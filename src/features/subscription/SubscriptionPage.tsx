import { useState } from 'react';
import { Link } from 'react-router';
import { useSubscription, useUpgradeSubscription } from '../../shared/api/hooks-growth';

const TIERS = [
  { id: 'free', name: '免费版', desc: '基础职业导航，每日 3 次分析', price: '¥0', popular: false, features: ['每日 3 次路径分析', '职业库浏览', '基础证据台账'] },
  { id: 'basic', name: '基础版', desc: '无限分析 + 证据管理 + 行动跟踪', price: '¥29/月', popular: false, features: ['不限次数路径分析', '证据文档管理', '行动实验跟踪', '决策记录'] },
  { id: 'sprint', name: '冲刺版', desc: '全部功能 + 优先队列 + 深度报告', price: '¥79/月', popular: true, features: ['基础版全部功能', '优先生成队列', '深度路径报告', '市场雷达完整版'] },
  { id: 'companion', name: '陪跑版', desc: '1v1 导航问答 + 专属路径规划', price: '¥199/月', popular: false, features: ['冲刺版全部功能', '1v1 导航问答', '专属路径规划', '季度复盘陪跑'] },
];

export function SubscriptionPage() {
  const { data: sub, isLoading, isError } = useSubscription();
  const upgrade = useUpgradeSubscription();
  const [payHtml, setPayHtml] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleUpgrade(tier: string) {
    setError('');
    setPayHtml(null);
    try {
      const res = await upgrade.mutateAsync({ tier });
      if (res.pay_form_html) {
        setPayHtml(res.pay_form_html);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '升级失败');
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <Link to="/app/settings" className="inline-flex items-center gap-1 text-xs font-medium text-ink-400 transition-colors hover:text-ink-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
          返回设置
        </Link>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">订阅管理</h1>
        <p className="mt-1 text-sm text-ink-500">选择适合你的方案，解锁更多导航能力</p>
      </section>

      {/* Current subscription */}
      {isLoading && <div className="h-16 animate-pulse rounded-xl bg-ink-100/40" />}
      {isError && <div className="rounded-xl border border-line bg-surface p-4 text-center text-sm text-ink-500">加载订阅信息失败</div>}
      {!isLoading && !isError && sub && (
        <div className="rounded-xl border border-accent-200 bg-accent-50/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-800">当前方案：{TIERS.find(t => t.id === sub.tier)?.name ?? sub.tier}</p>
              <p className="mt-0.5 text-xs text-ink-500">状态：{sub.status}{sub.expires_at ? ` · 到期 ${new Date(sub.expires_at).toLocaleDateString('zh-CN')}` : ''}</p>
            </div>
            <span className="rounded-full bg-accent-100 px-2.5 py-1 text-[10px] font-medium text-accent-700">{sub.tier}</span>
          </div>
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TIERS.map((tier) => {
          const isCurrent = sub?.tier === tier.id;
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-xl border p-5 transition-all duration-300 ${
                tier.popular
                  ? 'border-brand-300 bg-gradient-to-b from-brand-50/60 to-surface shadow-[0_8px_30px_-12px_rgba(196,85,59,0.25)]'
                  : isCurrent
                    ? 'border-accent-300 bg-accent-50/30'
                    : 'border-line bg-surface hover:border-ink-200 hover:-translate-y-0.5 hover:shadow-card'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-2.5 left-5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  最受欢迎
                </span>
              )}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{tier.name}</h3>
                  <p className="mt-0.5 text-[11px] text-ink-400">{tier.desc}</p>
                </div>
                <p className={`shrink-0 text-sm font-bold ${tier.popular ? 'text-brand-600' : 'text-ink-900'}`}>{tier.price}</p>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-ink-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && tier.id !== 'free' && (
                <button
                  onClick={() => void handleUpgrade(tier.id)}
                  disabled={upgrade.isPending}
                  className={`mt-4 w-full rounded-lg py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:shadow-[0_4px_12px_rgba(196,85,59,0.3)]'
                      : 'bg-ink-900 hover:bg-ink-700'
                  }`}
                >
                  {upgrade.isPending ? '处理中...' : `升级到${tier.name}`}
                </button>
              )}
              {isCurrent && (
                <p className="mt-4 rounded-lg border border-accent-200 bg-accent-100/40 py-1.5 text-center text-xs font-medium text-accent-700">当前方案</p>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Payment form (sandboxed iframe) */}
      {payHtml && (
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-ink-800">请在下方完成支付</p>
          <iframe
            srcDoc={payHtml}
            sandbox="allow-scripts allow-forms"
            referrerPolicy="no-referrer"
            className="h-64 w-full rounded-lg border border-line"
            title="支付表单"
          />
        </div>
      )}
    </div>
  );
}
