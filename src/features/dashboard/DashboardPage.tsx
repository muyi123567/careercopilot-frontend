import { Link } from 'react-router-dom';
import { useCookieAuth } from '../../shared/auth/AuthContext';
import { useNotifications, useEvidenceDocuments, useCredits } from '../../shared/api/hooks';
import { DonutChart } from '../../shared/components/charts/DonutChart';
import { TrendChart } from '../../shared/components/charts/TrendChart';
import { OnboardingGuide } from '../../shared/components/OnboardingGuide';
import { DailyCheckIn } from '../../shared/components/DailyCheckIn';

function StatCard({ icon, value, label, sub }: { icon: string; value: string | number; label: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-accent-50 ring-1 ring-brand-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-accent-600" aria-hidden="true">
            <path d={icon} />
          </svg>
        </span>
        <div>
          <p className="text-lg font-bold text-ink-900">{value}</p>
          <p className="text-[10px] font-medium text-ink-400">{label}</p>
        </div>
      </div>
      {sub && <p className="mt-2 text-[10px] text-ink-400">{sub}</p>}
    </div>
  );
}

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
      <section className="rounded-xl border border-line bg-surface p-5">
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
            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-700" style={{ width: '12%' }} />
          </div>
          <div className="mt-2 flex items-center gap-4 text-[10px] text-ink-400">
            <span className="flex items-center gap-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>每日签到 +5</span>
            <span>已用 {Math.max(0, 100 - (credits.data?.balance ?? 100))} / 100</span>
          </div>
        </div>
      </section>

      {/* Daily check-in */}
      <DailyCheckIn />

      {/* Stats cards */}
      <section className="grid grid-cols-3 gap-3">
        <StatCard
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          value={credits.isLoading ? '—' : credits.data?.balance ?? 0}
          label="积分"
        />
        <StatCard
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          value={evidence.isLoading ? '—' : evidenceCount}
          label="证据"
          sub={processedCount > 0 ? `${processedCount} 份已解析` : undefined}
        />
        <StatCard
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          value={notifications.data?.length ?? 0}
          label="推荐行动"
        />
      </section>

      {/* Charts area */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line border-l-[3px] border-l-brand-400 bg-surface p-4 transition-all duration-200 hover:shadow-card hover:border-l-brand-500">
          <div className="mb-2 flex items-center gap-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-500"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p className="text-sm font-semibold text-ink-800">证据完成度</p></div>
          <DonutChart value={processedCount} total={Math.max(evidenceCount, 1)} label="已解析 / 总上传" height={160} />
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 transition-shadow duration-200 hover:shadow-card">
          <div className="mb-2 flex items-center gap-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-500"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg><p className="text-sm font-semibold text-ink-800">行动趋势</p></div>
          <TrendChart data={trendData} labels={trendLabels} height={160} />
        </div>
      </section>

      {/* Onboarding guide + Today's action */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OnboardingGuide steps={onboardingSteps} />

        {/* Today's #1 action */}
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="mb-3 text-sm font-semibold text-ink-800">今天最重要的一件事</p>
          {notifications.isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-3/4 rounded bg-ink-100" />
              <div className="h-3 w-full rounded bg-ink-100" />
            </div>
          ) : topAction ? (
            <div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-accent-600" aria-hidden="true">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900">{topAction.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500 line-clamp-2">{topAction.body}</p>
                </div>
              </div>
              <Link to="/app/actions" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-600">
                开始行动
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden="true"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>
              </Link>
            </div>
          ) : (
            <p className="text-sm text-ink-400">完成档案后，系统会为你推荐下一步行动。</p>
          )}
        </div>
      </section>

      {/* Recent evidence */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-800">快速开始</h2>
          <Link to="/app/profile/evidence" className="text-xs font-medium text-accent-600 hover:text-accent-700">证据台账</Link>
        </div>
        {evidence.isLoading ? (
          <div className="animate-pulse rounded-xl border border-line bg-surface p-4">
            <div className="h-4 w-1/2 rounded bg-ink-100" />
          </div>
        ) : !evidence.data?.length ? (
          <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-6 text-center">
            <p className="text-sm text-ink-500">上传一份简历，系统会自动提取你的技能和经历。</p>
            <Link to="/app/documents" className="mt-2 inline-block text-sm font-medium text-accent-600 hover:text-accent-700">上传简历开始</Link>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {evidence.data.slice(0, 3).map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-[10px] font-bold text-ink-500">
                  {doc.doc_type?.slice(0, 3).toUpperCase() ?? 'DOC'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-800">{doc.filename}</p>
                  <p className="text-xs text-ink-400">{new Date(doc.uploaded_at).toLocaleDateString('zh-CN')}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  doc.status === 'processed' ? 'bg-success-50 text-success-600' : 'bg-accent-50 text-accent-600'
                }`}>
                  {doc.status === 'processed' ? '已解析' : '处理中'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
