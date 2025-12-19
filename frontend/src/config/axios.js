import axios from 'axios';

const TOKEN_KEY = 'pg_token';

function normalizeBaseUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  return trimmed.replace(/\/+$/, ''); // remove trailing slashes
}

// Create axios instance with base URL from environment variable.
// - Dev: empty baseURL => CRA "proxy" in `frontend/package.json` handles /api/*.
// - Prod (Vercel): set REACT_APP_API_URL to your backend (Render) URL.
const envBaseUrl = normalizeBaseUrl(process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: envBaseUrl || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helpful runtime hint when deployed without API URL configured.
if (process.env.NODE_ENV === 'production' && !envBaseUrl && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn(
    '[api] REACT_APP_API_URL is not set. Auth/expenses calls will go to the frontend origin (likely failing).'
  );
}

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

