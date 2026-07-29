/**
 * 导航 API 客户端。
 * - 生产路径始终命中真实 /api/v2/navigation。
 * - 后端未配置或不可用时显式失败，绝不生成伪造的路径、证据或成功状态。
 * - 任何响应都先过 validateNavigationResponse，非法则抛错。
 */
import type { CareerNavigationResponse, NavigationRequestInput } from './contract';
import { validateNavigationResponse } from './validate';

export interface RuntimeConfig {
  apiBase?: string;
}

declare global {
  interface Window {
    EVIDWAY_CONFIG?: RuntimeConfig;
  }
}

export function getRuntimeConfig(): RuntimeConfig {
  // 优先使用 window.EVIDWAY_CONFIG（运行时注入）
  // 其次使用 Vite 环境变量（构建时注入）
  const windowConfig = typeof window === 'undefined'
    ? {}
    : window.EVIDWAY_CONFIG ?? {};
  const envApiBase = import.meta.env.VITE_API_BASE_URL;
  return Object.freeze({
    apiBase: windowConfig.apiBase ?? envApiBase ?? undefined,
  });
}

export interface PostOptions {
  token?: string;
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


