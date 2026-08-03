import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { publicFetch, ApiError } from '../../shared/api/fetch';

interface Skill {
  name: string;
  level?: string;
  description?: string;
}

interface OccupationDetail {
  slug: string;
  title: string;
  description?: string;
  skills?: Skill[];
  sector?: string;
  education_level?: string;
}

export function OccupationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<OccupationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await publicFetch(`/api/v1/public/occupations/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new ApiError(res.status, (d as { detail?: string }).detail || `加载失败 (${res.status})`);
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof ApiError ? e.message : '网络连接失败，请检查网络后重试');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)]">
        <DetailHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-ink-900/5" />
            <div className="h-4 w-full animate-pulse rounded bg-ink-900/5" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-ink-900/5" />
            <div className="mt-8 h-40 w-full animate-pulse rounded-xl bg-ink-900/5" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)]">
        <DetailHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="flex flex-col items-center text-center">
            <svg className="h-12 w-12 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <p className="mt-3 text-sm text-red-700">{error}</p>
            <button onClick={() => navigate('/occupations')} className="mt-4 rounded-full bg-ink-900 px-5 py-2 text-xs font-medium text-white hover:bg-ink-700">返回搜索</button>
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const skills: Skill[] = data.skills ?? [];

  return (
    <div className="min-h-screen bg-[linear-gradient(168deg,#FAF7F2_0%,#F7F1E8_38%,#F4EDE2_68%,#FAF7F2_100%)]">
      <DetailHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-400">
          <Link to="/occupations" className="hover:text-accent-600">职业搜索</Link>
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          <span className="text-ink-600">{data.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{data.title}</h1>
        {data.description && <p className="mt-3 text-sm leading-relaxed text-ink-600">{data.description}</p>}

        {/* Meta */}
        {(data.sector || data.education_level) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.sector && <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600">{data.sector}</span>}
            {data.education_level && <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">{data.education_level}</span>}
          </div>
        )}

        {/* Skills */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink-900">技能要求</h2>
          {skills.length === 0 ? (
            <p className="mt-3 text-sm text-ink-400">暂无技能数据</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {skills.map((skill, i) => (
                <li key={i} className="card p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900">{skill.name}</p>
                      {skill.level && <p className="text-xs text-ink-400">{skill.level}</p>}
                    </div>
                  </div>
                  {skill.description && <p className="mt-2 text-xs leading-relaxed text-ink-500">{skill.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-sm font-medium text-ink-800">想了解如何转型到这个职业？</p>
          <p className="mt-1 text-xs text-ink-500">登录后获取个性化路径推演与证据分析</p>
          <Link to="/login" className="mt-4 inline-block rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-ink-700">
            开始规划
          </Link>
        </div>
      </main>
    </div>
  );
}

function DetailHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/60 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link to="/occupations" className="flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-accent-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          返回搜索
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-ink-800 to-ink-900 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>
          </span>
        </Link>
      </div>
    </header>
  );
}
