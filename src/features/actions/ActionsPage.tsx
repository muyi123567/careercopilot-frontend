import { Link } from 'react-router';
import { useDecisionList, useActions, useUpdateActionStatus, type ActionItem } from '../../shared/api/hooks-actions';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  planned: { label: '计划中', cls: 'bg-ink-100 text-ink-600' },
  active: { label: '进行中', cls: 'bg-accent-50 text-accent-600' },
  done: { label: '已完成', cls: 'bg-success-50 text-success-600' },
  abandoned: { label: '已放弃', cls: 'bg-red-50 text-red-600' },
};

function ActionCard({ action }: { action: ActionItem }) {
  const updateStatus = useUpdateActionStatus();
  const statusInfo = STATUS_LABELS[action.status] ?? STATUS_LABELS.planned;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ink-800">{action.title}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusInfo.cls}`}>{statusInfo.label}</span>
          </div>
          {action.description && <p className="mt-1 text-xs text-ink-500">{action.description}</p>}
          <p className="mt-2 text-[10px] text-ink-300">
            {new Date(action.created_at).toLocaleDateString('zh-CN')}
            {action.due_date ? ` · 截止 ${new Date(action.due_date).toLocaleDateString('zh-CN')}` : ''}
          </p>
        </div>
      </div>
      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        {action.status === 'planned' && (
          <button
            onClick={() => updateStatus.mutate({ actionId: action.id, status: 'active' })}
            disabled={updateStatus.isPending}
            className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
          >
            开始执行
          </button>
        )}
        {action.status === 'active' && (
          <>
            <button
              onClick={() => updateStatus.mutate({ actionId: action.id, status: 'done' })}
              disabled={updateStatus.isPending}
              className="rounded-lg bg-success-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-success-600 disabled:opacity-50"
            >
              标记完成
            </button>
            <Link
              to={`/app/check-ins/${action.id}`}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50"
            >
              签到复盘
            </Link>
            <button
              onClick={() => updateStatus.mutate({ actionId: action.id, status: 'abandoned' })}
              disabled={updateStatus.isPending}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              放弃
            </button>
          </>
        )}
        {(action.status === 'done' || action.status === 'abandoned') && (
          <Link
            to={`/app/check-ins/${action.id}`}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50"
          >
            查看复盘
          </Link>
        )}
      </div>
    </div>
  );
}

export function ActionsPage() {
  const { data: decisions, isLoading: decisionsLoading, isError: decisionsError, refetch } = useDecisionList();
  const activeDecision = decisions?.find((d) => !d.outcome);
  const { data: actions, isLoading: actionsLoading } = useActions(activeDecision?.id);

  return (
    <div className="space-y-5">
      <section className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">行动实验</h1>
          <p className="mt-1 text-sm text-ink-500">小步验证，用真实行动检验你的职业假设</p>
        </div>
        <Link to="/app/paths/new" className="shrink-0 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700">
          新建路径分析
        </Link>
      </section>

      {/* Loading */}
      {(decisionsLoading || actionsLoading) && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="h-4 w-48 rounded bg-ink-200" />
              <div className="mt-2 h-3 w-full rounded bg-ink-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {decisionsError && (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载行动列表失败。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">重试</button>
        </div>
      )}

      {/* Empty - no decisions yet */}
      {!decisionsLoading && !decisionsError && (!decisions || decisions.length === 0) && (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-20 w-20 text-ink-300" aria-hidden="true">
            <path d="M20 60V20h40v40H20z" strokeDasharray="4 3" />
            <path d="M30 45l8-8 6 6 10-12" />
            <circle cx="55" cy="25" r="4" strokeDasharray="2 1" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">还没有行动，没关系</p>
          <p className="mt-1 text-xs text-ink-400">先做一次路径分析，系统会为你生成可验证的行动实验。</p>
          <Link to="/app/paths/new" className="mt-4 inline-block rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700">
            开始路径分析
          </Link>
        </div>
      )}

      {/* Actions list */}
      {!decisionsLoading && !decisionsError && actions && actions.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-ink-400">共 {actions.length} 个行动</p>
          {actions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      )}

      {/* Has decisions but no actions for active decision */}
      {!decisionsLoading && !decisionsError && decisions && decisions.length > 0 && !actionsLoading && (!actions || actions.length === 0) && (
        <div className="rounded-xl border border-dashed border-line p-8 text-center">
          <p className="text-sm text-ink-500">当前决策下还没有行动项。</p>
          <p className="mt-1 text-xs text-ink-400">路径分析生成的验证行动会显示在这里。</p>
        </div>
      )}
    </div>
  );
}
