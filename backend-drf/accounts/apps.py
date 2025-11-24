"""
Accounts application configuration for user authentication.
"""

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    """
    Configuration for the Accounts application.
    
    Handles user registration, authentication, and JWT token management.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
