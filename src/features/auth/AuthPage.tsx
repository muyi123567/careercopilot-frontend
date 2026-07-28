/**
 * 登录/注册页面。
 * 邮箱 + 密码，HS256 JWT 认证。
 */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJwtAuth } from '../../shared/auth/AuthContext';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, register } = useJwtAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码。');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位。');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>CareerCopilot</h1>
        <p className="auth-subtitle">
          {mode === 'login' ? '登录你的账户' : '创建新账户'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">邮箱</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={busy}
          />

          <label htmlFor="auth-password">密码</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="至少 6 位"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            disabled={busy}
          />

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" disabled={busy}>
            {busy ? '处理中…' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? '还没有账户？' : '已有账户？'}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? '注册' : '登录'}
          </button>
        </p>

        <p className="auth-demo-hint">
          不想注册？<a href="#/">返回匿名 Demo</a>，无需账户即可体验。
        </p>
      </div>
    </main>
  );
}

