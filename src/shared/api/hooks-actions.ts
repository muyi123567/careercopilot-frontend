/**
 * Action Loop API hooks — 行动闭环（决策 -> 行动 -> 签到）。
 * 独立文件避免 hooks.ts 膨胀。
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from './fetch';

// --- Types ---

export interface DecisionCase {
  id: string;
  title: string;
  context: string;
  options: string[];
  chosen?: string;
  rationale?: string;
  outcome?: string;
  created_at: string;
}

export interface ActionItem {
  id: string;
  decision_id: string;
  title: string;
  description?: string;
  status: 'planned' | 'active' | 'done' | 'abandoned';
  due_date?: string;
  created_at: string;
}

export interface CheckinRecord {
  id: string;
  action_id: string;
  what_happened: string;
  new_evidence?: string;
  reason?: string;
  subjective_feeling?: number;
  created_at: string;
}

export interface GeneratedPath {
  kind: 'deepen' | 'adjacent' | 'explore';
  title: string;
  benefits: string[];
  costs: string[];
  key_gaps: string[];
  validation_action: string;
}

export interface GenerateDecisionResult {
  paths: GeneratedPath[];
}

// --- Hooks ---

export function useDecisionList() {
  return useQuery<DecisionCase[], ApiError>({
    queryKey: ['actions', 'decisions'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/actions/decisions');
      if (!res.ok) throw new ApiError(res.status, '获取决策列表失败');
      const json = await res.json();
      return Array.isArray(json) ? json : json.items ?? [];
    },
  });
}

export function useCreateDecisionCase() {
  const qc = useQueryClient();
  return useMutation<DecisionCase, ApiError, { title: string; context: string; options: string[] }>({
    mutationFn: async (data) => {
      const res = await apiFetch('/api/v1/actions/decisions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new ApiError(res.status, '创建决策失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['actions', 'decisions'] }); },
  });
}

export function useActions(decisionId: string | undefined) {
  return useQuery<ActionItem[], ApiError>({
    queryKey: ['actions', 'items', decisionId],
    queryFn: async () => {
      const res = await apiFetch(`/api/v1/actions/decisions/${decisionId}/actions`);
      if (!res.ok) throw new ApiError(res.status, '获取行动列表失败');
      const json = await res.json();
      return Array.isArray(json) ? json : json.items ?? [];
    },
    enabled: !!decisionId,
  });
}

export function useCreateAction(decisionId: string) {
  const qc = useQueryClient();
  return useMutation<ActionItem, ApiError, { title: string; description?: string; due_date?: string }>({
    mutationFn: async (data) => {
      const res = await apiFetch(`/api/v1/actions/decisions/${decisionId}/actions`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new ApiError(res.status, '创建行动失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['actions', 'items', decisionId] }); },
  });
}

export function useUpdateActionStatus() {
  const qc = useQueryClient();
  return useMutation<ActionItem, ApiError, { actionId: string; status: ActionItem['status'] }>({
    mutationFn: async ({ actionId, status }) => {
      const res = await apiFetch(`/api/v1/actions/items/${actionId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new ApiError(res.status, '更新行动状态失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['actions'] }); },
  });
}

export function useAddCheckin() {
  const qc = useQueryClient();
  return useMutation<CheckinRecord, ApiError, { actionId: string; what_happened: string; new_evidence?: string; reason?: string; subjective_feeling?: number }>({
    mutationFn: async ({ actionId, ...data }) => {
      const res = await apiFetch(`/api/v1/actions/items/${actionId}/checkins`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new ApiError(res.status, '提交签到失败');
      return res.json();
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['actions'] }); },
  });
}

export function useGenerateDecision() {
  return useMutation<GenerateDecisionResult, ApiError, { current_occupation?: string; target_occupation: string; region?: string }>({
    mutationFn: async (data) => {
      const res = await apiFetch('/api/v1/decision/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new ApiError(res.status, '生成决策分析失败');
      return res.json();
    },
  });
}
