import { useNavigate } from 'react-router';
import { useNavigation } from '../../shared/state/navigation';
import { useAuth } from '../../shared/auth/session';
import { StatusPill } from '../../shared/components/ui/Badge';
import { CoverageBadge } from '../../shared/components/provenance/CoverageBadge';
import {
  DataInsufficientState,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../shared/components/states/FeedbackStates';
import { Button } from '../../shared/components/ui/Button';
import { PathCard } from './PathCard';
import type { Source } from '../../shared/api/contract';

function resolveSources(ids: string[], all: Source[]): Source[] {
  return all.filter((s) => ids.includes(s.source_id));
}

export function MapPage() {
  const navigate = useNavigate();
  const { mode, mockScenario } = useAuth();
  const { phase, response, error, input, submit, reset, addToCompare, compareIds } = useNavigation();

  if (phase === 'idle') {
    return (
      <EmptyState
        title="还没有生成职业地图"
        hint="先在首页输入当前职业，系统会返回候选路径与证据。"
      />
    );
  }

  if (phase === 'loading') return <LoadingState />;

  if (phase === 'error' || !response) {
    return (
      <ErrorState
        message={error ?? '未知错误'}
        onBack={() => navigate('/')}
        onRetry={input ? () => submit(input, { mockScenario }) : undefined}
      />
    );
  }

  if (response.status === 'service_failure' && response.error) {
    return (
      <ErrorState
        message={response.error.message}
        requestId={response.error.trace_id}
        onBack={() => navigate('/')}
        onRetry={input ? () => submit(input, { mockScenario }) : undefined}
      />
    );
  }

  if (response.status === 'data_insufficient') {
    return (
      <div className="space-y-4">
        <DataInsufficientState gaps={response.data?.coverage_gaps ?? []}>
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={() => navigate('/')}>
              修改输入
            </Button>
          </div>
        </DataInsufficientState>
      </div>
    );
  }

  const data = response.data!;
  const sources = data.sources;

  return (
    <div className="stagger space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">职业地图</p>
          <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">
            {data.current_occupation?.name ?? '当前职业'}
          </h1>
          <p className="mt-2 text-sm text-ink-500">最多三条候选路径，每条都带来源与不确定性。</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status="ok" />
          <CoverageBadge gaps={data.coverage_gaps} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.paths.map((path) => (
          <PathCard
            key={path.path_id}
            path={path}
            sources={resolveSources(path.source_ids, sources)}
            comparing={compareIds.includes(path.path_id)}
            onToggleCompare={addToCompare}
            onDetails={(id) => navigate(`/compare?focus=${id}`)}
          />
        ))}
      </div>

      {data.paths.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => navigate('/compare')}>去比较工作台 →</Button>
        </div>
      )}

      <p className="text-xs text-ink-400">
        {mode === 'demo' ? '只读演示数据，不构成职业建议。' : ''} 每个数字都可打开来源查看范围、时间与方法。
      </p>
      <button onClick={reset} className="text-xs text-ink-400 underline transition-colors hover:text-ink-700">
        清空本次会话
      </button>
    </div>
  );
}
