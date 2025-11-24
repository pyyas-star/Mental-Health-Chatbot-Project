"""
Constants for Mental Health Companion API.

Centralizes magic strings, configuration values, and validation limits
to maintain consistency across the application.
"""

# Emotion choices (shared across models)
EMOTION_CHOICES = [
    ('happy', 'Happy'),
    ('sad', 'Sad'),
    ('angry', 'Angry'),
    ('anxious', 'Anxious'),
    ('neutral', 'Neutral'),
]

# Goal type choices
GOAL_TYPE_CHOICES = [
    ('daily_checkin', 'Daily Check-in'),
    ('mood_improvement', 'Mood Improvement'),
    ('gratitude', 'Gratitude Journaling'),
    ('custom', 'Custom Goal'),
]

# Theme choices
THEME_CHOICES = [
    ('light', 'Light'),
    ('dark', 'Dark'),
    ('auto', 'Auto'),
]

# Emotion color mapping
EMOTION_COLORS = {
    'happy': '#10b981',    # green
    'sad': '#3b82f6',      # blue
    'angry': '#ef4444',    # red
    'anxious': '#f59e0b',  # yellow/orange
    'neutral': '#6b7280',  # gray
}

# Default values
DEFAULT_REMINDER_TIME = '09:00:00'
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Validation limits
MIN_GRATITUDE_TEXT_LENGTH = 5
MAX_GRATITUDE_TEXT_LENGTH = 500
MIN_GOAL_TITLE_LENGTH = 3
MAX_GOAL_TITLE_LENGTH = 200
MIN_GOAL_DESCRIPTION_LENGTH = 10
MAX_GOAL_DESCRIPTION_LENGTH = 1000




