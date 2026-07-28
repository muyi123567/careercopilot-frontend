import { useState } from 'react';
import { useAuth } from './useAuth';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, register, loading, error } = useAuth();

  function validate(): boolean {
    setLocalError('');
    if (!email.trim()) { setLocalError('请输入邮箱地址'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setLocalError('邮箱格式不正确'); return false; }
    if (password.length < 6) { setLocalError('密码至少 6 位'); return false; }
    if (tab === 'register' && password !== confirmPassword) { setLocalError('两次输入的密码不一致'); return false; }
    if (!agreed) { setLocalError('请先阅读并同意用户协议和隐私政策'); return false; }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const ok = tab === 'login' ? await login(email, password) : await register(email, password);
    if (ok) onSuccess();
  }

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-ink-900/[0.04] p-1">
        <button type="button" className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setLocalError(''); }}>
          登录
        </button>
        <button type="button" className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setLocalError(''); }}>
          注册
        </button>
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="auth-email">邮箱</label>
        <input id="auth-email" type="email" className="auth-input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
      </div>

      {/* Password */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="auth-password">密码</label>
        <input id="auth-password" type="password" className="auth-input" placeholder="至少 6 位密码" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
      </div>

      {/* Confirm password (register only) */}
      {tab === 'register' && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="auth-confirm">确认密码</label>
          <input id="auth-confirm" type="password" className="auth-input" placeholder="再次输入密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} autoComplete="new-password" />
        </div>
      )}

      {/* Agreement */}
      <label className="flex items-start gap-2.5 text-xs text-ink-500 cursor-pointer select-none">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 rounded border-line text-brand-600 accent-[oklch(52%_0.21_36)]" />
        <span>我已阅读并同意<a href="#" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">《用户协议》</a>和<a href="#" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">《隐私政策》</a></span>
      </label>

      {/* Error */}
      {displayError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{displayError}</p>
      )}

      {/* Submit */}
      <button type="submit" className="auth-btn-primary" disabled={loading || !agreed}>
        {loading ? <><span className="auth-spinner" />{tab === 'login' ? '登录中…' : '注册中…'}</> : <>{tab === 'login' ? '登录' : '创建账户'}</>}
      </button>
    </form>
  );
}
