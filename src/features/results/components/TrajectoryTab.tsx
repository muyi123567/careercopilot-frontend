import { useCallback, useState } from 'react';
import { useNavigation } from '../../../shared/state/navigation';
import { useAuth } from '../../../shared/auth/session';
import { getTrajectory } from '../../../shared/api/client';
import type { TrajectoryResponse, TrajectoryQuery, Source } from '../../../shared/api/contract';
import { UncertaintyPill } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { sourceTypeLabel } from '../../../shared/api/labels';

export function TrajectoryTab() {
  const { response } = useNavigation();
  const { token } = useAuth();
  const [data, setData] = useState<TrajectoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState('');
  const [expMin, setExpMin] = useState('');
  const [expMax, setExpMax] = useState('');
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  const currentOcc = response?.data?.current_occupation?.name ?? '';

  const fetchTrajectory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: TrajectoryQuery = {};
      if (currentOcc) query.current_occupation = currentOcc;
      if (region.trim()) query.region = region.trim();
      if (expMin) query.experience_min = Number(expMin);
      if (expMax) query.experience_max = Number(expMax);
      const res = await getTrajectory(query, { token });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [currentOcc, region, expMin, expMax, token]);

  // Service failure / data insufficient from response
  if (data?.status === 'service_failure' && data.error) {
    return (
      <div className="card border-red-200 bg-red-50/60 p-6 text-red-800" role="alert">
        <h3 className="font-bold">轨迹服务失败</h3>
        <p className="mt-1 text-sm">{data.error.message}</p>
        <p className="mt-1 font-mono text-xs">trace: {data.error.trace_id}</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => setData(null)}>返回</Button>
      </div>
    );
  }

  if (data?.status === 'data_insufficient') {
    return (
      <div className="card border-amber-200 bg-amber-50/60 p-6 text-amber-900" role="status">
        <h3 className="font-bold">轨迹数据不足</h3>
        <p className="mt-1 text-sm">以下覆盖缺口导致无法生成可靠的群体轨迹参照：</p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {data.coverage_gaps.map((g) => <li key={g}>{g}</li>)}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-5">
        <p className="eyebrow mb-3">筛选条件</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-ink-500" htmlFor="traj-region">地域</label>
            <input id="traj-region" value={region} onChange={(e) => setRegion(e.target.value)}
              placeholder="如：北京" className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-500" htmlFor="traj-exp-min">经验下限(年)</label>
            <input id="traj-exp-min" type="number" min="0" value={expMin} onChange={(e) => setExpMin(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-500" htmlFor="traj-exp-max">经验上限(年)</label>
            <input id="traj-exp-max" type="number" min="0" value={expMax} onChange={(e) => setExpMax(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <Button size="sm" onClick={fetchTrajectory} disabled={loading}>
              {loading ? '加载中...' : '查询轨迹'}
            </Button>
          </div>
        </div>
        {currentOcc && <p className="mt-2 text-xs text-ink-400">当前职业：{currentOcc}（来自导航结果）</p>}
      </div>

      {/* Error */}
      {error && (
        <div className="card border-red-200 bg-red-50/60 p-4 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      {/* Results */}
      {data && data.status === 'ok' && (
        <>
          {/* Uncertainty & scope */}
          <div className="card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <UncertaintyPill level={data.uncertainty.level} />
              <span className="text-xs text-ink-500">{data.uncertainty.interpretation}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-ink-600 sm:grid-cols-3">
              <div><span className="font-medium">数据范围：</span>{data.scope.geographies.join('、') || '全国'}</div>
              <div><span className="font-medium">时间窗口：</span>{data.scope.time_window.start} ~ {data.scope.time_window.end}</div>
              <div><span className="font-medium">样本总体：</span>{data.scope.population}</div>
            </div>
            {data.coverage_gaps.length > 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <span className="font-semibold">覆盖缺口：</span>{data.coverage_gaps.join('；')}
              </div>
            )}
          </div>

          {/* Trajectory nodes */}
          <div className="card p-5">
            <p className="eyebrow mb-3">转移目标（按频率排序）</p>
            <div className="space-y-2">
              {data.nodes.map((n) => (
                <div key={n.occupation_id} className="flex items-center justify-between rounded-lg border border-line px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{n.name}</p>
                    <p className="text-xs text-ink-400">样本量：{n.sample_size.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-700">{(n.transition_rate * 100).toFixed(1)}%</p>
                    <p className="text-xs text-ink-400">{n.transition_count.toLocaleString()} 人</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="card p-5">
            <p className="eyebrow mb-3">数据来源</p>
            <div className="space-y-2">
              {data.sources.map((s: Source) => (
                <div key={s.source_id} className="rounded-lg border border-line p-3">
                  <button
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => setExpandedSource(expandedSource === s.source_id ? null : s.source_id)}
                    aria-expanded={expandedSource === s.source_id}
                  >
                    <span className="text-sm font-medium text-ink-700">{s.title}</span>
                    <span className="text-xs text-ink-400">{sourceTypeLabel[s.source_type]}</span>
                  </button>
                  {expandedSource === s.source_id && (
                    <div className="mt-2 space-y-1 border-t border-line pt-2 text-xs text-ink-500">
                      <p>许可：{s.license}</p>
                      <p>版本：{s.version}｜观测时间：{s.observed_at}</p>
                      {s.sample_size && <p>样本量：{s.sample_size.toLocaleString()}</p>}
                      <p>方法：{s.methodology.name}（{s.methodology.version}）</p>
                      <p className="text-ink-400">{s.methodology.description}</p>
                      {s.url && <p><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">原始链接</a></p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="card p-8 text-center text-ink-500">
          <p className="font-medium text-ink-700">群体职业轨迹参照</p>
          <p className="mt-1 text-sm">点击"查询轨迹"查看从当前职业出发的真实转移模式、频率和样本量。</p>
          <p className="mt-2 text-xs text-ink-400">数据来源为已登记的轨迹数据集（如 JobHop），每项均标注来源、样本量与截止时间。</p>
        </div>
      )}
    </div>
  );
}
