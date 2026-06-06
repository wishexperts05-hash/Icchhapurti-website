/**
 * Authentication utility functions
 * Handles token expiry and auto-logout after 5 days
 */

const AUTH_EXPIRY_DAYS = 5;
const AUTH_EXPIRY_MS = AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 5 days in milliseconds

/**
 * Store login timestamp when user logs in
 */
export const setLoginTimestamp = () => {
    const timestamp = Date.now();
    localStorage.setItem('login_timestamp', timestamp.toString());
};

/**
 * Check if the current session has expired (>5 days)
 * @returns {boolean} true if expired, false otherwise
 */
export const isSessionExpired = () => {
    const loginTimestamp = localStorage.getItem('login_timestamp');

    if (!loginTimestamp) {
        // No timestamp found, consider expired
        return true;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - parseInt(loginTimestamp);

    return elapsedTime > AUTH_EXPIRY_MS;
};

/**
 * Logout user and clear all stored data
 */
export const logoutUser = () => {
    // Clear all user-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('login_timestamp');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cart_data');
    localStorage.removeItem('cart_data_time');
    localStorage.removeItem('wishlist_count');
    localStorage.removeItem('wishlist_cache_time');
    localStorage.removeItem('unreadCount');
    // localStorage.removeItem('unread_count');
    localStorage.removeItem('notifications_cache_time');

    // Reset cart count
    localStorage.setItem('cart', '0');
};

/**
 * Check session and auto-logout if expired
 * @returns {boolean} true if session is valid, false if logged out
 */
export const checkAndHandleExpiredSession = () => {
    const token = localStorage.getItem('token');

    // If no token, user is not logged in
    if (!token) {
        return false;
    }

    // Check if session expired
    if (isSessionExpired()) {
        logoutUser();
        return false;
    }

    return true;
};

/**
 * Get remaining session time in days
 * @returns {number} days remaining, or 0 if expired
 */
export const getRemainingSessionDays = () => {
    const loginTimestamp = localStorage.getItem('login_timestamp');

    if (!loginTimestamp) {
        return 0;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - parseInt(loginTimestamp);
    const remainingTime = AUTH_EXPIRY_MS - elapsedTime;

    if (remainingTime <= 0) {
        return 0;
    }

    return Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
};
