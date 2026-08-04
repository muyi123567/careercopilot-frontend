/**
 * Shared fetch wrapper with cookie credentials, error handling, and network error messages.
 * Dispatches global events for 401/403/429/503 so the router can react.
 */
import { getRuntimeConfig } from './client';
import { getCsrfToken } from './csrf';

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_SAFE_RETRIES = 2;
const RETRY_BACKOFF_MS = 250;
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

class RequestTimeoutError extends Error {}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const { signal: callerSignal, ...requestOptions } = options;
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort();

  if (callerSignal) {
    if (callerSignal.aborted) {
      abortFromCaller();
    } else {
      callerSignal.addEventListener('abort', abortFromCaller, { once: true });
    }
  }

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...requestOptions, signal: controller.signal });
  } catch (error) {
    if (timedOut) throw new RequestTimeoutError();
    throw error;
  } finally {
    clearTimeout(timer);
    callerSignal?.removeEventListener('abort', abortFromCaller);
  }
}

function isSafeMethod(options: RequestInit): boolean {
  return SAFE_METHODS.has((options.method ?? 'GET').toUpperCase());
}

function isCallerAborted(options: RequestInit): boolean {
  return options.signal?.aborted === true;
}

async function waitBeforeRetry(options: RequestInit, retryIndex: number): Promise<void> {
  const delayMs = RETRY_BACKOFF_MS * 2 ** retryIndex;
  if (delayMs <= 0) return;
  await new Promise<void>((resolve, reject) => {
    const signal = options.signal;
    if (signal?.aborted) {
      reject(new DOMException('aborted', 'AbortError'));
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new DOMException('aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });
    timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, delayMs);
  });
}

/**
 * Retry only idempotent, read-only requests. A write request is never replayed
 * here because a transient gateway response does not prove that the server did
 * not already apply the side effect.
 */
async function fetchWithSafeRetry(url: string, options: RequestInit): Promise<Response> {
  if (!isSafeMethod(options)) return fetchWithTimeout(url, options);

  let retryIndex = 0;
  while (true) {
    if (isCallerAborted(options)) throw new DOMException('aborted', 'AbortError');
    try {
      const response = await fetchWithTimeout(url, options);
      if (!RETRYABLE_STATUSES.has(response.status) || retryIndex >= MAX_SAFE_RETRIES) {
        return response;
      }
      // Release a transient response before opening the next attempt.
      void response.body?.cancel();
    } catch (error) {
      if (isCallerAborted(options) || error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
      if (retryIndex >= MAX_SAFE_RETRIES) throw error;
    }
    await waitBeforeRetry(options, retryIndex);
    retryIndex += 1;
  }
}

export function getApiBaseUrl(): string {
  const apiBase = getRuntimeConfig().apiBase?.replace(/\/$/, '');
  // 未配置时默认同源：/api/* 由 Vercel 重写到后端，Cookie 一方化，
  // 避免跨站 Cookie 被浏览器三方 Cookie 策略拦截（登录/会话失效）。
  if (apiBase === undefined || apiBase === null || apiBase === 'null') return '';
  return apiBase;
}

/**
 * Authenticated fetch: includes cookies, throws ApiError on non-ok.
 * On 401, dispatches 'auth:unauthorized' so the router redirects to /login.
 * On 403/429/503, dispatches 'api:error' with status in detail.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  const method = (options.method ?? 'GET').toUpperCase();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  // 不安全方法（POST/PUT/PATCH/DELETE）且已有会话时附加 CSRF token（V7 12.1）
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = getCsrfToken();
    if (token && !headers['X-CSRF-Token']) headers['X-CSRF-Token'] = token;
  }
  let res: Response;
  try {
    res = await fetchWithSafeRetry(`${base}${path}`, {
      ...options,
      credentials: 'include',
      headers,
    });
  } catch (error) {
    throw new ApiError(0, error instanceof RequestTimeoutError ? '请求超时，请稍后重试' : '网络连接失败，请检查网络后重试');
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
    res = await fetchWithSafeRetry(`${base}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) },
    });
  } catch (error) {
    throw new ApiError(0, error instanceof RequestTimeoutError ? '请求超时，请稍后重试' : '网络连接失败，请检查网络后重试');
  }
  return res;
}
