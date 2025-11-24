import { useState, useEffect } from 'react';
import ChatInterface from '../ChatInterface';
import MoodHistory from '../MoodHistory';
import DailyCheckIn from '../DailyCheckIn';
import GoalTracker from '../GoalTracker';
import GratitudeJournal from '../GratitudeJournal';
import WellnessTips from '../WellnessTips';
import BreathingExercise from '../BreathingExercise';
import ReminderSettings from '../ReminderSettings';
import axiosInstance from '../../axiosInstance';
import ErrorBoundary from '../ErrorBoundary';
import '../../assets/css/dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('chat');
    const [username, setUsername] = useState('');

    useEffect(() => {
        console.log('Dashboard mounted, activeTab:', activeTab);
        // Verify authentication
        const fetchProtectedData = async () => {
            try {
                await axiosInstance.get('/protected-view/');
                // Get username from localStorage or decode from token
                const user = localStorage.getItem('username');
                if (user) {
                    setUsername(user);
                }
            } catch (error) {
                console.log('Error fetching protected data', error);
            }
        };
        fetchProtectedData();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                        aria-label="Chat tab"
                    >
                        <span className="tab-icon">💬</span>
                        <span className="tab-label">Chat</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'checkin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('checkin')}
                        aria-label="Check-in tab"
                    >
                        <span className="tab-icon">📅</span>
                        <span className="tab-label">Check-in</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('goals')}
                        aria-label="Goals tab"
                    >
                        <span className="tab-icon">🎯</span>
                        <span className="tab-label">Goals</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'gratitude' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gratitude')}
                        aria-label="Gratitude tab"
                    >
                        <span className="tab-icon">🙏</span>
                        <span className="tab-label">Gratitude</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'wellness' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wellness')}
                        aria-label="Wellness tab"
                    >
                        <span className="tab-icon">💡</span>
                        <span className="tab-label">Wellness</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'breathing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('breathing')}
                        aria-label="Breathing tab"
                    >
                        <span className="tab-icon">🌬️</span>
                        <span className="tab-label">Breathing</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                        aria-label="History tab"
                    >
                        <span className="tab-icon">📊</span>
                        <span className="tab-label">History</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                        aria-label="Settings tab"
                    >
                        <span className="tab-icon">⚙️</span>
                        <span className="tab-label">Settings</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content" style={{ minHeight: '600px', width: '100%', display: 'block', background: 'transparent' }}>
                    {activeTab === 'chat' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <ChatInterface />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'checkin' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <DailyCheckIn />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'goals' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <GoalTracker />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'gratitude' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <GratitudeJournal />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'wellness' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <WellnessTips />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'breathing' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <BreathingExercise />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <MoodHistory />
                            </ErrorBoundary>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="tab-pane fade-in" style={{ width: '100%', display: 'block', minHeight: '600px' }}>
                            <ErrorBoundary>
                                <ReminderSettings />
                            </ErrorBoundary>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
