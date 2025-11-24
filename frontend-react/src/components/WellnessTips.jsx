import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/wellness.css';

const WellnessTips = () => {
    const [tips, setTips] = useState([]);
    const [selectedEmotion, setSelectedEmotion] = useState('neutral');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const emotions = [
        { value: 'happy', emoji: '😊', label: 'Happy' },
        { value: 'sad', emoji: '😢', label: 'Sad' },
        { value: 'angry', emoji: '😠', label: 'Angry' },
        { value: 'anxious', emoji: '😰', label: 'Anxious' },
        { value: 'neutral', emoji: '😐', label: 'Neutral' },
    ];

    const categories = [
        { value: 'all', label: 'All Tips' },
        { value: 'breathing_exercises', label: 'Breathing' },
        { value: 'activities', label: 'Activities' },
        { value: 'resources', label: 'Resources' },
        { value: 'affirmations', label: 'Affirmations' },
    ];

    useEffect(() => {
        fetchTips();
    }, [selectedEmotion]);

    const fetchTips = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get('/wellness-tips/', {
                params: { emotion: selectedEmotion }
            });
            setTips(response.data || []);
        } catch (err) {
            console.error('Error fetching wellness tips:', err);
            setError('Failed to load tips. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTips = selectedCategory === 'all'
        ? tips
        : tips.filter(tip => tip.category === selectedCategory);

    if (isLoading) {
        return (
            <div className="wellness-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading wellness tips...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wellness-container">
            <div className="wellness-header">
                <h2>💡 Wellness Tips & Resources</h2>
                <p>Personalized tips based on how you're feeling</p>
            </div>

            <div className="emotion-selector-section">
                <label>Select Emotion:</label>
                <div className="emotion-buttons">
                    {emotions.map((emotion) => (
                        <button
                            key={emotion.value}
                            className={`emotion-select-btn ${selectedEmotion === emotion.value ? 'active' : ''}`}
                            onClick={() => setSelectedEmotion(emotion.value)}
                        >
                            <span>{emotion.emoji}</span>
                            <span>{emotion.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="category-filter">
                {categories.map((category) => (
                    <button
                        key={category.value}
                        className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.value)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            {filteredTips.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💡</div>
                    <h3>No Tips Available</h3>
                    <p>Try selecting a different emotion or category.</p>
                </div>
            ) : (
                <div className="tips-grid">
                    {filteredTips.map((tip, index) => (
                        <div key={index} className="tip-card">
                            <div className="tip-category-badge">
                                {tip.category.replace('_', ' ')}
                            </div>
                            <h3 className="tip-title">{tip.title}</h3>
                            <p className="tip-description">{tip.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WellnessTips;

