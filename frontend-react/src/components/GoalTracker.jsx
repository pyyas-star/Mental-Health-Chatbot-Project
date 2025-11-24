import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/goals.css';

const GoalTracker = () => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, completed, overdue
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal_type: 'daily_checkin',
        target_value: 7,
        target_date: '',
    });

    // Goal type configurations
    const goalTypeConfigs = {
        daily_checkin: {
            label: 'Daily Check-ins',
            description: 'Check in with your mood every day',
            unit: 'days',
            defaultValue: 7,
            placeholder: 'e.g., 7 (for 7 days)',
            examples: [7, 14, 30]
        },
        mood_improvement: {
            label: 'Mood Improvement',
            description: 'Track positive mood improvements',
            unit: 'positive entries',
            defaultValue: 10,
            placeholder: 'e.g., 10 (for 10 positive entries)',
            examples: [5, 10, 20]
        },
        gratitude: {
            label: 'Gratitude Journaling',
            description: 'Write gratitude entries regularly',
            unit: 'entries',
            defaultValue: 7,
            placeholder: 'e.g., 7 (for 7 entries)',
            examples: [5, 7, 14]
        },
        custom: {
            label: 'Custom Goal',
            description: 'Set your own personal goal',
            unit: 'units',
            defaultValue: 1,
            placeholder: 'Enter your target',
            examples: []
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [filter]);

    const fetchGoals = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await axiosInstance.get('/goals/', { params });
            setGoals(response.data.results || []);
        } catch (err) {
            console.error('Error fetching goals:', err);
            setError('Failed to load goals. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/goals/', formData);
            setGoals([response.data, ...goals]);
            setShowCreateModal(false);
            setFormData({
                title: '',
                description: '',
                goal_type: 'daily_checkin',
                target_value: 7,
                target_date: '',
            });
        } catch (err) {
            console.error('Error creating goal:', err);
            setError(err.response?.data?.message || 'Failed to create goal. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteGoal = async (goalId) => {
        try {
            const response = await axiosInstance.post(`/goals/${goalId}/complete/`);
            setGoals(goals.map(g => g.id === goalId ? response.data : g));
        } catch (err) {
            console.error('Error completing goal:', err);
            setError('Failed to complete goal. Please try again.');
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/goals/${goalId}/`);
            setGoals(goals.filter(g => g.id !== goalId));
        } catch (err) {
            console.error('Error deleting goal:', err);
            setError('Failed to delete goal. Please try again.');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysRemaining = (days) => {
        if (days < 0) return `Overdue by ${Math.abs(days)} days`;
        if (days === 0) return 'Due today';
        if (days === 1) return '1 day remaining';
        return `${days} days remaining`;
    };

    if (isLoading) {
        return (
            <div className="goals-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading goals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="goals-container">
            <div className="goals-header">
                <div>
                    <h2>🎯 Goals & Progress</h2>
                    <p>Track your mental health goals and celebrate achievements</p>
                </div>
                <button
                    className="create-goal-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + New Goal
                </button>
            </div>

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            <div className="filter-section">
                {['all', 'active', 'completed', 'overdue'].map((status) => (
                    <button
                        key={status}
                        className={`filter-btn ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {goals.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <h3>No Goals Yet</h3>
                    <p>Create your first goal to start tracking your progress!</p>
                    <button
                        className="create-goal-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Your First Goal
                    </button>
                </div>
            ) : (
                <div className="goals-list">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className={`goal-card ${goal.completed ? 'completed' : ''} ${goal.is_overdue ? 'overdue' : ''}`}
                        >
                            <div className="goal-header">
                                <h3>{goal.title}</h3>
                                {!goal.completed && (
                                    <div className="goal-actions">
                                        <button
                                            className="complete-btn"
                                            onClick={() => handleCompleteGoal(goal.id)}
                                        >
                                            ✓ Complete
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>

                            {goal.description && (
                                <p className="goal-description">{goal.description}</p>
                            )}

                            <div className="goal-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${goal.progress_percentage}%` }}
                                    />
                                </div>
                                <div className="progress-info">
                                    <span>
                                        {goal.current_value} / {goal.target_value} {goalTypeConfigs[goal.goal_type]?.unit || ''}
                                    </span>
                                    <span>{goal.progress_percentage.toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className="goal-meta">
                                <span className="goal-type">
                                    {goalTypeConfigs[goal.goal_type]?.label || goal.goal_type.replace('_', ' ')}
                                </span>
                                <span className={`days-remaining ${goal.is_overdue ? 'overdue' : ''}`}>
                                    {getDaysRemaining(goal.days_remaining)}
                                </span>
                            </div>

                            {goal.completed && (
                                <div className="completion-badge">
                                    🎉 Goal Completed!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                        title: '',
                        description: '',
                        goal_type: 'daily_checkin',
                        target_value: 7,
                        target_date: '',
                    });
                    setError(null);
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Goal</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateGoal} className="goal-form">
                            <div className="form-group">
                                <label htmlFor="title">Goal Title *</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    minLength={3}
                                    maxLength={200}
                                    placeholder="e.g., Check in daily for a week"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="goal_type">Goal Type</label>
                                <select
                                    id="goal_type"
                                    value={formData.goal_type}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        const config = goalTypeConfigs[newType];
                                        setFormData({ 
                                            ...formData, 
                                            goal_type: newType,
                                            target_value: config.defaultValue
                                        });
                                    }}
                                >
                                    {Object.entries(goalTypeConfigs).map(([value, config]) => (
                                        <option key={value} value={value}>
                                            {config.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="field-help-text">
                                    {goalTypeConfigs[formData.goal_type].description}
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="target_value">
                                    Target {goalTypeConfigs[formData.goal_type].unit.charAt(0).toUpperCase() + goalTypeConfigs[formData.goal_type].unit.slice(1)} *
                                </label>
                                <div className="target-value-wrapper">
                                    <input
                                        id="target_value"
                                        type="number"
                                        value={formData.target_value}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            if (value > 0) {
                                                setFormData({ ...formData, target_value: value });
                                            }
                                        }}
                                        min="1"
                                        required
                                        placeholder={goalTypeConfigs[formData.goal_type].placeholder}
                                    />
                                    <span className="target-unit">
                                        {goalTypeConfigs[formData.goal_type].unit}
                                    </span>
                                </div>
                                {goalTypeConfigs[formData.goal_type].examples.length > 0 && (
                                    <div className="quick-values">
                                        <span className="quick-label">Quick select:</span>
                                        {goalTypeConfigs[formData.goal_type].examples.map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                className="quick-value-btn"
                                                onClick={() => setFormData({ ...formData, target_value: val })}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <p className="field-help-text">
                                    How many {goalTypeConfigs[formData.goal_type].unit} do you want to achieve?
                                </p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="target_date">Target Date *</label>
                                <input
                                    id="target_date"
                                    type="date"
                                    value={formData.target_date}
                                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {error && (
                                <div className="error-message">{error}</div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setFormData({
                                            title: '',
                                            description: '',
                                            goal_type: 'daily_checkin',
                                            target_value: 7,
                                            target_date: '',
                                        });
                                        setError(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Goal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalTracker;

