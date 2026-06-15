from django.contrib import admin
from .models import CodeSnippet, Explanation, Feedback


@admin.register(CodeSnippet)
class CodeSnippetAdmin(admin.ModelAdmin):
    list_display = ('id', 'language', 'user', 'source', 'created_at')
    list_filter = ('language', 'source', 'created_at')
    search_fields = ('code_hash', 'user__username')
    readonly_fields = ('id', 'code_hash', 'created_at')


@admin.register(Explanation)
class ExplanationAdmin(admin.ModelAdmin):
    list_display = ('id', 'snippet', 'level', 'model_used', 'response_time_ms', 'created_at')
    list_filter = ('level', 'model_used', 'created_at')
    search_fields = ('snippet__code_hash',)
    readonly_fields = ('id', 'created_at')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'explanation', 'is_helpful', 'created_at')
    list_filter = ('is_helpful', 'created_at')
    search_fields = ('comment',)
    readonly_fields = ('id', 'created_at')
