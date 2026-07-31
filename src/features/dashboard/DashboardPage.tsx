import { Link } from 'react-router-dom';
import { useCookieAuth } from '../../shared/auth/AuthContext';
import { useNotifications, useEvidenceDocuments, useCredits } from '../../shared/api/hooks';

function SkeletonBlock({ lines = 2 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2 rounded-xl border border-line bg-surface p-4">
      <div className="h-3 w-20 rounded bg-ink-200" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 rounded bg-ink-100 ${i === 0 ? 'w-full' : 'w-2/3'}`} />
      ))}
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

  return (
    <div className="space-y-6">
      {/* Welcome + goal guidance */}
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
          {greeting}，{user?.display_name ?? '探索者'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">从真实轨迹，看清下一程</p>
        {/* Goal not set -> guidance card */}
        <div className="mt-4 rounded-xl border border-dashed border-line p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5 text-accent-600" aria-hidden="true">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-800">设定目标职业，获得个性化推荐</p>
              <p className="mt-0.5 text-xs text-ink-400">还没有目标？没关系，先看看地图找找方向。</p>
            </div>
            <Link to="/app/career-map" className="shrink-0 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-700">
              去看看
            </Link>
          </div>
        </div>
      </section>

      {/* Today's #1 action */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-800">今天最重要的一件事</h2>
        {notifications.isLoading ? (
          <SkeletonBlock lines={2} />
        ) : notifications.isError ? (
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm text-ink-500">暂时无法获取推荐，不影响其他操作。</p>
          </div>
        ) : topAction ? (
          <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-accent-600" aria-hidden="true">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">{topAction.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{topAction.body}</p>
                <Link
                  to="/app/actions"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-600"
                >
                  开始行动
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M5 12h14m-6-6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line p-6 text-center">
            <p className="text-sm text-ink-500">完成档案后，系统会为你推荐下一步行动。</p>
            <Link to="/app/documents" className="mt-2 inline-block text-sm font-medium text-accent-600 hover:text-accent-700">
              上传简历开始
            </Link>
          </div>
        )}
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <p className="text-lg font-bold text-ink-900">{credits.isLoading ? '—' : credits.data?.balance ?? 0}</p>
          <p className="text-[10px] font-medium text-ink-400">积分</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <p className="text-lg font-bold text-ink-900">{evidence.isLoading ? '—' : evidence.data?.length ?? 0}</p>
          <p className="text-[10px] font-medium text-ink-400">证据</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <p className="text-lg font-bold text-ink-900">—</p>
          <p className="text-[10px] font-medium text-ink-400">连续天数</p>
        </div>
      </section>

      {/* Recent evidence */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-800">最近证据</h2>
          <Link to="/app/profile/evidence" className="text-xs font-medium text-accent-600 hover:text-accent-700">
            证据台账
          </Link>
        </div>
        {evidence.isLoading ? (
          <SkeletonBlock lines={3} />
        ) : evidence.isError ? (
          <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-500">加载失败，请稍后重试。</p>
        ) : !evidence.data?.length ? (
          <div className="rounded-xl border border-dashed border-line p-6 text-center">
            <p className="text-sm text-ink-500">还没有证据，没关系 — 从一份简历开始就够了。</p>
            <Link to="/app/documents" className="mt-2 inline-block text-sm font-medium text-accent-600 hover:text-accent-700">
              上传第一份文档
            </Link>
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

      {/* More actions link */}
      {notifications.data && notifications.data.length > 1 && (
        <div className="text-center">
          <Link to="/app/actions" className="text-xs font-medium text-ink-400 underline-offset-2 hover:text-ink-700 hover:underline">
            还有 {notifications.data.length - 1} 条推荐行动
          </Link>
        </div>
      )}
    </div>
  );
}
