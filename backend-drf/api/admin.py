"""
Django Admin configuration for Mental Health Companion API.

Provides admin interface for managing mood entries, check-ins, goals,
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
    
    text_preview.short_description = 'Text Preview'
    
    def has_add_permission(self, request):
        """Disable manual creation of mood entries in admin."""
        return False


@admin.register(DailyMoodCheckIn)
class DailyMoodCheckInAdmin(admin.ModelAdmin):
    """Admin interface for DailyMoodCheckIn model."""
    list_display = ['id', 'user', 'emotion', 'date', 'timestamp']
    list_filter = ['emotion', 'date', 'user']
    search_fields = ['user__username', 'note']
    readonly_fields = ['date', 'timestamp']
    ordering = ['-date', '-timestamp']
    date_hierarchy = 'date'


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    """Admin interface for Goal model."""
    list_display = ['id', 'user', 'title', 'status', 'target_date', 'completed']
    list_filter = ['status', 'goal_type', 'completed', 'target_date']
    search_fields = ['user__username', 'title', 'description']
    readonly_fields = ['created_at', 'completed_at']
    ordering = ['-created_at']


@admin.register(GratitudeEntry)
class GratitudeEntryAdmin(admin.ModelAdmin):
    """Admin interface for GratitudeEntry model."""
    list_display = ['id', 'user', 'entry_date', 'text_preview', 'created_at']
    list_filter = ['entry_date', 'user']
    search_fields = ['user__username', 'text']
    readonly_fields = ['entry_date', 'created_at']
    ordering = ['-entry_date', '-created_at']
    date_hierarchy = 'entry_date'
    
    def text_preview(self, obj):
        """Display truncated text in list view."""
        if len(obj.text) > 50:
            return obj.text[:50] + "..."
        return obj.text
    text_preview.short_description = 'Text Preview'


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    """Admin interface for UserPreferences model."""
    list_display = ['user', 'reminder_enabled', 'reminder_time', 'notification_enabled']
    list_filter = ['reminder_enabled', 'notification_enabled']
    search_fields = ['user__username']

    
    text_preview.short_description = 'Text Preview'
    
    def has_add_permission(self, request):
        """Disable manual creation of mood entries in admin."""
        return False


@admin.register(DailyMoodCheckIn)
class DailyMoodCheckInAdmin(admin.ModelAdmin):
    """Admin interface for DailyMoodCheckIn model."""
    list_display = ['id', 'user', 'emotion', 'date', 'timestamp']
    list_filter = ['emotion', 'date', 'user']
    search_fields = ['user__username', 'note']
    readonly_fields = ['date', 'timestamp']
    ordering = ['-date', '-timestamp']
    date_hierarchy = 'date'


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    """Admin interface for Goal model."""
    list_display = ['id', 'user', 'title', 'status', 'target_date', 'completed']
    list_filter = ['status', 'goal_type', 'completed', 'target_date']
    search_fields = ['user__username', 'title', 'description']
    readonly_fields = ['created_at', 'completed_at']
    ordering = ['-created_at']


@admin.register(GratitudeEntry)
class GratitudeEntryAdmin(admin.ModelAdmin):
    """Admin interface for GratitudeEntry model."""
    list_display = ['id', 'user', 'entry_date', 'text_preview', 'created_at']
    list_filter = ['entry_date', 'user']
    search_fields = ['user__username', 'text']
    readonly_fields = ['entry_date', 'created_at']
    ordering = ['-entry_date', '-created_at']
    date_hierarchy = 'entry_date'
    
    def text_preview(self, obj):
        """Display truncated text in list view."""
        if len(obj.text) > 50:
            return obj.text[:50] + "..."
        return obj.text
    text_preview.short_description = 'Text Preview'


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    """Admin interface for UserPreferences model."""
    list_display = ['user', 'reminder_enabled', 'reminder_time', 'notification_enabled']
    list_filter = ['reminder_enabled', 'notification_enabled']
    search_fields = ['user__username']

    
    text_preview.short_description = 'Text Preview'
    
    def has_add_permission(self, request):
        """Disable manual creation of mood entries in admin."""
        return False


@admin.register(DailyMoodCheckIn)
class DailyMoodCheckInAdmin(admin.ModelAdmin):
    """Admin interface for DailyMoodCheckIn model."""
    list_display = ['id', 'user', 'emotion', 'date', 'timestamp']
    list_filter = ['emotion', 'date', 'user']
    search_fields = ['user__username', 'note']
    readonly_fields = ['date', 'timestamp']
    ordering = ['-date', '-timestamp']
    date_hierarchy = 'date'


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    """Admin interface for Goal model."""
    list_display = ['id', 'user', 'title', 'status', 'target_date', 'completed']
    list_filter = ['status', 'goal_type', 'completed', 'target_date']
    search_fields = ['user__username', 'title', 'description']
    readonly_fields = ['created_at', 'completed_at']
    ordering = ['-created_at']


@admin.register(GratitudeEntry)
class GratitudeEntryAdmin(admin.ModelAdmin):
    """Admin interface for GratitudeEntry model."""
    list_display = ['id', 'user', 'entry_date', 'text_preview', 'created_at']
    list_filter = ['entry_date', 'user']
    search_fields = ['user__username', 'text']
    readonly_fields = ['entry_date', 'created_at']
    ordering = ['-entry_date', '-created_at']
    date_hierarchy = 'entry_date'
    
    def text_preview(self, obj):
        """Display truncated text in list view."""
        if len(obj.text) > 50:
            return obj.text[:50] + "..."
        return obj.text
    text_preview.short_description = 'Text Preview'


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    """Admin interface for UserPreferences model."""
    list_display = ['user', 'reminder_enabled', 'reminder_time', 'notification_enabled']
    list_filter = ['reminder_enabled', 'notification_enabled']
    search_fields = ['user__username']

    
    text_preview.short_description = 'Text Preview'
    
    def has_add_permission(self, request):
        """Disable manual creation of mood entries in admin."""
        return False


@admin.register(DailyMoodCheckIn)
class DailyMoodCheckInAdmin(admin.ModelAdmin):
    """Admin interface for DailyMoodCheckIn model."""
    list_display = ['id', 'user', 'emotion', 'date', 'timestamp']
    list_filter = ['emotion', 'date', 'user']
    search_fields = ['user__username', 'note']
    readonly_fields = ['date', 'timestamp']
    ordering = ['-date', '-timestamp']
    date_hierarchy = 'date'


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    """Admin interface for Goal model."""
    list_display = ['id', 'user', 'title', 'status', 'target_date', 'completed']
    list_filter = ['status', 'goal_type', 'completed', 'target_date']
    search_fields = ['user__username', 'title', 'description']
    readonly_fields = ['created_at', 'completed_at']
    ordering = ['-created_at']


@admin.register(GratitudeEntry)
class GratitudeEntryAdmin(admin.ModelAdmin):
    """Admin interface for GratitudeEntry model."""
    list_display = ['id', 'user', 'entry_date', 'text_preview', 'created_at']
    list_filter = ['entry_date', 'user']
    search_fields = ['user__username', 'text']
    readonly_fields = ['entry_date', 'created_at']
    ordering = ['-entry_date', '-created_at']
    date_hierarchy = 'entry_date'
    
    def text_preview(self, obj):
        """Display truncated text in list view."""
        if len(obj.text) > 50:
            return obj.text[:50] + "..."
        return obj.text
    text_preview.short_description = 'Text Preview'


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    """Admin interface for UserPreferences model."""
    list_display = ['user', 'reminder_enabled', 'reminder_time', 'notification_enabled']
    list_filter = ['reminder_enabled', 'notification_enabled']
    search_fields = ['user__username']
