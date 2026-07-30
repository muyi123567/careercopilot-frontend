/**
 * Shared fetch wrapper with cookie credentials, 401 handling, and network error messages.
 */
import { getRuntimeConfig } from './client';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getApiBaseUrl(): string {
  const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
  if (!apiBase) throw new ApiError(0, '后端地址未配置');
  return apiBase;
}

/**
 * Authenticated fetch: includes cookies, throws ApiError on non-ok.
 * On 401, dispatches a global event so the router can redirect to /login.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) },
    });
  } catch {
    throw new ApiError(0, '网络连接失败，请检查网络后重试');
  }
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    throw new ApiError(401, '登录已过期，请重新登录');
  }
  return res;
}

/**
 * Public fetch (no auth required): still includes cookies for locale session.
 */
export async function publicFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) },
    });
  } catch {
    throw new ApiError(0, '网络连接失败，请检查网络后重试');
  }
  return res;
}
