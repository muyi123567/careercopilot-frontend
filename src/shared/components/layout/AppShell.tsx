import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';

const STEPS = [
  { to: '/workspace', label: '推演工作台', num: '01' },
  { to: '/results', label: '分析结果', num: '02' },
];

export function AppShell() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="visually-hidden focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">跳到主内容</a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md shadow-[0_1px_8px_-4px_rgba(33,29,26,0.06)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-lg font-bold tracking-tight text-ink-900 transition-colors hover:text-brand-700">见微<b className="text-brand-700">行远</b></Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              临时会话
            </span>
          </div>

          {/* Step navigation */}
          <nav aria-label="流程导航" className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const isActive = location.pathname === s.to;
              return (
                <div key={s.to} className="flex items-center">
                  {i > 0 && <span className="mx-1 h-px w-6 bg-line" />}
                  <NavLink to={s.to}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300 active:scale-[0.95] ${isActive ? 'bg-brand-700 text-white shadow-[0_2px_12px_-4px_rgba(181,71,46,0.4)]' : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm'}`}>
                    <span className={`font-display text-xs font-bold ${isActive ? 'text-white/70' : 'text-brand-600'}`}>{s.num}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </NavLink>
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main id="main" className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Subtle dot-grid background for functional pages */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4]" style={{backgroundImage: 'radial-gradient(circle, rgba(33,29,26,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px'}} aria-hidden="true" />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-line/50 py-6 text-center text-[11px] text-ink-300">
        见微行远 EvidWay · 从真实轨迹，看清下一程
      </footer>
    </div>
  );
}


