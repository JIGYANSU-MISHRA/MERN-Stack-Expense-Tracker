import axios from 'axios';

const TOKEN_KEY = 'pg_token';

// Create axios instance with base URL from environment variable
// In development, this will use the proxy from package.json
// In production (Vercel), this will use the Render backend URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token (if present) to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// If token becomes invalid/expired, clear it and send user to auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('pg_user');
      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

