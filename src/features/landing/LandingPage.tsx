import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

/* ===== Scroll Reveal ===== */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm || !('IntersectionObserver' in window)) {
      ref.current?.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    const els = ref.current?.querySelectorAll('.reveal');
    els?.forEach((el) => io.observe(el));
    const timer = setTimeout(() => { els?.forEach((el) => el.classList.add('in')); }, 600);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
  return ref;
}

/* ===== Icons ===== */
const CompassIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[17px] w-[17px]"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform group-hover:translate-x-[3px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>);

/* ===== Evidence Data ===== */
const EVIDENCE_CARDS = [
  {
    tag: '群体轨迹',
    tagColor: 'bg-brand-50 text-brand-700',
    title: '后端 → 技术 PM，38% 的迁移概率',
    body: '基于 128 条真实转岗轨迹。不是测试分数，是走过这条路的人留下的脚印。',
    source: '来源：脉脉职言 + 拉勾 JD 分析',
  },
  {
    tag: '市场信号',
    tagColor: 'bg-teal-50 text-teal-700',
    title: '技术 PM 需求同比 +15%，一线集中',
    body: '市场热度不等于个人适合度。我们标注样本量和截止时间，不编一个好看的总分。',
    source: '来源：Boss 直聘 2025 Q4 数据',
  },
  {
    tag: '个人反馈',
    tagColor: 'bg-gold-50 text-gold-600',
    title: '「帮团队砍掉没人用的功能」',
    body: '这就是产品判断的雏形。你已经在做「该不该做」的取舍了——只是还没命名它。',
    source: '来源：匿名对话 · 不留存',
  },
];

/* ===== Main Component ===== */
export function LandingPage() {
  const rootRef = useReveal();
  const [activeChat, setActiveChat] = useState(false);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)] font-sans text-ink-800 antialiased">

      {/* Trust Bar */}
      <div className="trust-bar-gradient flex items-center justify-center gap-2 px-4 py-2 text-xs tracking-wide text-ink-300">
        <span>原始文件本地解析</span>
        <span className="h-1 w-1 rounded-full bg-current opacity-40" />
        <span>授权后仅发送结构化信号</span>
        <span className="h-1 w-1 rounded-full bg-current opacity-40" />
        <span>随时关闭，不留痕迹</span>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-[100] border-b border-line/60 bg-paper/90 backdrop-blur-[16px]">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm"><CompassIcon /></span>
            <span className="font-display text-lg font-bold tracking-tight">见微<b className="text-brand-700">行远</b></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-medium text-ink-600 transition-all hover:border-brand-300 hover:text-brand-700 sm:block">登录</Link>
            <Link to="/workspace" className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-brand-800">
              开始推演 <ArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* === Section 1: Hero — Statement, not sales pitch === */}
      <section className="landing-hero relative px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-[1120px]">
          <div className="reveal max-w-[680px]">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">证据型职业导航 · 生涯向量模型</p>
            <h1 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.8rem)] font-semibold leading-[1.08] tracking-tight">
              从真实轨迹，<br className="hidden sm:block" />看清下一程。
            </h1>
            <p className="mt-6 max-w-[32em] text-base leading-relaxed text-ink-600 sm:text-lg">
              方向不是测出来的，是走出来的。见微行远从群体轨迹、市场变化和你的真实反馈中形成判断——每一条建议都可追溯来源，信息不足处诚实标注「未知」。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/workspace" className="hero-btn-primary group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-700 px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm hover:bg-brand-800">
                开始推演 <ArrowRight />
              </Link>
              <Link to="/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium text-ink-600 transition-colors hover:text-brand-700">
                了解它怎么工作
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === Section 2: Evidence Trail — the product's voice, not feature list === */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <div className="reveal mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">三类证据，一个判断</h2>
            <span className="text-xs text-ink-400">不编总分，不造确定性</span>
          </div>
          <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EVIDENCE_CARDS.map((card) => (
              <article key={card.tag} className="group flex flex-col rounded-2xl border border-line/70 bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(33,29,26,0.08)]">
                <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${card.tagColor}`}>{card.tag}</span>
                <h3 className="text-[15px] font-semibold leading-snug text-ink-800">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{card.body}</p>
                <p className="mt-4 border-t border-line/50 pt-3 text-[11px] text-ink-400">{card.source}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* === Section 3: Proof — show the conversation, don't describe it === */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto grid max-w-[1120px] items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal">
            <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">不给你一张岗位表，<br />给你「下一步做什么、为什么」</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              匿名对话，不留存。先别急着想「适合不适合」——从你已经做过的事里，找到产品判断的雏形。
            </p>
            <button
              type="button"
              onClick={() => setActiveChat(!activeChat)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-700 transition-all hover:border-brand-300 hover:text-brand-700"
            >
              {activeChat ? '收起对话' : '看一段真实对话'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 transition-transform duration-300 ${activeChat ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
          <div className={`reveal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeChat ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 lg:grid-rows-[1fr] lg:opacity-100'}`}>
            <div className="overflow-hidden">
              <div className="rounded-2xl bg-ink-900 p-6 sm:p-8">
                <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-ink-400">匿名对话 · 不留存</p>
                <div className="flex flex-col gap-2.5">
                  <div className="self-end rounded-2xl rounded-br-md bg-brand-500 px-4 py-2.5 text-sm text-white">我到底适不适合做产品？</div>
                  <div className="self-start rounded-2xl rounded-bl-md bg-ink-700 px-4 py-2.5 text-sm text-ink-200">先别急着想「适合不适合」。你之前做过最像产品的决定是什么？</div>
                  <div className="self-end rounded-2xl rounded-br-md bg-brand-500 px-4 py-2.5 text-sm text-white">好像是帮团队砍掉了一个没人用的功能。</div>
                  <div className="self-start rounded-2xl rounded-bl-md bg-ink-700 px-4 py-2.5 text-sm text-ink-200">那就是产品判断的雏形——你已经在做「该不该做」的取舍了。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Section 4: CTA — one line, one action === */}
      <section className="reveal px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1120px] border-t border-line/50 pt-12 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">见微知著，行远自迩。</p>
          <p className="mx-auto mt-3 max-w-[24em] text-sm text-ink-500">从职业轨迹的细微信号中形成判断，用一次次真实行动验证方向。</p>
          <Link to="/workspace" className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-brand-700 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-brand-800 hover:shadow-md">
            开始推演 <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer — one line */}
      <footer className="border-t border-line/40 py-6 text-center text-xs text-ink-400">
        <p>© 2026 见微行远 EvidWay · 证据型职业导航 · 原始文件本地解析 · 授权后临时处理</p>
      </footer>
    </div>
  );
}
