import { Link } from 'react-router';

function ErrorLayout({ code, title, desc, children }: { code: string; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="relative mb-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-200/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-brand-500" aria-hidden="true">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </span>
        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-gold-400/80" />
      </div>
      <p className="bg-gradient-to-b from-brand-500 to-brand-700 bg-clip-text text-6xl font-bold tracking-tighter text-transparent">{code}</p>
      <h1 className="mt-3 text-xl font-bold text-ink-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function ForbiddenPage() {
  return (
    <ErrorLayout code="403" title="无权访问" desc="你没有权限访问该页面。如果需要访问，请联系管理员。">
      <Link to="/app" className="inline-block rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(196,85,59,0.25)] hover:scale-[1.02] active:scale-95">返回工作台</Link>
    </ErrorLayout>
  );
}

export function RateLimitedPage() {
  return (
    <ErrorLayout code="429" title="请求过于频繁" desc="你发送了太多请求，请稍等片刻后再试。">
      <button onClick={() => window.location.reload()} className="inline-block rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(196,85,59,0.25)] hover:scale-[1.02] active:scale-95">重试</button>
    </ErrorLayout>
  );
}

export function ServiceUnavailablePage() {
  return (
    <ErrorLayout code="503" title="服务暂时不可用" desc="服务器正在维护或暂时无法处理请求，请稍后再试。">
      <button onClick={() => window.location.reload()} className="inline-block rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(196,85,59,0.25)] hover:scale-[1.02] active:scale-95">重试</button>
    </ErrorLayout>
  );
}
