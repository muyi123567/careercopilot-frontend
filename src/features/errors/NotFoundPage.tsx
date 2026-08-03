import { Link, useNavigate } from 'react-router';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="relative mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16 text-ink-300" aria-hidden="true">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>

      <h1 className="text-6xl font-bold tracking-tighter text-ink-900">404</h1>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink-800">页面未找到</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        你访问的页面不存在或已被移动。
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700">
          返回首页
        </Link>
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-line px-6 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100/50">
          返回上页
        </button>
      </div>

      <div className="mt-12 flex gap-6 text-xs text-ink-400">
        <Link to="/app" className="transition-colors hover:text-ink-700">工作台</Link>
        <Link to="/app/career-map" className="transition-colors hover:text-ink-700">职业地图</Link>
        <Link to="/app/profile" className="transition-colors hover:text-ink-700">我的档案</Link>
      </div>
    </div>
  );
}
