/**
 * TanStack Query hooks for authenticated API endpoints.
 * Uses apiFetch (cookie credentials, 401 auto-redirect).
 */
import { useQuery } from '@tanstack/react-query';
import { apiFetch, publicFetch, ApiError } from './fetch';

// --- Types ---

export interface GpsNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  action_url?: string;
  created_at: string;
}

export interface Occupation {
  slug: string;
  title: string;
  group?: string;
  description?: string;
  esco_code?: string;
}

export interface EvidenceDocument {
  id: string;
  filename: string;
  doc_type: string;
  status: string;
  uploaded_at: string;
  size_bytes?: number;
}

export interface CreditsInfo {
  balance: number;
  plan: string;
}

// --- Hooks ---

export function useNotifications() {
  return useQuery<GpsNotification[], ApiError>({
    queryKey: ['gps', 'notifications'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/gps/notifications');
      if (!res.ok) throw new ApiError(res.status, '获取推荐行动失败');
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useOccupations() {
  return useQuery<Occupation[], ApiError>({
    queryKey: ['occupations', 'zh-CN'],
    queryFn: async () => {
      const res = await publicFetch('/api/v1/public/occupations?locale=zh-CN');
      if (!res.ok) throw new ApiError(res.status, '获取职业列表失败');
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
    staleTime: 5 * 60_000,
  });
}

export function useEvidenceDocuments() {
  return useQuery<EvidenceDocument[], ApiError>({
    queryKey: ['evidence', 'documents'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/evidence/documents');
      if (!res.ok) throw new ApiError(res.status, '获取证据文档失败');
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCredits() {
  return useQuery<CreditsInfo, ApiError>({
    queryKey: ['credits'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/billing/credits');
      if (!res.ok) throw new ApiError(res.status, '获取积分信息失败');
      return res.json();
    },
  });
}
