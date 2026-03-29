/**
 * Authentication Service
 * This module handles all authentication-related API calls
 * Uses Axios for HTTP requests with proper error handling
 */

import API from './api';

/**
 * Auth Service
 * Handles user authentication (registration, login, profile management)
 */
export const AuthService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's password
     * @param {string} userData.location - User's location (optional)
     * @param {string} userData.occupation - User's occupation (optional)
     * @returns {Promise} Registration response with user data and token
     */
    register: async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            
            // Store token in localStorage if registration successful
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Registration failed');
        }
    },

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User's email address
     * @param {string} credentials.password - User's password
     * @returns {Promise} Login response with user data and token
     */
    login: async (credentials) => {
        try {
            const response = await API.post('/auth/login', credentials);
            
            // Store token and user data in localStorage if login successful
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Login failed');
        }
    },

    /**
     * Get current user profile
     * @returns {Promise} User profile data
     */
    getProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login first.');
            }
            
            const response = await API.get('/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            // If token is invalid, remove it from localStorage
            if (error.response?.status === 401) {
                AuthService.logout();
            }
            throw new Error(error.response?.data?.error?.message || 'Failed to get profile');
        }
    },

    /**
     * Update user profile
     * @param {Object} profileData - Updated profile data
     * @param {string} profileData.name - Updated name (optional)
     * @param {string} profileData.location - Updated location (optional)
     * @param {string} profileData.occupation - Updated occupation (optional)
     * @returns {Promise} Update response with new user data
     */
    updateProfile: async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login first.');
            }
            
            const response = await API.put('/auth/profile', profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Update user data in localStorage
            if (response.data.success && response.data.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            // If token is invalid, remove it from localStorage
            if (error.response?.status === 401) {
                AuthService.logout();
            }
            throw new Error(error.response?.data?.error?.message || 'Failed to update profile');
        }
    },

    /**
     * Logout user (remove token from localStorage)
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Check if user is logged in
     * @returns {boolean} True if user is logged in, false otherwise
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    /**
     * Get current user data from localStorage
     * @returns {Object|null} User data or null if not logged in
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get authentication token
     * @returns {string|null} JWT token or null if not logged in
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Set authorization header for API requests
     * This should be called before making authenticated requests
     */
    setAuthHeader: () => {
        const token = AuthService.getToken();
        if (token) {
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete API.defaults.headers.common['Authorization'];
        }
    }
};

// Set auth header on initial load
AuthService.setAuthHeader();

export default AuthService;