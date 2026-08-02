import { Link } from 'react-router-dom';
import { useCookieAuth } from '../../shared/auth/AuthContext';
import { useNotifications, useEvidenceDocuments, useCredits } from '../../shared/api/hooks';
import { DonutChart } from '../../shared/components/charts/DonutChart';
import { TrendChart } from '../../shared/components/charts/TrendChart';
import { OnboardingGuide } from '../../shared/components/OnboardingGuide';
import { DailyCheckIn } from '../../shared/components/DailyCheckIn';


export function DashboardPage() {
  const { user } = useCookieAuth();
  const notifications = useNotifications();
  const evidence = useEvidenceDocuments();
  const credits = useCredits();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';
  const topAction = notifications.data?.[0];
  const evidenceCount = evidence.data?.length ?? 0;
  const processedCount = evidence.data?.filter((d) => d.status === 'processed').length ?? 0;

  // Mock trend data (will come from API later)
  const trendData = [0, 1, 1, 2, 2, 3, 3, 3, 4, 5, 5, 6];
  const trendLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const onboardingSteps = [
    { label: '上传第一份简历', done: evidenceCount > 0, to: '/app/documents' },
    { label: '确认技能标签', done: false, to: '/app/profile' },
    { label: '设定目标职业', done: false, to: '/app/career-map' },
    { label: '完成第一次行动', done: false, to: '/app/actions' },
  ];

  const hasError = notifications.isError || evidence.isError || credits.isError;

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {hasError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-700">部分数据加载失败，显示的可能不是最新状态。</p>
        </div>
      )}


      {/* Plan usage panel (AnySearch-style) */}
      <section className="rounded-xl border border-line bg-surface p-5 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-brand-50 px-2.5 text-[11px] font-semibold text-brand-700">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6.4-4.8L5.6 21.2 8 14 2 9.2h7.6z"/></svg>
              免费版
            </span>
            <span className="text-sm font-bold text-ink-900">{greeting}，{user?.display_name ?? '探索者'}</span>
          </div>
          <Link to="/app/subscription" className="text-xs font-medium text-brand-600 hover:text-brand-700">升级套餐</Link>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-600">本月积分用量</span>
            <span className="text-ink-400">剩余 {credits.data?.balance ?? '—'}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 via-accent-400 to-brand-500 transition-all duration-1000" style={{ width: '12%' }} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] text-ink-400">
              <span className="flex items-center gap-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>每日签到 +5</span>
              <span>已用 {Math.max(0, 100 - (credits.data?.balance ?? 100))} / 100</span>
            </div>
            <DailyCheckIn />
          </div>
        </div>
      </section>



      {/* === First row: Quick Start + Recommended Tasks (two columns) === */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Quick Start */}
        <div className="group rounded-xl border border-line bg-surface p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(196,85,59,0.06)] hover:border-brand-200 hover:-translate-y-0.5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </span>
            <h2 className="text-sm font-bold text-ink-900">快速开始</h2>
          </div>
          {evidence.isLoading ? (
            <div className="animate-pulse space-y-3"><div className="h-4 w-3/4 rounded bg-ink-100" /><div className="h-4 w-1/2 rounded bg-ink-100" /></div>
          ) : !evidence.data?.length ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-ink-500">上传一份简历，系统会自动提取你的技能和经历，生成专属职业画像。</p>
              <Link to="/app/documents" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(196,85,59,0.25)] hover:scale-[1.02] active:scale-95">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M12 4v16m8-8H4"/></svg>
                上传简历开始
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {evidence.data.slice(0, 3).map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-ink-50">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-50 text-[9px] font-bold text-brand-600">{doc.doc_type?.slice(0, 3).toUpperCase() ?? 'DOC'}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-700">{doc.filename}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${doc.status === 'processed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {doc.status === 'processed' ? '已解析' : '处理中'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Recommended Tasks */}
        <div className="group rounded-xl border border-line bg-surface p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(217,119,6,0.06)] hover:border-accent-200 hover:-translate-y-0.5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </span>
            <h2 className="text-sm font-bold text-ink-900">推荐任务</h2>
          </div>
          {notifications.isLoading ? (
            <div className="animate-pulse space-y-3"><div className="h-4 w-3/4 rounded bg-ink-100" /><div className="h-4 w-full rounded bg-ink-100" /></div>
          ) : topAction ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900">{topAction.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500 line-clamp-2">{topAction.body}</p>
                </div>
              </div>
              <Link to="/app/actions" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-accent-600 hover:shadow-[0_4px_12px_rgba(217,119,6,0.25)] hover:scale-[1.02] active:scale-95">
                开始行动
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M5 12h14m-6-6l6 6-6 6"/></svg>
              </Link>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-ink-400">完成档案后，系统会为你推荐下一步行动。</p>
          )}
        </div>
      </section>

      {/* Stats cards with stagger animation */}
      <section className="grid grid-cols-3 gap-3">
        <div className="animate-[slide-up_0.4s_ease_both] rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 ring-1 ring-brand-200/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-600" aria-hidden="true"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </span>
            <div><p className="text-lg font-bold text-ink-900">{credits.isLoading ? '—' : credits.data?.balance ?? 0}</p><p className="text-[10px] font-medium text-ink-400">积分</p></div>
          </div>
        </div>
        <div className="animate-[slide-up_0.5s_ease_both] rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-teal-50 ring-1 ring-teal-200/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-teal-600" aria-hidden="true"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </span>
            <div><p className="text-lg font-bold text-ink-900">{evidence.isLoading ? '—' : evidenceCount}</p><p className="text-[10px] font-medium text-ink-400">证据</p></div>
          </div>
        </div>
        <div className="animate-[slide-up_0.6s_ease_both] rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-100 to-accent-50 ring-1 ring-accent-200/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-accent-600" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </span>
            <div><p className="text-lg font-bold text-ink-900">{notifications.data?.length ?? 0}</p><p className="text-[10px] font-medium text-ink-400">推荐行动</p></div>
          </div>
        </div>
      </section>

      {/* Charts area */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line border-l-[3px] border-l-brand-400 bg-surface p-4 transition-all duration-300 hover:shadow-card hover:border-l-brand-500 hover:-translate-y-0.5">
          <div className="mb-2 flex items-center gap-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-500"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p className="text-sm font-semibold text-ink-800">证据完成度</p></div>
          <DonutChart value={processedCount} total={Math.max(evidenceCount, 1)} label="已解析 / 总上传" height={160} />
        </div>
        <div className="rounded-xl border border-line border-l-[3px] border-l-teal-400 bg-surface p-4 transition-all duration-300 hover:shadow-card hover:border-l-teal-500 hover:-translate-y-0.5">
          <div className="mb-2 flex items-center gap-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-teal-500"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg><p className="text-sm font-semibold text-ink-800">行动趋势</p></div>
          <TrendChart data={trendData} labels={trendLabels} height={160} />
        </div>
      </section>

      {/* Onboarding guide */}
      <OnboardingGuide steps={onboardingSteps} />

    </div>
  );
}
