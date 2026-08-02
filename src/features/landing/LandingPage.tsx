import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── Scroll Reveal Hook (AnySearch-style lift + fade) ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-[0.98] opacity-0'} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Icons ─── */
const CompassIcon = ({ size }: { size?: number }) => (
  <svg width={size ?? 24} height={size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);

/* ─── Nav data ─── */
const NAV_ITEMS = [
  { label: '产品', children: [
    { label: '职业地图', desc: '可视化职业路径探索', to: '/occupations' },
    { label: '证据台账', desc: '结构化管理你的职业证据', to: '/login' },
    { label: '行动实验', desc: '小步验证，用真实行动检验假设', to: '/login' },
  ]},
  { label: '资源', children: [
    { label: '职业库', desc: 'ESCO 标准职业分类浏览', to: '/occupations' },
    { label: '工作原理', desc: '了解证据型导航的方法论', to: '/' },
  ]},
];

function NavDropdown({ label, children }: { label: string; children: typeof NAV_ITEMS[0]['children'] }) {
  const [open, setOpen] = useState(false);
  const timer = useState<ReturnType<typeof setTimeout> | null>(null);
  return (
    <div className="relative" onMouseEnter={() => { if (timer[0]) clearTimeout(timer[0]); setOpen(true); }} onMouseLeave={() => { timer[0] = setTimeout(() => setOpen(false), 200); }}>
      <button className="flex items-center gap-1 py-1.5 text-sm text-white/50 transition-colors hover:text-white">
        {label}
        <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="currentColor">
          <path fillRule="evenodd" d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/[0.08] bg-ink-800/95 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-slide-up">
          {children.map((item) => (
            <Link key={item.label} to={item.to} className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.05]">
              <p className="text-sm font-medium text-white/90">{item.label}</p>
              <p className="mt-0.5 text-xs text-white/40">{item.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SVG Flow Diagram (AnySearch-style hub + connectors) ─── */
function FlowDiagram() {
  return (
    <div className="relative mx-auto flex max-w-lg items-center justify-center py-8">
      {/* Center hub */}
      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-400/30 bg-ink-800 shadow-[0_0_40px_rgba(196,85,59,0.15)]">
        <span className="text-brand-400"><CompassIcon size={28} /></span>
        <span className="absolute -inset-1 rounded-2xl border border-brand-400/10 animate-[breathe_4s_ease-in-out_infinite]" />
      </div>
      {/* Left nodes */}
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-6">
        {['简历解析', '技能提取'].map((t, i) => (
          <div key={t} className="flex items-center gap-2">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/60 backdrop-blur-sm">{t}</div>
            <svg width="40" height="2" className="text-white/15"><line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeDasharray="4 3" className="animate-[dash_2s_linear_infinite]" style={{ animationDelay: `${i * 0.5}s` }} /></svg>
          </div>
        ))}
      </div>
      {/* Right nodes */}
      <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-6">
        {['轨迹匹配', '行动建议'].map((t, i) => (
          <div key={t} className="flex items-center gap-2">
            <svg width="40" height="2" className="text-brand-400/30"><line x1="0" y1="1" x2="40" y2="1" stroke="currentColor" strokeDasharray="4 3" className="animate-[dash_2s_linear_infinite]" style={{ animationDelay: `${i * 0.5 + 0.3}s` }} /></svg>
            <div className="rounded-lg border border-brand-400/20 bg-brand-500/[0.06] px-3 py-2 text-xs text-brand-300/80 backdrop-blur-sm">{t}</div>
          </div>
        ))}
      </div>
      {/* Top node */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="rounded-lg border border-gold-400/20 bg-gold-400/[0.05] px-3 py-2 text-xs text-gold-300/70">群体轨迹数据</div>
        <svg width="2" height="24" className="mx-auto text-white/10"><line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeDasharray="3 3" /></svg>
      </div>
      {/* Bottom node */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <svg width="2" height="24" className="mx-auto text-white/10"><line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeDasharray="3 3" /></svg>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/[0.05] px-3 py-2 text-xs text-teal-300/70">可验证下一步</div>
      </div>
    </div>
  );
}


/* ─── Raycast-style rotating feature text ─── */
const FEATURES = ['解析你的简历', '匹配群体轨迹', '生成行动实验', '追踪决策质量', '量化技能成长', '推荐下一步'];
function FeatureWall() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % FEATURES.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h3 className="text-xl font-semibold text-white/80 sm:text-2xl">见微行远还能做什么？</h3>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {FEATURES.map((f, i) => (
          <span key={f} className={`cursor-default text-lg font-medium transition-all duration-500 sm:text-xl ${i === active ? 'scale-110 bg-gradient-to-r from-brand-300 to-gold-400 bg-clip-text text-transparent' : 'text-white/25 hover:text-white/50'}`}>
            {f}{i < FEATURES.length - 1 ? '、' : '。'}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-ink-900 font-sans text-white antialiased">
      {/* Top accent line */}
      <div className="fixed inset-x-0 top-0 z-[60] h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      {/* === Nav === */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_0_12px_rgba(196,85,59,0.4)]">
              <CompassIcon size={16} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">见微行远</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (<NavDropdown key={item.label} label={item.label} children={item.children} />))}
            <Link to="/occupations" className="text-sm text-white/50 transition-colors hover:text-white">职业库</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/50 transition-colors hover:text-white">登录</Link>
            <Link to="/login" className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-900 transition-all hover:bg-white/90 active:scale-95">开始使用</Link>
          </div>
        </div>
      </header>

      {/* === Hero === */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-brand-500/[0.06] blur-[140px] animate-[breathe_6s_ease-in-out_infinite]" style={{ borderRadius: '50%' }} />
          <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] bg-gold-400/[0.04] blur-[100px] animate-[breathe_8s_ease-in-out_infinite_1.5s]" style={{ borderRadius: '50%' }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '70px 70px' }} />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-16 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[520px] flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs text-white/50 animate-[fade-in-up_0.8s_ease_both]" style={{ animationDelay: '0.1s' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-[breathe_3s_ease-in-out_infinite]" />
              证据型职业导航 · 不编造确定性
            </div>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl animate-[fade-in-up_0.8s_ease_both]" style={{ animationDelay: '0.25s' }}>
              从真实轨迹，<br className="hidden sm:block" /><span className="bg-gradient-to-r from-brand-300 via-gold-400 to-brand-400 bg-clip-text text-transparent">看清下一程</span>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/40 animate-[fade-in-up_0.8s_ease_both]" style={{ animationDelay: '0.4s' }}>
              用你的真实经历生成可验证的下一步行动。每条建议标注样本量和数据来源。
            </p>
            <div className="mt-8 flex items-center gap-3 animate-[fade-in-up_0.8s_ease_both]" style={{ animationDelay: '0.55s' }}>
              <Link to="/login" className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-ink-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95">免费开始</Link>
              <Link to="/occupations" className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-white/30 hover:text-white">浏览职业库</Link>
            </div>
          </div>
          {/* Right: Flow diagram */}
          <div className="hidden w-full max-w-[400px] lg:block">
            <FlowDiagram />
          </div>
        </div>
      </section>

      {/* === Feature Wall (Raycast-style rotating text) === */}
      <section className="px-4 py-24 sm:px-6">
        <RevealSection>
          <FeatureWall />
        </RevealSection>
      </section>

      {/* === Feature blocks (AnySearch-style: text left + visual right) === */}
      <section className="px-4 pb-32 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-24">
          {/* Block 1 */}
          <RevealSection>
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
              <div className="max-w-md">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-brand-400/70">证据引擎</p>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">群体轨迹<span className="text-white/30"> × </span>个人证据</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/35">基于 128 条真实转岗轨迹，标注样本量和来源。不是测试分数，是走过这条路的人留下的脚印。</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['脉脉职言', '拉勾 JD', 'Boss 直聘'].map(t => <span key={t} className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-white/40">{t}</span>)}
                </div>
              </div>
              <div className="w-full max-w-sm rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="space-y-3">
                  {[{ l: '产品经理 → 数据产品', n: '32 条', p: 78 }, { l: '前端 → 全栈', n: '45 条', p: 65 }, { l: '运营 → 增长', n: '51 条', p: 88 }].map(r => (
                    <div key={r.l} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 truncate text-xs text-white/50">{r.l}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-500/60 to-brand-400/40 transition-all duration-1000" style={{ width: `${r.p}%` }} />
                      </div>
                      <span className="w-10 text-right text-[10px] text-white/30">{r.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Block 2 */}
          <RevealSection>
            <div className="flex flex-col items-center gap-12 lg:flex-row-reverse lg:justify-between">
              <div className="max-w-md">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold-400/70">行动闭环</p>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">不给岗位表，<span className="text-white/30">给</span>小实验</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/35">做完就知道方向对不对。每个行动实验都有明确的验证标准和预期产出。</p>
              </div>
              <div className="w-full max-w-sm rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="space-y-4">
                  {[{ s: '01', t: '选择假设', d: '我想转数据产品', done: true }, { s: '02', t: '设计实验', d: '完成一个 SQL 分析项目', done: true }, { s: '03', t: '验证结果', d: '获得 2 个正面反馈', done: false }].map(r => (
                    <div key={r.s} className="flex items-start gap-3">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${r.done ? 'bg-brand-500/20 text-brand-400' : 'border border-white/10 text-white/30'}`}>{r.done ? '✓' : r.s}</span>
                      <div><p className="text-xs font-medium text-white/70">{r.t}</p><p className="text-[11px] text-white/30">{r.d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* === Product mockup === */}
      <RevealSection className="px-4 pb-32 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-ink-800/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/20">app.evidway.cn</span>
            </div>
            <div className="flex">
              <div className="hidden w-44 shrink-0 border-r border-white/[0.06] p-4 sm:block">
                <div className="mb-4 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded bg-white text-ink-900"><CompassIcon size={10} /></span><span className="text-[11px] font-medium text-white/50">见微行远</span></div>
                {['工作台', '职业地图', '证据台账', '行动实验', '决策记录'].map((item, i) => (<div key={item} className={`mb-0.5 rounded-md px-2.5 py-1.5 text-[11px] ${i === 0 ? 'bg-white/[0.06] text-white/70' : 'text-white/25'}`}>{item}</div>))}
              </div>
              <div className="flex-1 p-5">
                <div className="mb-3 h-4 w-32 rounded bg-white/[0.07]" />
                <div className="mb-5 h-2.5 w-52 rounded bg-white/[0.03]" />
                <div className="mb-5 grid grid-cols-3 gap-2.5">
                  {[1,2,3].map(i => (<div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"><div className="mb-1.5 h-3.5 w-7 rounded bg-brand-400/25" /><div className="h-2 w-14 rounded bg-white/[0.05]" /></div>))}
                </div>
                <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="mb-3 h-2.5 w-20 rounded bg-white/[0.05]" />
                  <div className="flex h-20 items-end gap-1">
                    {[30,50,38,65,48,78,60,88,72,55,82,95].map((h, i) => (<div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-500/30 to-brand-400/15" style={{ height: `${h}%` }} />))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* === CTA === */}
      <RevealSection className="relative overflow-hidden px-4 py-32 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-brand-500/[0.05] blur-[120px] animate-[breathe_6s_ease-in-out_infinite]" style={{ borderRadius: '50%' }} />
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">见微知著，行远自迩</h2>
          <p className="mt-4 text-white/35">从职业轨迹的细微信号中形成判断，用真实行动验证方向。</p>
          <Link to="/login" className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-ink-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95">免费开始</Link>
        </div>
      </RevealSection>

      {/* === Footer === */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-white/20">
        <p>见微行远 EvidWay · 原始文件本地解析 · 授权后临时处理 · 不留存</p>
      </footer>
    </div>
  );
}
