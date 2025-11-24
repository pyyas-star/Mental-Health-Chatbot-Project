/**
 * Axios instance configuration with JWT token handling.
 * 
 * Automatically attaches access tokens to requests and handles token refresh
 * when access tokens expire (401 errors).
 */

import axios from "axios";

// Base URL from environment variables
const baseURL = import.meta.env.VITE_BACKEND_BASE_API;

// Create axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor - Attach JWT access token to all requests.
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle token refresh on 401 errors.
 * 
 * When access token expires, automatically refresh it using the refresh token
 * and retry the original request.
 */
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors (expired access token)
        if (error.response && error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            
            try {
                // Attempt to refresh the access token
                const response = await axiosInstance.post('/token/refresh/', { 
                    refresh: refreshToken 
                });
                
                // Update stored access token
                const newAccessToken = response.data.access;
                localStorage.setItem('accessToken', newAccessToken);
                
                // Retry original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
