import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../shared/api/fetch';
import { BrandMark } from '../../shared/components/BrandMark';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setErrorMsg('密码至少 6 位'); setState('error'); return; }
    if (password !== confirm) { setErrorMsg('两次输入的密码不一致'); setState('error'); return; }
    if (!token) { setErrorMsg('缺少重置令牌，请重新从邮件中点击链接'); setState('error'); return; }
    setState('loading');
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/v1/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.detail === 'string' ? d.detail : '重置失败');
      }
      setState('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '重置失败，请重试');
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
          <h1 className="text-lg font-bold text-ink-900">重置密码</h1>

          {state === 'done' ? (
            <div className="mt-6 rounded-xl border border-success-500/20 bg-success-50 p-4 text-center">
              <p className="text-sm font-medium text-success-700">密码已重置</p>
              <Link to="/login" className="mt-2 inline-block rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white hover:bg-ink-700">
                去登录
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="rp-pass">新密码</label>
                <input id="rp-pass" type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (state === 'error') setState('idle'); }} placeholder="至少 6 位" className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20" autoComplete="new-password" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="rp-confirm">确认密码</label>
                <input id="rp-confirm" type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); if (state === 'error') setState('idle'); }} placeholder="再次输入" className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20" autoComplete="new-password" />
              </div>
              {state === 'error' && errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
              <button type="submit" disabled={state === 'loading'} className="w-full rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-50">
                {state === 'loading' ? '重置中...' : '重置密码'}
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
