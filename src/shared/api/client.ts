/**
 * 导航 API 客户端。
 * - 账户态始终命中真实 /api/v2/navigation。
 * - 后端未配置或不可用时显式失败，绝不生成伪造的路径、证据或成功状态。
 * - 任何响应都先过 validateNavigationResponse，非法则抛错。
 */
import type { CareerNavigationResponse, NavigationRequestInput } from './contract';
import { validateNavigationResponse } from './validate';

export type AccessMode = 'demo' | 'authenticated';
export type MockScenario = 'ok' | 'data_insufficient' | 'service_failure';

export interface RuntimeConfig {
  apiBase?: string;
}

declare global {
  interface Window {
    CAREERCOPILOT_CONFIG?: RuntimeConfig;
  }
}

export function getRuntimeConfig(): RuntimeConfig {
  // 优先使用 window.CAREERCOPILOT_CONFIG（运行时注入）
  // 其次使用 Vite 环境变量（构建时注入）
  const windowConfig = typeof window === 'undefined'
    ? {}
    : window.CAREERCOPILOT_CONFIG ?? {};
  const envApiBase = import.meta.env.VITE_API_BASE_URL;
  return Object.freeze({
    apiBase: windowConfig.apiBase ?? envApiBase ?? undefined,
  });
}

/** 随机匿名会话 id；绝不使用固定 web-session。 */
export function createClientSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export interface PostOptions {
  mode: AccessMode;
  token?: string;
  mockScenario?: MockScenario;
  signal?: AbortSignal;
}

export async function postNavigation(
  input: NavigationRequestInput,
  opts: PostOptions,
): Promise<CareerNavigationResponse> {
  const cfg = getRuntimeConfig();
  const backendConfigured = !!cfg.apiBase && cfg.apiBase !== 'null';
  if (!backendConfigured) {
    throw new Error('尚未配置职业导航后端地址，无法生成账户态路径。');
  }
  if (opts.mode === 'demo') {
    throw new Error('合成演示不生成账户态路径；请切换到登录后的真实导航。');
  }

  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${apiBase}/api/v2/navigation`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      current_occupation: input.current_occupation ?? null,
      target_occupation: input.target_occupation ?? null,
    }),
    signal: opts.signal,
  });
  const json = await res.json().catch(() => {
    throw new Error(`服务返回了非 JSON 响应（HTTP ${res.status}）`);
  });
  return validateNavigationResponse(json);
}
