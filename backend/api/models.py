import uuid
import hashlib
from django.db import models
from django.contrib.auth.models import User


class CodeSnippet(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('go', 'Go'),
        ('rust', 'Rust'),
        ('typescript', 'TypeScript'),
        ('csharp', 'C#'),
        ('php', 'PHP'),
        ('sql', 'SQL'),
        ('html', 'HTML'),
        ('css', 'CSS'),
    ]
    
    SOURCE_CHOICES = [
        ('paste', 'Paste'),
        ('github', 'GitHub'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)
    code_text = models.TextField()
    code_hash = models.CharField(max_length=64, db_index=True)
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default='paste'
    )
    source_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.code_hash:
            self.code_hash = hashlib.sha256(self.code_text.encode()).hexdigest()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.language} snippet - {self.created_at}"


class Explanation(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    snippet = models.ForeignKey(
        CodeSnippet,
        related_name='explanations',
        on_delete=models.CASCADE
    )
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    explanation_text = models.TextField()
    model_used = models.CharField(max_length=50, default='groq-mixtral')
    response_time_ms = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ('snippet', 'level')
    
    def __str__(self):
        return f"{self.snippet.language} - {self.level}"


class Feedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    explanation = models.ForeignKey(
        Explanation,
        related_name='feedback',
        on_delete=models.CASCADE
    )
    is_helpful = models.BooleanField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback on {self.explanation.id} - {'Helpful' if self.is_helpful else 'Not Helpful'}"
