"""
User serializers for registration and authentication.
"""

from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializers(serializers.ModelSerializer):
    """
    Serializer for user registration.
    
    Handles username, email, and password fields. Password is write-only
    and automatically hashed when creating a new user.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """
        Create a new user with hashed password.
        
        Args:
            validated_data: Validated user data
            
        Returns:
            User: Created user instance
        """
        user = User.objects.create_user(**validated_data)
        return user
    Handles username, email, and password fields. Password is write-only
    and automatically hashed when creating a new user.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """
        Create a new user with hashed password.
        
        Args:
            validated_data: Validated user data
            
        Returns:
            User: Created user instance
        """
        user = User.objects.create_user(**validated_data)
        return user
    Handles username, email, and password fields. Password is write-only
    and automatically hashed when creating a new user.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """
        Create a new user with hashed password.
        
        Args:
            validated_data: Validated user data
            
        Returns:
            User: Created user instance
        """
        user = User.objects.create_user(**validated_data)
        return user
    Handles username, email, and password fields. Password is write-only
    and automatically hashed when creating a new user.
    """
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """
        Create a new user with hashed password.
        
        Args:
            validated_data: Validated user data
            
        Returns:
            User: Created user instance
        """
        user = User.objects.create_user(**validated_data)
        return user