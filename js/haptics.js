// Haptic Feedback Utility
// Provides vibration feedback for iOS (Capacitor) and web browsers

const Haptics = {
    // Check if haptics are supported
    isSupported() {
        return !!(navigator.vibrate || (window.Capacitor && window.Capacitor.Plugins.Haptics));
    },

    // Light impact - for button taps, selections
    light() {
        this._trigger('light', 10);
    },

    // Medium impact - for successful actions
    medium() {
        this._trigger('medium', 20);
    },

    // Heavy impact - for important events (game over, win)
    heavy() {
        this._trigger('heavy', 30);
    },

    // Success notification - correct answer, level complete
    success() {
        this._trigger('success', [10, 50, 20]);
    },

    // Error notification - wrong answer, game over
    error() {
        this._trigger('error', [30, 50, 30, 50, 30]);
    },

    // Warning notification - low health, time running out
    warning() {
        this._trigger('warning', [20, 30, 20]);
    },

    // Selection changed
    selection() {
        this._trigger('selection', 5);
    },

    // Internal trigger method
    _trigger(type, webPattern) {
        try {
            // Try Capacitor Haptics first (iOS native)
            if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
                const haptics = window.Capacitor.Plugins.Haptics;

                switch(type) {
                    case 'light':
                        haptics.impact({ style: 'light' });
                        break;
                    case 'medium':
                        haptics.impact({ style: 'medium' });
                        break;
                    case 'heavy':
                        haptics.impact({ style: 'heavy' });
                        break;
                    case 'success':
                        haptics.notification({ type: 'success' });
                        break;
                    case 'error':
                        haptics.notification({ type: 'error' });
                        break;
                    case 'warning':
                        haptics.notification({ type: 'warning' });
                        break;
                    case 'selection':
                        haptics.selectionChanged();
                        break;
                    default:
                        haptics.impact({ style: 'medium' });
                }
                return;
            }

            // Fallback to Web Vibration API (Android, some browsers)
            if (navigator.vibrate) {
                navigator.vibrate(webPattern);
            }
        } catch (e) {
            // Silently fail - haptics are non-critical
            console.debug('Haptics not available:', e);
        }
    }
};

// Make globally available
window.Haptics = Haptics;
