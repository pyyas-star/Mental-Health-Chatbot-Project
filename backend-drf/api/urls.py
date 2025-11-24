"""
URL configuration for Mental Health Companion API.

All endpoints are prefixed with /api/ and require authentication unless specified otherwise.
"""

from django.urls import path
from accounts import views as UserViews
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    SentimentAnalysisAPIView,
    MoodHistoryAPIView,
    MoodEntryDetailAPIView,
    MoodStatsAPIView,
    DailyMoodCheckInAPIView,
    DailyMoodCheckInTodayAPIView,
    DailyMoodCheckInCalendarAPIView,
    GoalListCreateAPIView,
    GoalDetailAPIView,
    GoalCompleteAPIView,
    GratitudeListCreateAPIView,
    GratitudeDetailAPIView,
    GratitudeStatsAPIView,
    WellnessTipsAPIView,
    UserPreferencesAPIView,
)

urlpatterns = [
    # ========== Authentication Endpoints ==========
    path('register/', UserViews.RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-view/', UserViews.ProtectedView.as_view(), name='protected_view'),
    
    # ========== Mood & Sentiment Analysis ==========
    path('analyze/', SentimentAnalysisAPIView.as_view(), name='sentiment_analysis'),
    path('history/', MoodHistoryAPIView.as_view(), name='mood_history'),
    path('history/<int:entry_id>/', MoodEntryDetailAPIView.as_view(), name='mood_entry_detail'),
    path('stats/', MoodStatsAPIView.as_view(), name='mood_stats'),
    
    # ========== Daily Check-ins ==========
    path('checkin/', DailyMoodCheckInAPIView.as_view(), name='daily_checkin'),
    path('checkin/today/', DailyMoodCheckInTodayAPIView.as_view(), name='daily_checkin_today'),
    path('checkin/calendar/', DailyMoodCheckInCalendarAPIView.as_view(), name='daily_checkin_calendar'),
    
    # ========== Goal Tracking ==========
    path('goals/', GoalListCreateAPIView.as_view(), name='goal_list_create'),
    path('goals/<int:goal_id>/', GoalDetailAPIView.as_view(), name='goal_detail'),
    path('goals/<int:goal_id>/complete/', GoalCompleteAPIView.as_view(), name='goal_complete'),
    
    # ========== Gratitude Journal ==========
    path('gratitude/', GratitudeListCreateAPIView.as_view(), name='gratitude_list_create'),
    path('gratitude/<int:entry_id>/', GratitudeDetailAPIView.as_view(), name='gratitude_detail'),
    path('gratitude/stats/', GratitudeStatsAPIView.as_view(), name='gratitude_stats'),
    
    # ========== Wellness Resources ==========
    path('wellness-tips/', WellnessTipsAPIView.as_view(), name='wellness_tips'),
    
    # ========== User Preferences ==========
    path('preferences/', UserPreferencesAPIView.as_view(), name='user_preferences'),
]
