import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { LoginForm } from './LoginForm';
import './auth.css';

const CompassIcon = ({ size }: { size?: number }) => (
  <svg width={size ?? 24} height={size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleAuthSuccess() {
    navigate('/app');
  }

  return (
    <div className="auth-page-enter flex min-h-[100dvh]">
      {/* Left: Dark animated brand panel */}
      <div className="relative hidden w-[48%] flex-col items-center justify-center overflow-hidden bg-ink-900 lg:flex">
        {/* Breathing orbs */}
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-500/[0.15] blur-[100px] animate-[breathe_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-brand-700/[0.12] blur-[80px] animate-[breathe_8s_ease-in-out_infinite_1.5s]" />
        <div className="absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-gold-400/[0.08] blur-[70px] animate-[breathe_7s_ease-in-out_infinite_0.8s]" />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '70px 70px' }} />
        {/* Dashed paths */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 500 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M60 100 C160 180, 300 150, 440 280" stroke="rgba(196,85,59,0.5)" strokeWidth="1" strokeDasharray="5 4" />
          <path d="M40 280 C140 350, 280 320, 460 450" stroke="rgba(196,85,59,0.3)" strokeWidth="1" strokeDasharray="5 4" />
          <path d="M80 450 C180 530, 320 500, 480 620" stroke="rgba(196,85,59,0.2)" strokeWidth="1" strokeDasharray="5 4" />
          <circle cx="440" cy="280" r="3" fill="rgba(196,85,59,0.5)" className="animate-pulse" />
          <circle cx="460" cy="450" r="2.5" fill="rgba(196,85,59,0.35)" className="animate-pulse" />
        </svg>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_0_30px_rgba(196,85,59,0.3)]">
            <CompassIcon size={32} />
          </span>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">
            从真实轨迹，<br />看清下一程
          </h1>
          <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-white/50">
            证据型职业导航，用你的真实经历生成可验证的下一步行动
          </p>
          <div className="mt-10 flex items-center gap-3 text-[11px] text-white/30">
            <span>本地解析</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>临时处理</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>不留存</span>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-paper px-6 py-12">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-32 top-[15%] h-64 w-64 rounded-full bg-brand-500/[0.06] blur-[80px]" />
        <div className="pointer-events-none absolute -left-20 bottom-[10%] h-48 w-48 rounded-full bg-gold-400/[0.05] blur-[60px]" />

        <div className="auth-card relative z-10 w-full max-w-[380px] p-8 sm:p-10">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <CompassIcon size={22} />
            </span>
            <p className="mt-3 text-sm font-bold text-ink-900">见微行远</p>
          </div>

          {/* Title */}
          <h2 className="mb-8 text-center text-lg font-bold tracking-tight text-ink-900 lg:text-left">
            欢迎回来
          </h2>

          {/* WeChat */}
          <button type="button" onClick={() => showToast('请在微信小程序中搜索「见微行远」一键登录')} className="auth-btn-wechat mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-4.024 0-7.291 2.703-7.291 6.037 0 3.335 3.267 6.038 7.291 6.038.828 0 1.622-.118 2.367-.334a.72.72 0 0 1 .598.08l1.584.926a.272.272 0 0 0 .14.045c.133 0 .241-.108.241-.241 0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 0 1 .177-.553C23.028 18.572 24 16.89 24 14.895c0-3.334-3.267-6.037-7.062-6.037zm-2.813 3.085c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>
            微信登录
          </button>

          {/* QQ login */}
          <button type="button" onClick={() => showToast('QQ互联登录即将开放，敬请期待')} className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[#12B7F5]/30 py-[0.7rem] text-sm font-medium text-[#12B7F5] transition-all duration-200 hover:border-[#12B7F5]/50 hover:bg-[#12B7F5]/[0.04] hover:shadow-[0_2px_12px_-3px_rgba(18,183,245,0.18)] hover:-translate-y-px">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.215 0 6.293.256 6.293-.43 0-.687-1.772-1.182-1.772-1.182 2.087-1.77 1.906-3.967 1.906-3.967.847 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.293 3.364 14.268 2 12.003 2z"/></svg>
            QQ登录
          </button>
          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[11px] text-ink-300">或用邮箱</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Email form */}
          <LoginForm onSuccess={handleAuthSuccess} />

          {/* Footer links */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/forgot-password" className="text-xs text-ink-400 transition-colors hover:text-brand-600">忘记密码？</Link>
            <span className="h-3 w-px bg-line" />
            <Link to="/" className="text-xs text-ink-400 transition-colors hover:text-ink-700">返回首页</Link>
          </div>
        </div>

        {/* Anonymous explore - below card */}
        <button type="button" onClick={() => navigate('/occupations')} className="relative z-10 mt-6 text-xs font-medium text-ink-400 underline decoration-line underline-offset-4 transition-colors hover:text-brand-600 hover:decoration-brand-300">
          不登录，先匿名探索职业库 →
        </button>
      </div>

      {/* Toast */}
      {toast && <div className="auth-toast">{toast}</div>}
    </div>
  );
}
