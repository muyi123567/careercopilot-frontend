/**
 * 产品分析事件：仅发送枚举事件 + 对象 id，绝不发送问题全文或简历文本。
 * 当前为前端本地实现（无后端上报），保持类型约束即可。
 */
export type AnalyticsEvent =
  | 'map_viewed'
  | 'path_added'
  | 'path_compared'
  | 'evidence_confirmed'
  | 'path_selected'
  | 'action_created'
  | 'checkin_completed'
  | 'outcome_reported';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  object_id?: string;
  path_type?: string;
}

export function track(_payload: AnalyticsPayload): void {
  // 预留上报；当前仅类型约束，便于后续接 B 仓 F50。
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', _payload);
  }
}
