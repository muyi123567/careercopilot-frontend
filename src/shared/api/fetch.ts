/**
 * Shared fetch wrapper with cookie credentials, error handling, and network error messages.
 * Dispatches global events for 401/403/429/503 so the router can react.
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
 * On 401, dispatches 'auth:unauthorized' so the router redirects to /login.
 * On 403/429/503, dispatches 'api:error' with status in detail.
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
  if (res.status === 403) {
    window.dispatchEvent(new CustomEvent('api:error', { detail: { status: 403 } }));
    throw new ApiError(403, '无权访问该资源');
  }
  if (res.status === 429) {
    window.dispatchEvent(new CustomEvent('api:error', { detail: { status: 429 } }));
    throw new ApiError(429, '请求过于频繁，请稍后再试');
  }
  if (res.status === 503) {
    window.dispatchEvent(new CustomEvent('api:error', { detail: { status: 503 } }));
    throw new ApiError(503, '服务暂时不可用，请稍后再试');
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
