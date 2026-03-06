import axios from "axios";

// API Base URL - change this to your production URL when deploying
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mket_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    // BUT: Don't redirect on login/signup endpoints (those are expected to return 401 for bad credentials)
    if (error.response?.status === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/signup");

      // Only clear token and redirect if it's NOT a login/signup attempt
      if (!isAuthEndpoint) {
        // Clear token and redirect to login
        localStorage.removeItem("mket_auth_token");
        localStorage.removeItem("mket_current_user");

        // Only redirect if not already on auth page
        if (!window.location.pathname.includes("/auth")) {
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
