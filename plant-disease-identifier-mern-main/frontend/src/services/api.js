/**
 * API Service
 * This module handles all API calls to the backend
 * Uses Axios for HTTP requests with proper error handling
 */

import axios from 'axios';

// Create axios instance with default configuration
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for logging and authentication
API.interceptors.request.use(
    (config) => {
        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
API.interceptors.response.use(
    (response) => {
        console.log(`📥 API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
            console.warn('⚠️ Resource not found');
        } else if (error.response?.status === 500) {
            console.error('🔥 Server error occurred');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Connection refused - Check if backend server is running');
        }
        
        return Promise.reject(error);
    }
);

/**
 * Plant API Service
 * Handles all plant-related API calls
 */
export const PlantService = {
    /**
     * Fetch all available plants
     * @returns {Promise} Array of plants
     */
    getAllPlants: async () => {
        try {
            const response = await API.get('/plants');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch plants');
        }
    },

    /**
     * Fetch a specific plant by ID
     * @param {string} plantId - The plant ID
     * @returns {Promise} Plant object
     */
    getPlantById: async (plantId) => {
        try {
            const response = await API.get(`/plants/${plantId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch plant');
        }
    }
};

/**
 * Disease API Service
 * Handles all disease-related API calls
 */
export const DiseaseService = {
    /**
     * Identify disease based on plant and symptoms
     * @param {string} plantId - The selected plant ID
     * @param {Array} symptomIds - Array of selected symptom IDs
     * @returns {Promise} Disease identification results
     */
    identifyDisease: async (plantId, symptomIds) => {
        try {
            const response = await API.post('/diseases/identify', {
                plantId,
                symptomIds
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to identify disease');
        }
    },

    /**
     * Fetch all diseases (for debugging/admin)
     * @returns {Promise} Array of diseases
     */
    getAllDiseases: async () => {
        try {
            const response = await API.get('/diseases');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch diseases');
        }
    },

    /**
     * Fetch diseases for a specific plant
     * @param {string} plantId - The plant ID
     * @returns {Promise} Array of diseases
     */
    getDiseasesByPlant: async (plantId) => {
        try {
            const response = await API.get(`/diseases/plant/${plantId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch diseases for plant');
        }
    },

    /**
     * Fetch a specific disease by ID
     * @param {string} diseaseId - The disease ID
     * @returns {Promise} Disease object
     */
    getDiseaseById: async (diseaseId) => {
        try {
            const response = await API.get(`/diseases/${diseaseId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error?.message || 'Failed to fetch disease');
        }
    }
};

/**
 * Utility function to check if backend is connected
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
    try {
        const response = await axios.get('http://localhost:5000/health');
        return response.data;
    } catch (error) {
        throw new Error('Backend server is not responding');
    }
};

export default API;