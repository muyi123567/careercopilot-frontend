import { Link } from 'react-router';

function ErrorLayout({ code, title, desc, children }: { code: string; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="text-6xl font-bold tracking-tighter text-ink-200">{code}</p>
      <h1 className="mt-4 text-xl font-bold text-ink-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function ForbiddenPage() {
  return (
    <ErrorLayout code="403" title="无权访问" desc="你没有权限访问该页面。如果需要访问，请联系管理员。">
      <Link to="/app" className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700">返回工作台</Link>
    </ErrorLayout>
  );
}

export function RateLimitedPage() {
  return (
    <ErrorLayout code="429" title="请求过于频繁" desc="你发送了太多请求，请稍等片刻后再试。">
      <button onClick={() => window.location.reload()} className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700">重试</button>
    </ErrorLayout>
  );
}

export function ServiceUnavailablePage() {
  return (
    <ErrorLayout code="503" title="服务暂时不可用" desc="服务器正在维护或暂时无法处理请求，请稍后再试。">
      <button onClick={() => window.location.reload()} className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700">重试</button>
    </ErrorLayout>
  );
}
