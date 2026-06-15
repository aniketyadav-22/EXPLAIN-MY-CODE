from rest_framework import serializers
from .models import CodeSnippet, Explanation, Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'is_helpful', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']


class ExplanationSerializer(serializers.ModelSerializer):
    feedback = FeedbackSerializer(many=True, read_only=True)
    
    class Meta:
        model = Explanation
        fields = ['id', 'level', 'explanation_text', 'model_used', 'response_time_ms', 'created_at', 'feedback']
        read_only_fields = ['id', 'model_used', 'response_time_ms', 'created_at', 'feedback']


class CodeSnippetSerializer(serializers.ModelSerializer):
    explanations = ExplanationSerializer(many=True, read_only=True)
    
    class Meta:
        model = CodeSnippet
        fields = ['id', 'language', 'code_text', 'code_hash', 'source', 'source_url', 'created_at', 'explanations']
        read_only_fields = ['id', 'code_hash', 'created_at', 'explanations']


class CreateExplanationSerializer(serializers.Serializer):
    """Serializer for creating a new explanation request"""
    code = serializers.CharField()
    language = serializers.CharField()
    level = serializers.ChoiceField(choices=['beginner', 'intermediate', 'expert'])
    
    def validate_level(self, value):
        if value not in ['beginner', 'intermediate', 'expert']:
            raise serializers.ValidationError("Level must be beginner, intermediate, or expert")
        return value


class FeedbackCreateSerializer(serializers.ModelSerializer):
    explanation_id = serializers.UUIDField()
    
    class Meta:
        model = Feedback
        fields = ['explanation_id', 'is_helpful', 'comment']
    
    def create(self, validated_data):
        explanation_id = validated_data.pop('explanation_id')
        try:
            explanation = Explanation.objects.get(id=explanation_id)
        except Explanation.DoesNotExist:
            raise serializers.ValidationError("Explanation not found")
        
        feedback = Feedback.objects.create(
            explanation=explanation,
            **validated_data
        )
        return feedback


class AnalyticsSerializer(serializers.Serializer):
    """Serializer for analytics data"""
    level = serializers.CharField()
    total_explanations = serializers.IntegerField()
    helpful_count = serializers.IntegerField()
    unhelpful_count = serializers.IntegerField()
    helpful_percentage = serializers.FloatField()
