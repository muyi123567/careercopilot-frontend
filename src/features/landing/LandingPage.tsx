import { Link } from 'react-router-dom';
import { BrandMark } from '../../shared/components/BrandMark';

/* Feature data for bento section */
const FEATURES = [
  {
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    title: '群体轨迹证据',
    desc: '基于真实转岗轨迹统计，每条建议标注样本量和数据来源，不编造确定性。',
    large: true,
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: '下一步行动',
    desc: '不给你岗位表，给你可验证的下一步。',
    large: false,
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: '隐私优先',
    desc: '原始文件本地解析，授权后仅发送结构化信号。',
    large: false,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-paper bg-dot-grid font-sans text-ink-800 antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark size={24} className="text-ink-900" />
            <span className="text-[15px] font-bold tracking-tight text-ink-900">见微行远</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-500 md:flex">
            <a href="#features" className="transition-colors hover:text-ink-900">产品</a>
            <Link to="/occupations" className="transition-colors hover:text-ink-900">职业库</Link>
            <a href="#how" className="transition-colors hover:text-ink-900">工作原理</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900">
              登录
            </Link>
            <Link to="/login" className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-700">
              开始使用
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Vercel center-icon style */}
      <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        {/* Brand mark with pulse ring */}
        <div className="relative mb-8">
          <div className="animate-pulse-ring absolute inset-0 rounded-full border border-ink-900/10" style={{ margin: '-12px' }} />
          <BrandMark size={120} className="text-ink-900" animate />
        </div>

        {/* Headline - max 2 lines */}
        <h1 className="text-4xl font-bold tracking-tight text-ink-900 md:text-5xl lg:text-6xl">
          从真实轨迹，看清下一程
        </h1>

        {/* Subtext - max 20 words */}
        <p className="mt-4 max-w-[480px] text-base leading-relaxed text-ink-500">
          证据型职业导航，用你的真实经历生成可验证的下一步行动
        </p>

        {/* CTAs - 1 primary + 1 secondary */}
        <div className="mt-8 flex items-center gap-3">
          <Link to="/login" className="rounded-lg bg-ink-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-ink-700 active:scale-95">
            免费开始
          </Link>
          <a href="#features" className="rounded-lg border border-line px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300 hover:bg-surface">
            了解更多
          </a>
        </div>
      </section>

      {/* Product showcase - perspective tilt */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="stagger grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface p-4 shadow-card sm:col-span-1">
              <div className="mb-2 h-2 w-16 rounded bg-accent-100" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-ink-100" />
                <div className="h-3 w-3/4 rounded bg-ink-100" />
                <div className="h-3 w-1/2 rounded bg-ink-100" />
              </div>
              <p className="mt-3 text-[10px] font-medium text-ink-400">职业地图</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 shadow-card sm:col-span-1">
              <div className="mb-2 flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success-500/40" />
                <span className="h-2 w-2 rounded-full bg-accent-500/40" />
                <span className="h-2 w-2 rounded-full bg-ink-200" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-ink-100" />
                <div className="h-3 w-2/3 rounded bg-ink-100" />
              </div>
              <p className="mt-3 text-[10px] font-medium text-ink-400">证据台账</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 shadow-card sm:col-span-1">
              <div className="mb-2 h-2 w-12 rounded bg-accent-500/30" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-ink-100" />
                <div className="h-3 w-4/5 rounded bg-ink-100" />
                <div className="h-3 w-3/5 rounded bg-ink-100" />
              </div>
              <p className="mt-3 text-[10px] font-medium text-ink-400">行动推荐</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento 2+1 asymmetric (SKILL: no 3x2 equal grid) */}
      <section id="features" className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-400">
            产品特性
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-xl border border-line p-6 transition-colors hover:border-ink-200 ${
                  f.large ? 'bg-accent-50/50 sm:col-span-2' : 'bg-surface'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-6 w-6 text-ink-600" aria-hidden="true">
                  <path d={f.icon} />
                </svg>
                <h3 className="text-sm font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA close - left-aligned text + right button (SKILL: not centered) */}
      <section className="border-t border-line px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
              见微知著，行远自迩
            </h2>
            <p className="mt-2 text-sm text-ink-500">从职业轨迹的细微信号中形成判断，用真实行动验证方向。</p>
          </div>
          <Link to="/login" className="shrink-0 rounded-lg bg-ink-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-ink-700 active:scale-95">
            免费开始
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-8 text-center text-xs text-ink-400">
        <p>见微行远 EvidWay · 从真实轨迹，看清下一程</p>
        <p className="mt-1 text-ink-300">原始文件本地解析 · 授权后临时处理 · 不留存</p>
      </footer>
    </div>
  );
}
