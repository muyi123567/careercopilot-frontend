import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { BrandMark } from '../../shared/components/BrandMark';

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
    <div className="flex min-h-[100dvh] bg-paper">
      {/* Left: Brand visual (hidden on mobile) */}
      <div className="relative hidden w-[55%] flex-col items-center justify-center overflow-hidden bg-paper lg:flex">
        {/* Decorative path lines SVG */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" viewBox="0 0 600 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M80 120 C200 200, 350 180, 520 320" stroke="rgba(33,29,26,0.06)" strokeWidth="1.5" strokeDasharray="6 4" />
          <path d="M60 300 C180 380, 320 350, 540 500" stroke="rgba(33,29,26,0.04)" strokeWidth="1.5" strokeDasharray="6 4" />
          <path d="M100 500 C220 580, 380 540, 560 680" stroke="rgba(33,29,26,0.03)" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="520" cy="320" r="3" fill="rgba(217,119,6,0.2)" />
          <circle cx="540" cy="500" r="2.5" fill="rgba(217,119,6,0.15)" />
          <circle cx="560" cy="680" r="2" fill="rgba(217,119,6,0.1)" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center">
          <BrandMark size={80} className="text-ink-900" animate />
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-ink-900 xl:text-3xl">
            从真实轨迹，<br />看清下一程
          </h1>
          <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-ink-500">
            证据型职业导航，用你的真实经历生成可验证的下一步行动
          </p>
        </div>
      </div>

      {/* Right: Form area */}
      <div className="flex flex-1 flex-col justify-center bg-surface px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile brand header */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <BrandMark size={40} className="text-ink-900" />
            <p className="mt-3 text-sm font-bold text-ink-900">见微行远</p>
            <p className="mt-1 text-xs text-ink-400">从真实轨迹，看清下一程</p>
          </div>

          {/* Desktop title */}
          <h2 className="mb-8 hidden text-xl font-bold tracking-tight text-ink-900 lg:block">
            登录 见微行远
          </h2>

          {/* WeChat login */}
          <button
            type="button"
            onClick={() => showToast('请在微信小程序中搜索「见微行远」一键登录')}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100/50"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5 text-[#07C160]"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-4.024 0-7.291 2.703-7.291 6.037 0 3.335 3.267 6.038 7.291 6.038.828 0 1.622-.118 2.367-.334a.72.72 0 0 1 .598.08l1.584.926a.272.272 0 0 0 .14.045c.133 0 .241-.108.241-.241 0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 0 1 .177-.553C23.028 18.572 24 16.89 24 14.895c0-3.334-3.267-6.037-7.062-6.037zm-2.813 3.085c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>
            微信登录
          </button>

          {/* Anonymous explore */}
          <button
            type="button"
            onClick={() => navigate('/occupations')}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100/50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4.5 w-4.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            匿名探索职业
          </button>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-ink-400">或</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Email login/register form */}
          <LoginForm onSuccess={handleAuthSuccess} />

          {/* Forgot password + Back to home */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/forgot-password" className="text-xs text-ink-400 transition-colors hover:text-accent-600">
              忘记密码？
            </Link>
            <span className="h-3 w-px bg-line" />
            <Link to="/" className="text-xs text-ink-400 transition-colors hover:text-ink-700">
              返回首页
            </Link>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm text-white shadow-lift">
          {toast}
        </div>
      )}
    </div>
  );
}
