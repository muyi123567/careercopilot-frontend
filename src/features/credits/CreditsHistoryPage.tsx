import { useState } from 'react';
import { Link } from 'react-router';
import { useCreditsHistory } from '../../shared/api/hooks-growth';

export function CreditsHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useCreditsHistory(page);

  return (
    <div className="space-y-5">
      <section>
        <Link to="/app/settings" className="inline-flex items-center gap-1 text-xs font-medium text-ink-400 transition-colors hover:text-ink-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
          返回设置
        </Link>
        <h1 className="mt-3 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">积分记录</h1>
        <p className="mt-1 text-sm text-ink-500">查看积分的获取和消耗明细</p>
      </section>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="flex justify-between"><div className="h-3.5 w-32 rounded bg-ink-200" /><div className="h-3.5 w-16 rounded bg-ink-100" /></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载积分记录失败。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2">重试</button>
        </div>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-surface/50 p-10 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-16 w-16 text-ink-300" aria-hidden="true">
            <circle cx="40" cy="34" r="16" />
            <path d="M40 22v24" />
            <path d="M46 28c-2.5-2-8.5-2-8.5 1.5 0 3 8 2.5 8 5.5 0 3.5-6 3-8.5 1" />
            <path d="M28 58h24M30 66h20" strokeDasharray="3 2" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">还没有积分记录</p>
          <p className="mt-1 text-xs text-ink-400">完成签到、上传证据等操作后会获得积分。</p>
        </div>
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-ink-50/40">
                <div className="min-w-0">
                  <p className="text-sm text-ink-800">{item.reason}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{new Date(item.created_at).toLocaleString('zh-CN')}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${item.amount >= 0 ? 'bg-success-50 text-success-600' : 'bg-red-50 text-red-500'}`}>
                  {item.amount >= 0 ? `+${item.amount}` : item.amount}
                </span>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-600 shadow-sm transition-all duration-200 hover:border-ink-200 hover:bg-ink-50 disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent">
              上一页
            </button>
            <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">第 {page} 页</span>
            <button onClick={() => setPage(p => p + 1)} disabled={data.items.length < 20} className="rounded-lg border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-600 shadow-sm transition-all duration-200 hover:border-ink-200 hover:bg-ink-50 disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent">
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  );
}
