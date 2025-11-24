"""
Serializers for Mental Health Chatbot API.

Handles validation and serialization of mood entries and sentiment analysis requests.
"""

from rest_framework import serializers
from django.conf import settings
from django.utils import timezone
from datetime import timedelta, date
from .models import (
    MoodEntry,
    DailyMoodCheckIn,
    Goal,
    GratitudeEntry,
    UserPreferences
)
from .constants import (
    MIN_GRATITUDE_TEXT_LENGTH,
    MAX_GRATITUDE_TEXT_LENGTH,
    MIN_GOAL_TITLE_LENGTH,
    MAX_GOAL_TITLE_LENGTH,
    MIN_GOAL_DESCRIPTION_LENGTH,
    MAX_GOAL_DESCRIPTION_LENGTH,
)
import bleach


class SentimentAnalysisInputSerializer(serializers.Serializer):
    """
    Serializer for sentiment analysis input validation.
    """
    text = serializers.CharField(
        min_length=getattr(settings, 'MIN_TEXT_LENGTH', 5),
        max_length=getattr(settings, 'MAX_TEXT_LENGTH', 1000),
        trim_whitespace=True,
        help_text="Text to analyze (5-1000 characters)"
    )
    
    def validate_text(self, value):
        """
        Sanitize and validate text input.
        
        Args:
            value (str): Input text
            
        Returns:
            str: Sanitized text
        """
        # Remove any HTML tags for security
        cleaned_text = bleach.clean(value, tags=[], strip=True)
        
        # Check if text is empty after cleaning
        if not cleaned_text or len(cleaned_text.strip()) < getattr(settings, 'MIN_TEXT_LENGTH', 5):
            raise serializers.ValidationError(
                "Text must contain at least 5 characters of actual content."
            )
        
        return cleaned_text.strip()


class SentimentAnalysisOutputSerializer(serializers.Serializer):
    """
    Serializer for sentiment analysis output.
    """
    sentiment_score = serializers.FloatField(
        help_text="Sentiment score from -1 (negative) to 1 (positive)"
    )
    emotion = serializers.ChoiceField(
        choices=['happy', 'sad', 'angry', 'anxious', 'neutral'],
        help_text="Detected emotion"
    )
    response = serializers.CharField(
        help_text="AI-generated supportive message"
    )
    confidence = serializers.FloatField(
        required=False,
        help_text="Model confidence score"
    )


class MoodEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for MoodEntry model.
    """
    user_username = serializers.CharField(
        source='user.username',
        read_only=True,
        help_text="Username of the user who created this entry"
    )
    
    emotion_color = serializers.CharField(
        source='get_emotion_display_color',
        read_only=True,
        help_text="Color code for UI display"
    )
    
    time_ago = serializers.SerializerMethodField(
        help_text="Human-readable time difference"
    )
    
    class Meta:
        model = MoodEntry
        fields = [
            'id',
            'user',
            'user_username',
            'text',
            'sentiment_score',
            'emotion',
            'emotion_color',
            'response',
            'timestamp',
            'time_ago'
        ]
        read_only_fields = ['id', 'user', 'timestamp', 'sentiment_score', 'emotion', 'response']
    
    def get_time_ago(self, obj):
        """
        Generate human-readable time difference.
        
        Args:
            obj: MoodEntry instance
            
        Returns:
            str: Human-readable time (e.g., "2 hours ago")
        """
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.timestamp
        
        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"
        elif diff < timedelta(days=30):
            weeks = diff.days // 7
            return f"{weeks} week{'s' if weeks != 1 else ''} ago"
        elif diff < timedelta(days=365):
            months = diff.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"
        else:
            years = diff.days // 365
            return f"{years} year{'s' if years != 1 else ''} ago"


class MoodEntryListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for mood entry lists.
    """
    emotion_color = serializers.CharField(
        source='get_emotion_display_color',
        read_only=True
    )
    
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = MoodEntry
        fields = [
            'id',
            'text',
            'sentiment_score',
            'emotion',
            'emotion_color',
            'timestamp',
            'time_ago'
        ]
    
    def get_time_ago(self, obj):
        """Generate human-readable time difference."""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.timestamp
        
        if diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes}m ago" if minutes > 0 else "Just now"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours}h ago"
        else:
            days = diff.days
            return f"{days}d ago"


class DailyMoodCheckInSerializer(serializers.ModelSerializer):
    """
    Serializer for DailyMoodCheckIn model.
    """
    emotion_color = serializers.CharField(
        source='get_emotion_display_color',
        read_only=True,
        help_text="Color code for UI display"
    )
    
    date = serializers.DateField(
        read_only=True,
        help_text="Date of the check-in"
    )
    
    class Meta:
        model = DailyMoodCheckIn
        fields = [
            'id',
            'emotion',
            'emotion_color',
            'note',
            'date',
            'timestamp',
        ]
        read_only_fields = ['id', 'timestamp', 'date']
    
    def validate_note(self, value: str) -> str:
        """
        Sanitize note input.
        
        Args:
            value: Note text
            
        Returns:
            str: Sanitized note
        """
        if value:
            cleaned = bleach.clean(value, tags=[], strip=True)
            return cleaned.strip()
        return value
    
    def create(self, validated_data):
        """
        Create check-in with current date.
        
        Args:
            validated_data: Validated data
            
        Returns:
            DailyMoodCheckIn: Created instance
        """
        validated_data['date'] = date.today()
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class GoalSerializer(serializers.ModelSerializer):
    """
    Serializer for Goal model with computed fields.
    """
    progress_percentage = serializers.SerializerMethodField(
        help_text="Progress percentage (0-100)"
    )
    
    days_remaining = serializers.SerializerMethodField(
        help_text="Days remaining until target date"
    )
    
    is_overdue = serializers.SerializerMethodField(
        help_text="Whether goal is overdue"
    )
    
    class Meta:
        model = Goal
        fields = [
            'id',
            'title',
            'description',
            'goal_type',
            'target_value',
            'current_value',
            'start_date',
            'target_date',
            'completed',
            'progress_percentage',
            'days_remaining',
            'is_overdue',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_progress_percentage(self, obj) -> float:
        """Get progress percentage."""
        return obj.progress_percentage()
    
    def get_days_remaining(self, obj) -> int:
        """Get days remaining."""
        return obj.days_remaining()
    
    def get_is_overdue(self, obj) -> bool:
        """Get overdue status."""
        return obj.is_overdue()
    
    def validate_title(self, value: str) -> str:
        """
        Sanitize and validate title.
        
        Args:
            value: Title text
            
        Returns:
            str: Sanitized title
        """
        cleaned = bleach.clean(value, tags=[], strip=True)
        if len(cleaned.strip()) < MIN_GOAL_TITLE_LENGTH:
            raise serializers.ValidationError(
                f"Title must be at least {MIN_GOAL_TITLE_LENGTH} characters."
            )
        return cleaned.strip()
    
    def validate_description(self, value: str) -> str:
        """
        Sanitize description.
        
        Args:
            value: Description text
            
        Returns:
            str: Sanitized description
        """
        if value:
            cleaned = bleach.clean(value, tags=[], strip=True)
            return cleaned.strip()
        return value
    
    def validate_target_date(self, value: date) -> date:
        """
        Validate target date is in the future.
        
        Args:
            value: Target date
            
        Returns:
            date: Validated date
        """
        if value < date.today():
            raise serializers.ValidationError(
                "Target date cannot be in the past."
            )
        return value
    
    def create(self, validated_data):
        """
        Create goal for authenticated user.
        
        Args:
            validated_data: Validated data
            
        Returns:
            Goal: Created instance
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class GratitudeEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for GratitudeEntry model.
    """
    date = serializers.DateField(
        source='get_date',
        read_only=True,
        help_text="Date of the entry"
    )
    
    time_ago = serializers.SerializerMethodField(
        help_text="Human-readable time difference"
    )
    
    class Meta:
        model = GratitudeEntry
        fields = [
            'id',
            'text',
            'date',
            'timestamp',
            'time_ago',
        ]
        read_only_fields = ['id', 'timestamp']
    
    def validate_text(self, value: str) -> str:
        """
        Sanitize and validate text.
        
        Args:
            value: Gratitude text
            
        Returns:
            str: Sanitized text
        """
        cleaned = bleach.clean(value, tags=[], strip=True)
        if len(cleaned.strip()) < MIN_GRATITUDE_TEXT_LENGTH:
            raise serializers.ValidationError(
                f"Text must be at least {MIN_GRATITUDE_TEXT_LENGTH} characters."
            )
        if len(cleaned) > MAX_GRATITUDE_TEXT_LENGTH:
            raise serializers.ValidationError(
                f"Text must be no more than {MAX_GRATITUDE_TEXT_LENGTH} characters."
            )
        return cleaned.strip()
    
    def get_time_ago(self, obj) -> str:
        """
        Generate human-readable time difference.
        
        Args:
            obj: GratitudeEntry instance
            
        Returns:
            str: Human-readable time
        """
        now = timezone.now()
        diff = now - obj.timestamp
        
        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"
        else:
            weeks = diff.days // 7
            return f"{weeks} week{'s' if weeks != 1 else ''} ago"
    
    def create(self, validated_data):
        """
        Create gratitude entry for authenticated user.
        
        Args:
            validated_data: Validated data
            
        Returns:
            GratitudeEntry: Created instance
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserPreferencesSerializer(serializers.ModelSerializer):
    """
    Serializer for UserPreferences model.
    """
    class Meta:
        model = UserPreferences
        fields = [
            'reminder_enabled',
            'reminder_time',
            'notification_enabled',
            'preferred_theme',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        """
        Create preferences for authenticated user.
        
        Args:
            validated_data: Validated data
            
        Returns:
            UserPreferences: Created instance
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class WellnessTipSerializer(serializers.Serializer):
    """
    Serializer for wellness tips response.
    """
    title = serializers.CharField(
        help_text="Tip title"
    )
    description = serializers.CharField(
        help_text="Tip description"
    )
    category = serializers.CharField(
        help_text="Tip category (breathing_exercises, activities, resources, affirmations)"
    )
