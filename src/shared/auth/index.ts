/**
 * shared/auth — 认证层。
 * V2 要求：uid 只从服务端验证令牌取，不在请求体发送可覆盖身份的 user_id。
 * Demo 模式由用户主动进入，后端返回 mode=demo；生产失败绝不静默显示 Demo。
 *
 * 当前实现：dev-login token（对接 A 仓 /api/v1/auth/dev-login）。
 * 未来：Supabase GoTrue（auth_adapter.py 已留好接口）。
 */
import { create } from 'zustand'

interface AuthState {
  token: string | null
  uid: string | null
  isAuthenticated: boolean
  login: (token: string, uid: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('cc_token'),
  uid: localStorage.getItem('cc_uid'),
  isAuthenticated: !!localStorage.getItem('cc_token'),

  login: (token, uid) => {
    localStorage.setItem('cc_token', token)
    localStorage.setItem('cc_uid', uid)
    set({ token, uid, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('cc_token')
    localStorage.removeItem('cc_uid')
    set({ token: null, uid: null, isAuthenticated: false })
  },
}))

// TODO [Phase 1 门禁]: 实现 token 刷新制度
// 方案 A: httpOnly cookie（由 A 仓 /api/v1/auth/refresh 设置）
// 方案 B: Supabase GoTrue SDK 内置刷新

/**
 * dev-login：调用 A 仓 /api/v1/auth/dev-login 获取 token。
 * 仅 dev 环境可用。
 */
export async function devLogin(uid: string): Promise<{ token: string; uid: string }> {
  const res = await fetch('/api/v1/auth/dev-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
  })
  if (!res.ok) {
    throw new Error(`dev-login failed: ${res.status}`)
  }
  const data = await res.json()
  return { token: data.access_token, uid: data.uid }
}
