import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import './auth.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleAuthSuccess() {
    navigate('/workspace');
  }

  return (
    <div className="auth-page-enter relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)] px-4 py-12">
      {/* Background decorative glows */}
      <div className="auth-brand-glow" style={{ top: '-80px', left: '-60px' }} aria-hidden="true" />
      <div className="auth-brand-glow" style={{ bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(62,142,107,0.12), transparent 70%)' }} aria-hidden="true" />

      {/* Subtle contour pattern */}
      <svg className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.06]" aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#9A9088" strokeWidth="1">
          <ellipse cx="1180" cy="172" rx="86" ry="60"/><ellipse cx="1193" cy="162" rx="122" ry="84"/><ellipse cx="1206" cy="151" rx="206" ry="142"/>
          <ellipse cx="232" cy="742" rx="80" ry="54"/><ellipse cx="219" cy="757" rx="114" ry="76"/><ellipse cx="206" cy="772" rx="194" ry="128"/>
        </g>
      </svg>

      <div className="auth-layout relative z-10 grid w-full max-w-[960px] gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Left: Brand panel */}
        <div className="auth-brand-panel hidden lg:block">
          <Link to="/" className="mb-8 inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-ink-900">Career<b className="text-brand-700">Copilot</b></span>
          </Link>

          <h1 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.15] tracking-tight text-ink-900">
            先想清楚方向，<br/>再投出每一份简历。
          </h1>

          <p className="mt-4 max-w-[28em] text-[15px] leading-relaxed text-ink-600">
            结构化推演帮你看清职业路径。无需上传简历，授权后才发送脱敏信号。
          </p>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-col gap-3">
            {[
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: '原始文件始终在本地解析' },
              { icon: 'M20 6L9 17l-5-5', text: '仅在明确授权后发送结构化信号' },
              { icon: 'M18 6L6 18M6 6l12 12', text: '随时关闭，不留任何痕迹' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d={item.icon}/></svg>
                </span>
                <span className="text-sm text-ink-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login card */}
        <div className="auth-card p-7 sm:p-9 lg:p-10">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
            </span>
            <span className="font-display text-lg font-bold text-ink-900">Career<b className="text-brand-700">Copilot</b></span>
          </div>

          {/* Anonymous entry (most prominent) */}
          <button type="button" className="auth-btn-anonymous mb-6" onClick={() => navigate('/workspace')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
            匿名开始推演
          </button>
          <p className="mb-7 text-center text-[11px] leading-relaxed text-ink-400">无需注册 · 不上传简历 · 不留存 · 随时关闭</p>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-ink-400">或使用邮箱</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Login/Register form */}
          <LoginForm onSuccess={handleAuthSuccess} />

          {/* WeChat placeholder */}
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs text-ink-400">其他方式</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <button type="button" className="auth-btn-wechat" onClick={() => showToast('微信扫码登录正在开发中，敬请期待')}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-4.024 0-7.291 2.703-7.291 6.037 0 3.335 3.267 6.038 7.291 6.038.828 0 1.622-.118 2.367-.334a.72.72 0 0 1 .598.08l1.584.926a.272.272 0 0 0 .14.045c.133 0 .241-.108.241-.241 0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 0 1 .177-.553C23.028 18.572 24 16.89 24 14.895c0-3.334-3.267-6.037-7.062-6.037zm-2.813 3.085c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>
              微信登录（即将上线）
            </button>
          </div>

          {/* Back to home */}
          <div className="mt-9 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-xs text-ink-400 transition-colors hover:text-brand-700"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>返回首页</Link>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="auth-toast">{toast}</div>}
    </div>
  );
}


