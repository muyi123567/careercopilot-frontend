import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useOccupations } from '../../shared/api/hooks';
import { useGenerateDecision, useCreateDecisionCase, type GeneratedPath } from '../../shared/api/hooks-actions';

const PATH_KIND_LABELS: Record<string, { label: string; cls: string; border: string }> = {
  deepen: { label: '本行深化', cls: 'bg-accent-50 text-accent-700 border-accent-200', border: 'border-accent-200' },
  adjacent: { label: '邻近迁移', cls: 'bg-success-50 text-success-600 border-success-500/20', border: 'border-success-500/20' },
  explore: { label: '跨界探索', cls: 'bg-ink-100 text-ink-600 border-line', border: 'border-line' },
};

export function PathsNewPage() {
  const navigate = useNavigate();
  const { data: occupations, isLoading: isLoadingOccupations, isError: isOccupationsError } = useOccupations();
  const generateDecision = useGenerateDecision();
  const createDecisionCase = useCreateDecisionCase();

  const [target, setTarget] = useState('');
  const [region, setRegion] = useState('china-mainland');
  const [paths, setPaths] = useState<GeneratedPath[] | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoadingOccupations || isOccupationsError || !occupations?.length) {
      setError('职业目录暂不可用，请稍后重试。');
      return;
    }
    if (!target.trim()) { setError('请选择目标职业'); return; }
    setError('');
    setPaths(null);
    try {
      const result = await generateDecision.mutateAsync({ target_occupation: target, region });
      setPaths(result.paths ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    }
  }

  async function handleSelectPath(path: GeneratedPath) {
    try {
      await createDecisionCase.mutateAsync({
        title: `路径选择：${path.title}`,
        context: `目标职业：${target}，路径类型：${path.kind}`,
        options: [path.title, ...paths!.filter(p => p.kind !== path.kind).map(p => p.title)],
      });
      navigate('/app/decisions');
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建决策失败');
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">路径分析</h1>
        <p className="mt-1 text-sm text-ink-500">选择目标职业，生成三条可选路径的比较分析</p>
      </section>

      {/* Form */}
      {!paths && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-line bg-surface p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="target-occ">目标职业</label>
            <select
              id="target-occ"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isLoadingOccupations || isOccupationsError || !occupations?.length}
              className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              <option value="">
                {isLoadingOccupations
                  ? '职业目录加载中...'
                  : isOccupationsError
                    ? '职业目录加载失败'
                    : !occupations?.length
                      ? '暂无可用职业'
                      : '请选择...'}
              </option>
              {occupations?.map((occ) => (
                <option key={occ.slug} value={occ.title}>{occ.title}</option>
              ))}
            </select>
            {isOccupationsError && <p className="mt-1.5 text-xs text-red-600">职业目录加载失败，请稍后重试。</p>}
            {!isLoadingOccupations && !isOccupationsError && !occupations?.length && <p className="mt-1.5 text-xs text-ink-500">当前没有可用于路径分析的职业。</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600" htmlFor="region-select">地区</label>
            <select
              id="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-800 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              <option value="china-mainland">中国大陆</option>
              <option value="china-tier1">一线城市</option>
              <option value="china-new-tier1">新一线城市</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={generateDecision.isPending || isLoadingOccupations || isOccupationsError || !occupations?.length}
            className="w-full rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
          >
            {generateDecision.isPending ? '分析中...' : isLoadingOccupations ? '职业目录加载中...' : '生成路径分析'}
          </button>
        </form>
      )}

      {/* Loading */}
      {generateDecision.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-surface p-5">
              <div className="h-4 w-32 rounded bg-ink-200" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-ink-100" />
                <div className="h-3 w-2/3 rounded bg-ink-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results - three path cards */}
      {paths && paths.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-800">三条路径比较</p>
            <button onClick={() => setPaths(null)} className="text-xs text-accent-600 hover:text-accent-700">重新分析</button>
          </div>
          {paths.map((path) => {
            const kindInfo = PATH_KIND_LABELS[path.kind] ?? PATH_KIND_LABELS.explore;
            return (
              <div key={path.kind} className={`rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${kindInfo.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${kindInfo.cls}`}>{kindInfo.label}</span>
                    <h3 className="text-sm font-semibold text-ink-900">{path.title}</h3>
                  </div>
                  <button
                    onClick={() => void handleSelectPath(path)}
                    disabled={createDecisionCase.isPending}
                    className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(196,85,59,0.25)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    选择此路径
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-success-600">收益</p>
                    <ul className="mt-1 space-y-1">
                      {path.benefits.map((b, i) => <li key={i} className="text-xs text-ink-600">{b}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-red-500">代价</p>
                    <ul className="mt-1 space-y-1">
                      {path.costs.map((c, i) => <li key={i} className="text-xs text-ink-600">{c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-accent-600">关键缺口</p>
                    <ul className="mt-1 space-y-1">
                      {path.key_gaps.map((g, i) => <li key={i} className="text-xs text-ink-600">{g}</li>)}
                    </ul>
                  </div>
                </div>
                {path.validation_action && (
                  <p className="mt-3 rounded-lg bg-ink-100/50 px-3 py-2 text-xs text-ink-600">
                    验证行动：{path.validation_action}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty result */}
      {paths && paths.length === 0 && (
        <div className="rounded-xl border border-dashed border-line p-8 text-center">
          <p className="text-sm text-ink-500">未能生成路径分析，请尝试其他目标职业。</p>
          <button onClick={() => setPaths(null)} className="mt-3 text-xs font-medium text-accent-600 hover:text-accent-700">重新选择</button>
        </div>
      )}
    </div>
  );
}
