/**
 * API 公共配置。
 * v1 对接 A 仓当前 /api/v1/ 端点。
 * v2 对接未来 V2 §5.2 定义的 /api/v2/ 契约格式。
 */

export const API_CONFIG = {
  v1: {
    baseURL: import.meta.env.VITE_API_V1_BASE_URL ?? '/api/v1',
    timeout: 30_000,
  },
  v2: {
    baseURL: import.meta.env.VITE_API_V2_BASE_URL ?? '/api/v2',
    timeout: 30_000,
  },
} as const
