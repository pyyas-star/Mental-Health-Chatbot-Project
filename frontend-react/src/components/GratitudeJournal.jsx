import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/gratitude.css';

const GratitudeJournal = () => {
    const [entries, setEntries] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newEntry, setNewEntry] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchEntries();
        fetchStats();
    }, []);

    const fetchEntries = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/gratitude/');
            setEntries(response.data.results || []);
        } catch (err) {
            console.error('Error fetching gratitude entries:', err);
            setError('Failed to load entries. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/gratitude/stats/');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newEntry.trim().length < 5) {
            setError('Please enter at least 5 characters.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/gratitude/', {
                text: newEntry.trim()
            });
            setEntries([response.data, ...entries]);
            setNewEntry('');
            setShowForm(false);
            fetchStats(); // Refresh stats for streak
        } catch (err) {
            console.error('Error creating entry:', err);
            setError(err.response?.data?.message || 'Failed to save entry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (entryId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/gratitude/${entryId}/`);
            setEntries(entries.filter(e => e.id !== entryId));
            fetchStats();
        } catch (err) {
            console.error('Error deleting entry:', err);
            setError('Failed to delete entry. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="gratitude-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading gratitude journal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gratitude-container">
            <div className="gratitude-header">
                <div>
                    <h2>🙏 Gratitude Journal</h2>
                    <p>Reflect on what you're grateful for</p>
                </div>
                {stats && (
                    <div className="streak-badge">
                        <span className="streak-number">{stats.current_streak}</span>
                        <span className="streak-label">Day Streak 🔥</span>
                    </div>
                )}
            </div>

            {stats && (
                <div className="stats-section">
                    <div className="stat-card">
                        <span className="stat-value">{stats.total_entries}</span>
                        <span className="stat-label">Total Entries</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.current_streak}</span>
                        <span className="stat-label">Current Streak</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            {!showForm ? (
                <button
                    className="add-entry-btn"
                    onClick={() => setShowForm(true)}
                >
                    + Add Gratitude Entry
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="entry-form">
                    <textarea
                        value={newEntry}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                setNewEntry(e.target.value);
                            }
                        }}
                        placeholder="What are you grateful for today?"
                        rows="4"
                        maxLength={500}
                        className="entry-input"
                        required
                    />
                    <div className="form-footer">
                        <span className="char-count">{newEntry.length} / 500</span>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    setNewEntry('');
                                    setError(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting || newEntry.trim().length < 5}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Entry'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {entries.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Entries Yet</h3>
                    <p>Start your gratitude journey by adding your first entry!</p>
                </div>
            ) : (
                <div className="entries-list">
                    {entries.map((entry) => (
                        <div key={entry.id} className="entry-card">
                            <div className="entry-header">
                                <span className="entry-date">{entry.date}</span>
                                <button
                                    className="delete-entry-btn"
                                    onClick={() => handleDelete(entry.id)}
                                    aria-label="Delete entry"
                                >
                                    🗑️
                                </button>
                            </div>
                            <p className="entry-text">{entry.text}</p>
                            <span className="entry-time">{entry.time_ago}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GratitudeJournal;

