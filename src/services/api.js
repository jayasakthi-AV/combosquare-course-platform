// src/services/api.js
import axios from 'axios';

// Backend API URL
const API_URL = 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH FUNCTIONS =============

/**
 * Signup new user
 */
export const signup = async (fullName, email, password, mobile = null) => {
  try {
    const response = await api.post('/signup', {
      full_name: fullName,
      email: email,
      password: password,
      mobile: mobile
    });

    // Save token and user data to localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      email: email,
      password: password
    });

    // Save token and user data to localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    // Update localStorage with latest user data
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = () => {
  return localStorage.getItem('access_token') !== null;
};

/**
 * Get user data from localStorage
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get auth token
 */
export const getToken = () => {
  return localStorage.getItem('access_token');
};

export default api;