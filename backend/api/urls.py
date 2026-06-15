from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Explain endpoints
    path('explain/', views.explain_code, name='explain-code'),
    path('explanations/<uuid:snippet_id>/', views.get_explanations, name='get-explanations'),
    
    # Feedback
    path('feedback/', views.submit_feedback, name='submit-feedback'),
    
    # Auth (JWT)
    path('auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/register/', views.register, name='register'),
    
    # History & Analytics (auth required)
    path('history/', views.history, name='history'),
    path('analytics/', views.analytics, name='analytics'),
]
