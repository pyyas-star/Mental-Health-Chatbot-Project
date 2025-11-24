"""
WSGI config for Mental Health Companion project.

It exposes the WSGI callable as a module-level variable named ``application``.
Used for production deployment with servers like Gunicorn or uWSGI.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mental_health_main.settings')

application = get_wsgi_application()
