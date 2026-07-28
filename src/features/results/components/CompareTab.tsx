import { useState } from 'react';
import { useNavigation } from '../../../shared/state/navigation';
import { useAuth } from '../../../shared/auth/session';
import { postPathSelection } from '../../../shared/api/client';
import type { CareerPath, Source, PathSelectionResult } from '../../../shared/api/contract';
import { PathTypeChip, UncertaintyPill } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { sourceTypeLabel } from '../../../shared/api/labels';

export function CompareTab() {
  const { response } = useNavigation();
  const { token } = useAuth();
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [questions, setQuestions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<PathSelectionResult | null>(null);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const hasData = response && response.status === 'ok' && response.data;
  if (!hasData) {
    return (
      <div className="card p-8 text-center text-ink-500">
        <p className="font-medium text-ink-700">暂无比较数据</p>
        <p className="mt-1 text-sm">先在工作台运行推演，生成路径后即可同屏比较。</p>
      </div>
    );
  }

  const paths = response.data!.paths;
  const sources = response.data!.sources;

  const getSourceById = (id: string): Source | undefined => sources.find((s) => s.source_id === id);

  const handleSubmit = async () => {
    if (!selectedPathId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await postPathSelection({
        source_navigation_request_id: response!.request_id,
        selected_path_id: selectedPathId,
        selection_reason: reason.trim(),
        unresolved_questions: questions.split('\n').map((q) => q.trim()).filter(Boolean),
      }, { token });
      setSubmitResult(result);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Side-by-side comparison */}
      <div className="grid gap-4 lg:grid-cols-3" role="region" aria-label="路径比较">
        {paths.map((p: CareerPath) => (
          <div key={p.path_id}
            className={`card animate-slide-up flex flex-col gap-3 p-5 transition-shadow ${selectedPathId === p.path_id ? 'ring-2 ring-brand-500 shadow-lift' : ''}`}
            role="article" aria-label={p.target_occupation.name}>
            <div className="flex items-center justify-between">
              <PathTypeChip type={p.path_type} />
              <UncertaintyPill level={p.uncertainty.level} />
            </div>
            <h3 className="display text-lg font-semibold">{p.target_occupation.name}</h3>
            <p className="text-sm text-ink-600">{p.summary}</p>

            {/* Benefits */}
            {p.benefits.length > 0 && (
              <div><p className="eyebrow mb-1">收益</p><ul className="list-disc pl-4 text-xs text-emerald-700">{p.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul></div>
            )}
            {/* Costs */}
            {p.costs.length > 0 && (
              <div><p className="eyebrow mb-1">成本</p><ul className="list-disc pl-4 text-xs text-amber-700">{p.costs.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
            )}
            {/* Counterevidence */}
            {p.counterevidence.length > 0 && (
              <div><p className="eyebrow mb-1">反证/风险</p><ul className="list-disc pl-4 text-xs text-red-700">{p.counterevidence.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
            )}
            {/* Key gaps */}
            {p.key_gaps.length > 0 && (
              <div><p className="eyebrow mb-1">关键差距</p><ul className="list-disc pl-4 text-xs text-sky-700">{p.key_gaps.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
            )}
            {/* Validation actions */}
            <div className="border-t border-line pt-2">
              <p className="eyebrow mb-1">最小验证行动（{p.minimum_validation_actions.length}）</p>
              <ul className="space-y-1 text-xs text-ink-600">
                {p.minimum_validation_actions.map((a) => (
                  <li key={a.action_id}>• {a.title}（{a.timebox_days}天）</li>
                ))}
              </ul>
            </div>

            {/* Sources for this path */}
            <div className="border-t border-line pt-2">
              <p className="eyebrow mb-1">来源（{p.source_ids.length}）</p>
              <div className="space-y-1">
                {p.source_ids.map((sid) => {
                  const src = getSourceById(sid);
                  if (!src) return <span key={sid} className="text-xs text-ink-400">{sid}</span>;
                  return (
                    <div key={sid}>
                      <button className="text-xs text-brand-600 underline" onClick={() => setExpandedSource(expandedSource === sid ? null : sid)}>
                        {src.title}
                      </button>
                      {expandedSource === sid && (
                        <div className="mt-1 rounded border border-line bg-paper p-2 text-xs text-ink-500">
                          <p>类型：{sourceTypeLabel[src.source_type]}｜许可：{src.license}</p>
                          <p>样本量：{src.sample_size?.toLocaleString() ?? '未标注'}｜范围：{src.scope.geographies.join('、')}</p>
                          <p>时间：{src.scope.time_window.start} ~ {src.scope.time_window.end}</p>
                          <p>方法：{src.methodology.name}（{src.methodology.description}）</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Select button */}
            <div className="mt-auto pt-2">
              <Button
                variant={selectedPathId === p.path_id ? 'primary' : 'secondary'}
                size="sm"
                className="w-full"
                onClick={() => setSelectedPathId(p.path_id)}
                aria-pressed={selectedPathId === p.path_id}
              >
                {selectedPathId === p.path_id ? '✓ 已选择' : '选择此路径'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Decision submission */}
      {selectedPathId && (
        <div className="card p-5">
          <p className="eyebrow mb-3">确认路径选择</p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-ink-500" htmlFor="sel-reason">选择理由</label>
              <textarea id="sel-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
                placeholder="为什么选择这条路径？" className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-500" htmlFor="sel-questions">未决问题（每行一个）</label>
              <textarea id="sel-questions" value={questions} onChange={(e) => setQuestions(e.target.value)} rows={2}
                placeholder="还有哪些疑虑？" className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
            </div>
            {submitError && <p className="text-sm text-red-700" role="alert">{submitError}</p>}
            {submitResult && (
              <p className="text-sm text-emerald-700" role="status">
                ✓ 决策已记录（ID: {submitResult.decision_id}，{submitResult.created_at}）
              </p>
            )}
            <Button size="sm" onClick={handleSubmit} disabled={submitting || !!submitResult}>
              {submitting ? '提交中...' : submitResult ? '已提交' : '提交决策'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
