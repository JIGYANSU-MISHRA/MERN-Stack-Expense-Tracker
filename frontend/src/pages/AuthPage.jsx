import React, { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircleNotch, Lock, EnvelopeSimple, ShieldCheck, UserPlus } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { isAuthenticated, signin, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    return typeof from === 'string' && from.startsWith('/') ? from : '/';
  }, [location.state]);

  const [mode, setMode] = useState('signin'); // signin | signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    console.log('[AuthPage] Form submission started', {
      mode,
      email: email ? `${email.substring(0, 3)}***` : 'empty',
      hasPassword: !!password,
      hasConfirmPassword: !!confirmPassword,
    });

    if (!email || !password) {
      setError('Please fill in email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        setError('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      setLoading(true);
      console.log(`[AuthPage] Calling ${mode} API...`);
      
      if (mode === 'signup') {
        await signup({ email, password, confirmPassword });
        console.log('[AuthPage] Signup successful');
      } else {
        await signin({ email, password });
        console.log('[AuthPage] Signin successful');
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const errorId = `auth-error-${Date.now()}`;
      const errorDetails = {
        errorId,
        mode,
        message: err?.message,
        name: err?.name,
        code: err?.code,
        response: err?.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers,
        } : 'No response',
        request: err?.request ? {
          url: err.config?.url,
          method: err.config?.method,
          baseURL: err.config?.baseURL,
          fullURL: err.config?.baseURL ? `${err.config.baseURL}${err.config.url}` : err.config?.url,
        } : 'No request',
        networkError: !err?.response && !err?.request,
        timestamp: new Date().toISOString(),
      };
      
      console.error('[AuthPage] ❌ Authentication error:', errorDetails);
      
      // Detailed error logging for debugging
      if (err?.response) {
        console.error('[AuthPage] 📥 Server Response Error:', {
          status: err.response.status,
          statusText: err.response.statusText,
          errorMessage: err.response.data?.message || 'No error message',
          fullErrorData: err.response.data,
          errorId,
        });
      } else if (err?.request) {
        console.error('[AuthPage] 📡 Network Request Error:', {
          message: 'Request was sent but no response received',
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          fullURL: err.config?.baseURL ? `${err.config.baseURL}${err.config.url}` : err.config?.url,
          possibleCauses: [
            'Server is down or unreachable',
            'CORS issue preventing response',
            'Network timeout',
            'Backend URL is incorrect',
          ],
          errorId,
        });
      } else {
        console.error('[AuthPage] ⚠️ Request Setup Error:', {
          message: err?.message || 'Unknown error',
          code: err?.code,
          errorId,
        });
      }
      
      // User-friendly error messages
      let msg = 'Authentication failed.';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
        console.log('[AuthPage] Using server error message:', msg);
      } else if (err?.response?.status === 400) {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err?.response?.status === 401) {
        msg = 'Invalid credentials. Please check your email and password.';
      } else if (err?.response?.status === 409) {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (err?.response?.status === 422) {
        msg = err.response.data?.message || 'Validation error. Please check your input.';
      } else if (err?.response?.status === 500) {
        msg = 'Server error: Please try again later.';
      } else if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error')) {
        msg = 'Network error: Could not connect to server. Please check your connection and try again.';
      } else if (err?.code === 'ECONNABORTED') {
        msg = 'Request timeout: The server took too long to respond. Please try again.';
      } else if (!err?.response && !err?.request) {
        msg = 'Connection error: Unable to reach the server. Check if the backend is running.';
      } else if (err?.message) {
        msg = `Error: ${err.message}`;
      }
      
      console.log('[AuthPage] Setting error message for user:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAF7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="w-14 h-14 bg-[#14532D] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">Welcome to PennyGrid</h1>
          <p className="text-gray-600 mt-1">
            {mode === 'signin' ? 'Sign in to continue' : 'Create your account in seconds'}
          </p>
        </div>

        <div className="card-hover">
          <div className="flex bg-gray-50 rounded-lg p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'signin' ? 'bg-white shadow text-[#14532D]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-white shadow text-[#14532D]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
                <EnvelopeSimple className="w-4 h-4 mr-2 text-gray-500" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-500" />
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="input-field"
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={6}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2 text-gray-500" />
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? <CircleNotch className="w-4 h-4 animate-spin" /> : null}
              <span>
                {loading
                  ? mode === 'signin'
                    ? 'Signing in...'
                    : 'Creating account...'
                  : mode === 'signin'
                    ? 'Sign In'
                    : 'Sign Up'}
              </span>
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to keep your token safe (it’s stored locally in your browser).
        </p>
      </div>
    </div>
  );
};

export default AuthPage;


