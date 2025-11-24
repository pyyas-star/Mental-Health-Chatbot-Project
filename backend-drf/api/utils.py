"""
Utility functions for the Mental Health Companion API.

Provides helper functions for text processing, formatting, and validation.
"""

from datetime import timedelta
from django.utils import timezone


def format_timestamp(timestamp):
    """
    Format a timestamp into a human-readable string.
    
    Args:
        timestamp (datetime): The timestamp to format
        
    Returns:
        str: Human-readable time string (e.g., "2 hours ago")
    """
    now = timezone.now()
    diff = now - timestamp
    
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


def truncate_text(text, max_length=100):
    """
    Truncate text to a maximum length with ellipsis.
    
    Args:
        text (str): Text to truncate
        max_length (int): Maximum length
        
    Returns:
        str: Truncated text
    """
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."


def validate_emotion(emotion):
    """
    Validate that an emotion string is in the allowed list.
    
    Args:
        emotion (str): Emotion to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    valid_emotions = ['happy', 'sad', 'angry', 'anxious', 'neutral']
    return emotion in valid_emotions
