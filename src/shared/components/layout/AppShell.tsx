import { NavLink, Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '../../auth/session';

const STEPS = [
  { to: '/workspace', label: '推演工作台', num: '01' },
  { to: '/results', label: '分析结果', num: '02' },
];

export function AppShell() {
  const { mode } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="visually-hidden focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">跳到主内容</a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="display text-lg font-semibold transition-colors hover:text-brand-700">CareerCopilot</Link>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${mode === 'demo' ? 'bg-amber-50 text-amber-700' : 'bg-brand-50 text-brand-700'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${mode === 'demo' ? 'bg-amber-500' : 'bg-brand-500'}`} />
              {mode === 'demo' ? '演示' : '已登录'}
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
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${isActive ? 'bg-brand-700 text-white shadow-sm' : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700'}`}>
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
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-5 text-center text-xs text-ink-400">
        CareerCopilot · 证据优先 · 不展示未经校准的成功率
      </footer>
    </div>
  );
}
