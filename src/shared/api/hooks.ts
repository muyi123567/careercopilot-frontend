/**
 * TanStack Query hooks — 封装 A 仓常用 API 端点。
 */
import { useQuery, useMutation } from '@tanstack/react-query'
import { v1Fetch } from './v1/client'

/** 健康检查 */
export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => v1Fetch<{ status: string; env: string }>('/health'),
  })
}

/** Dev 登录 */
export function useDevLogin() {
  return useMutation({
    mutationFn: (uid: string) =>
      v1Fetch<{ token: string; uid: string }>('/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ uid }),
      }),
  })
}

/** 记忆检索 */
export function useMemorySearch(query: string, topK = 5) {
  return useQuery({
    queryKey: ['memory', query, topK],
    queryFn: () =>
      v1Fetch<unknown[]>(
        `/memory?q=${encodeURIComponent(query)}&top_k=${topK}`,
      ),
    enabled: query.length > 0,
  })
}

/** 用户画像 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => v1Fetch<Record<string, unknown>>('/profile'),
  })
}

/** 项目列表 */
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => v1Fetch<unknown[]>('/projects'),
  })
}
