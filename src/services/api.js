import axios from 'axios';

// Backend API URL
const API_URL = 'http://localhost:8001/api';

// Create axios instance  ← THIS MUST EXIST
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH FUNCTIONS =============

export const signup = async (fullName, email, password, mobile = null) => {
  try {
    const response = await api.post('/auth/signup', {
      full_name: fullName,
      email: email,
      password: password,
      mobile: mobile
    });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email: email,
      password: password
    });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isLoggedIn = () => {
  return localStorage.getItem('access_token') !== null;
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('access_token');
};

// ============= DASHBOARD FUNCTIONS =============

export const getStudentDashboard = async () => {
  try {
    const response = await api.get('/dashboard/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailablePrograms = async () => {
  try {
    const response = await api.get('/dashboard/available-programs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const enrollInProgram = async (programId) => {
  try {
    const response = await api.post('/enrollments/', {
      program_id: programId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProgress = async (enrollmentId, progress) => {
  try {
    const response = await api.put(`/enrollments/${enrollmentId}/progress`, {
      progress: progress
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllEnrollments = async () => {
  try {
    const response = await api.get('/admin/enrollments');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllContacts = async () => {
  try {
    const response = await api.get('/admin/contacts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;