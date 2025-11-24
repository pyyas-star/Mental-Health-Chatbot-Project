import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/mood-history.css';

const MoodHistory = () => {
    const [entries, setEntries] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        fetchHistory();
        fetchStats();
    }, [filter, page]);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const params = { page };
            if (filter !== 'all') {
                params.emotion = filter;
            }

            const response = await axiosInstance.get('/history/', { params });
            setEntries(response.data.results);
            setHasMore(!!response.data.next);
            setError(null);
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Failed to load mood history. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/stats/');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
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

    const getTrendEmoji = (trend) => {
        const trends = {
            improving: '📈',
            declining: '📉',
            stable: '➡️',
            no_data: '📊',
            insufficient_data: '📊',
            new_user: '🌱'
        };
        return trends[trend] || '📊';
    };

    const getTrendText = (trend) => {
        const texts = {
            improving: 'Improving',
            declining: 'Needs attention',
            stable: 'Stable',
            no_data: 'No data yet',
            insufficient_data: 'Not enough data',
            new_user: 'New user'
        };
        return texts[trend] || 'Unknown';
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1);
    };

    return (
        <div className="mood-history-container">
            <div className="history-header">
                <h2>📊 Your Mood Journey</h2>
                <p>Track your emotional wellbeing over time</p>
            </div>

            {/* Statistics Section */}
            {stats && stats.total_entries > 0 && (
                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-icon">💬</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.total_entries}</span>
                            <span className="stat-label">Total Entries</span>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">
                            {stats.average_sentiment > 0 ? '✨' : stats.average_sentiment < 0 ? '💙' : '➖'}
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.average_sentiment.toFixed(2)}</span>
                            <span className="stat-label">Avg Sentiment</span>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">{getTrendEmoji(stats.recent_trend)}</div>
                        <div className="stat-content">
                            <span className="stat-value">{getTrendText(stats.recent_trend)}</span>
                            <span className="stat-label">Recent Trend</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Emotion Breakdown */}
            {stats && stats.emotion_breakdown && Object.keys(stats.emotion_breakdown).length > 0 && (
                <div className="emotion-breakdown">
                    <h3>Emotion Distribution</h3>
                    <div className="emotion-bars">
                        {Object.entries(stats.emotion_breakdown).map(([emotion, count]) => {
                            const percentage = (count / stats.total_entries) * 100;
                            return (
                                <div key={emotion} className="emotion-bar-item">
                                    <div className="emotion-bar-label">
                                        <span>{getEmotionEmoji(emotion)} {emotion}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="emotion-bar-track">
                                        <div 
                                            className="emotion-bar-fill"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: getEmotionColor(emotion)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="filter-section">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    All
                </button>
                {['happy', 'sad', 'angry', 'anxious', 'neutral'].map(emotion => (
                    <button 
                        key={emotion}
                        className={`filter-btn ${filter === emotion ? 'active' : ''}`}
                        onClick={() => handleFilterChange(emotion)}
                        style={filter === emotion ? { backgroundColor: getEmotionColor(emotion) } : {}}
                    >
                        {getEmotionEmoji(emotion)} {emotion}
                    </button>
                ))}
            </div>

            {/* History Entries */}
            <div className="history-entries">
                {isLoading && entries.length === 0 ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your mood history...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <p>{error}</p>
                        <button onClick={fetchHistory} className="retry-btn">Try Again</button>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>No Entries Yet</h3>
                        <p>Start chatting to see your mood history here!</p>
                    </div>
                ) : (
                    <>
                        {entries.map((entry) => (
                            <div key={entry.id} className="history-card">
                                <div className="card-header">
                                    <div 
                                        className="emotion-badge"
                                        style={{ backgroundColor: getEmotionColor(entry.emotion) }}
                                    >
                                        {getEmotionEmoji(entry.emotion)} {entry.emotion}
                                    </div>
                                    <span className="timestamp">{entry.time_ago}</span>
                                </div>
                                <p className="entry-text">{entry.text}</p>
                                <div className="card-footer">
                                    <span className="sentiment-score">
                                        {entry.sentiment_score > 0 ? '✨' : entry.sentiment_score < 0 ? '💙' : '➖'} 
                                        {' '}Score: {entry.sentiment_score.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="pagination">
                            {page > 1 && (
                                <button 
                                    className="page-btn"
                                    onClick={() => setPage(page - 1)}
                                    disabled={isLoading}
                                >
                                    Previous
                                </button>
                            )}
                            <span className="page-info">Page {page}</span>
                            {hasMore && (
                                <button 
                                    className="page-btn"
                                    onClick={() => setPage(page + 1)}
                                    disabled={isLoading}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MoodHistory;



