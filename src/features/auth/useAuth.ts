import { useState, useCallback } from 'react';
import { getRuntimeConfig } from '../../shared/api/client';

const TOKEN_KEY = 'cc_access_token';
const UID_KEY = 'cc_uid';

interface AuthResponse {
  access_token: string;
  token_type: string;
  uid: string;
}

interface AuthState {
  token: string | null;
  uid: string | null;
  loading: boolean;
  error: string;
}

export function getStoredAuth(): { token: string | null; uid: string | null } {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    uid: localStorage.getItem(UID_KEY),
  };
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(UID_KEY);
}

function storeAuth(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(UID_KEY, data.uid);
}

export function useAuth() {
  const stored = getStoredAuth();
  const [state, setState] = useState<AuthState>({
    token: stored.token,
    uid: stored.uid,
    loading: false,
    error: '',
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
      if (!apiBase) {
        setState((s) => ({ ...s, loading: false, error: '尚未配置后端服务地址，无法登录。' }));
        return false;
      }
      const res = await fetch(`${apiBase}/api/v1/auth/login`, {
        method: 'POST',
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
      const data: AuthResponse = await res.json();
      storeAuth(data);
      setState({ token: data.access_token, uid: data.uid, loading: false, error: '' });
      return true;
    } catch {
      setState((s) => ({ ...s, loading: false, error: '网络连接失败，请检查网络后重试。' }));
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
      if (!apiBase) {
        setState((s) => ({ ...s, loading: false, error: '尚未配置后端服务地址，无法注册。' }));
        return false;
      }
      const res = await fetch(`${apiBase}/api/v1/auth/register`, {
        method: 'POST',
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
      const data: AuthResponse = await res.json();
      storeAuth(data);
      setState({ token: data.access_token, uid: data.uid, loading: false, error: '' });
      return true;
    } catch {
      setState((s) => ({ ...s, loading: false, error: '网络连接失败，请检查网络后重试。' }));
      return false;
    }
  }, []);

  const wechatLogin = useCallback(async (code: string) => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
      if (!apiBase) {
        setState((s) => ({ ...s, loading: false, error: '尚未配置后端服务地址，无法登录。' }));
        return false;
      }
      const res = await fetch(`${apiBase}/api/v1/auth/wechat-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.status === 401) {
        setState((s) => ({ ...s, loading: false, error: '微信授权失败，请重试。' }));
        return false;
      }
      if (res.status === 501) {
        setState((s) => ({ ...s, loading: false, error: '微信登录暂未开放，请使用邮箱登录。' }));
        return false;
      }
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        setState((s) => ({ ...s, loading: false, error: (detail as { detail?: string }).detail || `微信登录失败 (${res.status})` }));
        return false;
      }
      const data: AuthResponse = await res.json();
      storeAuth(data);
      setState({ token: data.access_token, uid: data.uid, loading: false, error: '' });
      return true;
    } catch {
      setState((s) => ({ ...s, loading: false, error: '网络连接失败，请检查网络后重试。' }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setState({ token: null, uid: null, loading: false, error: '' });
  }, []);

  return { ...state, login, register, wechatLogin, logout, isAuthenticated: !!state.token };
}
