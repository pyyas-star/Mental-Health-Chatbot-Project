import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/checkin.css';

const DailyCheckIn = () => {
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [note, setNote] = useState('');
    const [todayCheckIn, setTodayCheckIn] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [calendarData, setCalendarData] = useState([]);

    const emotions = [
        { value: 'happy', emoji: '😊', label: 'Happy', color: '#10b981' },
        { value: 'sad', emoji: '😢', label: 'Sad', color: '#3b82f6' },
        { value: 'angry', emoji: '😠', label: 'Angry', color: '#ef4444' },
        { value: 'anxious', emoji: '😰', label: 'Anxious', color: '#f59e0b' },
        { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#6b7280' },
    ];

    useEffect(() => {
        fetchTodayCheckIn();
        fetchCalendarData();
    }, []);

    const fetchTodayCheckIn = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/checkin/today/');
            setTodayCheckIn(response.data);
            setSelectedEmotion(response.data.emotion);
            setNote(response.data.note || '');
        } catch (error) {
            if (error.response?.status === 404) {
                // No check-in for today - that's okay
                setTodayCheckIn(null);
            } else {
                console.error('Error fetching today\'s check-in:', error);
                setError('Failed to load today\'s check-in');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCalendarData = async () => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30); // Last 30 days

            const response = await axiosInstance.get('/checkin/calendar/', {
                params: {
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                }
            });
            setCalendarData(response.data.checkins || []);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedEmotion) {
            setError('Please select your mood');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axiosInstance.post('/checkin/', {
                emotion: selectedEmotion,
                note: note.trim() || null,
            });

            setTodayCheckIn(response.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            
            // Refresh calendar
            fetchCalendarData();
        } catch (error) {
            console.error('Error submitting check-in:', error);
            setError(
                error.response?.data?.message || 
                'Failed to save check-in. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getEmotionByValue = (value) => {
        return emotions.find(e => e.value === value);
    };

    const getCalendarEmotion = (dateStr) => {
        const checkin = calendarData.find(c => c.date === dateStr);
        return checkin ? getEmotionByValue(checkin.emotion) : null;
    };

    // Generate calendar days (last 30 days)
    const generateCalendarDays = () => {
        const days = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const emotionData = getCalendarEmotion(dateStr);
            
            days.push({
                date: date,
                dateStr: dateStr,
                emotion: emotionData,
                isToday: i === 0,
            });
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();

    if (isLoading) {
        return (
            <div className="checkin-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkin-container">
            <div className="checkin-header">
                <h2>📅 Daily Mood Check-in</h2>
                <p>How are you feeling today?</p>
            </div>

            {todayCheckIn && (
                <div className="already-checked-in">
                    <div className="check-in-badge">
                        <span className="emotion-emoji-large">
                            {getEmotionByValue(todayCheckIn.emotion)?.emoji}
                        </span>
                        <div>
                            <strong>Already checked in today!</strong>
                            <p>You're feeling {todayCheckIn.emotion}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="checkin-form">
                <div className="emotion-selector">
                    {emotions.map((emotion) => (
                        <button
                            key={emotion.value}
                            type="button"
                            className={`emotion-btn ${selectedEmotion === emotion.value ? 'selected' : ''}`}
                            onClick={() => setSelectedEmotion(emotion.value)}
                            style={{
                                borderColor: selectedEmotion === emotion.value ? emotion.color : 'transparent',
                                backgroundColor: selectedEmotion === emotion.value ? `${emotion.color}15` : 'transparent',
                            }}
                            aria-label={`Select ${emotion.label} mood`}
                        >
                            <span className="emotion-emoji">{emotion.emoji}</span>
                            <span className="emotion-label">{emotion.label}</span>
                        </button>
                    ))}
                </div>

                <div className="note-section">
                    <label htmlFor="checkin-note">Optional Note (max 500 characters)</label>
                    <textarea
                        id="checkin-note"
                        value={note}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                setNote(e.target.value);
                            }
                        }}
                        placeholder="Add any thoughts about your mood..."
                        rows="3"
                        maxLength={500}
                        className="checkin-note-input"
                    />
                    <span className="char-count">{note.length} / 500</span>
                </div>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        ✓ Check-in saved successfully!
                    </div>
                )}

                <button
                    type="submit"
                    className="submit-checkin-btn"
                    disabled={!selectedEmotion || isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : todayCheckIn ? 'Update Check-in' : 'Save Check-in'}
                </button>
            </form>

            <div className="calendar-section">
                <h3>Your Mood Calendar (Last 30 Days)</h3>
                <div className="mood-calendar">
                    {calendarDays.map((day) => (
                        <div
                            key={day.dateStr}
                            className={`calendar-day ${day.isToday ? 'today' : ''} ${day.emotion ? 'has-mood' : ''}`}
                            style={{
                                backgroundColor: day.emotion ? `${day.emotion.color}20` : 'transparent',
                                borderColor: day.isToday ? day.emotion?.color || '#667eea' : 'transparent',
                            }}
                            title={day.emotion ? `${day.dateStr}: ${day.emotion.label}` : day.dateStr}
                        >
                            <span className="day-number">{day.date.getDate()}</span>
                            {day.emotion && (
                                <span className="day-emotion">{day.emotion.emoji}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DailyCheckIn;

