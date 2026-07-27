/**
 * 认证上下文：HS256 JWT 管理。
 * 前端仅存储 token，不接触任何密钥。
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getRuntimeConfig } from '../api/client';

interface AuthState {
  token: string | null;
  uid: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'cc_token';
const UID_KEY = 'cc_uid';

function parseJwtPayload(token: string): { sub?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

function loadInitialState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && isTokenValid(token)) {
    const payload = parseJwtPayload(token);
    return { token, uid: payload?.sub ?? null, isAuthenticated: true };
  }
  // 清除过期 token
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(UID_KEY);
  return { token: null, uid: null, isAuthenticated: false };
}

export function JwtAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const login = useCallback(async (email: string, password: string) => {
    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (!apiBase) throw new Error('后端地址未配置');

    const res = await fetch(`${apiBase}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `登录失败 (HTTP ${res.status})`);
    }

    const data = await res.json();
    const token = data.access_token || data.token;
    const payload = parseJwtPayload(token);

    localStorage.setItem(TOKEN_KEY, token);
    if (payload?.sub) localStorage.setItem(UID_KEY, payload.sub);
    setState({ token, uid: payload?.sub ?? null, isAuthenticated: true });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
    if (!apiBase) throw new Error('后端地址未配置');

    const res = await fetch(`${apiBase}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `注册失败 (HTTP ${res.status})`);
    }

    // 注册成功后自动登录
    const data = await res.json();
    const token = data.access_token || data.token;
    if (token) {
      const payload = parseJwtPayload(token);
      localStorage.setItem(TOKEN_KEY, token);
      if (payload?.sub) localStorage.setItem(UID_KEY, payload.sub);
      setState({ token, uid: payload?.sub ?? null, isAuthenticated: true });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(UID_KEY);
    setState({ token: null, uid: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useJwtAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useJwtAuth must be used within JwtAuthProvider');
  return ctx;
}
