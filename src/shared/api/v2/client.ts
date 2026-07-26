/**
 * v2 API 客户端 — 对接 A 仓 /api/v2/ 端点。
 * 所有 v2 响应必须经 AJV 运行时校验（V2 §9.4 强制）。
 */
import { API_CONFIG } from '../common/config'
import { ApiError } from '../common/errors'
import { validateV2Response } from './schema-validator'
import { useAppStore } from '../../store/app-store'

const { baseURL, timeout } = API_CONFIG.v2

function getToken(): string | null {
  return localStorage.getItem('cc_token')
}

export async function v2Fetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const appMode = useAppStore.getState().mode
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-App-Mode': appMode,
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${baseURL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new ApiError(
        res.status,
        body?.detail?.code ?? `http_${res.status}`,
        body?.detail?.message ?? res.statusText,
        body?.request_id,
      )
    }

    const data = await res.json()

    // V2 §9.4 强制：AJV 运行时校验 canonical schema
    validateV2Response(data, path)

    return data as T
  } finally {
    clearTimeout(timer)
  }
}
