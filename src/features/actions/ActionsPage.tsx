import { useNotifications } from '../../shared/api/hooks';
import { Link } from 'react-router-dom';

export function ActionsPage() {
  const { data, isLoading, isError, refetch } = useNotifications();

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">行动实验</h1>
        <p className="mt-1 text-sm text-ink-500">小步验证，用真实行动检验你的职业假设</p>
      </section>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="h-4 w-48 rounded bg-ink-200" />
              <div className="mt-2 h-3 w-full rounded bg-ink-100" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载行动列表失败。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2">重试</button>
        </div>
      ) : !data?.length ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10 text-ink-300" aria-hidden="true">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">还没有行动，没关系</p>
          <p className="mt-1 text-xs text-ink-400">完成档案和证据上传后，系统会为你推荐下一步实验。</p>
          <Link to="/app/documents" className="mt-4 inline-block rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700">
            先上传证据
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((action) => (
            <li key={action.id} className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent-200">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-accent-600" aria-hidden="true">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800">{action.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{action.body}</p>
                  <p className="mt-2 text-[10px] text-ink-300">
                    {new Date(action.created_at).toLocaleDateString('zh-CN')} · 来源：GPS 推荐
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
