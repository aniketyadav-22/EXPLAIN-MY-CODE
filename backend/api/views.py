import time
import hashlib
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Q
from .models import CodeSnippet, Explanation, Feedback
from .serializers import (
    CodeSnippetSerializer,
    ExplanationSerializer,
    CreateExplanationSerializer,
    FeedbackCreateSerializer,
    AnalyticsSerializer,
)


# System prompts for different complexity levels
SYSTEM_PROMPTS = {
    'beginner': "Explain this code simply, like teaching a complete beginner. Avoid technical jargon. Use analogies instead of terms like loop or function.",
    
    'intermediate': "Explain this code to a junior developer. Identify key patterns and idioms. Assume basic syntax knowledge.",
    
    'expert': "Review this code for a senior developer. Summarize intent, identify code smells, edge cases, and suggest one improvement. Be concise and technical.",
}


def get_ai_explanation(code, language, level):
    """Call Groq API to get an explanation"""
    if not settings.GROQ_API_KEY:
        return "Error: GROQ_API_KEY not configured", None
    
    system_prompt = SYSTEM_PROMPTS.get(level, SYSTEM_PROMPTS['intermediate'])
    user_message = f"Language: {language}\n\nCode:\n{code}"
    
    print(f"[DEBUG] Level: {level}")
    print(f"[DEBUG] System Prompt: {system_prompt}")
    
    start_time = time.time()
    
    try:
        payload = {
            "model": "openai/gpt-oss-120b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 1024,
            "temperature": 0.7,
        }
        print(f"[DEBUG] Payload: {payload}")
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30,
        )
        
        print(f"[DEBUG] Response Status: {response.status_code}")
        print(f"[DEBUG] Response Text: {response.text}")
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                error_msg = error_data.get('error', {}).get('message', response.text)
            except:
                error_msg = response.text
            print(f"[DEBUG] Groq API Error ({response.status_code}): {error_msg}")
            return f"Groq API Error: {error_msg}", None
        
        response_time_ms = int((time.time() - start_time) * 1000)
        data = response.json()
        explanation_text = data['choices'][0]['message']['content']
        
        return explanation_text, response_time_ms
    
    except requests.exceptions.RequestException as e:
        error_msg = f"Error calling Groq API: {str(e)}"
        print(error_msg)
        return error_msg, None
    except (KeyError, IndexError) as e:
        error_msg = f"Error parsing Groq response: {str(e)}"
        print(error_msg)
        return error_msg, None


@api_view(['POST'])
@permission_classes([AllowAny])
def explain_code(request):
    """
    POST /api/explain/
    Body: { code, language, level }
    Returns cached explanation if (code_hash, level) exists, else calls AI
    """
    serializer = CreateExplanationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    code = serializer.validated_data['code']
    language = serializer.validated_data['language']
    level = serializer.validated_data['level']
    
    # Calculate code hash
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    
    # Check if snippet exists
    snippet, created = CodeSnippet.objects.get_or_create(
        code_hash=code_hash,
        defaults={
            'language': language,
            'code_text': code,
            'user': request.user if request.user.is_authenticated else None,
        }
    )
    
    # Check if explanation exists for this level
    explanation = Explanation.objects.filter(snippet=snippet, level=level).first()
    
    if explanation:
        # Return cached explanation
        return Response({
            'snippet_id': str(snippet.id),
            'explanation': ExplanationSerializer(explanation).data,
            'cached': True,
        }, status=status.HTTP_200_OK)
    
    # Call AI API
    explanation_text, response_time = get_ai_explanation(code, language, level)
    
    # Create explanation record
    explanation = Explanation.objects.create(
        snippet=snippet,
        level=level,
        explanation_text=explanation_text,
        model_used='openai/gpt-oss-120b',
        response_time_ms=response_time,
    )
    
    return Response({
        'snippet_id': str(snippet.id),
        'explanation': ExplanationSerializer(explanation).data,
        'cached': False,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_explanations(request, snippet_id):
    """
    GET /api/explanations/{snippet_id}/
    Get all level explanations for a given snippet
    """
    try:
        snippet = CodeSnippet.objects.get(id=snippet_id)
    except CodeSnippet.DoesNotExist:
        return Response(
            {'error': 'Snippet not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    explanations = snippet.explanations.all()
    serializer = ExplanationSerializer(explanations, many=True)
    
    return Response({
        'snippet': CodeSnippetSerializer(snippet).data,
        'explanations': serializer.data,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_feedback(request):
    """
    POST /api/feedback/
    Body: { explanation_id, is_helpful, comment }
    """
    serializer = FeedbackCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    feedback = serializer.save()
    
    return Response({
        'feedback_id': str(feedback.id),
        'message': 'Feedback recorded successfully',
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    """
    GET /api/history/
    List current user's past snippets + explanations
    """
    snippets = CodeSnippet.objects.filter(user=request.user)
    serializer = CodeSnippetSerializer(snippets, many=True)
    
    return Response({
        'count': snippets.count(),
        'snippets': serializer.data,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    """
    GET /api/analytics/
    Aggregate feedback stats per level
    """
    analytics_data = []
    
    for level, _ in Explanation.LEVEL_CHOICES:
        explanations = Explanation.objects.filter(level=level)
        total = explanations.count()
        
        if total == 0:
            continue
        
        feedback_count = Feedback.objects.filter(
            explanation__level=level
        ).count()
        
        helpful_count = Feedback.objects.filter(
            explanation__level=level,
            is_helpful=True
        ).count()
        
        unhelpful_count = feedback_count - helpful_count
        helpful_percentage = (helpful_count / feedback_count * 100) if feedback_count > 0 else 0
        
        analytics_data.append({
            'level': level,
            'total_explanations': total,
            'helpful_count': helpful_count,
            'unhelpful_count': unhelpful_count,
            'helpful_percentage': helpful_percentage,
        })
    
    return Response(analytics_data, status=status.HTTP_200_OK)
