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
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.metadata = { requestId, startTime: Date.now() };
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[axios] 🔐 Request with token:`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL || 'using proxy',
        fullURL: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
        hasToken: true,
        tokenLength: token.length,
        requestId,
      });
    } else {
      console.log(`[axios] 📤 Request without token:`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL || 'using proxy',
        fullURL: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
        requestId,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[axios] ❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// If token becomes invalid/expired, clear it and send user to auth
api.interceptors.response.use(
  (response) => {
    const requestId = response.config?.metadata?.requestId;
    const duration = response.config?.metadata?.startTime 
      ? `${Date.now() - response.config.metadata.startTime}ms` 
      : 'unknown';
    
    console.log(`[axios] ✅ Response received:`, {
      status: response.status,
      statusText: response.statusText,
      method: response.config?.method?.toUpperCase(),
      url: response.config?.url,
      baseURL: response.config?.baseURL || 'using proxy',
      duration,
      requestId,
    });
    
    return response;
  },
  (error) => {
    const requestId = error.config?.metadata?.requestId;
    const duration = error.config?.metadata?.startTime 
      ? `${Date.now() - error.config.metadata.startTime}ms` 
      : 'unknown';
    
    console.error(`[axios] ❌ Response error:`, {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      method: error?.config?.method?.toUpperCase(),
      url: error?.config?.url,
      baseURL: error?.config?.baseURL || 'using proxy',
      fullURL: error?.config?.baseURL ? `${error.config.baseURL}${error.config.url}` : error?.config?.url,
      errorMessage: error?.message,
      errorCode: error?.code,
      responseData: error?.response?.data,
      duration,
      requestId,
    });
    
    if (error?.response?.status === 401) {
      console.warn('[axios] 🔒 401 Unauthorized - Clearing token and redirecting to auth');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('pg_user');
      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth');
      }
    } else if (!error?.response) {
      console.error('[axios] 🌐 No response received - possible network/CORS issue:', {
        message: error?.message,
        code: error?.code,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;

