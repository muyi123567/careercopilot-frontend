import { Link } from 'react-router';
import { useProfile, useResumeSkills } from '../../shared/api/hooks';

function SkillBar({ name, level, category }: { name: string; level: number; category: string }) {
  const colorMap: Record<string, string> = {
    '技术': 'bg-accent-500',
    '产品': 'bg-success-500',
    '通用': 'bg-ink-400',
  };
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-medium text-ink-700">{name}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
        <div className={`h-full rounded-full transition-all duration-700 ${colorMap[category] ?? 'bg-ink-400'}`} style={{ width: `${level}%` }} />
      </div>
      <span className="w-8 text-right text-[11px] font-semibold text-ink-500">{level}%</span>
    </div>
  );
}

export function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const { data: skills } = useResumeSkills();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-40 rounded bg-ink-200" />
          <div className="h-4 w-64 rounded bg-ink-100" />
        </div>
        <div className="animate-pulse rounded-xl border border-line bg-surface p-6">
          <div className="h-4 w-24 rounded bg-ink-200" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-full rounded bg-ink-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">我的档案</h1>
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载档案失败，请检查网络后重试。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">
            重试
          </button>
        </div>
      </div>
    );
  }

  const displaySkills = skills ?? profile?.skills ?? [];
  const hasData = displaySkills.length > 0 || profile?.current_occupation || profile?.target_occupation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">我的档案</h1>
        <p className="mt-1 text-sm text-ink-500">基于证据提取构建的职业轮廓，所有数据仅用于路径建议</p>
      </section>

      {/* Empty state - no data yet */}
      {!hasData ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-20 w-20 text-ink-300" aria-hidden="true">
            <circle cx="40" cy="28" r="10" />
            <path d="M22 62c0-10 8-18 18-18s18 8 18 18" />
            <path d="M56 20l4-4M62 14l2-2" strokeDasharray="2 2" opacity="0.5" />
          </svg>
          <p className="mt-3 text-sm font-medium text-ink-600">档案还是空的，没关系</p>
          <p className="mt-1 text-xs text-ink-400">上传简历后，系统会自动提取你的技能和经历。</p>
          <Link to="/app/documents" className="mt-4 inline-block rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700">
            上传第一份简历
          </Link>
        </div>
      ) : (
        <>
          {/* Completion progress */}
          {profile?.completion_pct !== undefined && (
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-800">档案完成度</p>
                <span className="text-sm font-bold text-accent-600">{profile.completion_pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-accent-500 transition-all duration-500" style={{ width: `${profile.completion_pct}%` }} />
              </div>
            </div>
          )}

          {/* Current / Target occupation */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4">
              <p className="text-xs font-medium text-ink-400">当前职业</p>
              <p className="mt-1 text-sm font-semibold text-ink-900">{profile?.current_occupation ?? '未设定'}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <p className="text-xs font-medium text-ink-400">目标职业</p>
              <p className="mt-1 text-sm font-semibold text-ink-900">{profile?.target_occupation ?? '未设定'}</p>
              {!profile?.target_occupation && (
                <Link to="/app/career-map" className="mt-1 inline-block text-xs font-medium text-accent-600 hover:text-accent-700">去设定</Link>
              )}
            </div>
          </div>

          {/* Skills */}
          {displaySkills.length > 0 && (
            <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-ink-800">技能图谱</h2>
              <div className="mt-4 space-y-3">
                {displaySkills.map((s) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} category={s.category} />
                ))}
              </div>
              <div className="mt-4 flex gap-4 border-t border-line pt-3">
                <span className="flex items-center gap-1.5 text-[11px] text-ink-400"><span className="h-2 w-2 rounded-full bg-accent-500" />技术</span>
                <span className="flex items-center gap-1.5 text-[11px] text-ink-400"><span className="h-2 w-2 rounded-full bg-success-500" />产品</span>
                <span className="flex items-center gap-1.5 text-[11px] text-ink-400"><span className="h-2 w-2 rounded-full bg-ink-400" />通用</span>
              </div>
            </div>
          )}

          {/* Constraints / Preferences */}
          {profile?.constraints && Object.keys(profile.constraints).length > 0 && (
            <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-ink-800">偏好与约束</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(profile.constraints).map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-line bg-paper px-4 py-3">
                    <p className="text-xs text-ink-400">{label}</p>
                    <p className="mt-0.5 text-sm font-medium text-ink-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link to="/app/profile/evidence" className="rounded-lg border border-line px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50">证据台账</Link>
        <Link to="/app/documents" className="rounded-lg border border-line px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50">文档管理</Link>
        <Link to="/app/settings" className="rounded-lg border border-line px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100/50">设置</Link>
      </div>
    </div>
  );
}
