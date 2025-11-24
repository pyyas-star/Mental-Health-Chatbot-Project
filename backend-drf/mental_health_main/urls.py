"""
Root URL configuration for Mental Health Companion project.

Routes all API endpoints to the api app and serves static/media files.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints - all routes prefixed with /api/
    path('api/', include('api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
