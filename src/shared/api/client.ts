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

/* ===== F13 轨迹 API ===== */

import type {
  TrajectoryQuery,
  TrajectoryResponse,
  PathSelectionInput,
  PathSelectionResult,
  UserAction,
  CreateActionInput,
  UpdateActionInput,
  CreateCheckInInput,
  CheckIn,
} from './contract';

export async function getTrajectory(
  query: TrajectoryQuery,
  opts: PostOptions,
): Promise<TrajectoryResponse> {
  const cfg = getRuntimeConfig();
  if (!cfg.apiBase || cfg.apiBase === 'null') {
    throw new Error('尚未配置后端地址，无法获取群体轨迹数据。');
  }
  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const params = new URLSearchParams();
  if (query.current_occupation) params.set('current', query.current_occupation);
  if (query.target_occupation) params.set('target', query.target_occupation);
  if (query.region) params.set('region', query.region);
  if (query.experience_min != null) params.set('exp_min', String(query.experience_min));
  if (query.experience_max != null) params.set('exp_max', String(query.experience_max));

  const res = await fetch(`${apiBase}/api/v2/trajectory?${params.toString()}`, {
    headers,
    signal: opts.signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `轨迹服务返回 HTTP ${res.status}`);
  }
  return res.json();
}

/* ===== F23 决策选择 API ===== */

export async function postPathSelection(
  input: PathSelectionInput,
  opts: PostOptions,
): Promise<PathSelectionResult> {
  const cfg = getRuntimeConfig();
  if (!cfg.apiBase || cfg.apiBase === 'null') {
    throw new Error('尚未配置后端地址，无法保存路径选择。');
  }
  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${apiBase}/api/v1/decisions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
    signal: opts.signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `决策服务返回 HTTP ${res.status}`);
  }
  return res.json();
}

/* ===== F41 行动计划 API ===== */

export async function getActions(opts: PostOptions): Promise<UserAction[]> {
  const cfg = getRuntimeConfig();
  if (!cfg.apiBase || cfg.apiBase === 'null') {
    throw new Error('尚未配置后端地址，无法获取行动计划。');
  }
  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${apiBase}/api/v1/actions`, { headers, signal: opts.signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `行动服务返回 HTTP ${res.status}`);
  }
  return res.json();
}

export async function createAction(
  input: CreateActionInput,
  opts: PostOptions,
): Promise<UserAction> {
  const cfg = getRuntimeConfig();
  if (!cfg.apiBase || cfg.apiBase === 'null') {
    throw new Error('尚未配置后端地址，无法创建行动。');
  }
  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${apiBase}/api/v1/actions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
    signal: opts.signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `创建行动失败（HTTP ${res.status}）`);
  }
  return res.json();
}

export async function updateAction(
  actionId: string,
  input: UpdateActionInput,
  opts: PostOptions,
): Promise<UserAction> {
  const cfg = getRuntimeConfig();
  if (!cfg.apiBase || cfg.apiBase === 'null') {
    throw new Error('尚未配置后端地址，无法更新行动。');
  }
  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${apiBase}/api/v1/actions/${actionId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(input),
    signal: opts.signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `更新行动失败（HTTP ${res.status}）`);
  }
  return res.json();
}

export async function postCheckIn(
  actionId: string,
  input: CreateCheckInInput,
  opts: PostOptions,
): Promise<CheckIn> {
  const cfg = getRuntimeConfig();
  if (!cfg.apiBase || cfg.apiBase === 'null') {
    throw new Error('尚未配置后端地址，无法提交检查点。');
  }
  const apiBase = String(cfg.apiBase).replace(/\/$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${apiBase}/api/v1/actions/${actionId}/checkins`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
    signal: opts.signal,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `提交检查点失败（HTTP ${res.status}）`);
  }
  return res.json();
}
