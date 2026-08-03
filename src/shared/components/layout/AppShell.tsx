import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useCookieAuth } from '../../auth/AuthContext';
import { useCredits, useUnreadCount } from '../../api/hooks';
import { CommandPalette } from '../CommandPalette';
import { AlertDialog } from '../ui/AlertDialog';

const CompassIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size ?? 20} height={size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);

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
      { to: '/app/paths/new', label: '路径分析', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', end: false },
    ],
  },
  {
    label: '管理',
    items: [
      { to: '/app/documents', label: '文档管理', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', end: false },
      { to: '/app/profile', label: '我的档案', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', end: false },
      { to: '/app/assistant', label: '导航问答', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2h-5l-5 5v-5z', end: false },
      { to: '/app/memory', label: '记忆管理', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', end: false },
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

/* User dropdown menu */
function UserMenu() {
  const { user, logout } = useCookieAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const menuItems = [
    { label: '概览', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', to: '/app' },
    { label: '我的档案', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', to: '/app/profile' },
    { label: '设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', to: '/app/settings' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-ink-100/60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-[10px] font-medium text-white">
          {(user?.display_name ?? 'U').charAt(0).toUpperCase()}
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-3.5 w-3.5 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border border-line bg-surface py-1.5 shadow-lift animate-slide-up" role="menu">
          {menuItems.map((item) => (
            <button
              key={item.to}
              role="menuitem"
              onClick={() => { setOpen(false); navigate(item.to); }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-ink-700 transition-colors hover:bg-ink-100/50"
            >
              <NavIcon d={item.icon} className="h-4 w-4 text-ink-400" />
              {item.label}
            </button>
          ))}
          <div className="mx-3 my-1.5 border-t border-line" />
          <button
            role="menuitem"
            onClick={() => { setOpen(false); setLogoutOpen(true); }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <NavIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-4 w-4" />
            退出登录
          </button>
        </div>
      )}

      <AlertDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => void logout()}
        title="退出登录"
        description="确定要退出当前账户吗？"
        confirmLabel="退出"
        variant="danger"
      />
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(() => !localStorage.getItem('cookie-accepted'));
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm animate-slide-up">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold text-ink-800">Cookie 偏好设置</p>
          <p className="mt-0.5 text-[11px] text-ink-500">我们使用必要 Cookie 保持网站正常运行，不会追踪你的个人数据。</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { localStorage.setItem('cookie-accepted', '1'); setShow(false); }} className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50">知道了</button>
          <button onClick={() => { localStorage.setItem('cookie-accepted', '1'); setShow(false); }} className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-700">继续</button>
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const { data: credits } = useCredits();
  const { data: unreadCount } = useUnreadCount();
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
        <div className="flex h-14 items-center gap-2 border-b border-line px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white"><CompassIcon size={14} /></span>
          <Link to="/app" className="text-[15px] font-bold tracking-tight text-ink-900">
            见微<span className="text-accent-500">行远</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="主导航">
          {/* Resource pack CTA */}
          <Link to="/app/subscription" className="mb-4 flex items-center gap-2.5 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-accent-50 px-3.5 py-3 transition-all duration-200 hover:shadow-[0_2px_12px_rgba(196,85,59,0.12)] hover:scale-[1.01] active:scale-[0.99]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-ink-800">开通资源包</p>
              <p className="text-[10px] text-ink-400">解锁全部 AI 分析能力</p>
            </div>
          </Link>
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
                          : 'font-medium text-ink-500 hover:bg-ink-100/60 hover:text-ink-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150'
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

        <div className="border-t border-line px-3 py-3">
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-ink-50 to-brand-50/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-brand-500"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-[11px] font-medium text-ink-600">帮助与反馈</span>
            </div>
            <span className="text-[10px] text-ink-300">v0.1</span>
          </div>
        </div>
      </aside>

      {/* === Main content === */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setSheetOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100" aria-label="打开导航">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
            </button>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white"><CompassIcon size={12} /></span>
            <Link to="/app" className="text-sm font-bold text-ink-900">
              见微<span className="text-accent-500">行远</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink-800">{currentLabel}</span>
            <span className="hidden sm:block h-3.5 w-px bg-ink-200" />
            <span className="hidden sm:block text-xs text-ink-400 italic">见微知著，行远自迩</span>
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
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount! > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* User dropdown (desktop) */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Avatar (mobile - simple) */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-[10px] font-medium text-white lg:hidden" aria-hidden="true">
              {((() => { try { return ''; } catch { return 'U'; } })())}
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

      {/* === Mobile bottom tab bar (Stripe/Notion style) === */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100/80 bg-white/[0.92] backdrop-blur-xl lg:hidden" aria-label="底部导航">
        <div className="mx-auto flex max-w-lg items-center justify-around px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
          {TAB_LEFT.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-3 py-1.5 transition-all duration-200 ${
                  isActive ? 'text-brand-600 scale-105' : 'text-ink-300 hover:text-ink-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon d={item.icon} className={`h-[22px] w-[22px] transition-all duration-200 ${isActive ? 'drop-shadow-[0_1px_3px_rgba(196,85,59,0.3)]' : ''}`} />
                  <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  {isActive && <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500" />}
                </>
              )}
            </NavLink>
          ))}

          {/* Center + button (floating) */}
          <button
            onClick={() => setSheetOpen(true)}
            className="relative -top-4 mx-1 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-[0_6px_20px_rgba(196,85,59,0.35)] transition-all duration-200 active:scale-90 active:shadow-[0_2px_8px_rgba(196,85,59,0.3)] hover:shadow-[0_8px_24px_rgba(196,85,59,0.45)] hover:-translate-y-0.5"
            aria-label="打开导航"
            style={{ height: '52px', width: '52px' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {TAB_RIGHT.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-3 py-1.5 transition-all duration-200 ${
                  isActive ? 'text-brand-600 scale-105' : 'text-ink-300 hover:text-ink-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon d={item.icon} className={`h-[22px] w-[22px] transition-all duration-200 ${isActive ? 'drop-shadow-[0_1px_3px_rgba(196,85,59,0.3)]' : ''}`} />
                  <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  {isActive && <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Global Command+K palette */}
      <CookieBanner />
      <CommandPalette />

      {/* === Mobile Navigation Drawer === */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="导航菜单">
          <div className="absolute inset-0 bg-scrim" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface shadow-2xl animate-[slide-in-left_0.25s_ease] overflow-y-auto">
            <div className="flex h-14 items-center gap-2 border-b border-line px-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white"><CompassIcon size={14} /></span>
              <span className="text-[15px] font-bold text-ink-900">见微<span className="text-accent-500">行远</span></span>
              <button onClick={() => setSheetOpen(false)} className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="px-3 py-4">
              {NAV_GROUPS.map((group, gi) => (
                <div key={group.label}>
                  {gi > 0 && <div className="mx-3 my-3 border-t border-line" />}
                  <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-300">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <button key={item.to} onClick={() => { setSheetOpen(false); navigate(item.to); }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${location.pathname === item.to ? 'font-semibold text-ink-900 bg-brand-50/60' : 'font-medium text-ink-500 hover:bg-ink-100/60'}`}>
                        <NavIcon d={item.icon} className="h-[18px] w-[18px] shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-line px-4 py-3">
              <p className="text-[10px] text-ink-300 italic">见微知著，行远自迩</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
