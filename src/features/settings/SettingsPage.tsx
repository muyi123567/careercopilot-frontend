import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredAuth, clearStoredAuth } from '../auth/useAuth';

export function SettingsPage() {
  const navigate = useNavigate();
  const auth = getStoredAuth();
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleLogout() {
    clearStoredAuth();
    navigate('/login');
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">用户设置</p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">账户与偏好</h1>
      </div>

      {/* Account section */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base font-semibold text-ink-800">账户信息</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink-700">登录状态</p>
              <p className="text-xs text-ink-400">{auth.uid ? `已登录：${auth.uid}` : '匿名会话（未登录）'}</p>
            </div>
            <span className={`h-2.5 w-2.5 rounded-full ${auth.uid ? 'bg-teal-500' : 'bg-ink-300'}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink-700">Token 有效期</p>
              <p className="text-xs text-ink-400">JWT HS256 · 2 小时自动过期</p>
            </div>
            <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-[11px] font-medium text-gold-600">2h</span>
          </div>
        </div>
        {auth.uid && (
          <button type="button" onClick={handleLogout}
            className="mt-4 rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100 active:scale-95">
            退出登录
          </button>
        )}
      </div>

      {/* Notification preferences */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base font-semibold text-ink-800">通知偏好</h2>
        <p className="mt-1 text-xs text-ink-400">检查点提醒仅在登录后可用</p>
        <div className="mt-4 space-y-3">
          {[
            { label: '7 天检查点提醒', desc: '行动开始后第 7 天提醒回填', enabled: false },
            { label: '30 天检查点提醒', desc: '行动开始后第 30 天提醒回填', enabled: false },
            { label: '90 天检查点提醒', desc: '行动开始后第 90 天提醒最终复盘', enabled: false },
            { label: '市场雷达周报', desc: '每周一推送关注职业的市场变化', enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink-700">{item.label}</p>
                <p className="text-xs text-ink-400">{item.desc}</p>
              </div>
              <button type="button" onClick={() => showToast('通知功能需要登录后启用')}
                className={`relative h-6 w-11 rounded-full transition-colors ${item.enabled ? 'bg-brand-600' : 'bg-ink-900/10'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data management */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base font-semibold text-ink-800">数据管理</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => showToast('数据导出功能即将上线')}
            className="rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium text-ink-600 transition-all hover:border-brand-400 hover:text-brand-700 hover:shadow-sm active:scale-95">
            导出我的数据
          </button>
          <button type="button" onClick={() => showToast('账户注销功能即将上线')}
            className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100 active:scale-95">
            注销账户
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-400">导出格式为 JSON，包含所有推演记录、证据、行动和决策快照。注销将永久删除所有数据，不可恢复。</p>
      </div>

      {/* About */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base font-semibold text-ink-800">关于</h2>
        <div className="mt-3 space-y-2 text-sm text-ink-600">
          <p>见微行远 EvidWay V2 · 证据优先的职业导航</p>
          <p className="text-xs text-ink-400">版本 0.1.0 · 本地开发模式 · 不展示未经校准的成功率</p>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink-900 px-6 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}



