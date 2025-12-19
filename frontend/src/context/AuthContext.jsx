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
    const res = await api.post('/api/auth/signup', { email, password, confirmPassword });
    persist(res.data.token, res.data.user);
    return res.data;
  };

  const signin = async ({ email, password }) => {
    const res = await api.post('/api/auth/signin', { email, password });
    persist(res.data.token, res.data.user);
    return res.data;
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
