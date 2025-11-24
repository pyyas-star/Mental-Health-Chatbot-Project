/**
 * Browser Notification Utility
 * 
 * Handles browser notification permissions and scheduling.
 */

/**
 * Request notification permission from the user.
 * 
 * @returns {Promise<string>} Permission status ('granted', 'denied', or 'default')
 */
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return 'unsupported';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission === 'denied') {
        return 'denied';
    }

    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'default';
    }
};

/**
 * Check current notification permission status.
 * 
 * @returns {string} Permission status
 */
export const getNotificationPermission = () => {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
};

/**
 * Show a notification.
 * 
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 * @returns {Notification|null} Notification object or null if not supported/permitted
 */
export const showNotification = (title, options = {}) => {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return null;
    }

    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
    }

    const defaultOptions = {
        body: 'Time for your daily mood check-in!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'mood-checkin',
        requireInteraction: false,
        ...options,
    };

    try {
        const notification = new Notification(title, defaultOptions);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        // Handle click
        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    } catch (error) {
        console.error('Error showing notification:', error);
        return null;
    }
};

/**
 * Schedule a daily notification (client-side only).
 * Note: For production, use server-side scheduling with background tasks.
 * 
 * @param {string} time - Time in HH:MM format (24-hour)
 * @param {function} callback - Callback function to execute
 */
export const scheduleDailyNotification = (time, callback) => {
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduleNext = () => {
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduled <= now) {
            scheduled.setDate(scheduled.getDate() + 1);
        }

        const delay = scheduled.getTime() - now.getTime();

        setTimeout(() => {
            callback();
            // Schedule next day
            scheduleNext();
        }, delay);
    };

    scheduleNext();
};

/**
 * Cancel scheduled notifications (client-side).
 * Note: This only works for client-side scheduled notifications.
 */
export const cancelScheduledNotifications = () => {
    // Note: Client-side scheduled notifications can't be easily cancelled
    // In production, use server-side task queue (Celery/Django Q)
    console.log('To cancel notifications, disable reminders in settings');
};

