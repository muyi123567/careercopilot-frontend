import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function NotFoundPage() {
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)] px-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(212,85,59,0.08),transparent_70%)]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(62,142,107,0.06),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-line bg-white/80 shadow-[0_8px_32px_-8px_rgba(33,29,26,0.10)] backdrop-blur-sm">
            {isOffline ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-ink-400">
                <path d="M1 1l22 22" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.56 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><path d="M12 20h.01" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-brand-400">
                <circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" />
              </svg>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 shadow-sm">
            {isOffline ? '!' : '?'}
          </span>
        </div>

        {/* Content */}
        {isOffline ? (
          <>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">网络已断开</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
              当前设备没有网络连接。见微行远 EvidWay 的核心推演功能需要网络支持。请检查网络设置后重试。
            </p>
            <div className="mt-4 rounded-xl border border-line bg-white/60 px-4 py-3 text-xs text-ink-400">
              提示：已加载的页面内容仍可浏览，但新的推演请求无法完成。
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-7xl font-bold tracking-tighter text-brand-700/90">404</h1>
            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink-800">页面未找到</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
              你访问的路径不存在。可能是链接已失效，或者页面已被移动。
            </p>
          </>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(181,71,46,0.4)] transition-all duration-300 hover:-translate-y-px hover:bg-brand-800 hover:shadow-[0_8px_24px_-6px_rgba(181,71,46,0.5)] active:scale-95">
            返回首页
          </Link>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-6 py-2.5 text-sm font-medium text-ink-600 backdrop-blur-sm transition-all duration-200 hover:border-brand-300 hover:text-brand-700 active:scale-95">
            返回上一页
          </button>
          {isOffline && (
            <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-6 py-2.5 text-sm font-medium text-ink-600 backdrop-blur-sm transition-all duration-200 hover:border-teal-600/40 hover:text-teal-700 active:scale-95">
              重试连接
            </button>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-400">
          <Link to="/workspace" className="transition-colors hover:text-brand-700">推演工作台</Link>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <Link to="/results" className="transition-colors hover:text-brand-700">分析结果</Link>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <Link to="/profile" className="transition-colors hover:text-brand-700">记忆画像</Link>
        </div>
      </div>
    </div>
  );
}


