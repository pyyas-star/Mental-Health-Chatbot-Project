"""
Wellness Tips Data for Mental Health Chatbot.

Provides emotion-based wellness tips, activities, and resources.
"""

from typing import List, Dict
from .constants import EMOTION_CHOICES

# Type hint for tip structure
Tip = Dict[str, str]


def get_wellness_tips(emotion: str) -> List[Tip]:
    """
    Get wellness tips based on detected emotion.
    
    Args:
        emotion: One of 'happy', 'sad', 'angry', 'anxious', 'neutral'
        
    Returns:
        List of tip dictionaries with title, description, category
    """
    emotion = emotion.lower()
    
    if emotion not in [choice[0] for choice in EMOTION_CHOICES]:
        emotion = 'neutral'
    
    return WELLNESS_TIPS.get(emotion, WELLNESS_TIPS['neutral'])


# Wellness tips organized by emotion
WELLNESS_TIPS: Dict[str, List[Tip]] = {
    'happy': [
        {
            'title': 'Share Your Joy',
            'description': 'Share your positive feelings with someone you care about. Spreading joy multiplies happiness.',
            'category': 'activities'
        },
        {
            'title': 'Practice Gratitude',
            'description': 'Take a moment to write down what you\'re grateful for. This reinforces positive feelings.',
            'category': 'activities'
        },
        {
            'title': 'Celebrate Small Wins',
            'description': 'Acknowledge and celebrate your achievements, no matter how small they seem.',
            'category': 'affirmations'
        },
        {
            'title': 'Deep Breathing',
            'description': 'Take 5 deep breaths to ground yourself in this positive moment.',
            'category': 'breathing_exercises'
        },
        {
            'title': 'Stay Present',
            'description': 'Enjoy this moment of happiness. Mindfulness helps you fully experience positive emotions.',
            'category': 'activities'
        },
    ],
    'sad': [
        {
            'title': '4-7-8 Breathing',
            'description': 'Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times to calm your nervous system.',
            'category': 'breathing_exercises'
        },
        {
            'title': 'Reach Out',
            'description': 'Talk to someone you trust about how you\'re feeling. You don\'t have to face this alone.',
            'category': 'resources'
        },
        {
            'title': 'Gentle Movement',
            'description': 'Take a short walk, stretch, or do light yoga. Movement can help lift your mood.',
            'category': 'activities'
        },
        {
            'title': 'Self-Compassion',
            'description': 'Be kind to yourself. It\'s okay to feel sad. Your feelings are valid and temporary.',
            'category': 'affirmations'
        },
        {
            'title': 'Professional Support',
            'description': 'If sadness persists, consider speaking with a mental health professional. Help is available.',
            'category': 'resources'
        },
        {
            'title': 'Create Something',
            'description': 'Express yourself through writing, drawing, music, or any creative outlet.',
            'category': 'activities'
        },
    ],
    'angry': [
        {
            'title': 'Box Breathing',
            'description': 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4-6 times.',
            'category': 'breathing_exercises'
        },
        {
            'title': 'Take a Break',
            'description': 'Step away from the situation. Give yourself space to cool down before responding.',
            'category': 'activities'
        },
        {
            'title': 'Physical Release',
            'description': 'Channel anger through exercise, punching a pillow, or vigorous activity.',
            'category': 'activities'
        },
        {
            'title': 'Identify Triggers',
            'description': 'Reflect on what triggered your anger. Understanding helps manage future responses.',
            'category': 'activities'
        },
        {
            'title': 'Express Constructively',
            'description': 'Write down your feelings or talk it through with someone. Expressing helps process anger.',
            'category': 'activities'
        },
        {
            'title': 'Cool Down Technique',
            'description': 'Splash cold water on your face or hold something cold. This can help reset your system.',
            'category': 'activities'
        },
    ],
    'anxious': [
        {
            'title': '4-7-8 Breathing',
            'description': 'Inhale for 4 counts, hold for 7, exhale for 8. This activates your relaxation response.',
            'category': 'breathing_exercises'
        },
        {
            'title': 'Grounding Technique',
            'description': 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
            'category': 'activities'
        },
        {
            'title': 'Progressive Muscle Relaxation',
            'description': 'Tense and release each muscle group from toes to head. This reduces physical tension.',
            'category': 'activities'
        },
        {
            'title': 'Challenge Anxious Thoughts',
            'description': 'Ask yourself: "Is this thought helpful? What\'s the evidence? What\'s a more balanced view?"',
            'category': 'activities'
        },
        {
            'title': 'Limit Stimulants',
            'description': 'Reduce caffeine and sugar intake, especially when feeling anxious.',
            'category': 'resources'
        },
        {
            'title': 'Create a Calm Space',
            'description': 'Find a quiet place, dim lights, play calming music, or use aromatherapy.',
            'category': 'activities'
        },
    ],
    'neutral': [
        {
            'title': 'Mindful Breathing',
            'description': 'Take 10 slow, deep breaths. Focus on the sensation of breathing.',
            'category': 'breathing_exercises'
        },
        {
            'title': 'Check In With Yourself',
            'description': 'Take a moment to notice how you\'re feeling physically and emotionally.',
            'category': 'activities'
        },
        {
            'title': 'Gentle Movement',
            'description': 'Do some light stretching or take a short walk to energize your body.',
            'category': 'activities'
        },
        {
            'title': 'Set an Intention',
            'description': 'Think about what you\'d like to focus on today. Setting intentions brings clarity.',
            'category': 'activities'
        },
        {
            'title': 'Stay Hydrated',
            'description': 'Drink a glass of water. Proper hydration supports both physical and mental wellbeing.',
            'category': 'resources'
        },
    ],
}

