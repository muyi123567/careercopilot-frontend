import { useMemo, useState } from 'react';
import { useNavigation } from '../../shared/state/navigation';
import { PathTypeChip } from '../../shared/components/ui/Badge';
import { Button } from '../../shared/components/ui/Button';
import { EmptyState, LoadingState } from '../../shared/components/states/FeedbackStates';

type ActionStatus = 'draft' | 'active' | 'done';
type ActionState = { status: ActionStatus; note: string; remind: boolean };

export function ActionsPage() {
  const { phase, response } = useNavigation();
  const [states, setStates] = useState<Record<string, ActionState>>({});

  const actions = useMemo(() => {
    if (!response || response.status !== 'ok' || !response.data) return [];
    return response.data.paths.flatMap((p) =>
      p.minimum_validation_actions.map((a) => ({ ...a, pathType: p.path_type, target: p.target_occupation.name })),
    );
  }, [response]);

  if (phase === 'idle') {
    return <EmptyState title="还没有可执行的行动" hint="先在首页生成职业地图。" />;
  }
  if (phase === 'loading') return <LoadingState />;
  if (actions.length === 0) {
    return <EmptyState title="当前响应无最小验证行动" />;
  }

  function patch(id: string, next: Partial<ActionState>) {
    setStates((m) => {
      const prev = m[id] ?? { status: 'draft' as ActionStatus, note: '', remind: false };
      return { ...m, [id]: { ...prev, ...next } };
    });
  }

  const statusLabel: Record<ActionStatus, string> = {
    draft: '草稿',
    active: '进行中',
    done: '已完成',
  };

  return (
    <div className="stagger space-y-5">
      <div>
        <p className="eyebrow">行动计划</p>
        <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">低成本验证，带停止条件</h1>
        <p className="mt-2 text-sm text-ink-500">
          每个行动都低成本、可观察、带停止条件。提醒默认关闭，由你选择开启。
        </p>
      </div>

      <ul className="space-y-3">
        {actions.map((a) => {
          const st = states[a.action_id] ?? { status: 'draft' as ActionStatus, note: '', remind: false };
          return (
            <li key={a.action_id} className="card card-hover animate-slide-up p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PathTypeChip type={a.pathType} />
                  <span className="text-xs text-ink-400">→ {a.target}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    st.status === 'done'
                      ? 'bg-emerald-100 text-emerald-700'
                      : st.status === 'active'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-ink-900/5 text-ink-500'
                  }`}
                >
                  {statusLabel[st.status]}
                </span>
              </div>

              <h3 className="display mt-2 text-lg font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-ink-600">预期信号：{a.expected_signal}</p>
              <p className="mt-1 text-xs text-ink-400">时间盒：{a.timebox_days} 天</p>

              <div className="mt-3">
                <label htmlFor={`note-${a.action_id}`} className="mb-1 block text-xs font-medium text-ink-500">
                  回填证据 / 备注
                </label>
                <textarea
                  id={`note-${a.action_id}`}
                  rows={2}
                  className="field resize-none"
                  placeholder="完成后记录看到的新信号……"
                  value={st.note}
                  onChange={(e) => patch(a.action_id, { note: e.target.value })}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {st.status !== 'active' && st.status !== 'done' && (
                  <Button size="sm" onClick={() => patch(a.action_id, { status: 'active' })}>
                    开始
                  </Button>
                )}
                {st.status === 'active' && (
                  <Button size="sm" onClick={() => patch(a.action_id, { status: 'done' })}>
                    标记完成
                  </Button>
                )}
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-line text-brand-600 focus:ring-brand-500"
                    checked={st.remind}
                    onChange={(e) => patch(a.action_id, { remind: e.target.checked })}
                  />
                  开启提醒（默认关）
                </label>
              </div>
              {st.status === 'done' && (
                <p className="mt-2 text-xs text-emerald-700">
                  已完成。新证据将帮助重估对应路径的判断。
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
