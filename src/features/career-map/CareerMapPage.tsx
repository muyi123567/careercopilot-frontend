import { useState, useMemo } from 'react';
import { useOccupations, useProfile, useUpdateProfile, type Occupation } from '../../shared/api/hooks';
import { EmptyMap } from '../../shared/components/illustrations/EmptyStates';

function GroupSection({ group, items, onSetTarget, targetSlug }: { group: string; items: Occupation[]; onSetTarget: (title: string) => void; targetSlug?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-line bg-surface">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-800">{group}</span>
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">{items.length}</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="divide-y divide-line border-t border-line">
          {items.slice(0, 8).map((occ) => (
            <li key={occ.slug} className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-50/40">
              <span className={`h-2 w-2 shrink-0 rounded-full border ${occ.title === targetSlug ? 'border-accent-500 bg-accent-500' : 'border-ink-300'}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink-800">{occ.title}</p>
                {occ.description && <p className="mt-0.5 truncate text-xs text-ink-400">{occ.description}</p>}
              </div>
              {occ.title === targetSlug ? (
                <span className="shrink-0 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-600">目标</span>
              ) : (
                <button
                  onClick={() => onSetTarget(occ.title)}
                  className="shrink-0 rounded-lg border border-line px-2 py-1 text-[10px] font-medium text-ink-500 opacity-0 transition-all hover:border-accent-300 hover:text-accent-600 group-hover:opacity-100"
                >
                  设为目标
                </button>
              )}
            </li>
          ))}
          {items.length > 8 && (
            <li className="px-4 py-2 text-center text-xs text-ink-400">还有 {items.length - 8} 个，请搜索查看</li>
          )}
        </ul>
      )}
    </div>
  );
}

export function CareerMapPage() {
  const { data, isLoading, isError, refetch } = useOccupations();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [search, setSearch] = useState('');
  const [justSet, setJustSet] = useState('');

  const targetOcc = profile?.target_occupation;

  function handleSetTarget(title: string) {
    updateProfile.mutate({ target_occupation: title }, {
      onSuccess: () => { setJustSet(title); setTimeout(() => setJustSet(''), 3000); },
    });
  }

  const groups = useMemo(() => {
    if (!data) return [];
    const filtered = search.trim()
      ? data.filter((o) => o.title.toLowerCase().includes(search.toLowerCase()) || (o.group ?? '').toLowerCase().includes(search.toLowerCase()))
      : data;
    const map = new Map<string, Occupation[]>();
    for (const occ of filtered) {
      const key = occ.group || '其他';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(occ);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [data, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">职业地图</h1>
        <p className="mt-1 text-sm text-ink-500">浏览可选路径，找到你的下一程方向</p>
      </section>

      {/* Success toast */}
      {justSet && (
        <div className="rounded-xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-700">
          已将「{justSet}」设为目标职业
        </div>
      )}

      {/* Current node -> target node path visualization */}
      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">你</span>
            <span className="text-[10px] text-ink-400">当前</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-ink-200" />
          <div className="flex flex-col items-center gap-1">
            {targetOcc ? (
              <>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent-500 bg-accent-50 text-xs font-bold text-accent-600">
                  {targetOcc.charAt(0)}
                </span>
                <span className="max-w-[80px] truncate text-[10px] font-medium text-accent-600">{targetOcc}</span>
              </>
            ) : (
              <>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-ink-300 text-xs text-ink-400">?</span>
                <span className="text-[10px] text-ink-400">目标</span>
              </>
            )}
          </div>
        </div>
        {!targetOcc && (
          <p className="mt-3 text-center text-xs text-ink-400">
            在下方列表中点击「设为目标」，即可设定你的目标职业。
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索职业名称或分类..."
          className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          aria-label="搜索职业"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-4">
              <div className="h-4 w-28 rounded bg-ink-200" />
              <div className="mt-3 space-y-2">
                <div className="h-3.5 w-full rounded bg-ink-100" />
                <div className="h-3.5 w-3/4 rounded bg-ink-100" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-ink-500">加载职业数据失败，请检查网络后重试。</p>
          <button onClick={() => void refetch()} className="mt-2 text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700">
            重试
          </button>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-line p-10 text-center">
          <EmptyMap />
          <p className="mt-3 text-sm font-medium text-ink-600">
            {search ? `没有找到匹配「${search}」的职业` : '暂无职业数据'}
          </p>
          <p className="mt-1 text-xs text-ink-400">换个关键词试试，或等待数据更新。</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-ink-400">共 {data?.length ?? 0} 个职业，{groups.length} 个分类</p>
          {groups.slice(0, 12).map(([group, items]) => (
            <GroupSection key={group} group={group} items={items} onSetTarget={handleSetTarget} targetSlug={targetOcc} />
          ))}
        </div>
      )}
    </div>
  );
}
