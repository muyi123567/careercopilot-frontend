import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCookieAuth } from '../../shared/auth/AuthContext';
import { useCredits } from '../../shared/api/hooks';
import { AlertDialog } from '../../shared/components/ui/AlertDialog';

function BindingCard({ icon, label, value, bound }: { icon: React.ReactNode; label: string; value: string; bound?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-4 transition-shadow hover:shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100/60">{icon}</span>
        <div>
          <p className="text-sm font-medium text-ink-800">{label}</p>
          <p className="text-xs text-ink-400">{value}</p>
        </div>
      </div>
      {bound ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          已绑定
        </span>
      ) : (
        <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50">绑定</button>
      )}
    </div>
  );
}

export function SettingsPage() {
  const { user, logout } = useCookieAuth();
  const { data: credits } = useCredits();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Title */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">设置</h1>
        <p className="mt-1 text-sm text-ink-500">管理你的账户、订阅和偏好</p>
      </section>

      {/* User profile card (AnySearch-style) */}
      <section className="flex items-center gap-4 rounded-xl border border-line bg-surface p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-line bg-ink-100 text-xl font-bold text-ink-500">
          {(user?.display_name ?? 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-ink-900">{user?.display_name ?? '探索者'}</p>
          <p className="text-sm text-ink-400">{user?.user_id ?? 'user@evidway.cn'}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6.4-4.8L5.6 21.2 8 14 2 9.2h7.6z"/></svg>
            {credits?.plan ?? 'free'} 套餐
          </span>
        </div>
      </section>

      {/* Binding section */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-800">账户绑定</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <BindingCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-ink-500"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
            label="邮箱"
            value={user?.user_id ?? '未绑定'}
            bound={!!user?.user_id}
          />
          <BindingCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-ink-500"><path d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"/></svg>}
            label="手机号"
            value="未绑定"
          />
          <BindingCard
            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#07C160]"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-4.024 0-7.29 2.728-7.29 6.09 0 3.363 3.266 6.09 7.29 6.09.828 0 1.622-.118 2.367-.334a.72.72 0 01.598.08l1.584.93a.272.272 0 00.14.045c.133 0 .242-.108.242-.242 0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 01.177-.554C23.028 18.572 24 16.862 24 14.949c0-3.362-3.266-6.09-7.062-6.09zm-2.344 3.36c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.688 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/></svg>}
            label="微信"
            value="未绑定"
          />
          <BindingCard
            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#12B7F5]"><path d="M12.003 2C6.004 2 1.5 5.686 1.5 10.186c0 2.56 1.394 4.84 3.563 6.354.164.114.263.3.263.5v2.39c0 .39.453.623.78.4l2.576-1.72a.9.9 0 01.72-.12c.83.22 1.7.34 2.6.34 5.999 0 10.5-3.686 10.5-8.186S17.999 2 12.003 2zM8.25 8.25a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25zm7.5 0a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25z"/></svg>}
            label="QQ"
            value="未绑定"
          />
        </div>
      </section>

      {/* Subscription & credits */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-800">订阅与积分</h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <Link to="/app/subscription" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-ink-100/30">
            <span className="text-sm text-ink-700">当前套餐</span>
            <span className="flex items-center gap-2 text-sm font-medium text-brand-600">{credits?.plan ?? 'free'}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-ink-300"><path d="M9 5l7 7-7 7"/></svg></span>
          </Link>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-ink-700">积分余额</span>
            <span className="text-sm font-semibold text-ink-900">{credits?.balance ?? '—'}</span>
          </div>
          <Link to="/app/credits/history" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-ink-100/30">
            <span className="text-sm text-ink-700">消费记录</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-ink-300"><path d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-800">通知偏好</h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <div className="flex items-center justify-between px-5 py-4"><span className="text-sm text-ink-700">推荐行动通知</span><span className="text-xs font-medium text-success-600">已开启</span></div>
          <div className="flex items-center justify-between px-5 py-4"><span className="text-sm text-ink-700">市场雷达提醒</span><span className="text-xs font-medium text-ink-400">已关闭</span></div>
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-800">关于</h2>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <Link to="/privacy" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-ink-100/30"><span className="text-sm text-ink-700">隐私政策</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-ink-300"><path d="M9 5l7 7-7 7"/></svg></Link>
          <Link to="/terms" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-ink-100/30"><span className="text-sm text-ink-700">用户协议</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-ink-300"><path d="M9 5l7 7-7 7"/></svg></Link>
          <div className="flex items-center justify-between px-5 py-4"><span className="text-sm text-ink-700">联系我们</span><span className="text-xs text-ink-400">support@evidway.cn</span></div>
          <div className="flex items-center justify-between px-5 py-4"><span className="text-sm text-ink-700">版本</span><span className="text-xs text-ink-400">0.1.0</span></div>
        </div>
      </section>

      {/* Logout */}
      <button onClick={() => setLogoutOpen(true)} className="w-full rounded-xl border border-red-200 bg-red-50/50 py-3.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50">退出登录</button>

      <AlertDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={() => void logout()} title="退出登录" description="确定要退出当前账户吗？未保存的内容不会丢失。" confirmLabel="退出" variant="danger" />

      <p className="text-center text-[10px] text-ink-300">见微行远 EvidWay · 从真实轨迹，看清下一程</p>
    </div>
  );
}
