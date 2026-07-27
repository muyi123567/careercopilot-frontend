/**
 * 导航 API 客户端。
 * - demo 模式：始终使用契约形 mock（绝不在后端错误时伪造成功）。
 * - authenticated 模式：命中真实 /api/v2/navigation；未配置后端时回退为 data_insufficient mock，如实反映现状。
 * - 任何响应都先过 validateNavigationResponse，非法则抛错。
 */
import type { CareerNavigationResponse, NavigationRequestInput } from './contract';
import { validateNavigationResponse } from './validate';
import {
  buildDataInsufficientResponse,
  buildOkResponse,
  buildServiceFailureResponse,
} from './mock';

export type AccessMode = 'demo' | 'authenticated';
export type MockScenario = 'ok' | 'data_insufficient' | 'service_failure';

export interface RuntimeConfig {
  apiBase?: string;
  useMock?: boolean;
  mockScenario?: MockScenario;
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
  const rawEnvUseMock = import.meta.env.VITE_USE_MOCK;
  const envUseMock = rawEnvUseMock === undefined
    ? undefined
    : rawEnvUseMock === 'true';
  const envMockScenario = import.meta.env.VITE_MOCK_SCENARIO as MockScenario | undefined;

  return Object.freeze({
    apiBase: windowConfig.apiBase ?? envApiBase ?? undefined,
    useMock: windowConfig.useMock ?? envUseMock ?? undefined,
    mockScenario: windowConfig.mockScenario ?? envMockScenario ?? undefined,
  });
}

/** 随机匿名会话 id；绝不使用固定 web-session。 */
export function createClientSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
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
  const forceMock = cfg.useMock ?? !backendConfigured;

  if (opts.mode === 'demo' || forceMock) {
    await delay(550, opts.signal);
    const scenario = opts.mode === 'demo' ? opts.mockScenario ?? 'ok' : 'data_insufficient';
    const data =
      scenario === 'ok'
        ? buildOkResponse(input)
        : scenario === 'data_insufficient'
          ? buildDataInsufficientResponse(input)
          : buildServiceFailureResponse();
    return validateNavigationResponse(data);
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
