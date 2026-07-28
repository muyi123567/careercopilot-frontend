import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../shared/state/navigation';
import { PathTypeChip, UncertaintyPill, ClassificationTag } from '../../shared/components/ui/Badge';
import { CoverageBadge } from '../../shared/components/provenance/CoverageBadge';
import { DataInsufficientState, ErrorState, LoadingState } from '../../shared/components/states/FeedbackStates';
import { evidenceDimensions } from '../../shared/api/labels';


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

/* ===== Demo Dataset (契约驱动 mock，后端就绪后切换 apiBase 即可对接) ===== */
const DEMO_PATHS = [
  {
    path_id: 'p1', path_type: 'deepen' as const,
    target: '高级后端工程师', summary: '在当前技术栈上纵深发展，补齐分布式系统和架构设计能力。',
    uncertainty: 'medium' as const,
    benefits: ['薪资涨幅可预期（20-40%）', '已有经验直接复用', '团队内晋升通道清晰'],
    costs: ['天花板可能在 3-5 年后出现', '技术栈单一化风险', '需要持续跟进技术演进'],
    counterevidence: ['部分公司高级岗要求管理经验', '纯技术路线在国内晋升空间有限'],
    gaps: ['分布式系统设计', '大规模数据治理', '技术影响力建设'],
    actions: [
      { id: 'a1', title: '主导一个分布式改造项目', signal: '能独立完成技术方案评审', days: 30 },
      { id: 'a2', title: '在团队内做一次技术分享', signal: '获得同事正面反馈', days: 14 },
    ],
    sources: ['脉脉职言 2025 后端薪资报告', '拉勾网高级后端 JD 分析（n=342）'],
  },
  {
    path_id: 'p2', path_type: 'adjacent' as const,
    target: '技术产品经理', summary: '利用技术背景转向产品岗，补齐产品判断力和用户研究能力。',
    uncertainty: 'high' as const,
    benefits: ['技术背景是差异化优势', '产品岗薪资天花板更高', '跨领域复合能力稀缺'],
    costs: ['需要 6-12 个月转型期', '初期可能降薪', '需要重建专业人脉'],
    counterevidence: ['技术转产品成功率约 30-40%', '部分 PM 岗位不要求技术背景', '转型期心理压力较大'],
    gaps: ['产品需求分析方法论', '用户研究实操', '商业思维与 ROI 评估'],
    actions: [
      { id: 'a3', title: '完成一个完整的需求闭环', signal: '独立从 0 到 1 交付一个功能', days: 45 },
      { id: 'a4', title: '做 2 次信息访谈', signal: '确认产品岗日常是否匹配预期', days: 14 },
    ],
    sources: ['Boss 直聘技术 PM 岗位分析（n=128）', '在行专家访谈记录'],
  },
  {
    path_id: 'p3', path_type: 'explore' as const,
    target: '独立开发者 / 自由职业', summary: '利用技术能力直接面向市场，探索产品化或咨询模式。',
    uncertainty: 'very_high' as const,
    benefits: ['完全自主的时间和方向', '收入无上限', '直接面对市场反馈'],
    costs: ['收入不稳定（前 6-12 个月）', '需要自律和时间管理', '缺乏团队支持和社保'],
    counterevidence: ['独立开发者 3 年存活率约 15%', '需要同时具备产品+营销+技术能力', '心理压力和社会压力较大'],
    gaps: ['产品化思维', '营销和获客能力', '财务规划和风险缓冲'],
    actions: [
      { id: 'a5', title: '用 2 周做一个最小可行产品', signal: '有 10 个真实用户使用', days: 14 },
      { id: 'a6', title: '在社交平台发布 3 篇技术内容', signal: '获得 50+ 互动', days: 21 },
    ],
    sources: ['IndieHackers 社区案例', '即刻独立开发者社群调研'],
  },
];

const DEMO_EVIDENCE = [
  { id: 'e1', grade: 'A' as const, classification: 'fact' as const, uncertainty: 'low' as const, claim: '你有 2 年后端开发经验，熟悉 Python 和分布式系统基础。', source: '简历结构化提取', confirmed: null as string | null },
  { id: 'e2', grade: 'B' as const, classification: 'inference' as const, uncertainty: 'medium' as const, claim: '你的系统思维能力可以迁移到产品判断中。', source: '职业路径模型推断', confirmed: null as string | null },
  { id: 'e3', grade: 'C' as const, classification: 'inference' as const, uncertainty: 'high' as const, claim: '技术转产品的成功率约为 30-40%。', source: '脉脉社区统计（样本量有限）', confirmed: null as string | null },
  { id: 'e4', grade: 'D' as const, classification: 'recommendation' as const, uncertainty: 'very_high' as const, claim: '独立开发者 3 年存活率约 15%。', source: 'IndieHackers 社区（非中国样本）', confirmed: null as string | null },
  { id: 'e5', grade: 'U' as const, classification: 'fact' as const, uncertainty: 'unknown' as const, claim: '你所在城市的技术 PM 岗位供需比。', source: '数据缺失 — 需要地域化数据源', confirmed: null as string | null },
];

const DEMO_DECISIONS = [
  { id: 'd1', day: '第 0 天', event: '选择「邻近迁移：后端→技术PM」作为主探索路径', reason: '系统思维可迁移，时间成本适中', status: 'locked' as const },
  { id: 'd2', day: '第 7 天', event: '完成 2 次信息访谈', reason: '验证产品岗日常是否匹配预期', status: 'pending' as const },
  { id: 'd3', day: '第 30 天', event: '提交一个需求闭环作品', reason: '证明「从 0 到 1」的判断力', status: 'pending' as const },
  { id: 'd4', day: '第 90 天', event: '回填结果与新证据', reason: '重估路径判断，更新置信维度', status: 'pending' as const },
];

const DEMO_RADAR = [
  { skill: '产品需求分析', demand: 82, growth: '+12%', region: '一线' },
  { skill: '数据驱动决策', demand: 74, growth: '+18%', region: '全国' },
  { skill: '用户研究', demand: 68, growth: '+8%', region: '新一线' },
  { skill: '项目管理', demand: 91, growth: '+5%', region: '全国' },
  { skill: 'SQL/数据查询', demand: 77, growth: '+9%', region: '一线' },
  { skill: 'A/B 测试', demand: 63, growth: '+22%', region: '一线' },
];

/* ===== Grade Colors ===== */
const gradeColors: Record<string, string> = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-sky-50 text-sky-700 border-sky-200',
  C: 'bg-amber-50 text-amber-700 border-amber-200',
  D: 'bg-red-50 text-red-700 border-red-200',
  U: 'bg-ink-900/5 text-ink-500 border-line',
};

export function ResultsPage() {
  const navigate = useNavigate();
  const { phase, response, error } = useNavigation();
  const [tab, setTab] = useState<Tab>('overview');
  const [confirmations, setConfirmations] = useState<Record<string, string>>({});
  const [useDemo, setUseDemo] = useState(true);

  if (phase === 'loading') return <LoadingState />;
  if (phase === 'error') return <ErrorState message={error ?? '无法读取本次职业导航结果'} onBack={() => navigate('/workspace')} />;
  if (response?.status === 'service_failure' && response.error) return <ErrorState message={response.error.message} requestId={response.error.trace_id} onBack={() => navigate('/workspace')} />;
  if (response?.status === 'data_insufficient') return <DataInsufficientState gaps={response.data?.coverage_gaps ?? []} />;

  const hasLiveData = response && response.status === 'ok' && response.data;
  const showDemo = useDemo && !hasLiveData;

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
          {showDemo && (
            <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-600 border border-gold-100">演示数据</span>
          )}
          <button type="button" onClick={() => setUseDemo(!useDemo)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${useDemo ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-ink-900/5 text-ink-500 border border-line'}`}>
            {useDemo ? '演示模式' : '实时数据'}
          </button>
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
                <p className="display mt-1 text-3xl font-bold text-brand-800">{showDemo ? DEMO_PATHS.length : (hasLiveData ? response.data!.paths.length : 0)}</p>
              </div>
              <div className="card relative overflow-hidden p-5">
                <span className="absolute left-0 top-0 h-full w-1 bg-teal-500" />
                <p className="eyebrow">证据条目</p>
                <p className="display mt-1 text-3xl font-bold text-teal-700">{showDemo ? DEMO_EVIDENCE.length : (hasLiveData ? response.data!.evidence.length : 0)}</p>
              </div>
              <div className="card relative overflow-hidden p-5">
                <span className="absolute left-0 top-0 h-full w-1 bg-gold-500" />
                <p className="eyebrow">数据覆盖</p>
                <p className="display mt-1 text-3xl font-bold text-gold-600">{showDemo ? '1 缺口' : (hasLiveData ? (response.data!.coverage_gaps.length === 0 ? '完整' : `${response.data!.coverage_gaps.length} 缺口`) : '—')}</p>
              </div>
            </div>

            {/* Path cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {(showDemo ? DEMO_PATHS : []).map((p) => (
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
            {(showDemo ? DEMO_PATHS : []).map((p) => (
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
            {(showDemo ? DEMO_PATHS : []).map((p) => (
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
            {(showDemo ? DEMO_EVIDENCE : []).map((e) => {
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
            {(showDemo ? DEMO_PATHS.flatMap(p => p.actions.map(a => ({ ...a, pathType: p.path_type, target: p.target }))) : []).map((a) => (
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
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">中文职业市场雷达</p>
              <p className="text-sm text-ink-500">技能需求热度与增长趋势（演示数据，非实时抓取）</p>
            </div>
            <div className="card p-5">
              <div className="space-y-3">
                {(showDemo ? DEMO_RADAR : []).map((r) => (
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
            <p className="text-xs text-ink-400">数据为演示用途。真实版本将标注来源、样本量与截止时间。市场热度不等于个人适合度。</p>
          </div>
        )}

        {/* ===== Decisions ===== */}
        {tab === 'decisions' && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="eyebrow mb-1">决策复盘</p>
              <p className="text-sm text-ink-500">不可变的决策快照与后续检查点。历史建议不可被覆盖。</p>
            </div>
            <div className="relative space-y-0 pl-6">
              <span className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(33,29,26,0.16)_0_5px,transparent_5px_10px)]" />
              {(showDemo ? DEMO_DECISIONS : []).map((d) => (
                <div key={d.id} className="relative pb-6 last:pb-0">
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



