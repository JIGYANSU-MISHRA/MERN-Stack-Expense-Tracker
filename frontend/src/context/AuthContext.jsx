import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../config/axios';

const TOKEN_KEY = 'pg_token';
const USER_KEY = 'pg_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const clear = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const signup = async ({ email, password, confirmPassword }) => {
    const requestId = `signup-${Date.now()}`;
    try {
      const requestData = {
        email: email ? `${email.substring(0, 3)}***` : 'empty',
        hasPassword: !!password,
        passwordLength: password?.length || 0,
        hasConfirmPassword: !!confirmPassword,
        confirmPasswordLength: confirmPassword?.length || 0,
        apiBaseURL: api.defaults.baseURL || 'using proxy',
        fullURL: api.defaults.baseURL ? `${api.defaults.baseURL}/api/auth/signup` : '/api/auth/signup',
        timestamp: new Date().toISOString(),
        requestId,
      };
      
      console.log('[AuthContext] 🔵 Signup request started:', requestData);
      
      const requestPayload = { email, password, confirmPassword };
      console.log('[AuthContext] 📤 Request payload:', {
        email: email ? `${email.substring(0, 3)}***` : 'empty',
        passwordLength: password?.length || 0,
        confirmPasswordLength: confirmPassword?.length || 0,
      });
      
      const res = await api.post('/api/auth/signup', requestPayload);
      
      console.log('[AuthContext] ✅ Signup response received:', {
        status: res.status,
        statusText: res.statusText,
        hasToken: !!res.data?.token,
        tokenLength: res.data?.token?.length || 0,
        hasUser: !!res.data?.user,
        userId: res.data?.user?.id,
        userEmail: res.data?.user?.email,
        responseData: res.data,
        requestId,
      });
      
      if (!res.data?.token) {
        console.error('[AuthContext] ⚠️ No token in response!', res.data);
        throw new Error('No token received from server');
      }
      
      if (!res.data?.user) {
        console.error('[AuthContext] ⚠️ No user data in response!', res.data);
        throw new Error('No user data received from server');
      }
      
      persist(res.data.token, res.data.user);
      console.log('[AuthContext] 💾 Token and user persisted to localStorage');
      return res.data;
    } catch (error) {
      const errorDetails = {
        requestId,
        message: error?.message,
        name: error?.name,
        code: error?.code,
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
        request: error?.config ? {
          url: error.config.url,
          baseURL: error.config.baseURL,
          method: error.config.method,
          headers: error.config.headers,
          fullURL: `${error.config.baseURL || ''}${error.config.url}`,
        } : null,
        networkError: !error?.response && !error?.request ? 'Network request failed before reaching server' : null,
        timeout: error?.code === 'ECONNABORTED' ? 'Request timeout' : null,
        timestamp: new Date().toISOString(),
      };
      
      console.error('[AuthContext] ❌ Signup error details:', errorDetails);
      
      // Log to console in a more readable format
      if (error?.response) {
        console.error('[AuthContext] Server responded with error:', {
          status: error.response.status,
          message: error.response.data?.message || 'No error message from server',
          data: error.response.data,
        });
      } else if (error?.request) {
        console.error('[AuthContext] Request was made but no response received:', {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          message: 'This usually means the server is down or unreachable',
        });
      } else {
        console.error('[AuthContext] Error setting up request:', error.message);
      }
      
      throw error;
    }
  };

  const signin = async ({ email, password }) => {
    const requestId = `signin-${Date.now()}`;
    try {
      const requestData = {
        email: email ? `${email.substring(0, 3)}***` : 'empty',
        hasPassword: !!password,
        passwordLength: password?.length || 0,
        apiBaseURL: api.defaults.baseURL || 'using proxy',
        fullURL: api.defaults.baseURL ? `${api.defaults.baseURL}/api/auth/signin` : '/api/auth/signin',
        timestamp: new Date().toISOString(),
        requestId,
      };
      
      console.log('[AuthContext] 🔵 Signin request started:', requestData);
      
      const requestPayload = { email, password };
      console.log('[AuthContext] 📤 Request payload:', {
        email: email ? `${email.substring(0, 3)}***` : 'empty',
        passwordLength: password?.length || 0,
      });
      
      const res = await api.post('/api/auth/signin', requestPayload);
      
      console.log('[AuthContext] ✅ Signin response received:', {
        status: res.status,
        statusText: res.statusText,
        hasToken: !!res.data?.token,
        tokenLength: res.data?.token?.length || 0,
        hasUser: !!res.data?.user,
        userId: res.data?.user?.id,
        userEmail: res.data?.user?.email,
        responseData: res.data,
        requestId,
      });
      
      if (!res.data?.token) {
        console.error('[AuthContext] ⚠️ No token in response!', res.data);
        throw new Error('No token received from server');
      }
      
      if (!res.data?.user) {
        console.error('[AuthContext] ⚠️ No user data in response!', res.data);
        throw new Error('No user data received from server');
      }
      
      persist(res.data.token, res.data.user);
      console.log('[AuthContext] 💾 Token and user persisted to localStorage');
      return res.data;
    } catch (error) {
      const errorDetails = {
        requestId,
        message: error?.message,
        name: error?.name,
        code: error?.code,
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
        request: error?.config ? {
          url: error.config.url,
          baseURL: error.config.baseURL,
          method: error.config.method,
          headers: error.config.headers,
          fullURL: `${error.config.baseURL || ''}${error.config.url}`,
        } : null,
        networkError: !error?.response && !error?.request ? 'Network request failed before reaching server' : null,
        timeout: error?.code === 'ECONNABORTED' ? 'Request timeout' : null,
        timestamp: new Date().toISOString(),
      };
      
      console.error('[AuthContext] ❌ Signin error details:', errorDetails);
      
      // Log to console in a more readable format
      if (error?.response) {
        console.error('[AuthContext] Server responded with error:', {
          status: error.response.status,
          message: error.response.data?.message || 'No error message from server',
          data: error.response.data,
        });
      } else if (error?.request) {
        console.error('[AuthContext] Request was made but no response received:', {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          message: 'This usually means the server is down or unreachable',
        });
      } else {
        console.error('[AuthContext] Error setting up request:', error.message);
      }
      
      throw error;
    }
  };

  const logout = () => {
    clear();
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }
        // Validate token and refresh user
        const res = await api.get('/api/auth/user');
        setUser(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      } catch {
        clear();
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated,
      signup,
      signin,
      logout,
    }),
    [token, user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}