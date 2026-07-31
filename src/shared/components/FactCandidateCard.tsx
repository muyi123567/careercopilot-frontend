import { type EvidenceItem, useConfirmEvidence, useRejectEvidence } from '../api/hooks';

const KIND_LABELS: Record<string, string> = {
  skill: '技能',
  experience: '经历',
  education: '教育',
  project: '项目',
  certification: '证书',
  preference: '偏好',
};

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending: { label: '待确认', cls: 'bg-accent-50 text-accent-600' },
  confirmed: { label: '已确认', cls: 'bg-success-50 text-success-600' },
  rejected: { label: '已拒绝', cls: 'bg-red-50 text-red-600' },
  revised: { label: '已修正', cls: 'bg-ink-100 text-ink-600' },
};

export function FactCandidateCard({ item }: { item: EvidenceItem }) {
  const confirm = useConfirmEvidence();
  const reject = useRejectEvidence();
  const status = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink-200">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">
              {KIND_LABELS[item.kind] ?? item.kind}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.cls}`}>
              {status.label}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-ink-800">{item.label}</p>
          {item.value && <p className="mt-0.5 text-xs text-ink-500">{item.value}</p>}
        </div>
      </div>

      {/* Action buttons - only for pending items */}
      {item.status === 'pending' && (
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
          <button
            onClick={() => confirm.mutate(item.id)}
            disabled={confirm.isPending}
            className="rounded-lg bg-success-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-success-600 disabled:opacity-50"
          >
            {confirm.isPending ? '确认中...' : '确认'}
          </button>
          <button
            onClick={() => reject.mutate(item.id)}
            disabled={reject.isPending}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            拒绝
          </button>
        </div>
      )}
    </div>
  );
}
