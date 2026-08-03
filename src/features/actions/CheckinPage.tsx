import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAddCheckin } from '../../shared/api/hooks-actions';

export function CheckinPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addCheckin = useAddCheckin();

  const [whatHappened, setWhatHappened] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [reason, setReason] = useState('');
  const [feeling, setFeeling] = useState(3);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!whatHappened.trim()) { setError('请描述发生了什么'); return; }
    setError('');
    try {
      await addCheckin.mutateAsync({
        actionId: id,
        what_happened: whatHappened.trim(),
        new_evidence: newEvidence.trim() || undefined,
        reason: reason.trim() || undefined,
        subjective_feeling: feeling,
      });
      setSuccess(true);
      setTimeout(() => navigate('/app/actions'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请重试');
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-success-500" aria-hidden="true">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-sm font-medium text-ink-800">签到成功</p>
        <p className="mt-1 text-xs text-ink-400">正在返回行动列表...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <Link to="/app/actions" className="inline-flex items-center gap-1 text-xs font-medium text-ink-400 transition-colors hover:text-ink-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
          返回行动列表
        </Link>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">行动复盘</h1>
        <p className="mt-1 text-sm text-ink-500">记录这次行动的结果，为下一步决策积累证据</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-line bg-surface p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="what-happened">发生了什么？ *</label>
          <textarea
            id="what-happened"
            value={whatHappened}
            onChange={(e) => { setWhatHappened(e.target.value); if (error) setError(''); }}
            rows={4}
            placeholder="描述你做了什么、结果如何..."
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="new-evidence">新发现的证据</label>
          <input
            id="new-evidence"
            type="text"
            value={newEvidence}
            onChange={(e) => setNewEvidence(e.target.value)}
            placeholder="例如：收到了面试邀请、完成了某个项目..."
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="reason">原因分析</label>
          <input
            id="reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="为什么会有这个结果？"
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="feeling">主观感受</label>
          <div className="flex items-center gap-3">
            <input
              id="feeling"
              type="range"
              min={1}
              max={5}
              value={feeling}
              onChange={(e) => setFeeling(Number(e.target.value))}
              className="flex-1 accent-accent-500"
            />
            <span className="w-16 text-center text-xs font-medium text-ink-600">
              {['', '很差', '较差', '一般', '较好', '很好'][feeling]}
            </span>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={addCheckin.isPending}
          className="w-full rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
        >
          {addCheckin.isPending ? '提交中...' : '提交复盘'}
        </button>
      </form>
    </div>
  );
}
