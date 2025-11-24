from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.utils import timezone
from datetime import date, timedelta
from .constants import (
    EMOTION_CHOICES,
    GOAL_TYPE_CHOICES,
    THEME_CHOICES,
    EMOTION_COLORS,
    MIN_GRATITUDE_TEXT_LENGTH,
    MAX_GRATITUDE_TEXT_LENGTH,
    MIN_GOAL_TITLE_LENGTH,
    MAX_GOAL_TITLE_LENGTH,
    MIN_GOAL_DESCRIPTION_LENGTH,
    MAX_GOAL_DESCRIPTION_LENGTH,
)


class MoodEntry(models.Model):
    """
    Model to store user mood entries with sentiment analysis results.
    
    Each entry represents a single interaction where the user shares their feelings
    and receives an AI-generated supportive response.
    """
    
    EMOTION_CHOICES = EMOTION_CHOICES
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='mood_entries',
        help_text="User who created this mood entry"
    )
    
    text = models.TextField(
        validators=[MinLengthValidator(5), MaxLengthValidator(1000)],
        help_text="User's message describing their feelings"
    )
    
    sentiment_score = models.FloatField(
        help_text="Sentiment score from -1 (negative) to 1 (positive)"
    )
    
    emotion = models.CharField(
        max_length=20,
        choices=EMOTION_CHOICES,
        help_text="Detected primary emotion"
    )
    
    response = models.TextField(
        help_text="AI-generated supportive response"
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When this mood entry was created"
    )
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['emotion', '-timestamp']),
        ]
        verbose_name = 'Mood Entry'
        verbose_name_plural = 'Mood Entries'
    
    def __str__(self):
        return f"{self.user.username} - {self.emotion} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    
    def get_emotion_display_color(self):
        """Return color code for UI display based on emotion"""
        return EMOTION_COLORS.get(self.emotion, '#6b7280')


class DailyMoodCheckIn(models.Model):
    """
    Model for daily mood check-ins.
    
    Allows users to quickly log their mood once per day without full sentiment analysis.
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='daily_checkins',
        help_text="User who created this check-in"
    )
    
    emotion = models.CharField(
        max_length=20,
        choices=EMOTION_CHOICES,
        help_text="User's selected emotion"
    )
    
    note = models.TextField(
        blank=True,
        null=True,
        max_length=500,
        help_text="Optional note about the mood"
    )
    
    date = models.DateField(
        default=date.today,
        db_index=True,
        help_text="Date of the check-in"
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When this check-in was created"
    )
    
    class Meta:
        ordering = ['-date', '-timestamp']
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(fields=['user', '-timestamp']),
        ]
        unique_together = [['user', 'date']]  # One check-in per user per day
        verbose_name = 'Daily Mood Check-in'
        verbose_name_plural = 'Daily Mood Check-ins'
    
    def __str__(self):
        return f"{self.user.username} - {self.emotion} - {self.timestamp.strftime('%Y-%m-%d')}"
    
    def get_emotion_display_color(self):
        """Return color code for UI display based on emotion"""
        return EMOTION_COLORS.get(self.emotion, '#6b7280')
    
    def get_date(self):
        """Return the date (without time) for this check-in."""
        return self.timestamp.date()


class Goal(models.Model):
    """
    Model for user goals and tracking progress.
    
    Supports various goal types: daily check-ins, mood improvement, gratitude journaling, custom.
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='goals',
        help_text="User who created this goal"
    )
    
    title = models.CharField(
        max_length=MAX_GOAL_TITLE_LENGTH,
        validators=[MinLengthValidator(MIN_GOAL_TITLE_LENGTH)],
        help_text="Goal title"
    )
    
    description = models.TextField(
        max_length=MAX_GOAL_DESCRIPTION_LENGTH,
        validators=[MinLengthValidator(MIN_GOAL_DESCRIPTION_LENGTH)],
        blank=True,
        help_text="Detailed description of the goal"
    )
    
    goal_type = models.CharField(
        max_length=30,
        choices=GOAL_TYPE_CHOICES,
        default='custom',
        help_text="Type of goal"
    )
    
    target_value = models.IntegerField(
        help_text="Target value to achieve (e.g., number of days, entries)"
    )
    
    current_value = models.IntegerField(
        default=0,
        help_text="Current progress value"
    )
    
    start_date = models.DateField(
        default=date.today,
        help_text="When the goal started"
    )
    
    target_date = models.DateField(
        help_text="Target completion date"
    )
    
    completed = models.BooleanField(
        default=False,
        help_text="Whether the goal has been completed"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When this goal was created"
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'completed']),
        ]
        verbose_name = 'Goal'
        verbose_name_plural = 'Goals'
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    def progress_percentage(self) -> float:
        """
        Calculate progress percentage.
        
        Returns:
            float: Progress percentage (0-100)
        """
        if self.target_value == 0:
            return 0.0
        progress = min(100.0, (self.current_value / self.target_value) * 100)
        return round(progress, 2)
    
    def days_remaining(self) -> int:
        """
        Calculate days remaining until target date.
        
        Returns:
            int: Number of days remaining (negative if overdue)
        """
        today = date.today()
        delta = self.target_date - today
        return delta.days
    
    def is_overdue(self) -> bool:
        """
        Check if goal is overdue.
        
        Returns:
            bool: True if target date has passed and goal is not completed
        """
        return not self.completed and self.days_remaining() < 0


class GratitudeEntry(models.Model):
    """
    Model for gratitude journal entries.
    
    Allows users to record things they're grateful for.
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='gratitude_entries',
        help_text="User who created this gratitude entry"
    )
    
    text = models.TextField(
        validators=[
            MinLengthValidator(MIN_GRATITUDE_TEXT_LENGTH),
            MaxLengthValidator(MAX_GRATITUDE_TEXT_LENGTH)
        ],
        help_text="What the user is grateful for"
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When this entry was created"
    )
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['user', 'timestamp']),  # For streak calculations
        ]
        verbose_name = 'Gratitude Entry'
        verbose_name_plural = 'Gratitude Entries'
    
    def __str__(self):
        return f"{self.user.username} - {self.timestamp.strftime('%Y-%m-%d')}"
    
    def get_date(self):
        """Return the date (without time) for this entry."""
        return self.timestamp.date()


class UserPreferences(models.Model):
    """
    Model for user preferences and settings.
    
    Extends User profile with application-specific preferences.
    """
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='preferences',
        help_text="User these preferences belong to"
    )
    
    reminder_enabled = models.BooleanField(
        default=False,
        help_text="Whether daily reminders are enabled"
    )
    
    reminder_time = models.TimeField(
        default='09:00:00',
        help_text="Time for daily reminder"
    )
    
    notification_enabled = models.BooleanField(
        default=False,
        help_text="Whether browser notifications are enabled"
    )
    
    preferred_theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default='auto',
        help_text="Preferred UI theme"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When preferences were created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="When preferences were last updated"
    )
    
    class Meta:
        verbose_name = 'User Preferences'
        verbose_name_plural = 'User Preferences'
    
    def __str__(self):
        return f"Preferences for {self.user.username}"
