import { useState } from 'react';
import { useMemorySearch } from '../../shared/api/hooks-growth';

export function MemoryPage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { data, isLoading, isError, refetch } = useMemorySearch(submitted);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) setSubmitted(query.trim());
  }

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">记忆管理</h1>
        <p className="mt-1 text-sm text-ink-500">搜索系统为你保存的事实和知识块</p>
      </section>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词搜索记忆（至少 2 个字符）..."
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          />
        </div>
        <button type="submit" disabled={query.trim().length < 2} className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-40">
          搜索
        </button>
      </form>

      {/* Idle state */}
      {!submitted && (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-16 w-16 text-ink-300" aria-hidden="true">
            <circle cx="35" cy="35" r="18" />
            <path d="M48 48l12 12" />
            <path d="M28 32h14M28 38h10" strokeDasharray="3 2" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">输入关键词开始搜索</p>
          <p className="mt-1 text-xs text-ink-400">可以搜索技能、经历、偏好等系统为你保存的信息</p>
        </div>
      )}

      {/* Loading */}
      {submitted && isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="h-4 w-40 rounded bg-ink-200" />
              <div className="mt-2 h-3 w-full rounded bg-ink-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {submitted && isError && (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">搜索失败，请重试。</p>
          <button
            onClick={() => void refetch()}
            className="mt-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(196,85,59,0.25)] hover:scale-[1.02] active:scale-95"
          >
            重试
          </button>
        </div>
      )}

      {/* Empty results */}
      {submitted && !isLoading && !isError && data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-surface/50 p-8 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-16 w-16 text-ink-300" aria-hidden="true">
            <circle cx="35" cy="35" r="18" />
            <path d="M48 48l12 12" />
            <path d="M29 32h12M29 38h8" strokeDasharray="3 2" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">没有找到匹配「{submitted}」的记忆</p>
          <p className="mt-1 text-xs text-ink-400">试试其他关键词</p>
        </div>
      )}

      {/* Results */}
      {submitted && !isLoading && !isError && data && data.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-ink-400">找到 {data.length} 条记忆</p>
          {data.map((item) => (
            <div key={item.id} className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink-200">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">{item.type}</span>
                <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-600">{item.stage}</span>
                {item.score !== undefined && <span className="text-[10px] text-ink-400">相关度 {Math.round(item.score * 100)}%</span>}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-ink-100/60 px-2 py-0.5 text-[10px] text-ink-600">{tag}</span>
                ))}
              </div>
              {Object.keys(item.key_fields).length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-ink-100 sm:grid-cols-2">
                  {Object.entries(item.key_fields).map(([k, v]) => (
                    <div key={k} className="bg-surface px-3 py-2">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">{k}</p>
                      <p className="mt-0.5 text-xs text-ink-700">{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
