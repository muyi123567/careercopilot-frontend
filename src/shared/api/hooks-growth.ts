/**
 * Growth & SaaS API hooks — 签到、积分历史、订阅、记忆搜索。
 * 独立文件避免 hooks.ts 膨胀。
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from './fetch';

// --- Types ---

export interface CheckInResult {
  credits_awarded: number;
  streak: number;
  already_checked_in: boolean;
}

export interface CreditsHistoryItem {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface SubscriptionInfo {
  tier: 'free' | 'basic' | 'sprint' | 'companion';
  status: string;
  expires_at?: string;
  credits_remaining?: number;
}

export interface MemoryItem {
  id: string;
  stage: string;
  type: string;
  tags: string[];
  key_fields: Record<string, string>;
  score?: number;
}

// --- Hooks ---

export function useDailyCheckIn() {
  const qc = useQueryClient();
  return useMutation<CheckInResult, ApiError>({
    mutationFn: async () => {
      const res = await apiFetch('/api/v1/credits/check-in', { method: 'POST' });
      if (!res.ok) throw new ApiError(res.status, '签到失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['credits'] }); },
  });
}

export function useCreditsHistory(page: number = 1) {
  return useQuery<{ items: CreditsHistoryItem[]; total: number }, ApiError>({
    queryKey: ['credits', 'history', page],
    queryFn: async () => {
      const res = await apiFetch(`/api/v1/credits/history?page=${page}&page_size=20`);
      if (!res.ok) throw new ApiError(res.status, '获取积分历史失败');
      const json = await res.json();
      if (Array.isArray(json)) return { items: json, total: json.length };
      return { items: json.items ?? [], total: json.total ?? 0 };
    },
  });
}

export function useSubscription() {
  return useQuery<SubscriptionInfo, ApiError>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/subscription');
      if (!res.ok) throw new ApiError(res.status, '获取订阅信息失败');
      return res.json();
    },
  });
}

export function useUpgradeSubscription() {
  const qc = useQueryClient();
  return useMutation<{ pay_form_html?: string; success?: boolean }, ApiError, { tier: string }>({
    mutationFn: async ({ tier }) => {
      const res = await apiFetch('/api/v1/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new ApiError(res.status, res.status === 503 ? '支付功能暂未配置' : '升级失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['subscription'] }); void qc.invalidateQueries({ queryKey: ['credits'] }); },
  });
}

export function useMemorySearch(q: string) {
  return useQuery<MemoryItem[], ApiError>({
    queryKey: ['memory', q],
    queryFn: async () => {
      const res = await apiFetch(`/api/v1/memory?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new ApiError(res.status, '搜索记忆失败');
      const json = await res.json();
      return Array.isArray(json) ? json : json.items ?? [];
    },
    enabled: q.length >= 2,
  });
}
