/**
 * TanStack Query hooks for authenticated API endpoints.
 * Uses apiFetch (cookie credentials, 401 auto-redirect).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, publicFetch, ApiError } from './fetch';

// --- Types ---

export interface GpsNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  action_url?: string;
  created_at: string;
  read?: boolean;
}

export interface Occupation {
  slug: string;
  title: string;
  group?: string;
  description?: string;
  esco_code?: string;
}

export interface NavigationOption {
  code: string;
  label: string;
  edge_count: number;
}

export interface EvidenceDocument {
  id: string;
  filename: string;
  doc_type: string;
  status: string;
  uploaded_at: string;
  size_bytes?: number;
}

export interface EvidenceItem {
  id: string;
  kind: string;
  label: string;
  value: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'revised';
  source_document_id?: string;
  created_at: string;
}

export interface CreditsInfo {
  balance: number;
  plan: string;
}

export interface UserProfile {
  user_id: string;
  display_name?: string;
  target_occupation?: string;
  current_occupation?: string;
  skills?: { name: string; level: number; category: string }[];
  constraints?: Record<string, string>;
  completion_pct?: number;
}

export interface PresignResponse {
  upload_id: string;
  presigned_url: string;
  object_key: string;
  expires_in: number;
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

export function useUnreadCount() {
  return useQuery<number, ApiError>({
    queryKey: ['gps', 'unread-count'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/gps/notifications/unread-count');
      if (!res.ok) throw new ApiError(res.status, '获取未读数失败');
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        throw new ApiError(res.status, '服务返回了非 JSON 响应');
      }
      if (typeof data === 'number') return data;
      const counter = data as { count?: number; unread_count?: number } | null;
      return counter?.count ?? counter?.unread_count ?? 0;
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/v1/gps/notifications/${id}/read`, { method: 'POST' });
      if (!res.ok) throw new ApiError(res.status, '标记已读失败');
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['gps'] });
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
      const list: unknown[] = Array.isArray(data) ? data : data.data ?? data.items ?? [];
      const seen = new Set<string>();
      const out: Occupation[] = [];
      for (const raw of list as Record<string, unknown>[]) {
        const slug = typeof raw?.slug === 'string' ? raw.slug : '';
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        const label = typeof raw?.label === 'string' ? raw.label : '';
        const title = typeof raw?.title === 'string' && raw.title ? (raw.title as string) : label.split('\n')[0];
        out.push({
          slug,
          title,
          group: typeof raw?.group === 'string' ? (raw.group as string) : undefined,
          description: typeof raw?.description === 'string' ? (raw.description as string) : undefined,
          esco_code: typeof raw?.esco_code === 'string' && raw.esco_code ? (raw.esco_code as string) : undefined,
        });
      }
      return out;
    },
    staleTime: 5 * 60_000,
  });
}

export function useNavigationOptions(q: string) {
  const trimmed = q.trim();
  return useQuery<NavigationOption[], ApiError>({
    queryKey: ['occupations', 'navigation-options', trimmed],
    queryFn: async () => {
      const res = await publicFetch(
        `/api/v1/public/occupations/navigation-options?q=${encodeURIComponent(trimmed)}&limit=50`,
      );
      if (!res.ok) throw new ApiError(res.status, '获取可导航职业失败');
      const data = await res.json();
      return (Array.isArray(data) ? data : data.data ?? data.items ?? []) as NavigationOption[];
    },
    enabled: trimmed.length >= 2,
    staleTime: 60_000,
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

export function useEvidenceItems() {
  return useQuery<EvidenceItem[], ApiError>({
    queryKey: ['evidence', 'items'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/evidence/items');
      if (!res.ok) throw new ApiError(res.status, '获取证据条目失败');
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useConfirmEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/v1/evidence/items/${id}/confirm`, { method: 'POST' });
      if (!res.ok) throw new ApiError(res.status, '确认失败');
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['evidence', 'items'] }); },
  });
}

export function useRejectEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/v1/evidence/items/${id}/reject`, { method: 'POST' });
      if (!res.ok) throw new ApiError(res.status, '拒绝失败');
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['evidence', 'items'] }); },
  });
}

export function useCredits() {
  return useQuery<CreditsInfo, ApiError>({
    queryKey: ['credits'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/credits/balance');
      if (!res.ok) throw new ApiError(res.status, '获取积分信息失败');
      return res.json();
    },
  });
}

export function useProfile() {
  return useQuery<UserProfile, ApiError>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/profile');
      if (!res.ok) throw new ApiError(res.status, '获取档案失败');
      return res.json();
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const res = await apiFetch('/api/v1/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new ApiError(res.status, '更新档案失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['profile'] }); },
  });
}

// --- Document Upload ---

export function usePresignUpload() {
  return useMutation<PresignResponse, ApiError, { filename: string; content_type: string; file_size: number }>({
    mutationFn: async ({ filename, content_type, file_size }) => {
      const res = await apiFetch('/api/v1/uploads/presign', {
        method: 'POST',
        body: JSON.stringify({ filename, content_type, file_size }),
      });
      if (!res.ok) throw new ApiError(res.status, '获取上传凭证失败');
      return res.json();
    },
  });
}

export function useCompleteUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uploadId: string) => {
      const res = await apiFetch(`/api/v1/uploads/${uploadId}/complete`, { method: 'POST' });
      if (!res.ok) throw new ApiError(res.status, '确认上传失败');
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['evidence', 'documents'] }); },
  });
}

export function useParseResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      const res = await apiFetch('/api/v1/resume/parse', {
        method: 'POST',
        body: JSON.stringify({ document_id: documentId }),
      });
      if (!res.ok) throw new ApiError(res.status, '触发解析失败');
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['evidence'] }); },
  });
}

export function useResumeSkills() {
  return useQuery<{ name: string; level: number; category: string }[], ApiError>({
    queryKey: ['resume', 'skills'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/resume/skills');
      if (!res.ok) throw new ApiError(res.status, '获取技能失败');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
}
