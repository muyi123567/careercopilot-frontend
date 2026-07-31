import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../shared/api/fetch';
import { BrandMark } from '../../shared/components/BrandMark';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('error'); setErrorMsg('缺少验证令牌'); return; }
    (async () => {
      try {
        const res = await apiFetch('/api/v1/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(typeof d.detail === 'string' ? d.detail : '验证失败');
        }
        setState('success');
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : '验证失败');
        setState('error');
      }
    })();
  }, [token]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex flex-col items-center">
          <BrandMark size={40} className="text-ink-900" />
          <p className="mt-3 text-sm font-bold text-ink-900">见微行远</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6">
          {state === 'verifying' && (
            <>
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent-200 border-t-accent-500" />
              <h1 className="text-lg font-bold text-ink-900">验证中...</h1>
              <p className="mt-1 text-sm text-ink-500">正在确认你的邮箱地址</p>
            </>
          )}

          {state === 'success' && (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 h-10 w-10 text-success-500" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-lg font-bold text-ink-900">邮箱验证成功</h1>
              <p className="mt-1 text-sm text-ink-500">你的账户已激活，可以开始使用了。</p>
              <Link to="/login" className="mt-4 inline-block rounded-lg bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700">
                去登录
              </Link>
            </>
          )}

          {state === 'error' && (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 h-10 w-10 text-red-400" aria-hidden="true">
                <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h1 className="text-lg font-bold text-ink-900">验证失败</h1>
              <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
              <button
                onClick={async () => {
                  try {
                    await apiFetch('/api/v1/auth/verify-email/resend', { method: 'POST' });
                    setErrorMsg('验证邮件已重新发送，请检查收件箱');
                  } catch { setErrorMsg('重发失败，请稍后重试'); }
                }}
                className="mt-4 rounded-lg border border-line px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50"
              >
                重新发送验证邮件
              </button>
            </>
          )}
        </div>

        <div className="mt-6">
          <Link to="/login" className="text-xs text-ink-400 transition-colors hover:text-ink-700">返回登录</Link>
        </div>
      </div>
    </div>
  );
}
