"""
API application configuration for Mental Health Companion.
"""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    """
    Configuration for the API application.
    
    Handles sentiment analysis, mood tracking, goals, gratitude journaling,
    and wellness features.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'