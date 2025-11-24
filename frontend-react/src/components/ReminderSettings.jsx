import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import '../assets/css/wellness.css';
import '../assets/css/reminders.css';

const ReminderSettings = () => {
    const [preferences, setPreferences] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [hasChanges, setHasChanges] = useState(false);

    // Quick time presets
    const timePresets = [
        { label: 'Morning', value: '09:00', icon: '🌅' },
        { label: 'Noon', value: '12:00', icon: '☀️' },
        { label: 'Evening', value: '18:00', icon: '🌆' },
        { label: 'Night', value: '21:00', icon: '🌙' },
    ];

    useEffect(() => {
        fetchPreferences();
        checkNotificationPermission();
    }, []);

    const fetchPreferences = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/preferences/');
            setPreferences(response.data);
        } catch (err) {
            console.error('Error fetching preferences:', err);
            setError('Failed to load preferences. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const checkNotificationPermission = () => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    };

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            
            if (permission === 'granted') {
                // Update preferences
                await handleSave({ ...preferences, notification_enabled: true });
            }
        } catch (err) {
            console.error('Error requesting notification permission:', err);
        }
    };

    const handleSave = async (updatedPrefs = null) => {
        const prefsToSave = updatedPrefs || preferences;
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axiosInstance.patch('/preferences/', prefsToSave);
            setPreferences(response.data);
            setSuccess(true);
            setHasChanges(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving preferences:', err);
            setError(err.response?.data?.message || 'Failed to save preferences. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestNotification = () => {
        if (Notification.permission === 'granted') {
            new Notification('Mental Health Companion', {
                body: 'This is a test notification. Your reminders are working!',
                icon: '/favicon.ico',
            });
        } else {
            alert('Please enable notifications first');
        }
    };

    const handleChange = (field, value) => {
        setPreferences({
            ...preferences,
            [field]: value,
        });
        setHasChanges(true);
        setSuccess(false);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    };

    if (isLoading) {
        return (
            <div className="wellness-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading settings...</p>
                </div>
            </div>
        );
    }

    if (!preferences) {
        return (
            <div className="wellness-container">
                <div className="error-message">Failed to load preferences</div>
            </div>
        );
    }

    return (
        <div className="reminders-container">
            <div className="reminders-header">
                <div className="header-icon">⚙️</div>
                <div>
                    <h2>Reminder Settings</h2>
                    <p>Configure your daily check-in reminders and preferences</p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    <span className="alert-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <span className="alert-icon">✓</span>
                    <span>Settings saved successfully!</span>
                </div>
            )}

            <div className="settings-grid">
                {/* Daily Reminders Card */}
                <div className="setting-card">
                    <div className="card-header">
                        <div className="card-icon">📅</div>
                        <div>
                            <h3>Daily Reminders</h3>
                            <p>Get reminded to check in with your mood</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="toggle-group">
                            <label className="toggle-label">
                                <span className="toggle-text">Enable Daily Reminders</span>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.reminder_enabled}
                                        onChange={(e) => handleChange('reminder_enabled', e.target.checked)}
                                        className="toggle-input"
                                    />
                                    <span className="toggle-slider"></span>
                                </div>
                            </label>
                            <p className="help-text">
                                Receive a daily reminder to log your mood and track your mental wellness journey.
                            </p>
                        </div>

                        {preferences.reminder_enabled && (
                            <div className="time-selector-section">
                                <label className="section-label">Reminder Time</label>
                                
                                <div className="time-presets">
                                    {timePresets.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            className={`time-preset-btn ${preferences.reminder_time?.startsWith(preset.value) ? 'active' : ''}`}
                                            onClick={() => handleChange('reminder_time', preset.value)}
                                        >
                                            <span className="preset-icon">{preset.icon}</span>
                                            <span className="preset-label">{preset.label}</span>
                                            <span className="preset-time">{preset.value}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="custom-time-input">
                                    <label htmlFor="reminder_time">Or choose custom time:</label>
                                    <div className="time-input-wrapper">
                                        <input
                                            id="reminder_time"
                                            type="time"
                                            value={preferences.reminder_time || '09:00'}
                                            onChange={(e) => handleChange('reminder_time', e.target.value)}
                                            className="time-input"
                                        />
                                        <span className="time-display">
                                            {formatTime(preferences.reminder_time || '09:00')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Browser Notifications Card */}
                <div className="setting-card">
                    <div className="card-header">
                        <div className="card-icon">🔔</div>
                        <div>
                            <h3>Browser Notifications</h3>
                            <p>Get notified even when the app is closed</p>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="toggle-group">
                            <label className="toggle-label">
                                <span className="toggle-text">Enable Browser Notifications</span>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notification_enabled && notificationPermission === 'granted'}
                                        onChange={(e) => handleChange('notification_enabled', e.target.checked)}
                                        disabled={notificationPermission !== 'granted'}
                                        className="toggle-input"
                                    />
                                    <span className="toggle-slider"></span>
                                </div>
                            </label>
                            <p className="help-text">
                                Receive browser notifications for your reminders, even when you're not on the app.
                            </p>
                        </div>

                        <div className="notification-status">
                            {notificationPermission === 'default' && (
                                <div className="status-banner status-info">
                                    <span className="status-icon">ℹ️</span>
                                    <div className="status-content">
                                        <strong>Permission Required</strong>
                                        <p>Click the button below to allow notifications from this site.</p>
                                        <button
                                            className="btn-primary"
                                            onClick={requestNotificationPermission}
                                        >
                                            Enable Notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {notificationPermission === 'granted' && (
                                <div className="status-banner status-success">
                                    <span className="status-icon">✓</span>
                                    <div className="status-content">
                                        <strong>Notifications Enabled</strong>
                                        <p>You'll receive notifications at your reminder time.</p>
                                        <button
                                            className="btn-secondary"
                                            onClick={handleTestNotification}
                                        >
                                            Test Notification
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {notificationPermission === 'denied' && (
                                <div className="status-banner status-error">
                                    <span className="status-icon">⚠️</span>
                                    <div className="status-content">
                                        <strong>Notifications Blocked</strong>
                                        <p>Notifications are disabled in your browser settings. To enable them:</p>
                                        <ol>
                                            <li>Click the lock icon in your browser's address bar</li>
                                            <li>Find "Notifications" and change it to "Allow"</li>
                                            <li>Refresh this page</li>
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Save Button */}
            {hasChanges && (
                <div className="save-bar">
                    <div className="save-bar-content">
                        <span className="save-bar-text">You have unsaved changes</span>
                        <div className="save-bar-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    fetchPreferences();
                                    setHasChanges(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => handleSave()}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Settings'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReminderSettings;


            <div className="settings-form">
                <div className="setting-group">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={preferences.reminder_enabled}
                            onChange={(e) => handleChange('reminder_enabled', e.target.checked)}
                        />
                        <span>Enable Daily Reminders</span>
                    </label>
                    <p className="setting-description">
                        Receive reminders to check in with your mood each day
                    </p>
                </div>

                {preferences.reminder_enabled && (
                    <div className="setting-group">
                        <label className="setting-label">Reminder Time</label>
                        <input
                            type="time"
                            value={preferences.reminder_time}
                            onChange={(e) => handleChange('reminder_time', e.target.value)}
                            className="time-input"
                        />
                        <p className="setting-description">
                            Choose when you'd like to receive your daily reminder
                        </p>
                    </div>
                )}

                <div className="setting-group">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={preferences.notification_enabled}
                            onChange={(e) => handleChange('notification_enabled', e.target.checked)}
                            disabled={notificationPermission !== 'granted'}
                        />
                        <span>Enable Browser Notifications</span>
                    </label>
                    <p className="setting-description">
                        Receive browser notifications for reminders
                    </p>
                    
                    {notificationPermission === 'default' && (
                        <button
                            className="permission-btn"
                            onClick={requestNotificationPermission}
                        >
                            Request Notification Permission
                        </button>
                    )}
                    
                    {notificationPermission === 'granted' && (
                        <button
                            className="test-notification-btn"
                            onClick={handleTestNotification}
                        >
                            Test Notification
                        </button>
                    )}
                    
                    {notificationPermission === 'denied' && (
                        <p className="permission-denied">
                            Notifications are blocked. Please enable them in your browser settings.
                        </p>
                    )}
                </div>

                <div className="setting-group">
                    <label className="setting-label">Theme Preference</label>
                    <select
                        value={preferences.preferred_theme}
                        onChange={(e) => handleChange('preferred_theme', e.target.value)}
                        className="theme-select"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                    </select>
                    <p className="setting-description">
                        Choose your preferred color theme
                    </p>
                </div>

                <div className="form-actions">
                    <button
                        className="save-btn"
                        onClick={() => handleSave()}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderSettings;


                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="toggle-group">
                            <label className="toggle-label">
                                <span className="toggle-text">Enable Browser Notifications</span>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.notification_enabled && notificationPermission === 'granted'}
                                        onChange={(e) => handleChange('notification_enabled', e.target.checked)}
                                        disabled={notificationPermission !== 'granted'}
                                        className="toggle-input"
                                    />
                                    <span className="toggle-slider"></span>
                                </div>
                            </label>
                            <p className="help-text">
                                Receive browser notifications for your reminders, even when you're not on the app.
                            </p>
                        </div>

                        <div className="notification-status">
                            {notificationPermission === 'default' && (
                                <div className="status-banner status-info">
                                    <span className="status-icon">ℹ️</span>
                                    <div className="status-content">
                                        <strong>Permission Required</strong>
                                        <p>Click the button below to allow notifications from this site.</p>
                                        <button
                                            className="btn-primary"
                                            onClick={requestNotificationPermission}
                                        >
                                            Enable Notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {notificationPermission === 'granted' && (
                                <div className="status-banner status-success">
                                    <span className="status-icon">✓</span>
                                    <div className="status-content">
                                        <strong>Notifications Enabled</strong>
                                        <p>You'll receive notifications at your reminder time.</p>
                                        <button
                                            className="btn-secondary"
                                            onClick={handleTestNotification}
                                        >
                                            Test Notification
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {notificationPermission === 'denied' && (
                                <div className="status-banner status-error">
                                    <span className="status-icon">⚠️</span>
                                    <div className="status-content">
                                        <strong>Notifications Blocked</strong>
                                        <p>Notifications are disabled in your browser settings. To enable them:</p>
                                        <ol>
                                            <li>Click the lock icon in your browser's address bar</li>
                                            <li>Find "Notifications" and change it to "Allow"</li>
                                            <li>Refresh this page</li>
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Save Button */}
            {hasChanges && (
                <div className="save-bar">
                    <div className="save-bar-content">
                        <span className="save-bar-text">You have unsaved changes</span>
                        <div className="save-bar-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    fetchPreferences();
                                    setHasChanges(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => handleSave()}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Settings'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReminderSettings;

