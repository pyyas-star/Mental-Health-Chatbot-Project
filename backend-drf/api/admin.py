"""
Django Admin configuration for Mental Health Companion API.I.

Provides admin interface for managing mood entries, check-ins, goals,
gratitude entries, and user preferences. check-ins, goals,
gratitude entries, and user preferences.
"""

from django.contrib import admin

from .models import (
    MoodEntry,
    DailyMoodCheckIn,
    Goal,
    GratitudeEntry,
    UserPreferences
)


@admin.register(MoodEntry)
class MoodEntryAdmin(admin.ModelAdmin):
    """
    Admin interface for MoodEntry model.
    """
    list_display = [
        'id',
        'user',
        'emotion',
        'sentiment_score',
        'timestamp',
        'text_preview'
    ]
    
    list_filter = [
        'emotion',
        'timestamp',
        'user'
    ]
    
    search_fields = [
        'user__username',
        'text',
        'response'
    ]
    
    readonly_fields = [
        'timestamp',
        'sentiment_score',
        'emotion',
        'response'
    ]
    
    ordering = ['-timestamp']
    
    list_per_page = 50
    
    date_hierarchy = 'timestamp'
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Mood Entry', {
            'fields': ('text', 'emotion', 'sentiment_score')
        }),
        ('AI Response', {
            'fields': ('response',)
        }),
        ('Metadata', {
            'fields': ('timestamp',)
        }),
    )
    
    def text_preview(self, obj):
        """Display truncated text in list view."""
        if len(obj.text) > 50:
            return obj.text[:50] + "..."
        return obj.text
    
    
    def has_add_permission(self, request):
        """Disable manual creation of mood entries in admin."""
        return False