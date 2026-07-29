import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    num: '01',
    title: '选择你的起点',
    desc: '告诉我们你当前的职业或专业方向。不需要精确，一个大致方向就够。',
    icon: 'M12 2l2.4 7.4H22l-6 4.3 2.3 7.3L12 17l-6.3 4 2.3-7.3-6-4.3h7.6z',
  },
  {
    num: '02',
    title: '获取路径推演',
    desc: '生涯向量模型基于群体轨迹数据，为你生成三条候选路径。每条路径都标注来源和不确定性。',
    icon: 'M3 3v18h18M7 14l3-3 3 3 4-5',
  },
  {
    num: '03',
    title: '验证并行动',
    desc: '选择一条路径，获取最小验证行动。方向不是测出来的，是走出来的——用真实反馈替代猜测。',
    icon: 'M20 6L9 17l-5-5',
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)] px-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(212,85,59,0.07),transparent_70%)]" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(62,142,107,0.06),transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress dots */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <button key={s.num} type="button" onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-7 bg-brand-600' : i < step ? 'w-1.5 bg-brand-300' : 'w-1.5 bg-ink-900/10'}`} />
          ))}
        </div>

        {/* Step card */}
        <div className="rounded-2xl border border-line/70 bg-white/90 p-7 shadow-[0_0_0_1px_rgba(33,29,26,0.03),0_8px_32px_-8px_rgba(33,29,26,0.08),0_24px_64px_-16px_rgba(181,71,46,0.05)] backdrop-blur-sm sm:p-9">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><path d={STEPS[step].icon} /></svg>
            </span>
            <div>
              <span className="text-xs font-semibold text-brand-600">步骤 {STEPS[step].num}</span>
              <h1 className="font-display text-xl font-semibold tracking-tight text-ink-900">{STEPS[step].title}</h1>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink-600">{STEPS[step].desc}</p>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-500 transition-all hover:text-ink-700 disabled:opacity-30">
              上一步
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(181,71,46,0.4)] transition-all duration-300 hover:-translate-y-px hover:bg-brand-800 active:scale-95">
                下一步
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
              </button>
            ) : (
              <button type="button" onClick={() => navigate('/workspace')}
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(181,71,46,0.4)] transition-all duration-300 hover:-translate-y-px hover:bg-brand-800 active:scale-95">
                开始推演
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Anonymous vs Login choice */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-ink-400">或者</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/workspace')}
              className="rounded-full border border-line bg-white/80 px-5 py-2 text-sm font-medium text-ink-600 backdrop-blur-sm transition-all hover:border-brand-300 hover:text-brand-700 active:scale-95">
              匿名直接使用
            </button>
            <button type="button" onClick={() => navigate('/login')}
              className="rounded-full border border-line bg-white/80 px-5 py-2 text-sm font-medium text-ink-600 backdrop-blur-sm transition-all hover:border-brand-300 hover:text-brand-700 active:scale-95">
              登录 / 注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


