import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/chat.css';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const MAX_CHAR = 1000;
    const MIN_CHAR = 5;

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-focus input on mount
    useEffect(() => {
        console.log('ChatInterface mounted');
        inputRef.current?.focus();
    }, []);

    const handleInputChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHAR) {
            setInputText(text);
            setCharCount(text.length);
            setError(null);
        }
    };

    const getEmotionColor = (emotion) => {
        const colors = {
            happy: '#10b981',
            sad: '#3b82f6',
            angry: '#ef4444',
            anxious: '#f59e0b',
            neutral: '#6b7280'
        };
        return colors[emotion] || '#6b7280';
    };

    const getEmotionEmoji = (emotion) => {
        const emojis = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            anxious: '😰',
            neutral: '😐'
        };
        return emojis[emotion] || '😐';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (inputText.trim().length < MIN_CHAR) {
            setError(`Please enter at least ${MIN_CHAR} characters.`);
            return;
        }

        if (inputText.trim().length > MAX_CHAR) {
            setError(`Message is too long. Maximum ${MAX_CHAR} characters.`);
            return;
        }

        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputText.trim(),
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setCharCount(0);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/analyze/', {
                text: inputText.trim()
            });

            const { sentiment_score, emotion, response: aiResponse } = response.data;

            // Add AI response to chat
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: aiResponse,
                emotion: emotion,
                sentimentScore: sentiment_score,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            
            // Auto-focus back to input
            setTimeout(() => inputRef.current?.focus(), 100);

        } catch (err) {
            console.error('Error analyzing sentiment:', err);
            setError(
                err.response?.data?.message || 
                'Failed to analyze your message. Please try again.'
            );
            
            // Remove the user message if request failed
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const clearChat = () => {
        if (window.confirm('Are you sure you want to clear the chat?')) {
            setMessages([]);
        }
    };

    return (
        <div className="chat-container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '600px', 
            maxHeight: 'calc(100vh - 250px)',
            maxWidth: '900px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        }}>
            <div className="chat-header">
                <div className="header-content">
                    <h2>💬 Mental Health Companion</h2>
                    <p>Share your feelings, I'm here to listen and support you</p>
                </div>
                {messages.length > 0 && (
                    <button 
                        className="clear-chat-btn" 
                        onClick={clearChat}
                        aria-label="Clear chat"
                    >
                        Clear Chat
                    </button>
                )}
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">💭</div>
                        <h3>Start a Conversation</h3>
                        <p>Share how you're feeling today. I'm here to provide support and understanding.</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`message ${message.type}-message`}
                    >
                        <div className="message-content">
                            {message.type === 'ai' && message.emotion && (
                                <div className="emotion-badge" style={{ backgroundColor: getEmotionColor(message.emotion) }}>
                                    {getEmotionEmoji(message.emotion)} {message.emotion}
                                </div>
                            )}
                            <p className="message-text">{message.text}</p>
                            {message.type === 'ai' && message.sentimentScore !== undefined && (
                                <div className="sentiment-info">
                                    Sentiment: {message.sentimentScore > 0 ? '✨' : message.sentimentScore < 0 ? '💙' : '➖'} 
                                    {' '}{message.sentimentScore.toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message ai-message typing-indicator">
                        <div className="message-content">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <p className="typing-text">Analyzing your message...</p>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="chat-form">
                    <div className="input-wrapper">
                        <textarea
                            ref={inputRef}
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                            className="chat-input"
                            disabled={isLoading}
                            rows="3"
                            aria-label="Message input"
                        />
                        <div className="input-footer">
                            <span className={`char-counter ${charCount > MAX_CHAR * 0.9 ? 'warning' : ''}`}>
                                {charCount} / {MAX_CHAR}
                            </span>
                            <button 
                                type="submit" 
                                className="send-button"
                                disabled={isLoading || inputText.trim().length < MIN_CHAR}
                                aria-label="Send message"
                            >
                                {isLoading ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        <span>Send</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;



