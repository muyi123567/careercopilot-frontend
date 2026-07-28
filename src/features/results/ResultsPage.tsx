import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../shared/state/navigation';
import { useAuth } from '../../shared/auth/session';
import { StatusPill, PathTypeChip, UncertaintyPill, EvidenceGradeBadge, ClassificationTag } from '../../shared/components/ui/Badge';
import { CoverageBadge } from '../../shared/components/provenance/CoverageBadge';
import { SourceList } from '../../shared/components/provenance/SourceList';
import { Button } from '../../shared/components/ui/Button';
import { evidenceDimensions } from '../../shared/api/labels';
import type { Source, UserConfirmation } from '../../shared/api/contract';

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

/* ===== Mock data for radar/decisions/privacy ===== */
const RADAR_DATA = [
  { skill: '产品需求分析', demand: 82, growth: '+12%', region: '一线' },
  { skill: '数据驱动决策', demand: 74, growth: '+18%', region: '全国' },
  { skill: '用户研究', demand: 68, growth: '+8%', region: '新一线' },
  { skill: '项目管理', demand: 91, growth: '+5%', region: '全国' },
  { skill: 'SQL/数据查询', demand: 77, growth: '+9%', region: '一线' },
];

const DECISION_TIMELINE = [
  { day: '第 0 天', event: '选择「邻近迁移：后端→产品」路径', reason: '系统思维可迁移，时间成本最低', status: 'locked' },
  { day: '第 7 天', event: '完成一次信息访谈', reason: '验证产品岗日常是否匹配预期', status: 'pending' },
  { day: '第 30 天', event: '提交一个需求闭环作品', reason: '证明「从 0 到 1」的判断力', status: 'pending' },
  { day: '第 90 天', event: '回填结果与新证据', reason: '重估路径判断，更新置信维度', status: 'pending' },
];

const PRIVACY_DATA = [
  { category: '结构化事件', usage: '本次推演输入', retention: '会话结束即删', count: '12 条' },
  { category: '对话历史', usage: '多轮推演上下文', retention: '仅浏览器内存', count: '≤10 轮' },
  { category: '推演结果', usage: '路径与行动建议', retention: '不持久化', count: '1 份' },
  { category: '原始文件', usage: '从不离开设备', retention: '零上传', count: '0' },
];

export function ResultsPage() {
  const navigate = useNavigate();
  const { phase, response } = useNavigation();
  const { mode } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmations, setConfirmations] = useState<Record<string, UserConfirmation>>({});

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
                  <h3 className="text-lg font-semibold text-ink-700">还没有分析数据</h3>
                  <p className="mt-1 text-sm text-ink-500">去工作台运行一次推演，结果会在这里展开。</p>
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

        {/* Radar (mock) */}
        {tab === 'radar' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">中文职业市场雷达</p>
              <p className="text-sm text-ink-500">技能需求热度与增长（合成演示数据，非实时抓取）</p>
            </div>
            <div className="card p-5">
              <div className="space-y-3">
                {RADAR_DATA.map((r) => (
                  <div key={r.skill} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-xs font-medium text-ink-700">{r.skill}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded-full bg-ink-900/5">
                      <div className="flex h-full items-center rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-2 transition-all duration-700" style={{ width: `${r.demand}%` }}>
                        <span className="text-[10px] font-bold text-white">{r.demand}</span>
                      </div>
                    </div>
                    <span className="w-12 text-right text-xs font-semibold text-teal-600">{r.growth}</span>
                    <span className="w-12 text-right text-[10px] text-ink-400">{r.region}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-ink-400">数据为合成演示。真实版本将标注来源、样本量与截止时间。市场热度不等于个人适合度。</p>
          </div>
        )}

        {/* Decisions (mock) */}
        {tab === 'decisions' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">决策复盘</p>
              <p className="text-sm text-ink-500">不可变的决策快照与后续检查点。历史建议不可被覆盖。</p>
            </div>
            <div className="relative space-y-0 pl-6">
              <span className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(33,29,26,0.16)_0_5px,transparent_5px_10px)]" />
              {DECISION_TIMELINE.map((d, i) => (
                <div key={i} className="relative pb-6 last:pb-0">
                  <span className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] ${d.status === 'locked' ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-surface text-ink-400'}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <div className="card ml-2 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-700">{d.day}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${d.status === 'locked' ? 'bg-brand-50 text-brand-700' : 'bg-ink-900/5 text-ink-400'}`}>{d.status === 'locked' ? '已锁定' : '待回填'}</span>
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-ink-800">{d.event}</h4>
                    <p className="mt-0.5 text-xs text-ink-500">{d.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy (mock) */}
        {tab === 'privacy' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">隐私中心</p>
              <p className="text-sm text-ink-500">每类数据的用途、留存与你的控制权。</p>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-line bg-paper text-xs text-ink-500">
                  <th className="px-4 py-3 font-medium">数据类型</th><th className="px-4 py-3 font-medium">用途</th><th className="px-4 py-3 font-medium">留存</th><th className="px-4 py-3 font-medium">数量</th>
                </tr></thead>
                <tbody>
                  {PRIVACY_DATA.map((r) => (
                    <tr key={r.category} className="border-b border-line last:border-b-0">
                      <td className="px-4 py-3 font-medium text-ink-800">{r.category}</td>
                      <td className="px-4 py-3 text-ink-600">{r.usage}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">{r.retention}</span></td>
                      <td className="px-4 py-3 text-ink-500">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <button type="button" className="rounded-full border border-line bg-surface px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700">导出我的数据</button>
              <button type="button" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100">删除全部</button>
            </div>
            <p className="text-xs text-ink-400">生产失败绝不自动伪装成 Demo 成功。删除任务有状态、审计与明确 SLA。</p>
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

function Section({ title, items, tone }: { title: string; items: string[]; tone?: string }) {
  return (
    <div><p className="eyebrow mb-1">{title}</p><ul className={`list-disc pl-4 text-xs ${tone ?? 'text-ink-700'}`}>{items.map((it, i) => <li key={i}>{it}</li>)}</ul></div>
  );
}
