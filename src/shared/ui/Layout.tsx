import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '@/shared/store/app-store'

const NAV_ITEMS = [
  { path: '/map', label: '参照' },
  { path: '/evidence', label: '证据' },
  { path: '/compare', label: '比较' },
  { path: '/actions', label: '行动' },
]

export function Layout({ children }: { children: ReactNode }) {
  const mode = useAppStore((s) => s.mode)
  const setMode = useAppStore((s) => s.setMode)

  return (
    <div className="mx-auto max-w-[1200px] px-4">
      <a href="#main-content" className="skip-link">跳转到主要内容</a>
      {/* 顶栏 */}
      <header className="flex items-center justify-between border-b border-(--border) py-3">
        <Link to="/" className="text-lg font-semibold text-(--ink)">
          CareerCopilot
        </Link>
        <nav className="hidden gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm text-(--muted) hover:text-(--primary)"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {/* Demo/Real 模式切换 */}
          <button
            onClick={() => setMode(mode === 'demo' ? 'real' : 'demo')}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              mode === 'demo'
                ? 'bg-(--warning-soft) text-(--warning)'
                : 'bg-(--primary-soft) text-(--primary)'
            }`}
          >
            {mode === 'demo' ? 'Demo 模式' : '正式模式'}
          </button>
          <Link
            to="/settings/privacy"
            className="text-xs text-(--muted) hover:text-(--ink)"
          >
            隐私
          </Link>
        </div>
      </header>

      {/* 主内容 */}
      <main id="main-content" className="py-6">{children}</main>

      {/* 底栏 */}
      <footer className="border-t border-(--border) py-4 text-center text-xs text-(--muted)">
        CareerCopilot · 证据型职业导航 · 历史观察频率不等于成功概率
      </footer>
    </div>
  )
}
