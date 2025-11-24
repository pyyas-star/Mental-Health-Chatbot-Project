"""
ASGI config for Mental Health Companion project.

It exposes the ASGI callable as a module-level variable named ``application``.
Used for async deployment with servers like Daphne or Uvicorn.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mental_health_main.settings')

application = get_asgi_application()
