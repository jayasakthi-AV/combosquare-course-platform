import axios from "axios";

// 🔥 FIXED BASE URL (NO /api unless your backend uses it)
const API_URL = "http://127.0.0.1:8001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❗ Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ================= AUTH =================

export const signup = async (fullName, email, password, mobile = null) => {
  const response = await api.post("/auth/signup", {
    full_name: fullName,
    email,
    password,
    mobile,
  });
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null;
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

// ================= DASHBOARD =================

export const getStudentDashboard = async () => {
  const response = await api.get("/dashboard/me");
  return response.data;
};

export const getAvailablePrograms = async () => {
  const response = await api.get("/dashboard/available-programs");
  return response.data;
};

export const enrollInProgram = async (programId) => {
  const response = await api.post("/enrollments/", {
    program_id: programId,
  });
  return response.data;
};

export const updateProgress = async (enrollmentId, progress) => {
  const response = await api.put(`/enrollments/${enrollmentId}/progress`, {
    progress,
  });
  return response.data;
};

// ================= ADMIN =================

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getAllEnrollments = async () => {
  const response = await api.get("/admin/enrollments");
  return response.data;
};

export const getAllContacts = async () => {
  const response = await api.get("/admin/contacts");
  return response.data;
};

export default api;