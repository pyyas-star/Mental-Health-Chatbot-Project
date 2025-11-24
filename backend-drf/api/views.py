"""
API Views for Mental Health Chatbot.

Provides endpoints for sentiment analysis and mood history retrieval.
"""

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
import logging

from .models import (
    MoodEntry,
    DailyMoodCheckIn,
    Goal,
    GratitudeEntry,
    UserPreferences
)
from .serializers import (
    SentimentAnalysisInputSerializer,
    SentimentAnalysisOutputSerializer,
    MoodEntrySerializer,
    MoodEntryListSerializer,
    DailyMoodCheckInSerializer,
    GoalSerializer,
    GratitudeEntrySerializer,
    UserPreferencesSerializer,
    WellnessTipSerializer,
)
from .sentiment_analyzer import get_sentiment_analyzer
from .wellness_tips import get_wellness_tips
from django.db.models import Q, Count
from django.db import transaction
from datetime import date, timedelta
from django.utils import timezone

logger = logging.getLogger('api')


def optional_ratelimit(rate, method="POST"):
    """Apply ratelimit only if enabled in settings."""
    def decorator(view_func):
        if settings.RATELIMIT_ENABLE:
            return method_decorator(
                ratelimit(key='user', rate=rate, method=method)
            )(view_func)
        return view_func

    return decorator


class SentimentAnalysisAPIView(APIView):
    """
    API endpoint for sentiment analysis and supportive response generation.
    
    POST /api/analyze/
    
    Request body:
        {
            "text": "User's message about their feelings"
        }
    
    Response:
        {
            "sentiment_score": float,
            "emotion": "happy|sad|angry|anxious|neutral",
            "response": "Supportive AI-generated message"
        }
    """
    
    permission_classes = [IsAuthenticated]
    
    @optional_ratelimit('30/m', method='POST')
    def post(self, request):
        """
        Analyze text sentiment and generate supportive response.
        
        Args:
            request: HTTP request with 'text' in body
            
        Returns:
            Response: Sentiment analysis results and supportive message
        """
        try:
            # Validate input
            input_serializer = SentimentAnalysisInputSerializer(data=request.data)
            
            if not input_serializer.is_valid():
                logger.warning(f"Invalid input: {input_serializer.errors}")
                return Response(
                    {
                        'error': True,
                        'message': 'Invalid input',
                        'details': input_serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            text = input_serializer.validated_data['text']
            logger.info(f"Analyzing text for user: {request.user.username}")
            
            # Get sentiment analyzer instance
            analyzer = get_sentiment_analyzer()
            
            # Analyze text
            analysis_result = analyzer.analyze_text(text)
            emotion = analysis_result['emotion']
            sentiment_score = analysis_result['sentiment_score']
            confidence = analysis_result.get('confidence', 0.0)
            
            # Generate supportive response
            supportive_response = analyzer.generate_supportive_response(
                emotion, 
                sentiment_score
            )
            
            # Save to database
            mood_entry = MoodEntry.objects.create(
                user=request.user,
                text=text,
                sentiment_score=sentiment_score,
                emotion=emotion,
                response=supportive_response
            )
            
            logger.info(
                f"Created mood entry {mood_entry.id} for user {request.user.username}: "
                f"emotion={emotion}, score={sentiment_score:.2f}"
            )
            
            # Prepare response
            output_data = {
                'sentiment_score': sentiment_score,
                'emotion': emotion,
                'response': supportive_response,
                'confidence': confidence,
                'entry_id': mood_entry.id
            }
            
            output_serializer = SentimentAnalysisOutputSerializer(data=output_data)
            output_serializer.is_valid(raise_exception=True)
            
            return Response(
                output_serializer.data,
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}", exc_info=True)
            return Response(
                {
                    'error': True,
                    'message': 'An error occurred during analysis. Please try again.',
                    'details': str(e) if request.user.is_staff else {}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MoodHistoryAPIView(ListAPIView):
    """
    API endpoint to retrieve user's mood history.
    
    GET /api/history/
    
    Query parameters:
        - page: Page number (default: 1)
        - page_size: Number of items per page (default: 20, max: 100)
        - emotion: Filter by emotion (optional)
        
    Response:
        {
            "count": total_count,
            "next": "url_to_next_page",
            "previous": "url_to_previous_page",
            "results": [
                {
                    "id": int,
                    "text": "user message",
                    "sentiment_score": float,
                    "emotion": "emotion_type",
                    "emotion_color": "#hexcolor",
                    "timestamp": "datetime",
                    "time_ago": "human readable time"
                },
                ...
            ]
        }
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = MoodEntryListSerializer
    
    def get_queryset(self):
        """
        Get mood entries for the authenticated user.
        
        Returns:
            QuerySet: Filtered mood entries
        """
        queryset = MoodEntry.objects.filter(
            user=self.request.user
        ).select_related('user')
        
        # Filter by emotion if specified
        emotion = self.request.query_params.get('emotion', None)
        if emotion and emotion in ['happy', 'sad', 'angry', 'anxious', 'neutral']:
            queryset = queryset.filter(emotion=emotion)
        
        logger.info(
            f"Retrieved {queryset.count()} mood entries for user {self.request.user.username}"
        )
        
        return queryset
    
    @method_decorator(cache_page(60))  # Cache for 1 minute
    def list(self, request, *args, **kwargs):
        """Override list to add caching."""
        return super().list(request, *args, **kwargs)


class MoodEntryDetailAPIView(APIView):
    """
    API endpoint to retrieve a single mood entry.
    
    GET /api/history/<id>/
    
    Response:
        {
            "id": int,
            "user_username": "username",
            "text": "user message",
            "sentiment_score": float,
            "emotion": "emotion_type",
            "emotion_color": "#hexcolor",
            "response": "AI response",
            "timestamp": "datetime",
            "time_ago": "human readable time"
        }
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, entry_id):
        """
        Retrieve a single mood entry.
        
        Args:
            request: HTTP request
            entry_id: ID of the mood entry
            
        Returns:
            Response: Mood entry details
        """
        try:
            mood_entry = MoodEntry.objects.select_related('user').get(
                id=entry_id,
                user=request.user
            )
            
            serializer = MoodEntrySerializer(mood_entry)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except MoodEntry.DoesNotExist:
            logger.warning(
                f"Mood entry {entry_id} not found for user {request.user.username}"
            )
            return Response(
                {
                    'error': True,
                    'message': 'Mood entry not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error retrieving mood entry: {str(e)}", exc_info=True)
            return Response(
                {
                    'error': True,
                    'message': 'An error occurred'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MoodStatsAPIView(APIView):
    """
    API endpoint to get mood statistics for the user.
    
    GET /api/stats/
    
    Response:
        {
            "total_entries": int,
            "emotion_breakdown": {
                "happy": int,
                "sad": int,
                "angry": int,
                "anxious": int,
                "neutral": int
            },
            "average_sentiment": float,
            "recent_trend": "improving|declining|stable"
        }
    """
    
    permission_classes = [IsAuthenticated]
    
    @method_decorator(cache_page(300))  # Cache for 5 minutes
    def get(self, request):
        """
        Get mood statistics for the authenticated user.
        
        Args:
            request: HTTP request
            
        Returns:
            Response: Mood statistics
        """
        try:
            from django.db.models import Count, Avg
            
            entries = MoodEntry.objects.filter(user=request.user)
            total_entries = entries.count()
            
            if total_entries == 0:
                return Response({
                    'total_entries': 0,
                    'emotion_breakdown': {},
                    'average_sentiment': 0.0,
                    'recent_trend': 'no_data'
                })
            
            # Get emotion breakdown
            emotion_counts = entries.values('emotion').annotate(
                count=Count('emotion')
            )
            emotion_breakdown = {item['emotion']: item['count'] for item in emotion_counts}
            
            # Calculate average sentiment
            avg_sentiment = entries.aggregate(Avg('sentiment_score'))['sentiment_score__avg']
            
            # Determine recent trend (last 10 entries vs previous 10)
            recent_entries = list(entries.order_by('-timestamp')[:10].values_list('sentiment_score', flat=True))
            previous_entries = list(entries.order_by('-timestamp')[10:20].values_list('sentiment_score', flat=True))
            
            if len(recent_entries) < 5:
                recent_trend = 'insufficient_data'
            elif len(previous_entries) == 0:
                recent_trend = 'new_user'
            else:
                recent_avg = sum(recent_entries) / len(recent_entries)
                previous_avg = sum(previous_entries) / len(previous_entries)
                diff = recent_avg - previous_avg
                
                if diff > 0.1:
                    recent_trend = 'improving'
                elif diff < -0.1:
                    recent_trend = 'declining'
                else:
                    recent_trend = 'stable'
            
            return Response({
                'total_entries': total_entries,
                'emotion_breakdown': emotion_breakdown,
                'average_sentiment': round(avg_sentiment, 2) if avg_sentiment else 0.0,
                'recent_trend': recent_trend
            })
            
        except Exception as e:
            logger.error(f"Error calculating mood stats: {str(e)}", exc_info=True)
            return Response(
                {
                    'error': True,
                    'message': 'An error occurred while calculating statistics'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================================================
# User Engagement Features - Daily Check-ins, Goals, Gratitude, Wellness Tips
# ============================================================================

class DailyMoodCheckInAPIView(APIView):
    """
    API endpoint for daily mood check-ins.
    
    POST /api/checkin/ - Create today's mood check-in
    GET /api/checkin/ - Get check-in history (paginated)
    """
    
    permission_classes = [IsAuthenticated]
    
    @optional_ratelimit('10/m', method='POST')
    def post(self, request):
        """Create today's mood check-in."""
        try:
            today = date.today()
            existing_checkin = DailyMoodCheckIn.objects.filter(
                user=request.user,
                date=today
            ).first()
            
            if existing_checkin:
                serializer = DailyMoodCheckInSerializer(existing_checkin)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            serializer = DailyMoodCheckInSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                checkin = serializer.save()
                logger.info(f"Created daily check-in for user {request.user.username}: emotion={checkin.emotion}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(
                {'error': True, 'message': 'Invalid input', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error creating check-in: {str(e)}", exc_info=True)
            return Response(
                {'error': True, 'message': 'An error occurred. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        """Get check-in history (paginated)."""
        try:
            checkins = DailyMoodCheckIn.objects.filter(
                user=request.user
            ).select_related('user').order_by('-date', '-timestamp')
            
            page_size = min(int(request.query_params.get('page_size', 20)), 100)
            page = int(request.query_params.get('page', 1))
            start = (page - 1) * page_size
            end = start + page_size
            total = checkins.count()
            
            serializer = DailyMoodCheckInSerializer(checkins[start:end], many=True)
            return Response({
                'count': total,
                'next': f"/api/checkin/?page={page + 1}&page_size={page_size}" if end < total else None,
                'previous': f"/api/checkin/?page={page - 1}&page_size={page_size}" if page > 1 else None,
                'results': serializer.data
            })
        except Exception as e:
            logger.error(f"Error fetching check-ins: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DailyMoodCheckInTodayAPIView(APIView):
    """API endpoint to get today's check-in. GET /api/checkin/today/"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            checkin = DailyMoodCheckIn.objects.filter(
                user=request.user,
                date=date.today()
            ).first()
            
            if checkin:
                return Response(DailyMoodCheckInSerializer(checkin).data)
            return Response(
                {'error': True, 'message': 'No check-in found for today'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching today's check-in: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DailyMoodCheckInCalendarAPIView(APIView):
    """API endpoint for calendar view. GET /api/checkin/calendar/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            end_date = date.fromisoformat(request.query_params.get('end_date')) if request.query_params.get('end_date') else date.today()
            start_date = date.fromisoformat(request.query_params.get('start_date')) if request.query_params.get('start_date') else end_date - timedelta(days=30)
            
            checkins = DailyMoodCheckIn.objects.filter(
                user=request.user,
                date__gte=start_date,
                date__lte=end_date
            ).select_related('user').order_by('date')
            
            return Response({
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'checkins': DailyMoodCheckInSerializer(checkins, many=True).data
            })
        except ValueError:
            return Response({'error': True, 'message': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error fetching calendar check-ins: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GoalListCreateAPIView(APIView):
    """API endpoint for goals. GET /api/goals/ POST /api/goals/"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            goals = Goal.objects.filter(user=request.user)
            status_filter = request.query_params.get('status', 'all')
            if status_filter == 'completed':
                goals = goals.filter(completed=True)
            elif status_filter == 'active':
                goals = goals.filter(completed=False, target_date__gte=date.today())
            elif status_filter == 'overdue':
                goals = goals.filter(completed=False, target_date__lt=date.today())
            
            page_size = min(int(request.query_params.get('page_size', 20)), 100)
            page = int(request.query_params.get('page', 1))
            start = (page - 1) * page_size
            total = goals.count()
            
            serializer = GoalSerializer(goals[start:start + page_size], many=True)
            return Response({
                'count': total,
                'next': f"/api/goals/?page={page + 1}&page_size={page_size}" if start + page_size < total else None,
                'previous': f"/api/goals/?page={page - 1}&page_size={page_size}" if page > 1 else None,
                'results': serializer.data
            })
        except Exception as e:
            logger.error(f"Error fetching goals: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @optional_ratelimit('20/m', method='POST')
    def post(self, request):
        try:
            serializer = GoalSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                goal = serializer.save()
                logger.info(f"Created goal for user {request.user.username}: {goal.title}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'error': True, 'message': 'Invalid input', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating goal: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GoalDetailAPIView(APIView):
    """API endpoint for individual goal. GET/PATCH/DELETE /api/goals/<id>/"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, goal_id, user):
        try:
            return Goal.objects.get(id=goal_id, user=user)
        except Goal.DoesNotExist:
            return None
    
    def get(self, request, goal_id):
        goal = self.get_object(goal_id, request.user)
        if not goal:
            return Response({'error': True, 'message': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(GoalSerializer(goal).data)
    
    @optional_ratelimit('30/m', method='PATCH')
    def patch(self, request, goal_id):
        goal = self.get_object(goal_id, request.user)
        if not goal:
            return Response({'error': True, 'message': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GoalSerializer(goal, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Updated goal {goal_id} for user {request.user.username}")
            return Response(serializer.data)
        return Response({'error': True, 'message': 'Invalid input', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, goal_id):
        goal = self.get_object(goal_id, request.user)
        if not goal:
            return Response({'error': True, 'message': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
        goal.delete()
        logger.info(f"Deleted goal {goal_id} for user {request.user.username}")
        return Response(status=status.HTTP_204_NO_CONTENT)


class GoalCompleteAPIView(APIView):
    """API endpoint to mark goal as completed. POST /api/goals/<id>/complete/"""
    permission_classes = [IsAuthenticated]
    
    @optional_ratelimit('30/m', method='POST')
    def post(self, request, goal_id):
        try:
            goal = Goal.objects.get(id=goal_id, user=request.user)
            with transaction.atomic():
                goal.completed = True
                goal.current_value = goal.target_value
                goal.save()
            logger.info(f"Goal {goal_id} marked as completed by user {request.user.username}")
            return Response(GoalSerializer(goal).data)
        except Goal.DoesNotExist:
            return Response({'error': True, 'message': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error completing goal: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GratitudeListCreateAPIView(APIView):
    """API endpoint for gratitude entries. GET/POST /api/gratitude/"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            entries = GratitudeEntry.objects.filter(user=request.user).select_related('user').order_by('-timestamp')
            page_size = min(int(request.query_params.get('page_size', 20)), 100)
            page = int(request.query_params.get('page', 1))
            start = (page - 1) * page_size
            total = entries.count()
            serializer = GratitudeEntrySerializer(entries[start:start + page_size], many=True)
            return Response({
                'count': total,
                'next': f"/api/gratitude/?page={page + 1}&page_size={page_size}" if start + page_size < total else None,
                'previous': f"/api/gratitude/?page={page - 1}&page_size={page_size}" if page > 1 else None,
                'results': serializer.data
            })
        except Exception as e:
            logger.error(f"Error fetching gratitude entries: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @optional_ratelimit('30/m', method='POST')
    def post(self, request):
        try:
            serializer = GratitudeEntrySerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Created gratitude entry for user {request.user.username}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'error': True, 'message': 'Invalid input', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating gratitude entry: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GratitudeDetailAPIView(APIView):
    """API endpoint for individual gratitude entry. GET/DELETE /api/gratitude/<id>/"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, entry_id, user):
        try:
            return GratitudeEntry.objects.get(id=entry_id, user=user)
        except GratitudeEntry.DoesNotExist:
            return None
    
    def get(self, request, entry_id):
        entry = self.get_object(entry_id, request.user)
        if not entry:
            return Response({'error': True, 'message': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(GratitudeEntrySerializer(entry).data)
    
    def delete(self, request, entry_id):
        entry = self.get_object(entry_id, request.user)
        if not entry:
            return Response({'error': True, 'message': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        logger.info(f"Deleted gratitude entry {entry_id} for user {request.user.username}")
        return Response(status=status.HTTP_204_NO_CONTENT)


class GratitudeStatsAPIView(APIView):
    """API endpoint for gratitude statistics. GET /api/gratitude/stats/"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            entries = GratitudeEntry.objects.filter(user=request.user).order_by('-timestamp')
            total_entries = entries.count()
            streak = 0
            if total_entries > 0:
                current_date = date.today()
                if entries.filter(timestamp__date=current_date).exists():
                    streak = 1
                    check_date = current_date - timedelta(days=1)
                    while entries.filter(timestamp__date=check_date).exists():
                        streak += 1
                        check_date -= timedelta(days=1)
            return Response({'total_entries': total_entries, 'current_streak': streak})
        except Exception as e:
            logger.error(f"Error calculating gratitude stats: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WellnessTipsAPIView(APIView):
    """API endpoint for wellness tips. GET /api/wellness-tips/?emotion=sad"""
    permission_classes = [IsAuthenticated]
    
    @method_decorator(cache_page(300))
    def get(self, request):
        try:
            emotion = request.query_params.get('emotion', 'neutral')
            tips = get_wellness_tips(emotion)
            return Response(WellnessTipSerializer(tips, many=True).data)
        except Exception as e:
            logger.error(f"Error fetching wellness tips: {str(e)}", exc_info=True)
            tips = get_wellness_tips('neutral')
            return Response(WellnessTipSerializer(tips, many=True).data)


class UserPreferencesAPIView(APIView):
    """API endpoint for user preferences. GET/PATCH /api/preferences/"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            preferences, created = UserPreferences.objects.get_or_create(user=request.user)
            if created:
                logger.info(f"Created default preferences for user {request.user.username}")
            return Response(UserPreferencesSerializer(preferences).data)
        except Exception as e:
            logger.error(f"Error fetching preferences: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @optional_ratelimit('30/m', method='PATCH')
    def patch(self, request):
        try:
            preferences, created = UserPreferences.objects.get_or_create(user=request.user)
            serializer = UserPreferencesSerializer(preferences, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Updated preferences for user {request.user.username}")
                return Response(serializer.data)
            return Response({'error': True, 'message': 'Invalid input', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating preferences: {str(e)}", exc_info=True)
            return Response({'error': True, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
