/**
 * Supabase 客户端配置。
 * Phase 1 步骤 1.4：配置 Supabase JS SDK + GoTrue Auth。
 *
 * 环境变量：
 *   VITE_SUPABASE_URL  — Supabase Project URL
 *   VITE_SUPABASE_ANON_KEY — Supabase anon/public key
 *
 * 未配置时回退到 dev-login 模式（A 仓 /api/v1/auth/dev-login）。
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
// 设计决策：Supabase anon key 是公开的（靠 RLS 保护数据），
// 不是 secret。生产环境应配置 RLS 策略限制未授权访问。
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

/**
 * 获取当前用户 session。
 * Supabase 模式：从 GoTrue 获取。
 * Dev 模式：从 localStorage 获取 dev-login token。
 */
export async function getSession(): Promise<{ token: string; uid: string } | null> {
  if (supabase) {
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (!session) return null
    return { token: session.access_token, uid: session.user.id }
  }

  // Dev-login 回退
  const token = localStorage.getItem('cc_token')
  const uid = localStorage.getItem('cc_uid')
  if (!token || !uid) return null
  return { token, uid }
}
