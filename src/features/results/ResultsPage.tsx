import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNavigation } from '../../shared/state/navigation';
import { PathTypeChip, UncertaintyPill, ClassificationTag } from '../../shared/components/ui/Badge';
import { CoverageBadge } from '../../shared/components/provenance/CoverageBadge';
import { DataInsufficientState, ErrorState, LoadingState } from '../../shared/components/states/FeedbackStates';
import { evidenceDimensions } from '../../shared/api/labels';
import type { CareerPath, Evidence, NavigationResult } from '../../shared/api/contract';


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

/* ===== Grade Colors ===== */
const gradeColors: Record<string, string> = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-sky-50 text-sky-700 border-sky-200',
  C: 'bg-amber-50 text-amber-700 border-amber-200',
  D: 'bg-red-50 text-red-700 border-red-200',
  U: 'bg-ink-900/5 text-ink-500 border-line',
};

interface DisplayPath {
  path_id: string;
  path_type: 'deepen' | 'adjacent' | 'explore';
  target: string;
  summary: string;
  uncertainty: 'low' | 'medium' | 'high' | 'very_high' | 'unknown';
  benefits: string[];
  costs: string[];
  counterevidence: string[];
  gaps: string[];
  actions: { id: string; title: string; signal: string; days: number }[];
  sources: string[];
}

interface DisplayEvidence {
  id: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'U';
  classification: 'fact' | 'inference' | 'recommendation';
  uncertainty: 'low' | 'medium' | 'high' | 'very_high' | 'unknown';
  claim: string;
  source: string;
  confirmed: string | null;
}

function toDisplayPath(p: CareerPath, result: NavigationResult): DisplayPath {
  return {
    path_id: p.path_id,
    path_type: p.path_type,
    target: p.target_occupation.name,
    summary: p.summary,
    uncertainty: p.uncertainty.level,
    benefits: p.benefits,
    costs: p.costs,
    counterevidence: p.counterevidence,
    gaps: p.key_gaps,
    actions: p.minimum_validation_actions.map((a) => ({
      id: a.action_id,
      title: a.title,
      signal: a.expected_signal,
      days: a.timebox_days,
    })),
    sources: result.sources.filter((s) => p.source_ids.includes(s.source_id)).map((s) => s.title),
  };
}

function toDisplayEvidence(e: Evidence, result: NavigationResult): DisplayEvidence {
  const sourceTitles = result.sources
    .filter((s) => e.source_ids.includes(s.source_id))
    .map((s) => s.title)
    .join('；');
  return {
    id: e.evidence_id,
    grade: e.evidence_grade,
    classification: e.classification,
    uncertainty: e.uncertainty.level,
    claim: e.claim,
    source: sourceTitles || '已发布轨迹聚合',
    confirmed:
      e.user_confirmation === 'confirmed'
        ? 'confirmed'
        : e.user_confirmation === 'rejected'
          ? 'rejected'
          : null,
  };
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { phase, response, error } = useNavigation();
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmations, setConfirmations] = useState<Record<string, string>>({});

  if (phase === 'loading') return <LoadingState />;
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="text-sm font-medium text-ink-600">尚未生成账户态导航</p>
        <p className="mt-1 text-xs text-ink-400">先在工作台选择当前职业，生成账户态职业导航后再查看结果。</p>
        <button
          type="button"
          onClick={() => navigate('/workspace')}
          className="mt-4 rounded-full bg-brand-700 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-800 active:scale-95"
        >
          去工作台生成导航
        </button>
      </div>
    );
  }
  if (phase === 'error') return <ErrorState message={error ?? '无法读取本次职业导航结果'} onBack={() => navigate('/workspace')} />;
  if (response?.status === 'service_failure' && response.error) return <ErrorState message={response.error.message} requestId={response.error.trace_id} onBack={() => navigate('/workspace')} />;
  if (response?.status === 'data_insufficient') return <DataInsufficientState gaps={response.data?.coverage_gaps ?? []} />;

  const hasLiveData = response && response.status === 'ok' && response.data;
  const livePaths = hasLiveData ? response.data!.paths.map((p) => toDisplayPath(p, response.data!)) : [];
  const liveEvidence = hasLiveData ? response.data!.evidence.map((e) => toDisplayEvidence(e, response.data!)) : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">分析结果</p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">你的路径全景</h1>
        </div>
        <div className="flex items-center gap-3">
          {hasLiveData && <CoverageBadge gaps={response.data!.coverage_gaps} />}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-line pb-px -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`relative whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-200 active:scale-[0.95] sm:px-4 sm:text-sm ${tab === t.id ? 'bg-brand-50/80 text-brand-700' : 'text-ink-500 hover:bg-ink-900/[0.03] hover:text-ink-700'}`}>
            {t.label}
            {tab === t.id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="stagger">
        {/* ===== Overview ===== */}
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4">
              <div className="card relative overflow-hidden p-5">
                <span className="absolute left-0 top-0 h-full w-1 bg-brand-500" />
                <p className="eyebrow">候选路径</p>
                <p className="display mt-1 text-3xl font-bold text-brand-800">{hasLiveData ? response.data!.paths.length : 0}</p>
              </div>
              <div className="card relative overflow-hidden p-5">
                <span className="absolute left-0 top-0 h-full w-1 bg-teal-500" />
                <p className="eyebrow">证据条目</p>
                <p className="display mt-1 text-3xl font-bold text-teal-700">{hasLiveData ? response.data!.evidence.length : 0}</p>
              </div>
              <div className="card relative overflow-hidden p-5">
                <span className="absolute left-0 top-0 h-full w-1 bg-gold-500" />
                <p className="eyebrow">数据覆盖</p>
                <p className="display mt-1 text-3xl font-bold text-gold-600">{hasLiveData ? (response.data!.coverage_gaps.length === 0 ? '完整' : `${response.data!.coverage_gaps.length} 缺口`) : '—'}</p>
              </div>
            </div>

            {/* Path cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {livePaths.map((p) => (
                <div key={p.path_id} className="card card-hover animate-slide-up flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <PathTypeChip type={p.path_type} />
                    <UncertaintyPill level={p.uncertainty} />
                  </div>
                  <h3 className="display text-base font-semibold">{p.target}</h3>
                  <p className="text-xs leading-relaxed text-ink-600">{p.summary}</p>
                  <div className="mt-auto border-t border-line pt-2 text-xs text-ink-400">{p.actions.length} 个验证行动 · {p.sources.length} 个来源</div>
                </div>
              ))}
            </div>

            {/* Five dimensions */}
            <div className="card p-5">
              <p className="eyebrow mb-3">五维度评估（不合成单一成功率）</p>
              <div className="flex flex-wrap gap-2">
                {evidenceDimensions.map((d) => (
                  <span key={d.key} className="rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink-600 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-700 hover:shadow-sm">{d.label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== Paths ===== */}
        {tab === 'paths' && (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:gap-4">
            {livePaths.map((p) => (
              <div key={p.path_id} className="card card-hover animate-slide-up flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between"><PathTypeChip type={p.path_type} /><UncertaintyPill level={p.uncertainty} /></div>
                <h3 className="display text-lg font-semibold">{p.target}</h3>
                <p className="text-sm text-ink-600">{p.summary}</p>
                {p.gaps.length > 0 && <div><p className="eyebrow mb-1">关键差距</p><ul className="list-disc pl-4 text-xs text-sky-700">{p.gaps.map((g, i) => <li key={i}>{g}</li>)}</ul></div>}
                <div className="mt-auto space-y-1 border-t border-line pt-2">
                  <p className="text-xs text-ink-400">来源：{p.sources.join('；')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Compare ===== */}
        {tab === 'compare' && (
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-3 sm:gap-4">
            {livePaths.map((p) => (
              <div key={p.path_id} className="card animate-slide-up flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between"><PathTypeChip type={p.path_type} /><UncertaintyPill level={p.uncertainty} /></div>
                <h3 className="text-sm font-semibold">{p.target}</h3>
                <Section title="收益" items={p.benefits} />
                <Section title="成本" items={p.costs} tone="text-amber-700" />
                <Section title="反证" items={p.counterevidence} tone="text-red-700" />
                <div className="mt-auto border-t border-line pt-2">
                  <p className="text-[11px] text-ink-400">来源：{p.sources.join('；')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Evidence ===== */}
        {tab === 'evidence' && (
          <div className="space-y-3">
            {liveEvidence.map((e) => {
              const state = confirmations[e.id] ?? e.confirmed;
              return (
                <div key={e.id} className="card card-hover animate-slide-up p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${gradeColors[e.grade]}`}>{e.grade} 级</span>
                    <ClassificationTag kind={e.classification} />
                    <UncertaintyPill level={e.uncertainty} />
                  </div>
                  <p className="text-sm text-ink-800">{e.claim}</p>
                  <p className="mt-1.5 text-xs text-ink-400">来源：{e.source}</p>
                  <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                    <button onClick={() => setConfirmations((m) => ({ ...m, [e.id]: 'confirmed' }))}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-all active:scale-95 ${state === 'confirmed' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-line text-ink-500 hover:border-emerald-300 hover:text-emerald-600'}`}>确认</button>
                    <button onClick={() => setConfirmations((m) => ({ ...m, [e.id]: 'rejected' }))}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-all active:scale-95 ${state === 'rejected' ? 'border-red-400 bg-red-50 text-red-700' : 'border-line text-ink-500 hover:border-red-300 hover:text-red-600'}`}>驳回</button>
                    {e.grade === 'U' && <span className="ml-auto text-[11px] text-ink-400 italic">Unknown — 数据缺失，不做推断</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== Actions ===== */}
        {tab === 'actions' && (
          <div className="space-y-3">
            {livePaths.flatMap(p => p.actions.map(a => ({ ...a, pathType: p.path_type, target: p.target }))).map((a) => (
              <div key={a.id} className="card card-hover animate-slide-up p-5">
                <div className="flex items-center gap-2">
                  <PathTypeChip type={a.pathType} />
                  <span className="text-xs text-ink-400">→ {a.target}</span>
                  <span className="ml-auto rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700">{a.days} 天</span>
                </div>
                <h3 className="display mt-2 text-base font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-ink-600">预期信号：{a.signal}</p>
                {/* Checkpoint UI */}
                <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
                  <span className="text-[11px] text-ink-400">检查点：</span>
                  {[7, 30, 90].filter(d => d <= a.days).map(d => (
                    <span key={d} className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-500">第 {d} 天</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Radar ===== */}
        {tab === 'radar' && (
          <div className="card p-5">
            <p className="eyebrow mb-1">中文职业市场雷达</p>
            <p className="text-sm text-ink-500">市场数据暂不可用。数据服务接入后将展示来源、样本量和截止时间。</p>
          </div>
        )}

        {/* ===== Decisions ===== */}
        {tab === 'decisions' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">决策复盘</p>
              <p className="text-sm text-ink-500">不可变的决策快照与后续检查点。历史建议不可被覆盖。</p>
            </div>
            <div className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-500">
              暂无已保存的决策快照。
            </div>
          </div>
        )}

        {/* ===== Privacy ===== */}
        {tab === 'privacy' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">隐私中心</p>
              <p className="text-sm text-ink-500">每类数据的用途、留存与你的控制权。</p>
            </div>
            <div className="card overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-line bg-paper text-xs text-ink-500">
                  <th className="px-4 py-3 font-medium">数据类型</th><th className="px-4 py-3 font-medium">用途</th><th className="px-4 py-3 font-medium">留存</th><th className="px-4 py-3 font-medium">数量</th>
                </tr></thead>
                <tbody>
                  {[
                    { type: '结构化事件', usage: '推演输入', retention: '会话结束即删', count: '12 条' },
                    { type: '对话历史', usage: '多轮推演上下文', retention: '仅浏览器内存', count: '≤10 轮' },
                    { type: '推演结果', usage: '路径与行动建议', retention: '不持久化', count: '1 份' },
                    { type: '原始文件', usage: '从不离开设备', retention: '零上传', count: '0' },
                  ].map((r) => (
                    <tr key={r.type} className="border-b border-line last:border-b-0">
                      <td className="px-4 py-3 font-medium text-ink-800">{r.type}</td>
                      <td className="px-4 py-3 text-ink-600">{r.usage}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">{r.retention}</span></td>
                      <td className="px-4 py-3 text-ink-500">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <button type="button" className="rounded-full border border-line bg-surface px-4 py-2 text-xs font-medium text-ink-600 transition-all hover:border-brand-400 hover:text-brand-700 hover:shadow-sm active:scale-95">导出我的数据</button>
              <button type="button" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition-all hover:bg-red-100 active:scale-95">删除全部</button>
            </div>
            <p className="text-xs text-ink-400">生产失败绝不自动伪装成 Demo 成功。删除任务有状态、审计与明确 SLA。</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Helpers ===== */
function Section({ title, items, tone }: { title: string; items: string[]; tone?: string }) {
  return (
    <div><p className="eyebrow mb-1">{title}</p><ul className={`list-disc pl-4 text-xs ${tone ?? 'text-ink-700'}`}>{items.map((it, i) => <li key={i}>{it}</li>)}</ul></div>
  );
}



