import { useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { publicFetch, ApiError } from '../../shared/api/fetch';
import { useAuth } from '../auth/useAuth';

interface Occupation {
  slug: string;
  title: string;
  description?: string;
}

export function OccupationSearchPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Occupation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await publicFetch(
        `/api/v1/public/occupations?locale=zh-CN&q=${encodeURIComponent(q.trim())}`,
        { signal: ctrl.signal },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new ApiError(res.status, (d as { detail?: string }).detail || `搜索失败 (${res.status})`);
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data.items ?? data.occupations ?? []);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError(e instanceof ApiError ? e.message : '网络连接失败，请检查网络后重试');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSearch(query);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line/60 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ink-800 to-ink-900 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
            </span>
            <span className="text-base font-bold text-ink-900">Career<b className="text-accent-600">Copilot</b></span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <span className="text-xs text-ink-500">{user?.display_name || user?.email || '已登录'}</span>
            ) : (
              <Link to="/login" className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink-700">登录</Link>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">探索职业方向</h1>
        <p className="mt-2 text-sm text-ink-500">搜索你感兴趣的职业，查看技能要求与发展路径。</p>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="search"
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
              placeholder="输入职业名称，如：产品经理、数据分析师…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading || !query.trim()} className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-ink-700 disabled:opacity-40">
            {loading ? '搜索中…' : '搜索'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>
        )}

        {/* Results */}
        {loading && (
          <div className="mt-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-ink-900/5" />)}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="mt-10 flex flex-col items-center text-center">
            <svg className="h-12 w-12 text-ink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/></svg>
            <p className="mt-3 text-sm text-ink-500">未找到匹配的职业，试试其他关键词</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <ul className="mt-6 space-y-3">
            {results.map((occ) => (
              <li key={occ.slug}>
                <button
                  onClick={() => navigate(`/occupations/${occ.slug}`)}
                  className="card card-hover flex w-full items-center gap-4 p-4 text-left"
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">{occ.title}</p>
                    {occ.description && <p className="mt-0.5 truncate text-xs text-ink-500">{occ.description}</p>}
                  </div>
                  <svg className="h-4 w-4 flex-none text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Quick suggestions */}
        {!searched && (
          <div className="mt-8">
            <p className="text-xs font-medium text-ink-400">热门搜索</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['产品经理', '数据分析师', '前端工程师', 'UI设计师', '市场营销', '人力资源'].map(tag => (
                <button key={tag} onClick={() => { setQuery(tag); doSearch(tag); }} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-ink-600 transition-colors hover:border-accent-400 hover:text-accent-600">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
