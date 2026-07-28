import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '../../../shared/state/navigation';
import { useAuth } from '../../../shared/auth/session';
import { getActions, createAction, updateAction, postCheckIn } from '../../../shared/api/client';
import type { UserAction, ActionStatus, CreateCheckInInput } from '../../../shared/api/contract';
import { PathTypeChip } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';

const STATUS_LABEL: Record<ActionStatus, string> = {
  proposed: '待启动',
  active: '进行中',
  completed: '已完成',
  abandoned: '已放弃',
};

const STATUS_CLASS: Record<ActionStatus, string> = {
  proposed: 'bg-slate-100 text-slate-700',
  active: 'bg-sky-100 text-sky-800',
  completed: 'bg-emerald-100 text-emerald-800',
  abandoned: 'bg-red-100 text-red-700',
};

export function ActionsTab() {
  const { response } = useNavigation();
  const { token } = useAuth();
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [checkinFor, setCheckinFor] = useState<string | null>(null);

  // Create form
  const [formPathId, setFormPathId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSignal, setFormSignal] = useState('');
  const [formDays, setFormDays] = useState('14');
  const [formReason, setFormReason] = useState('');

  // Check-in form
  const [ciNote, setCiNote] = useState('');
  const [ciFeeling, setCiFeeling] = useState('');
  const [ciDelta, setCiDelta] = useState('');

  const hasData = response && response.status === 'ok' && response.data;
  const paths = hasData ? response.data!.paths : [];

  const loadActions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const list = await getActions({ token });
      setActions(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadActions(); }, [loadActions]);

  const handleCreate = async () => {
    setError(null);
    try {
      const newAction = await createAction({
        path_id: formPathId,
        title: formTitle.trim(),
        expected_signal: formSignal.trim(),
        timebox_days: Number(formDays) || 14,
        reason: formReason.trim() || undefined,
      }, { token });
      setActions((prev) => [newAction, ...prev]);
      setShowCreate(false);
      setFormTitle(''); setFormSignal(''); setFormReason('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleStatusChange = async (actionId: string, status: ActionStatus) => {
    setError(null);
    try {
      const updated = await updateAction(actionId, { status }, { token });
      setActions((prev) => prev.map((a) => (a.action_id === actionId ? updated : a)));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleCheckIn = async (actionId: string) => {
    setError(null);
    const input: CreateCheckInInput = {
      note: ciNote.trim(),
      subjective_feeling: ciFeeling.trim(),
      before_after_delta: ciDelta.trim() || undefined,
    };
    try {
      const ci = await postCheckIn(actionId, input, { token });
      setActions((prev) => prev.map((a) =>
        a.action_id === actionId ? { ...a, checkins: [...a.checkins, ci] } : a
      ));
      setCheckinFor(null);
      setCiNote(''); setCiFeeling(''); setCiDelta('');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  // Not logged in
  if (!token) {
    return (
      <div className="card p-8 text-center text-ink-500">
        <p className="font-medium text-ink-700">行动计划需要登录</p>
        <p className="mt-1 text-sm">创建、编辑行动和提交检查点需要账户态。匿名会话仅展示只读行动建议。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="eyebrow">我的行动（{actions.length}）</p>
        <Button size="sm" variant="secondary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '取消' : '+ 新建行动'}
        </Button>
      </div>

      {error && <div className="card border-red-200 bg-red-50/60 p-4 text-sm text-red-800" role="alert">{error}</div>}

      {/* Create form */}
      {showCreate && (
        <div className="card p-5">
          <p className="eyebrow mb-3">创建行动</p>
          {!hasData && <p className="mb-3 text-xs text-amber-700">提示：需要先有路径选择才能创建对应行动。</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-ink-500" htmlFor="act-path">关联路径</label>
              <select id="act-path" value={formPathId} onChange={(e) => setFormPathId(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm">
                <option value="">选择路径...</option>
                {paths.map((p) => <option key={p.path_id} value={p.path_id}>{p.target_occupation.name}（{p.path_type}）</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-500" htmlFor="act-title">行动标题</label>
              <input id="act-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" placeholder="如：完成一个数据分析小项目" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-500" htmlFor="act-signal">预期信号</label>
              <input id="act-signal" value={formSignal} onChange={(e) => setFormSignal(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" placeholder="如：能独立完成数据清洗" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-500" htmlFor="act-days">时间盒（天）</label>
              <input id="act-days" type="number" min="1" max="90" value={formDays} onChange={(e) => setFormDays(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs text-ink-500" htmlFor="act-reason">选择理由</label>
            <input id="act-reason" value={formReason} onChange={(e) => setFormReason(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" placeholder="为什么选择这个行动？" />
          </div>
          <Button size="sm" className="mt-3" onClick={handleCreate} disabled={!formPathId || !formTitle.trim()}>
            创建
          </Button>
        </div>
      )}

      {/* Actions list */}
      {loading && <p className="text-sm text-ink-400">加载中...</p>}
      {!loading && actions.length === 0 && (
        <div className="card p-8 text-center text-ink-500">
          <p className="font-medium text-ink-700">暂无行动</p>
          <p className="mt-1 text-sm">选择路径后创建你的第一个验证行动。</p>
        </div>
      )}

      {actions.map((a) => {
        const linkedPath = paths.find((p) => p.path_id === a.path_id);
        return (
          <div key={a.action_id} className="card card-hover animate-slide-up p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[a.status]}`}>{STATUS_LABEL[a.status]}</span>
              {linkedPath && <PathTypeChip type={linkedPath.path_type} />}
              <span className="text-xs text-ink-400">时间盒：{a.timebox_days}天</span>
              {a.reminder_enabled && <span className="text-xs text-ink-400">🔔 提醒已开启</span>}
            </div>
            <h3 className="display mt-2 text-base font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-ink-600">预期信号：{a.expected_signal}</p>
            {a.reason && <p className="mt-1 text-xs text-ink-500">理由：{a.reason}</p>}
            {a.unresolved_questions.length > 0 && (
              <p className="mt-1 text-xs text-amber-700">未决：{a.unresolved_questions.join('；')}</p>
            )}
            {a.evidence_links.length > 0 && (
              <p className="mt-1 text-xs text-ink-400">证据关联：{a.evidence_links.join('、')}</p>
            )}

            {/* Check-ins */}
            {a.checkins.length > 0 && (
              <div className="mt-3 border-t border-line pt-2">
                <p className="eyebrow mb-1">检查点（{a.checkins.length}）</p>
                <ul className="space-y-1 text-xs text-ink-600">
                  {a.checkins.map((ci) => (
                    <li key={ci.checkin_id}>
                      <span className="text-ink-400">{new Date(ci.at).toLocaleDateString()}</span> — {ci.note}
                      {ci.subjective_feeling && <span className="text-ink-400">（感受：{ci.subjective_feeling}）</span>}
                      {ci.before_after_delta && <span className="text-emerald-600"> 变化：{ci.before_after_delta}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions row */}
            <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
              {a.status === 'proposed' && <Button size="sm" variant="secondary" onClick={() => handleStatusChange(a.action_id, 'active')}>启动</Button>}
              {a.status === 'active' && <Button size="sm" variant="secondary" onClick={() => handleStatusChange(a.action_id, 'completed')}>完成</Button>}
              {(a.status === 'proposed' || a.status === 'active') && <Button size="sm" variant="ghost" onClick={() => handleStatusChange(a.action_id, 'abandoned')}>放弃</Button>}
              {a.status === 'active' && <Button size="sm" variant="ghost" onClick={() => setCheckinFor(checkinFor === a.action_id ? null : a.action_id)}>+ 检查点</Button>}
            </div>

            {/* Check-in form */}
            {checkinFor === a.action_id && (
              <div className="mt-3 rounded-lg border border-line bg-paper p-3">
                <div className="grid gap-2 sm:grid-cols-3">
                  <input value={ciNote} onChange={(e) => setCiNote(e.target.value)} placeholder="进展笔记" className="rounded-lg border border-line px-3 py-1.5 text-sm" />
                  <input value={ciFeeling} onChange={(e) => setCiFeeling(e.target.value)} placeholder="主观感受" className="rounded-lg border border-line px-3 py-1.5 text-sm" />
                  <input value={ciDelta} onChange={(e) => setCiDelta(e.target.value)} placeholder="前后变化" className="rounded-lg border border-line px-3 py-1.5 text-sm" />
                </div>
                <Button size="sm" className="mt-2" onClick={() => handleCheckIn(a.action_id)} disabled={!ciNote.trim()}>提交检查点</Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
