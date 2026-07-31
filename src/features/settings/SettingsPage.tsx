import { Link } from 'react-router-dom';
import { useCookieAuth } from '../../shared/auth/AuthContext';
import { useCredits } from '../../shared/api/hooks';

function SettingRow({ label, value, to }: { label: string; value?: string; to?: string }) {
  const inner = (
    <div className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-ink-100/30">
      <span className="text-sm text-ink-700">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-ink-400">{value}</span>}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-ink-300" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
  if (to) return <Link to={to} className="block">{inner}</Link>;
  return <button className="block w-full text-left">{inner}</button>;
}

export function SettingsPage() {
  const { user, logout } = useCookieAuth();
  const { data: credits } = useCredits();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">设置</h1>
      </section>

      {/* Account */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">账户安全</p>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <SettingRow label="账户邮箱" value={user?.user_id ?? ''} />
          <SettingRow label="修改密码" />
          <SettingRow label="绑定手机号" value="未绑定" />
        </div>
      </div>

      {/* Subscription & credits */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">订阅与积分</p>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <SettingRow label="当前套餐" value={credits?.plan ?? 'free'} />
          <SettingRow label="积分余额" value={String(credits?.balance ?? 0)} />
          <SettingRow label="消费记录" />
        </div>
      </div>

      {/* Preferences */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">通知偏好</p>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <SettingRow label="推荐行动通知" value="已开启" />
          <SettingRow label="市场雷达提醒" value="已关闭" />
        </div>
      </div>

      {/* About */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">关于</p>
        <div className="divide-y divide-line rounded-xl border border-line bg-surface">
          <Link to="/privacy" className="block"><SettingRow label="隐私政策" /></Link>
          <Link to="/terms" className="block"><SettingRow label="用户协议" /></Link>
          <SettingRow label="版本" value="0.1.0" />
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => void logout()}
        className="w-full rounded-xl border border-red-200 bg-red-50/50 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
      >
        退出登录
      </button>

      <p className="text-center text-[10px] text-ink-300">见微行远 EvidWay · 从真实轨迹，看清下一程</p>
    </div>
  );
}
