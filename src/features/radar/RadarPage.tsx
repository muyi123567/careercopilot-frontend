import { useQuery } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../shared/api/fetch';

interface RadarSignal {
  id: string;
  type: string;
  title: string;
  summary: string;
  source: string;
  relevance: number;
  created_at: string;
  expires_at?: string;
}

export function RadarPage() {
  const { data, isLoading, isError, refetch } = useQuery<RadarSignal[], ApiError>({
    queryKey: ['radar', 'signals'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/gps/signals');
      if (!res.ok) throw new ApiError(res.status, '获取市场信号失败');
      const json = await res.json();
      return Array.isArray(json) ? json : json.items ?? [];
    },
  });

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">市场雷达</h1>
        <p className="mt-1 text-sm text-ink-500">跟踪与你相关的岗位变动和行业信号</p>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-ink-200" />
                <div className="flex-1">
                  <div className="h-3.5 w-40 rounded bg-ink-200" />
                  <div className="mt-1.5 h-3 w-full rounded bg-ink-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载市场信号失败，请检查网络后重试。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">
            重试
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && (!data || data.length === 0) && (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-20 w-20 text-ink-300" aria-hidden="true">
            <circle cx="40" cy="40" r="28" strokeDasharray="4 3" />
            <circle cx="40" cy="40" r="16" strokeDasharray="3 2" />
            <circle cx="40" cy="40" r="4" fill="currentColor" stroke="none" opacity="0.3" />
            <path d="M40 12v6M40 62v6M12 40h6M62 40h6" />
            <circle cx="52" cy="28" r="3" strokeDasharray="2 1" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">暂无市场信号</p>
          <p className="mt-1 text-xs text-ink-400">
            设定目标职业后，系统会为你跟踪相关的岗位变动和行业趋势。<br />
            信号来源标注时效，过期自动标记。
          </p>
        </div>
      )}

      {/* Success - signal list */}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-ink-400">共 {data.length} 条信号</p>
          {data.map((signal) => (
            <div key={signal.id} className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink-200">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-accent-600" aria-hidden="true">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-medium text-ink-800">{signal.title}</h3>
                    {signal.relevance > 0 && (
                      <span className="shrink-0 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-600">
                        相关度 {Math.round(signal.relevance * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-500 line-clamp-2">{signal.summary}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-ink-400">
                    <span>来源：{signal.source}</span>
                    <span>{new Date(signal.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
