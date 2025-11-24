"""
User authentication views for registration and protected route testing.
"""

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializers


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    
    Allows anyone to create a new user account. Password is hashed automatically
    via the serializer's create method.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]


class ProtectedView(APIView):
    """
    Protected route test endpoint.
    
    Used to verify JWT authentication is working correctly.
    Only accessible to authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return success status if user is authenticated."""
        return Response({'status': 'Request was permitted'})

    def get(self, request):
        response = {
            'status': 'Request was permitted'
        }
        return Response(response)