import type { CareerPath, Source } from '../../shared/api/contract';
import { PathTypeChip, UncertaintyPill } from '../../shared/components/ui/Badge';
import { SourceList } from '../../shared/components/provenance/SourceList';
import { Button } from '../../shared/components/ui/Button';

interface PathCardProps {
  path: CareerPath;
  sources: Source[];
  comparing: boolean;
  onToggleCompare: (pathId: string) => void;
  onDetails: (pathId: string) => void;
}

export function PathCard({ path, sources, comparing, onToggleCompare, onDetails }: PathCardProps) {
  return (
    <article className="card card-hover flex animate-slide-up flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <PathTypeChip type={path.path_type} />
        <UncertaintyPill level={path.uncertainty.level} />
      </div>
      <h3 className="display text-lg font-semibold">{path.target_occupation.name}</h3>
      <p className="text-sm leading-relaxed text-ink-600">{path.summary}</p>

      <div className="rounded-lg bg-ink-900/5 px-3 py-2 text-xs text-ink-600">
        不确定性：{path.uncertainty.interpretation}
      </div>

      <div>
        <div className="eyebrow mb-1.5">来源</div>
        <SourceList sources={sources} />
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <Button
          size="sm"
          variant={comparing ? 'secondary' : 'primary'}
          aria-pressed={comparing}
          onClick={() => onToggleCompare(path.path_id)}
        >
          {comparing ? '已在比较' : '加入比较'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDetails(path.path_id)}>
          详情
        </Button>
      </div>
    </article>
  );
}
