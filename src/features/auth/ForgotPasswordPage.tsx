import { useState } from 'react';
import { Link } from 'react-router';
import { apiFetch } from '../../shared/api/fetch';
import { BrandMark } from '../../shared/components/BrandMark';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setErrorMsg('请输入邮箱地址'); setState('error'); return; }
    setState('loading');
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/v1/auth/password/forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.detail === 'string' ? d.detail : '请求失败');
      }
      setState('sent');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '请求失败，请重试');
      setState('error');
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <BrandMark size={40} className="text-ink-900" />
          <p className="mt-3 text-sm font-bold text-ink-900">见微行远</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6">
          <h1 className="text-lg font-bold text-ink-900">找回密码</h1>
          <p className="mt-1 text-sm text-ink-500">输入注册邮箱，我们将发送重置链接。</p>

          {state === 'sent' ? (
            <div className="mt-6 rounded-xl border border-success-500/20 bg-success-50 p-4 text-center">
              <p className="text-sm font-medium text-success-700">重置链接已发送</p>
              <p className="mt-1 text-xs text-success-600">如果该邮箱已注册，你会收到重置链接，请检查收件箱（含垃圾邮件）</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="fp-email">邮箱</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                />
              </div>
              {state === 'error' && errorMsg && (
                <p className="text-xs text-red-600">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
              >
                {state === 'loading' ? '发送中...' : '发送重置链接'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-ink-400 transition-colors hover:text-ink-700">返回登录</Link>
        </div>
      </div>
    </div>
  );
}
