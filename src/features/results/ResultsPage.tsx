import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNavigation } from '../../shared/state/navigation';
import { StatusPill, PathTypeChip, UncertaintyPill, EvidenceGradeBadge, ClassificationTag } from '../../shared/components/ui/Badge';
import { CoverageBadge } from '../../shared/components/provenance/CoverageBadge';
import { DataInsufficientState, ErrorState, LoadingState } from '../../shared/components/states/FeedbackStates';
import { Button } from '../../shared/components/ui/Button';
import { evidenceDimensions } from '../../shared/api/labels';
import type { UserConfirmation } from '../../shared/api/contract';

type Tab = 'overview' | 'paths' | 'compare' | 'evidence' | 'actions' | 'radar' | 'decisions' | 'privacy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: '总览' },
  { id: 'paths', label: '路径' },
  { id: 'compare', label: '比较' },
  { id: 'evidence', label: '证据' },
  { id: 'actions', label: '行动' },
  { id: 'radar', label: '雷达' },
  { id: 'decisions', label: '决策' },
  { id: 'privacy', label: '隐私' },
];

export function ResultsPage() {
  const navigate = useNavigate();
  const { phase, response, error } = useNavigation();
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmations, setConfirmations] = useState<Record<string, UserConfirmation>>({});

  if (phase === 'loading') return <LoadingState />;

  if (phase === 'error') {
    return <ErrorState message={error ?? '无法读取本次职业导航结果'} onBack={() => navigate('/workspace')} />;
  }

  if (response?.status === 'service_failure' && response.error) {
    return <ErrorState message={response.error.message} requestId={response.error.trace_id} onBack={() => navigate('/workspace')} />;
  }

  if (response?.status === 'data_insufficient') {
    return <DataInsufficientState gaps={response.data?.coverage_gaps ?? []} />;
  }

  const hasData = response && response.status === 'ok' && response.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">分析结果</p>
          <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">你的路径全景</h1>
        </div>
        {hasData && <div className="flex items-center gap-2"><StatusPill status="ok" /><CoverageBadge gaps={response.data!.coverage_gaps} /></div>}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-line pb-px">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`relative whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800'}`}>
            {t.label}
            {tab === t.id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="stagger">
        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-4">
            {!hasData ? (
              <div className="card flex flex-col items-center gap-4 p-12 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-ink-300"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
                <div>
                  <h3 className="text-lg font-semibold text-ink-700">账户态职业地图尚未运行</h3>
                  <p className="mt-1 text-sm text-ink-500">匿名临时推演只生成当次行动建议；真实路径、比较与行动创建需要登录并连接已部署的数据服务。</p>
                </div>
                <Button onClick={() => navigate('/workspace')}>去推演工作台</Button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="card p-5"><p className="eyebrow">候选路径</p><p className="display mt-1 text-3xl font-bold">{response.data!.paths.length}</p></div>
                  <div className="card p-5"><p className="eyebrow">证据条目</p><p className="display mt-1 text-3xl font-bold">{response.data!.evidence.length}</p></div>
                  <div className="card p-5"><p className="eyebrow">数据覆盖</p><p className="display mt-1 text-3xl font-bold">{response.data!.coverage_gaps.length === 0 ? '完整' : `${response.data!.coverage_gaps.length} 缺口`}</p></div>
                </div>
                <div className="card p-5">
                  <p className="eyebrow mb-3">五维度评估（不合成单一成功率）</p>
                  <div className="flex flex-wrap gap-2">
                    {evidenceDimensions.map((d) => (
                      <span key={d.key} className="rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink-600">{d.label}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Paths */}
        {tab === 'paths' && (
          <div className="space-y-4">
            {!hasData ? <EmptyTab label="路径" /> : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {response.data!.paths.map((p) => (
                  <div key={p.path_id} className="card card-hover animate-slide-up flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between"><PathTypeChip type={p.path_type} /><UncertaintyPill level={p.uncertainty.level} /></div>
                    <h3 className="display text-lg font-semibold">{p.target_occupation.name}</h3>
                    <p className="text-sm text-ink-600">{p.summary}</p>
                    {p.key_gaps.length > 0 && <div><p className="eyebrow mb-1">关键差距</p><ul className="list-disc pl-4 text-xs text-sky-700">{p.key_gaps.map((g, i) => <li key={i}>{g}</li>)}</ul></div>}
                    <div className="mt-auto border-t border-line pt-2 text-xs text-ink-400">{p.minimum_validation_actions.length} 个最小验证行动</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compare */}
        {tab === 'compare' && (
          <div className="space-y-4">
            {!hasData ? <EmptyTab label="比较" /> : (
              <div className="grid gap-4 lg:grid-cols-3">
                {response.data!.paths.map((p) => (
                  <div key={p.path_id} className="card animate-slide-up flex flex-col gap-3 p-5">
                    <PathTypeChip type={p.path_type} />
                    <h3 className="text-sm font-semibold">{p.target_occupation.name}</h3>
                    {p.benefits.length > 0 && <Section title="收益" items={p.benefits} />}
                    {p.costs.length > 0 && <Section title="成本" items={p.costs} tone="text-amber-700" />}
                    {p.counterevidence.length > 0 && <Section title="反证" items={p.counterevidence} tone="text-red-700" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evidence */}
        {tab === 'evidence' && (
          <div className="space-y-3">
            {!hasData ? <EmptyTab label="证据" /> : response.data!.evidence.map((e) => {
              const state = confirmations[e.evidence_id] ?? e.user_confirmation;
              return (
                <div key={e.evidence_id} className="card card-hover animate-slide-up p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2"><EvidenceGradeBadge grade={e.evidence_grade} /><ClassificationTag kind={e.classification} /><UncertaintyPill level={e.uncertainty.level} /></div>
                  <p className="text-sm text-ink-800">{e.claim}</p>
                  <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                    <button onClick={() => setConfirmations((m) => ({ ...m, [e.evidence_id]: 'confirmed' }))}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${state === 'confirmed' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-line text-ink-500 hover:border-ink-900/20'}`}>确认</button>
                    <button onClick={() => setConfirmations((m) => ({ ...m, [e.evidence_id]: 'rejected' }))}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${state === 'rejected' ? 'border-red-400 bg-red-50 text-red-700' : 'border-line text-ink-500 hover:border-ink-900/20'}`}>驳回</button>
                  </div>
                  <p className="mt-2 text-xs text-ink-400">此标记仅在当前浏览器会话中保留；保存个人证据需要登录后的后端能力。</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        {tab === 'actions' && (
          <div className="space-y-3">
            {!hasData ? <EmptyTab label="行动" /> : (
              response.data!.paths.flatMap((p) => p.minimum_validation_actions.map((a) => ({ ...a, pathType: p.path_type }))).map((a) => (
                <div key={a.action_id} className="card card-hover animate-slide-up p-5">
                  <div className="flex items-center gap-2"><PathTypeChip type={a.pathType} /><span className="text-xs text-ink-400">时间盒：{a.timebox_days} 天</span></div>
                  <h3 className="display mt-2 text-base font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-ink-600">预期信号：{a.expected_signal}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Radar */}
        {tab === 'radar' && (
          <UnavailableTab title="市场雷达尚未开放" detail="首发前没有已批准的职位快照来源，因此不展示合成热度、增长率或地域结论。上线后每项数据都会标注来源、样本量与截止时间。" />
        )}

        {/* Decisions */}
        {tab === 'decisions' && (
          <UnavailableTab title="决策复盘需要已保存的用户决策" detail="首发匿名会话不会生成或伪造“已锁定”决策。登录、同意与 F42/F43 结果回填完成后，才会在这里展示不可变快照和检查点。" />
        )}

        {/* Privacy */}
        {tab === 'privacy' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">隐私中心</p>
              <p className="text-sm text-ink-500">原始文件在浏览器本地解析；仅在你勾选授权后才发送经筛选的结构化信号和问题。</p>
            </div>
            <div className="card p-5 text-sm leading-relaxed text-ink-600">
              <p>匿名会话不创建账号数据；浏览器关闭后，本地对话状态消失。导出和删除任务只会在账号数据、审计记录与明确 SLA 均已上线后出现。</p>
              <p className="mt-3 text-xs text-ink-400">生产失败绝不自动伪装成 Demo 成功。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Helpers ===== */
function EmptyTab({ label }: { label: string }) {
  const navigate = useNavigate();
  return (
    <div className="card flex flex-col items-center gap-4 p-12 text-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-ink-300"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
      <div><h3 className="font-semibold text-ink-700">暂无{label}数据</h3><p className="mt-1 text-sm text-ink-500">先在工作台运行推演。</p></div>
      <Button size="sm" onClick={() => navigate('/workspace')}>去工作台</Button>
    </div>
  );
}

function UnavailableTab({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-12 text-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-ink-300"><circle cx="12" cy="12" r="9"/><path d="M12 7v5"/><path d="M12 16h.01"/></svg>
      <div>
        <h3 className="font-semibold text-ink-700">{title}</h3>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-500">{detail}</p>
      </div>
    </div>
  );
}

function Section({ title, items, tone }: { title: string; items: string[]; tone?: string }) {
  return (
    <div><p className="eyebrow mb-1">{title}</p><ul className={`list-disc pl-4 text-xs ${tone ?? 'text-ink-700'}`}>{items.map((it, i) => <li key={i}>{it}</li>)}</ul></div>
  );
}
