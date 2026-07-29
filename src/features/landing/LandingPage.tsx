import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

/* ===== Scroll Reveal Hook ===== */
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
    // Safety fallback: ensure content is visible even if IO doesn't fire
    const timer = setTimeout(() => { els?.forEach((el) => el.classList.add('in')); }, 600);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
  return ref;
}

/* ===== Mouse Parallax + 3D Tilt ===== */
function useHeroMouse(heroRef: React.RefObject<HTMLElement | null>, cardRef: React.RefObject<HTMLElement | null>) {
  const raf = useRef(0);
  const onMove = useCallback((e: MouseEvent) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const hero = heroRef.current; const card = cardRef.current;
      if (!hero) return;
      const hr = hero.getBoundingClientRect();
      const mx = (e.clientX - hr.left) / hr.width; const my = (e.clientY - hr.top) / hr.height;
      hero.style.setProperty('--mx', mx.toFixed(3)); hero.style.setProperty('--my', my.toFixed(3));
      hero.style.setProperty('--cx', (mx * 100).toFixed(2) + '%'); hero.style.setProperty('--cy', (my * 100).toFixed(2) + '%');
      if (card) {
        const rr = card.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (rr.left + rr.width / 2)) / (rr.width / 2)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (rr.top + rr.height / 2)) / (rr.height / 2)));
        card.style.transform = `perspective(1400px) rotateX(${(-dy * 4.5).toFixed(2)}deg) rotateY(${(dx * 5.5).toFixed(2)}deg) translateZ(0)`;
      }
    });
  }, [heroRef, cardRef]);
  const onLeave = useCallback(() => {
    const hero = heroRef.current; const card = cardRef.current;
    if (hero) { hero.style.setProperty('--mx', '.5'); hero.style.setProperty('--my', '.5'); }
    if (card) card.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  }, [heroRef, cardRef]);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    hero.addEventListener('mousemove', onMove); hero.addEventListener('mouseleave', onLeave);
    return () => { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); };
  }, [heroRef, onMove, onLeave]);
}

/* ===== Accordion Section Data ===== */
const SECTIONS = [
  { id: 'console', num: '01', label: '推演控制台', sub: '把经历交给推演，不交给服务器', icon: 'M12 20V10M18 20V4M6 20v-4' },
  { id: 'trust', num: '02', label: '信任宣言', sub: '不知道你是谁，是我们的底色', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'capabilities', num: '03', label: '能力详解', sub: '它能为你做什么', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 'chat', num: '04', label: '匿名对话', sub: '不留存的多轮探索', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id: 'cta', num: '05', label: '开始行动', sub: '先想清楚，再行动', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3' },
];

const CAPABILITIES = [
  { num: '1', title: '临时推演，无需注册', desc: '先在本地解析经历；只有在你明确授权后，才发送必要的结构化信号和问题。' },
  { num: '2', title: '把经历交给推演，不交给服务器', desc: '拖入简历本地解析，勾选授权后开始。解析与推演都在你设备，文件不会离开。' },
  { num: '3', title: '拿到下一步，也拿到「为什么」', desc: '每条建议可追溯来源；信息不足处诚实标注「未知」，绝不编一个好看的总分。' },
  { num: '4', title: '临时处理 · 可随时关闭', desc: '原始文件不上传；临时请求的保留规则和限制会在每次响应中明确展示。' },
  { num: '5', title: '三步，逐项核验', desc: '提取职业事件 → 授权临时推演 → 查看下一步和限制。不满意可继续追问。' },
];

/* ===== Icons ===== */
const CompassIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>);
const ShieldIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const ArrowRight = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] transition-transform group-hover:translate-x-[3px]"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>);
const CheckIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 6L9 17l-5-5"/></svg>);
const UploadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[30px] h-[30px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>);
const ChevronDown = ({ open }: { open: boolean }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 text-ink-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>);

/* ===== Main Component ===== */
export function LandingPage() {
  const rootRef = useReveal();
  const heroRef = useRef<HTMLElement>(null);
  const routeCardRef = useRef<HTMLDivElement>(null);
  useHeroMouse(heroRef, routeCardRef);
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div ref={rootRef} className="min-h-screen bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)] font-sans text-ink-800 antialiased">
      {/* Contour Background */}
      <svg className="landing-contour" aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g className="c-near"><ellipse cx="1180" cy="172" rx="26" ry="18"/><ellipse cx="1184" cy="169" rx="54" ry="38"/><ellipse cx="1188" cy="166" rx="86" ry="60"/><ellipse cx="1193" cy="162" rx="122" ry="84"/><ellipse cx="1199" cy="157" rx="162" ry="112"/><ellipse cx="1206" cy="151" rx="206" ry="142"/></g>
        <g className="c-mid"><ellipse cx="232" cy="742" rx="24" ry="16"/><ellipse cx="228" cy="746" rx="50" ry="34"/><ellipse cx="224" cy="751" rx="80" ry="54"/><ellipse cx="219" cy="757" rx="114" ry="76"/><ellipse cx="213" cy="764" rx="152" ry="100"/><ellipse cx="206" cy="772" rx="194" ry="128"/></g>
        <g className="c-far"><ellipse cx="762" cy="472" rx="30" ry="20"/><ellipse cx="766" cy="469" rx="62" ry="42"/><ellipse cx="770" cy="466" rx="98" ry="66"/><ellipse cx="775" cy="462" rx="138" ry="92"/></g>
        <path className="flow" d="M-60 300 C 220 250, 430 372, 720 308 S 1120 262, 1520 322"/>
        <path className="flow" d="M-60 624 C 260 686, 470 558, 770 624 S 1160 664, 1520 602"/>
      </svg>

      {/* Trust Bar */}
      <div className="trust-bar-gradient flex items-center justify-center gap-2 px-4 py-2 text-xs tracking-wide text-[#B6ABA0]">
        <ShieldIcon /><span>原始文件本地解析 · 授权后仅发送结构化信号</span>
        <span className="h-1 w-1 rounded-full bg-current opacity-40" />
        <span>随时关闭，不留任何痕迹</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-[100] border-b border-line bg-paper/82 backdrop-blur-[12px] saturate-[1.4]">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 sm:h-[66px] sm:px-6">
          <Link to="/" className="flex items-center gap-[11px]">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm"><CompassIcon /></span>
            <span className="font-display text-[19px] font-bold tracking-tight">见微<b className="text-brand-700">行远</b></span>
          </Link>
          <div className="flex items-center gap-3">
            <button type="button" title="微信小程序（即将上线）" className="hidden items-center gap-1.5 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-medium text-ink-600 transition-all hover:border-teal-600/40 hover:text-teal-700 sm:flex"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8v8"/></svg>小程序</button><Link to="/login" className="hidden items-center gap-1.5 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-medium text-ink-600 transition-all hover:border-brand-300 hover:text-brand-700 sm:flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a7 7 0 0 1 13 0"/></svg>
              登录
            </Link>
            <Link to="/workspace" className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-brand-800">
              开始推演 <ArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="landing-hero px-4 py-8 sm:px-6 sm:py-12">
        {/* 方向母题装饰：罗盘 + 地球经纬 + 轨道动效 */}
        <div className="pointer-events-none absolute -right-[100px] top-1/2 -translate-y-1/2 opacity-[0.04]" aria-hidden="true">
          <svg width="720" height="720" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.25">
            {/* 外圈刻度环（慢旋转） */}
            <g className="compass-spin-slow" style={{transformOrigin:'50px 50px'}}>
              <circle cx="50" cy="50" r="48" strokeDasharray="2 3"/>
              <path d="M50 2v4M50 94v4M2 50h4M94 50h4M15.4 15.4l2.8 2.8M81.8 81.8l2.8 2.8M84.6 15.4l-2.8 2.8M18.2 81.8l-2.8 2.8"/>
            </g>
            {/* 地球经纬 */}
            <circle cx="50" cy="50" r="36"/>
            <ellipse cx="50" cy="50" rx="36" ry="14"/>
            <ellipse cx="50" cy="50" rx="36" ry="26"/>
            <ellipse cx="50" cy="50" rx="14" ry="36"/>
            <ellipse cx="50" cy="50" rx="26" ry="36"/>
            <path d="M14 50h72M50 14v72"/>
            {/* 内圈罗盘指针 */}
            <circle cx="50" cy="50" r="20" strokeDasharray="1 2"/>
            <path d="M50 30l3 17-3-2-3 2zM50 70l3-17-3 2-3-2z" fill="currentColor" stroke="none" opacity="0.6"/>
            {/* 轨道卫星点（动画） */}
            <g className="compass-orbit" style={{transformOrigin:'50px 50px'}}>
              <circle cx="50" cy="6" r="1.5" fill="currentColor" stroke="none"/>
            </g>
            <g className="compass-orbit-reverse" style={{transformOrigin:'50px 50px'}}>
              <circle cx="88" cy="50" r="1" fill="currentColor" stroke="none"/>
            </g>
            <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <div className="mx-auto grid w-full max-w-[1120px] items-center gap-8 sm:gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="reveal border-l-2 border-brand-500/60 pl-5">
            <span className="eyebrow-badge inline-flex items-center gap-2 rounded-full bg-brand-100 px-[13px] py-1.5 text-[13px] font-semibold tracking-wide text-brand-800"><ShieldIcon /> 证据优先 · 见微知著 · 行远自迩</span>
            <h1 className="mt-4 font-display text-[clamp(1.8rem,5vw,3.7rem)] font-semibold leading-[1.1] tracking-tight sm:mt-5">先<span className="hl-draw">想清楚方向</span>，<br/>再投出每一份简历。</h1>
            <p className="mt-5 max-w-[30em] text-[1.075rem] leading-relaxed text-ink-600">生涯向量模型，从群体轨迹、市场信号和你的真实反馈中形成判断。方向不是测出来的，是走出来的。</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link to="/workspace" className="hero-btn-primary group inline-flex items-center gap-2.5 rounded-full bg-brand-700 px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm hover:bg-brand-800">开始推演 <ArrowRight /></Link>
              <button type="button" onClick={() => document.getElementById('accordion-section')?.scrollIntoView({ behavior: 'smooth' })} className="hero-btn-secondary inline-flex items-center gap-2.5 rounded-full bg-ink-900/[0.04] px-6 py-3.5 text-[15px] font-semibold text-ink-700 backdrop-blur-sm hover:text-ink-900">看它怎么工作</button>
            </div>
          </div>
          {/* Route Path Card */}
          <div ref={routeCardRef} className="route-card reveal relative flex flex-col overflow-hidden">
            <div className="absolute -right-[50px] -top-[70px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(226,114,91,0.07),transparent_70%)]" />
            <div className="relative mb-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500"><span className="text-brand-600"><CompassIcon /></span> 路径推演 · 实时</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-600"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" /> 等待明确授权</span>
            </div>
            <div className="route-path-container relative flex flex-1 flex-col justify-around">
              <span className="rt-tracer absolute left-[11px] z-[2] h-[14px] w-[14px] rounded-full bg-[radial-gradient(circle,#B5472E_0%,rgba(226,114,91,0.9)_35%,rgba(226,114,91,0.25)_65%,transparent_80%)] shadow-[0_0_12px_3px_rgba(226,114,91,0.35)]" />
              <span className="absolute bottom-0 left-[17px] top-0 z-0 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(33,29,26,0.16)_0_5px,transparent_5px_10px)] opacity-50" />
              <div className="rt-node relative z-[1] flex items-start gap-[14px] pb-7">
                <span className="rt-dot flex h-9 w-9 flex-none items-center justify-center rounded-full border-[1.5px] border-brand-500 bg-brand-500 text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7 7 0 0 1 13 0"/></svg></span>
                <div className="flex flex-col gap-[3px] pt-[5px]"><span className="text-[15px] font-semibold leading-tight text-brand-700">后端 2 年</span><span className="text-xs text-ink-400">你现在的起点</span><div className="rt-detail"><p className="text-[13px] text-ink-600">两年后端，写过系统、背过线上问题——这是你的底盘，不是弱点。</p></div></div>
              </div>
              <div className="rt-node relative z-[1] flex items-start gap-[14px] pb-7">
                <span className="rt-dot flex h-9 w-9 flex-none items-center justify-center rounded-full border-[1.5px] border-line bg-surface text-ink-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 4-5"/></svg></span>
                <div className="flex flex-col gap-[3px] pt-[5px]"><span className="text-[15px] font-semibold leading-tight text-ink-800">职业路径</span><span className="text-xs text-ink-400">补「产品判断」+ 系统思维迁移</span><div className="rt-detail"><p className="text-[13px] text-ink-600">不用从头学产品。把后端经验改写成「我解决了什么不确定性」的故事。</p></div></div>
              </div>
              <div className="rt-node goal relative z-[1] flex items-start gap-[14px]">
                <span className="rt-dot flex h-9 w-9 flex-none items-center justify-center rounded-full border-[1.5px] border-teal-600 bg-surface text-teal-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]"><path d="M12 2l2.4 7.4H22l-6 4.3 2.3 7.3L12 17l-6.3 4 2.3-7.3-6-4.3h7.6z"/></svg></span>
                <div className="flex flex-col gap-[3px] pt-[5px]"><span className="text-[15px] font-semibold leading-tight text-teal-700">产品岗</span><span className="text-xs text-ink-400">推演目标</span><div className="rt-detail"><p className="text-[13px] text-ink-600">推演给你的不是一张岗位表，而是「下一步到底做什么、为什么」。</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section id="accordion-section" className="reveal mx-auto max-w-[1120px] px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-card">
          {SECTIONS.map((s) => {
            const isOpen = openSection === s.id;
            return (
              <div key={s.id} className="border-b border-line last:border-b-0">
                {/* Accordion header */}
                <button type="button" onMouseEnter={() => setOpenSection(s.id)}
                  className={`flex w-full items-center gap-4 px-6 py-5 text-left transition-all duration-300 sm:gap-5 sm:px-8 sm:py-6 ${isOpen ? 'bg-brand-50/50' : 'hover:bg-paper/80'}`}>
                  <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-sm font-bold transition-all duration-300 ${isOpen ? 'bg-brand-600 text-white scale-110 shadow-[0_4px_12px_-4px_rgba(181,71,46,0.4)]' : 'bg-brand-50 text-brand-700'}`}>{isOpen ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d={s.icon}/></svg> : s.num}</span>
                  <div className="flex-1">
                    <span className={`block text-lg font-bold tracking-tight transition-colors ${isOpen ? 'text-brand-800' : 'text-ink-800'}`}>{s.label}</span>
                    <span className="block text-xs text-ink-400">{s.sub}</span>
                  </div>
                  <ChevronDown open={isOpen} />
                </button>

                {/* Accordion panel */}
                <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2">
                      {/* Console */}
                      {s.id === 'console' && (
                        <div className="rounded-[10px] bg-ink-900 p-8 text-[#F3EDE6]">
                          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#B6ABA0]">推演控制台 · 本地模式</div>
                          <div className="mb-4 rounded-[10px] border-[1.5px] border-dashed border-[rgba(255,245,235,0.10)] py-8 text-center text-[#B6ABA0]">
                            <span className="mb-2 inline-block text-[#E8896F]"><UploadIcon /></span>
                            <div className="text-[15px] font-semibold text-[#F3EDE6]">拖入或选择你的简历 / 职业经历</div>
                            <div className="mt-1 text-sm">仅本地解析 · 支持 PDF / 文本 · 不上传</div>
                          </div>
                          <div className="mb-4 flex items-start gap-3 rounded-[10px] bg-[#2C2723] p-4 text-[13px] text-[#B6ABA0]">
                            <span className="mt-px flex-none text-[#6FB593]"><CheckIcon /></span>
                            <span>以上内容只在本机处理，不会上传到任何服务器，也不会被存储。</span>
                          </div>
                          <Link to="/workspace" className="group inline-flex items-center gap-2 rounded-full bg-[#E8896F] px-5 py-2.5 text-sm font-semibold text-[#2A1206] transition-all hover:bg-[#F0A088]">进入推演 <ArrowRight /></Link>
                        </div>
                      )}
                      {/* Trust */}
                      {s.id === 'trust' && (
                        <div className="rounded-[10px] bg-ink-900 p-8 text-center text-[#F3EDE6]">
                          <blockquote className="font-display text-[clamp(1.3rem,2.5vw,1.8rem)] font-medium leading-[1.4]">我们靠<b className="text-[#E8896F]">「最小必要数据」</b>建立信任。<br/>不上传原始文件、明确授权、如实说明限制——这是底色，不是功能。</blockquote>
                          <p className="mt-4 text-sm text-[#B6ABA0]">这就是 见微行远 和那些要你先交简历、再谈服务的产品的区别。</p>
                        </div>
                      )}
                      {/* Capabilities */}
                      {s.id === 'capabilities' && (
                        <div className="cap-container space-y-0">
                          {CAPABILITIES.map((cap) => (
                            <div key={cap.num} className="cap-item border-b border-line last:border-b-0">
                              <button type="button" className="cap-head relative flex w-full items-center gap-3 px-2 py-3.5 text-left">
                                <span className="cap-num flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-50 font-display text-xs font-bold text-brand-700">{cap.num}</span>
                                <span className="cap-title flex-1 text-sm font-semibold">{cap.title}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cap-chev h-4 w-4 text-ink-400"><path d="M9 6l6 6-6 6"/></svg>
                              </button>
                              <div className="cap-panel"><div className="px-2 pb-4 pl-12 text-sm text-ink-500">{cap.desc}</div></div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Chat */}
                      {s.id === 'chat' && (
                        <div className="rounded-[10px] bg-ink-900 p-8 text-[#F3EDE6]">
                          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#B6ABA0]">匿名对话 · 不留存</div>
                          <div className="flex max-w-[560px] flex-col gap-2.5">
                            <div className="self-end rounded-2xl rounded-br-[5px] bg-[#E8896F] px-4 py-2.5 text-sm text-[#2A1206]">我到底适不适合做产品？</div>
                            <div className="self-start rounded-2xl rounded-bl-[5px] bg-[#2C2723] px-4 py-2.5 text-sm">先别急着想「适合不适合」。你之前做过最像产品的决定是什么？</div>
                            <div className="self-end rounded-2xl rounded-br-[5px] bg-[#E8896F] px-4 py-2.5 text-sm text-[#2A1206]">好像是帮团队砍掉了一个没人用的功能。</div>
                            <div className="self-start rounded-2xl rounded-bl-[5px] bg-[#2C2723] px-4 py-2.5 text-sm">那就是产品判断的雏形——你已经在做「该不该做」的取舍了。</div>
                          </div>
                        </div>
                      )}
                      {/* CTA */}
                      {s.id === 'cta' && (
                        <div className="py-4 text-center">
                          <h3 className="font-display text-2xl font-semibold">见微知著，行远自迩。</h3>
                          <p className="mx-auto mt-2 max-w-[28em] text-sm text-ink-500">从职业轨迹的细微信号中形成判断，用一次次真实行动验证方向。</p>
                          <Link to="/workspace" className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-brand-800 hover:shadow-md">开始推演 <ArrowRight /></Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-gradient-to-b from-paper to-[#F4EEE4] px-6 pb-8 pt-12 text-ink-500">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-[10px] text-base text-ink-800">
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white"><CompassIcon /></span>见微行远
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">原始文件本地解析<br/>仅在授权后发送脱敏结构化信号</p>
          </div>
          <nav className="flex flex-col gap-[11px] text-sm">
            <button type="button" onClick={() => setOpenSection('capabilities')} className="text-left text-ink-600 transition-colors hover:text-brand-700">能力详解</button>
            <Link to="/workspace" className="text-ink-600 transition-colors hover:text-brand-700">开始推演</Link>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left text-ink-600 transition-colors hover:text-brand-700">回到顶部</button>
          </nav>
        </div>
        <div className="mx-auto mt-8 max-w-[1120px] border-t border-line pt-5 text-center text-[12.5px] text-ink-400">© 2026 见微行远 · 原始文件本地解析 · 授权后临时处理</div>
      </footer>
    </div>
  );
}






