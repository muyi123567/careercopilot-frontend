import { useQuery } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../shared/api/fetch';

interface Decision {
  id: string;
  title: string;
  context: string;
  options: string[];
  chosen: string;
  rationale?: string;
  outcome?: string;
  created_at: string;
}

export function DecisionsPage() {
  const { data, isLoading, isError, refetch } = useQuery<Decision[], ApiError>({
    queryKey: ['decisions'],
    queryFn: async () => {
      const res = await apiFetch('/api/v1/actions/decisions');
      if (!res.ok) throw new ApiError(res.status, '获取决策记录失败');
      const json = await res.json();
      return Array.isArray(json) ? json : json.items ?? [];
    },
  });

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">决策记录</h1>
        <p className="mt-1 text-sm text-ink-500">记录每一次职业选择，让未来的自己有据可循</p>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-5">
              <div className="h-4 w-48 rounded bg-ink-200" />
              <div className="mt-3 h-3 w-full rounded bg-ink-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-ink-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载决策记录失败，请检查网络后重试。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">
            重试
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && (!data || data.length === 0) && (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-20 w-20 text-ink-300" aria-hidden="true">
            <circle cx="40" cy="24" r="8" />
            <path d="M40 32v10" />
            <path d="M40 42L28 58" />
            <path d="M40 42l12 16" />
            <circle cx="28" cy="60" r="5" strokeDasharray="3 2" />
            <circle cx="52" cy="60" r="5" strokeDasharray="3 2" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">还没有决策记录</p>
          <p className="mt-1 text-xs text-ink-400">
            当你面临职业选择时，在这里记录依据和结果。<br />
            回头看时，你会发现自己的判断模式。
          </p>
          <button className="mt-4 rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700">
            记录第一个决策
          </button>
        </div>
      )}

      {/* Success - timeline */}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-ink-400">共 {data.length} 条决策记录</p>
          {data.map((d) => (
            <div key={d.id} className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-ink-200">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-ink-800">{d.title}</h3>
                  <p className="mt-1 text-xs text-ink-500">{d.context}</p>
                </div>
                <span className="shrink-0 text-[10px] text-ink-400">
                  {new Date(d.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {d.chosen && (
                <div className="mt-3 rounded-lg bg-accent-50 px-3 py-2">
                  <p className="text-xs font-medium text-accent-700">选择：{d.chosen}</p>
                  {d.rationale && <p className="mt-1 text-xs text-ink-500">{d.rationale}</p>}
                </div>
              )}
              {d.outcome && (
                <div className="mt-2 rounded-lg bg-success-50 px-3 py-2">
                  <p className="text-xs font-medium text-success-600">结果：{d.outcome}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
