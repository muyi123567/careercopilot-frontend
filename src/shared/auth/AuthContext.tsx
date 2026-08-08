/**
 * P0 Cookie session auth context (V7 23.1).
 * No localStorage token/uid. HttpOnly Cookie set by server.
 * CSRF token in memory only. Auth via GET /api/v1/auth/me.
 */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getApiBaseUrl } from '../api/fetch';
import { getCsrfToken, setCsrfToken, clearCsrfToken } from '../api/csrf';

interface User {
  user_id: string;
  status: string;
  display_name: string | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCreds(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
}

async function fetchCsrf(url: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  const token = getCsrfToken();
  if (token) headers['X-CSRF-Token'] = token;
  return fetch(url, { ...options, credentials: 'include', headers });
}

async function refreshCsrf(apiBase: string) {
  try {
    const res = await fetchCreds(apiBase + '/api/v1/auth/csrf');
    if (res.ok) { const d = await res.json(); setCsrfToken(d.csrf_token as string); }
  } catch { /* best effort */ }
}

export function CookieAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const apiBase = getApiBaseUrl();
        const res = await fetchCreds(apiBase + '/api/v1/auth/me');
        if (res.ok) { setUser(await res.json()); await refreshCsrf(apiBase); }
        else { setUser(null); }
      } catch { setUser(null); }
      finally { setIsLoading(false); }
    })();
  }, []);

  // Session expires mid-use: apiFetch dispatches 'auth:unauthorized'.
  // Clear in-memory state + CSRF token so the app does not keep showing a
  // stale authenticated shell after being redirected to /login.
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      clearCsrfToken();
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const apiBase = getApiBaseUrl();
    const res = await fetchCreds(apiBase + '/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); const msg = typeof d.detail === 'string' ? d.detail : '登录失败'; setError(msg); throw new Error(msg); }
    setUser(await res.json());
    await refreshCsrf(apiBase);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    const apiBase = getApiBaseUrl();
    const res = await fetchCreds(apiBase + '/api/v1/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); const msg = typeof d.detail === 'string' ? d.detail : '注册失败'; setError(msg); throw new Error(msg); }
    setUser(await res.json());
    await refreshCsrf(apiBase);
  }, []);

  const logout = useCallback(async () => {
    try { const apiBase = getApiBaseUrl(); await fetchCsrf(apiBase + '/api/v1/auth/logout', { method: 'POST' }); } catch { /* best effort */ }
    setUser(null);
    clearCsrfToken();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCookieAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useCookieAuth must be used within CookieAuthProvider');
  return ctx;
}

// Backward compat aliases
export { CookieAuthProvider as JwtAuthProvider };
export function useJwtAuth(): AuthContextValue { return useCookieAuth(); }
