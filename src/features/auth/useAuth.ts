/**
 * Cookie-session auth hook.
 * Server sets HttpOnly cookie on login/register; no localStorage token.
 * Auth state verified via GET /api/v1/auth/me.
 */
import { useState, useCallback, useEffect } from 'react';
import { getRuntimeConfig } from '../../shared/api/client';

interface UserInfo {
  user_id: string;
  status: string;
  display_name: string | null;
  email?: string;
}

interface AuthState {
  user: UserInfo | null;
  loading: boolean;
  error: string;
}

function getApiBase(): string {
  const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
  if (!apiBase) throw new Error('后端地址未配置');
  return apiBase;
}

async function fetchMe(): Promise<UserInfo | null> {
  try {
    const apiBase = getApiBase();
    const res = await fetch(`${apiBase}/api/v1/auth/me`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: '',
  });

  // On mount, check existing session via /auth/me
  useEffect(() => {
    (async () => {
      const user = await fetchMe();
      setState({ user, loading: false, error: '' });
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 401) {
        setState((s) => ({ ...s, loading: false, error: '邮箱或密码错误' }));
        return false;
      }
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setState((s) => ({ ...s, loading: false, error: (detail as { detail?: string }).detail || `登录失败 (${res.status})` }));
        return false;
      }
      // Cookie set by server; verify session
      const user = await fetchMe();
      setState({ user, loading: false, error: '' });
      return true;
    } catch {
      setState((s) => ({ ...s, loading: false, error: '网络连接失败，请检查网络后重试。' }));
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/v1/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 409) {
        setState((s) => ({ ...s, loading: false, error: '该邮箱已注册，请直接登录。' }));
        return false;
      }
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setState((s) => ({ ...s, loading: false, error: (detail as { detail?: string }).detail || `注册失败 (${res.status})` }));
        return false;
      }
      // Cookie set by server; verify session
      const user = await fetchMe();
      setState({ user, loading: false, error: '' });
      return true;
    } catch {
      setState((s) => ({ ...s, loading: false, error: '网络连接失败，请检查网络后重试。' }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch { /* best effort */ }
    setState({ user: null, loading: false, error: '' });
  }, []);

  return {
    ...state,
    token: null, // backward compat
    uid: state.user?.user_id ?? null,
    login,
    register,
    logout,
    isAuthenticated: !!state.user,
  };
}
