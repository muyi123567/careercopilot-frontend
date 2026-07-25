import { useState } from 'react';
import { useNavigation } from '../../shared/state/navigation';
import { EvidenceGradeBadge, ClassificationTag, UncertaintyPill } from '../../shared/components/ui/Badge';
import { SourceList } from '../../shared/components/provenance/SourceList';
import { EmptyState, LoadingState } from '../../shared/components/states/FeedbackStates';
import type { UserConfirmation } from '../../shared/api/contract';

export function EvidencePage() {
  const { phase, response } = useNavigation();
  const [confirmations, setConfirmations] = useState<Record<string, UserConfirmation>>({});

  if (phase === 'idle') {
    return <EmptyState title="还没有证据可确认" hint="先在首页生成职业地图。" />;
  }
  if (phase === 'loading') return <LoadingState />;
  if (!response || !response.data) {
    return <EmptyState title="当前响应无证据" />;
  }

  const { evidence, sources } = response.data;

  return (
    <div className="stagger space-y-5">
      <div>
        <p className="eyebrow">证据账本</p>
        <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">逐条确认，而非盲信</h1>
        <p className="mt-2 text-sm text-ink-500">
          每条证据都可确认或驳回。驳回不会被下一次调用悄悄恢复。事实、推断、建议分别标识。
        </p>
      </div>

      {evidence.length === 0 ? (
        <EmptyState title="暂无证据" hint="后端返回的数据不足或未包含证据项。" />
      ) : (
        <ul className="space-y-3">
          {evidence.map((e) => {
            const state = confirmations[e.evidence_id] ?? e.user_confirmation;
            return (
              <li key={e.evidence_id} className="card card-hover animate-slide-up p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <EvidenceGradeBadge grade={e.evidence_grade} />
                  <ClassificationTag kind={e.classification} />
                  <UncertaintyPill level={e.uncertainty.level} />
                </div>
                <p className="text-sm leading-relaxed text-ink-800">{e.claim}</p>
                <p className="mt-1 text-xs text-ink-500">不确定性：{e.uncertainty.interpretation}</p>

                <div className="mt-3">
                  <SourceList sources={sources.filter((s) => e.source_ids.includes(s.source_id))} />
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                  <span className="text-xs text-ink-500">你的确认：</span>
                  <button
                    onClick={() => setConfirmations((m) => ({ ...m, [e.evidence_id]: 'confirmed' }))}
                    className={`rounded-lg border px-2 py-1 text-xs transition-colors duration-200 ${
                      state === 'confirmed'
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-line text-ink-500 hover:border-ink-900/20'
                    }`}
                  >
                    确认
                  </button>
                  <button
                    onClick={() => setConfirmations((m) => ({ ...m, [e.evidence_id]: 'rejected' }))}
                    className={`rounded-lg border px-2 py-1 text-xs transition-colors duration-200 ${
                      state === 'rejected'
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-line text-ink-500 hover:border-ink-900/20'
                    }`}
                  >
                    驳回
                  </button>
                  {state === 'rejected' && (
                    <span className="text-xs text-red-600">已驳回，将影响派生结论。</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
