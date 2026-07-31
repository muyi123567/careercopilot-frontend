import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCookieAuth } from '../../auth/AuthContext';
import { useCredits } from '../../api/hooks';

// --- Navigation data (grouped for sidebar) ---

const NAV_GROUPS = [
  {
    label: '核心',
    items: [
      { to: '/app', label: '工作台', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
      { to: '/app/career-map', label: '职业地图', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', end: false },
      { to: '/app/profile/evidence', label: '证据台账', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', end: false },
    ],
  },
  {
    label: '行动',
    items: [
      { to: '/app/actions', label: '行动实验', icon: 'M13 10V3L4 14h7v7l9-11h-7z', end: false },
      { to: '/app/decisions', label: '决策记录', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', end: false },
      { to: '/app/radar', label: '市场雷达', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', end: false },
    ],
  },
  {
    label: '管理',
    items: [
      { to: '/app/documents', label: '文档管理', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', end: false },
      { to: '/app/profile', label: '我的档案', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', end: false },
      { to: '/app/settings', label: '设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', end: false },
    ],
  },
];

// Mobile bottom tabs (4 items + center action)
const TAB_LEFT = [
  { to: '/app', label: '工作台', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/app/career-map', label: '地图', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', end: false },
];
const TAB_RIGHT = [
  { to: '/app/profile/evidence', label: '证据', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', end: false },
  { to: '/app/profile', label: '我的', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', end: false },
];

function NavIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'h-5 w-5'} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function AppShell() {
  const { user, logout } = useCookieAuth();
  const { data: credits } = useCredits();
  const location = useLocation();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const currentLabel = location.pathname === '/app'
    ? '工作台'
    : allItems.find((i) => i.to === location.pathname)?.label ?? '';

  return (
    <div className="flex min-h-[100dvh] bg-paper">
      {/* === Desktop sidebar === */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-14 items-center border-b border-line px-5">
          <Link to="/app" className="text-[15px] font-bold tracking-tight text-ink-900">
            见微<span className="text-accent-500">行远</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="主导航">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="mx-3 my-3 border-t border-line" />}
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-300">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                        isActive
                          ? 'font-semibold text-ink-900'
                          : 'font-medium text-ink-500 hover:bg-ink-100/60 hover:text-ink-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent-500" />
                        )}
                        <NavIcon d={item.icon} className="h-[18px] w-[18px] shrink-0" />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <p className="truncate text-xs font-medium text-ink-600">{user?.display_name ?? '用户'}</p>
          <button
            onClick={() => void logout()}
            className="mt-1 text-xs text-ink-400 underline-offset-2 transition-colors hover:text-ink-700 hover:underline"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* === Main content === */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/app" className="text-sm font-bold text-ink-900">
              见微<span className="text-accent-500">行远</span>
            </Link>
          </div>
          <div className="hidden items-center lg:flex">
            <span className="text-sm font-medium text-ink-600">{currentLabel}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Credits */}
            <Link
              to="/app/settings"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700 transition-colors hover:bg-accent-100"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {credits?.balance ?? 0}
            </Link>

            {/* Notification bell */}
            <button
              onClick={() => navigate('/app/actions')}
              className="relative rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              aria-label="通知"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-medium text-white" aria-hidden="true">
              {(user?.display_name ?? 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content with transition */}
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          <div key={location.pathname} className="mx-auto max-w-4xl animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>

      {/* === Mobile bottom tab bar (4+1) === */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-sm lg:hidden" aria-label="底部导航">
        <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-1.5 pt-1">
          {TAB_LEFT.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-accent-600' : 'text-ink-400'
                }`
              }
            >
              <NavIcon d={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}

          {/* Center + button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="relative -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white shadow-lift transition-transform active:scale-95"
            aria-label="快速操作"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path d="M12 5v14m-7-7h14" />
            </svg>
          </button>

          {TAB_RIGHT.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-accent-600' : 'text-ink-400'
                }`
              }
            >
              <NavIcon d={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* === Action Sheet (mobile + button) === */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="快速操作">
          <div className="absolute inset-0 bg-scrim" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] animate-slide-up">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-200" />
            <p className="mb-3 text-sm font-semibold text-ink-800">快速操作</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => { setSheetOpen(false); navigate('/app/documents'); }} className="flex flex-col items-center gap-2 rounded-xl border border-line p-4 transition-colors hover:bg-ink-100/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-600"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <span className="text-xs text-ink-600">上传证据</span>
              </button>
              <button onClick={() => { setSheetOpen(false); navigate('/app/actions'); }} className="flex flex-col items-center gap-2 rounded-xl border border-line p-4 transition-colors hover:bg-ink-100/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-600"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="text-xs text-ink-600">记录行动</span>
              </button>
              <button onClick={() => { setSheetOpen(false); navigate('/app/decisions'); }} className="flex flex-col items-center gap-2 rounded-xl border border-line p-4 transition-colors hover:bg-ink-100/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-ink-600"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <span className="text-xs text-ink-600">写决策</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
