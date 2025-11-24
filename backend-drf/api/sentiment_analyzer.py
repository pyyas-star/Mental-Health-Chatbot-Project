"""
Sentiment Analysis Service using DistilBERT for emotion detection.

This module provides a singleton-pattern sentiment analyzer that uses a 
pretrained transformer model to detect emotions and generate supportive responses.
"""

import torch
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
from django.conf import settings
import logging
import os

logger = logging.getLogger('api')


class SentimentAnalyzer:
    """
    Singleton class for sentiment analysis using DistilBERT.
    
    The model is loaded once and cached for performance optimization.
    """
    
    _instance = None
    _model = None
    _tokenizer = None
    _emotion_classifier = None
    
    def __new__(cls):
        """Implement singleton pattern to cache the model."""
        if cls._instance is None:
            cls._instance = super(SentimentAnalyzer, cls).__new__(cls)
            cls._instance._initialize_models()
        return cls._instance
    
    def _initialize_models(self):
        """Initialize and cache the sentiment analysis models."""
        try:
            logger.info("Initializing sentiment analysis models...")
            
            # Set cache directory for models via environment variable
            cache_dir = getattr(settings, 'MODEL_CACHE_DIR', None)
            if cache_dir:
                os.environ['TRANSFORMERS_CACHE'] = str(cache_dir)
                os.environ['HF_HOME'] = str(cache_dir)
            
            # Use emotion detection model
            model_name = "bhadresh-savani/distilbert-base-uncased-emotion"
            
            logger.info(f"Loading model: {model_name}")
            
            # Initialize emotion classifier
            # Note: pipeline() doesn't accept cache_dir directly, it uses TRANSFORMERS_CACHE env var
            self._emotion_classifier = pipeline(
                "text-classification",
                model=model_name,
                tokenizer=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            
            logger.info("Models initialized successfully!")
            
        except Exception as e:
            logger.error(f"Error initializing models: {str(e)}")
            raise
    
    def analyze_text(self, text: str) -> dict:
        """
        Analyze text for emotion and sentiment.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            dict: Contains 'emotion' and 'sentiment_score'
                  emotion: one of ['happy', 'sad', 'angry', 'anxious', 'neutral']
                  sentiment_score: float between -1 and 1
        """
        try:
            # Truncate text if too long
            max_length = 512
            text = text[:max_length] if len(text) > max_length else text
            
            # Get emotion classification
            emotion_result = self._emotion_classifier(text)[0]
            raw_emotion = emotion_result['label'].lower()
            confidence = emotion_result['score']
            
            # Log raw model output for debugging
            logger.info(f"Raw model output - label: '{raw_emotion}', confidence: {confidence:.3f}, text: '{text[:50]}...'")
            
            # Map various emotions to our 5 categories
            emotion = self._map_emotion(raw_emotion)
            
            # Context-aware override: Check for explicit negative/positive keywords
            # This helps catch cases where the model misclassifies
            emotion = self._apply_context_override(text, emotion, confidence)
            
            # Calculate sentiment score based on emotion and confidence
            sentiment_score = self._calculate_sentiment_score(emotion, confidence)
            
            logger.info(f"Analysis complete: raw_emotion='{raw_emotion}' -> mapped_emotion={emotion}, score={sentiment_score:.2f}")
            
            return {
                'emotion': emotion,
                'sentiment_score': sentiment_score,
                'confidence': confidence
            }
            
        except Exception as e:
            logger.error(f"Error analyzing text: {str(e)}")
            # Return neutral defaults on error
            return {
                'emotion': 'neutral',
                'sentiment_score': 0.0,
                'confidence': 0.5
            }
    
    def _map_emotion(self, raw_emotion: str) -> str:
        """
        Map model's emotion labels to our standard 5 emotions.
        
        Args:
            raw_emotion (str): Raw emotion from model
            
        Returns:
            str: Mapped emotion (happy/sad/angry/anxious/neutral)
        """
        emotion_mapping = {
            # Positive emotions -> happy
            'joy': 'happy',
            'happiness': 'happy',
            'happy': 'happy',
            'love': 'happy',
            'optimism': 'happy',
            
            # Negative emotions -> sad
            'sadness': 'sad',
            'sad': 'sad',
            'grief': 'sad',
            'disappointment': 'sad',
            'loneliness': 'sad',
            'down': 'sad',  # Added for "feeling down"
            'depressed': 'sad',
            'depression': 'sad',
            
            # Angry emotions
            'anger': 'angry',
            'angry': 'angry',
            'rage': 'angry',
            'fury': 'angry',
            'annoyance': 'angry',
            
            # Anxious/fear emotions
            'fear': 'anxious',
            'anxious': 'anxious',
            'anxiety': 'anxious',
            'worry': 'anxious',
            'nervous': 'anxious',
            'nervousness': 'anxious',
            'stress': 'anxious',
            'stressed': 'anxious',
            
            # Neutral emotions
            'surprise': 'neutral',
            'neutral': 'neutral',
            'confusion': 'neutral',
        }
        
        mapped = emotion_mapping.get(raw_emotion, 'neutral')
        
        # If still neutral and we got an unexpected label, log it
        if mapped == 'neutral' and raw_emotion not in ['surprise', 'neutral', 'confusion']:
            logger.warning(f"Unmapped emotion label: '{raw_emotion}' - defaulting to neutral")
        
        return mapped
    
    def _apply_context_override(self, text: str, detected_emotion: str, confidence: float) -> str:
        """
        Apply context-aware overrides based on explicit keywords in the text.
        This helps catch cases where the model misclassifies emotions.
        
        Args:
            text (str): Original text
            detected_emotion (str): Emotion detected by model
            confidence (float): Model confidence
            
        Returns:
            str: Potentially overridden emotion
        """
        text_lower = text.lower()
        
        # Negative keywords that strongly indicate sadness
        sad_keywords = [
            'down', 'depressed', 'depression', 'sad', 'sadness', 'unhappy',
            'miserable', 'hopeless', 'lonely', 'loneliness', 'empty',
            'crying', 'tears', 'hurt', 'pain', 'suffering', 'grief',
            'disappointed', 'disappointment', 'upset', 'feeling down'
        ]
        
        # Negative keywords that strongly indicate anger
        angry_keywords = [
            'angry', 'anger', 'mad', 'furious', 'rage', 'annoyed',
            'frustrated', 'irritated', 'hate', 'hatred', 'resent',
            'outraged', 'livid', 'fuming'
        ]
        
        # Negative keywords that strongly indicate anxiety
        anxious_keywords = [
            'anxious', 'anxiety', 'worried', 'worry', 'nervous', 'stress',
            'stressed', 'panic', 'panicking', 'afraid', 'fear', 'scared',
            'overwhelmed', 'overwhelming', 'tense', 'uneasy'
        ]
        
        # Positive keywords that strongly indicate happiness
        happy_keywords = [
            'happy', 'happiness', 'joy', 'joyful', 'excited', 'excitement',
            'great', 'wonderful', 'amazing', 'fantastic', 'love', 'loving',
            'grateful', 'thankful', 'blessed', 'cheerful', 'glad', 'pleased'
        ]
        
        # Check for explicit negative keywords - override if model got it wrong
        # Only override if confidence is low (< 0.7) or if keywords are very strong
        
        sad_matches = sum(1 for keyword in sad_keywords if keyword in text_lower)
        angry_matches = sum(1 for keyword in angry_keywords if keyword in text_lower)
        anxious_matches = sum(1 for keyword in anxious_keywords if keyword in text_lower)
        happy_matches = sum(1 for keyword in happy_keywords if keyword in text_lower)
        
        # If user explicitly says "feeling down" or similar, override to sad
        if sad_matches > 0 and detected_emotion == 'happy':
            logger.warning(f"Context override: detected 'happy' but found {sad_matches} sad keywords - overriding to 'sad'")
            return 'sad'
        
        if angry_matches > 0 and detected_emotion not in ['angry', 'sad']:
            logger.warning(f"Context override: detected '{detected_emotion}' but found {angry_matches} angry keywords - overriding to 'angry'")
            return 'angry'
        
        if anxious_matches > 0 and detected_emotion not in ['anxious', 'sad']:
            logger.warning(f"Context override: detected '{detected_emotion}' but found {anxious_matches} anxious keywords - overriding to 'anxious'")
            return 'anxious'
        
        # If low confidence and we have keyword matches, use keyword-based emotion
        if confidence < 0.6:
            if sad_matches > angry_matches and sad_matches > anxious_matches and sad_matches > happy_matches:
                logger.info(f"Low confidence ({confidence:.2f}) with {sad_matches} sad keywords - using 'sad'")
                return 'sad'
            elif angry_matches > sad_matches and angry_matches > anxious_matches:
                logger.info(f"Low confidence ({confidence:.2f}) with {angry_matches} angry keywords - using 'angry'")
                return 'angry'
            elif anxious_matches > sad_matches and anxious_matches > angry_matches:
                logger.info(f"Low confidence ({confidence:.2f}) with {anxious_matches} anxious keywords - using 'anxious'")
                return 'anxious'
        
        return detected_emotion
    
    def _calculate_sentiment_score(self, emotion: str, confidence: float) -> float:
        """
        Calculate sentiment score from -1 to 1 based on emotion.
        
        Args:
            emotion (str): Detected emotion
            confidence (float): Model confidence
            
        Returns:
            float: Sentiment score between -1 and 1
        """
        # Base sentiment values for each emotion
        emotion_sentiment = {
            'happy': 0.8,
            'sad': -0.7,
            'angry': -0.8,
            'anxious': -0.5,
            'neutral': 0.0,
        }
        
        base_score = emotion_sentiment.get(emotion, 0.0)
        
        # Adjust by confidence (but don't go extreme)
        adjusted_score = base_score * confidence
        
        # Clamp between -1 and 1
        return max(-1.0, min(1.0, adjusted_score))
    
    def generate_supportive_response(self, emotion: str, sentiment_score: float) -> str:
        """
        Generate a supportive response based on detected emotion.
        
        Args:
            emotion (str): Detected emotion
            sentiment_score (float): Sentiment score
            
        Returns:
            str: Supportive message tailored to the emotion
        """
        responses = {
            'happy': [
                "I'm so glad to hear you're feeling positive! It's wonderful to embrace these happy moments. Keep celebrating the good things in your life! 🌟",
                "That's fantastic! Your positive energy is truly uplifting. Remember to savor these joyful moments - they're what make life beautiful.",
                "How wonderful that you're experiencing happiness! These positive feelings are so important. Keep nurturing what brings you joy!",
            ],
            'sad': [
                "I hear you, and it's okay to feel sad. Remember that these feelings are temporary, and it's perfectly normal to have down days. Be gentle with yourself. 💙",
                "I'm sorry you're going through a tough time. Your feelings are valid, and it's important to acknowledge them. Consider reaching out to someone you trust, or doing something small that usually brings you comfort.",
                "Sadness is a natural part of being human. Allow yourself to feel these emotions, but also remember that brighter days lie ahead. Take care of yourself, and don't hesitate to seek support if you need it.",
            ],
            'angry': [
                "I can sense your frustration, and it's completely valid to feel angry sometimes. Try taking some deep breaths or stepping away for a moment. You deserve peace of mind.",
                "Anger is a natural emotion, and it's okay to feel this way. What matters is how we handle it. Consider channeling this energy into something constructive, or talking it through with someone you trust.",
                "I understand you're feeling upset right now. Remember to be kind to yourself as you process these feelings. It might help to take a break, practice some breathing exercises, or express yourself through writing or physical activity.",
            ],
            'anxious': [
                "I can sense you're feeling anxious, and that's completely understandable. Try to ground yourself in the present moment - take slow, deep breaths. You're stronger than you think. 🌸",
                "Anxiety can feel overwhelming, but remember that you've gotten through difficult moments before. Focus on what you can control right now, and take things one step at a time. You've got this!",
                "I hear your worries, and they're valid. When anxiety feels too much, try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. You're not alone in this.",
            ],
            'neutral': [
                "Thank you for sharing. Sometimes it's okay to just be in a neutral space. If there's anything specific on your mind, I'm here to listen.",
                "I appreciate you checking in. It's perfectly fine to have moments where emotions aren't extreme. How can I support you today?",
                "Thanks for opening up. Whether you're feeling calm or just in between emotions, remember that every feeling is temporary and valid. I'm here if you need to talk more.",
            ],
        }
        
        import random
        emotion_responses = responses.get(emotion, responses['neutral'])
        
        # Select a random response for variety
        response = random.choice(emotion_responses)
        
        # Add extra support if sentiment is very negative
        if sentiment_score < -0.6:
            response += "\n\nIf you're experiencing persistent difficult feelings, please consider reaching out to a mental health professional or trusted person in your life. You don't have to face this alone."
        
        return response


# Create a singleton instance
_analyzer_instance = None

def get_sentiment_analyzer():
    """
    Get the singleton sentiment analyzer instance.
    
    Returns:
        SentimentAnalyzer: The analyzer instance
    """
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = SentimentAnalyzer()
    return _analyzer_instance



