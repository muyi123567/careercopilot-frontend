import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/session';

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/map', label: '职业地图' },
  { to: '/compare', label: '路径比较' },
  { to: '/evidence', label: '证据账本' },
  { to: '/actions', label: '行动' },
  { to: '/radar', label: '市场雷达' },
  { to: '/decisions', label: '决策复盘' },
  { to: '/settings/privacy', label: '隐私' },
];

export function AppShell() {
  const { mode } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="visually-hidden focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        跳到主内容
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2.5">
              <span className="display text-xl font-semibold">CareerCopilot</span>
              <span className="eyebrow hidden sm:inline">职业路径参照系</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                mode === 'demo'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-brand-50 text-brand-700'
              }`}
              title={mode === 'demo' ? '只读演示：不读取/保存个人画像' : '已登录：令牌由服务端签发'}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${mode === 'demo' ? 'bg-amber-500' : 'bg-brand-500'}`} aria-hidden="true" />
              {mode === 'demo' ? '只读演示' : '已登录'}
            </span>
          </div>
          <nav aria-label="主导航" className="-mx-1 overflow-x-auto">
            <ul className="flex gap-1 whitespace-nowrap">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `relative inline-block px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-brand-700'
                          : 'text-ink-600 hover:text-ink-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600 transition-transform duration-200 ease-out-quart ${
                            isActive ? 'scale-x-100' : 'scale-x-0'
                          }`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-ink-400">
        CareerCopilot · V2 Evidence-first · 不展示未经校准的成功率
      </footer>
    </div>
  );
}
