import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useNavigation } from '../../shared/state/navigation';
import { useAuth } from '../../shared/auth/session';
import { PathTypeChip, UncertaintyPill, EvidenceGradeBadge, ClassificationTag } from '../../shared/components/ui/Badge';
import { SourceList } from '../../shared/components/provenance/SourceList';
import { EmptyState, LoadingState } from '../../shared/components/states/FeedbackStates';
import { evidenceDimensions } from '../../shared/api/labels';
import type { CareerPath, Evidence, Source } from '../../shared/api/contract';

function PathColumn({
  path,
  evidence,
  sources,
}: {
  path: CareerPath;
  evidence: Evidence[];
  sources: Source[];
}) {
  const [decision, setDecision] = useState<'selected' | 'deferred' | 'replaced' | null>(null);
  return (
    <article className="card card-hover flex animate-slide-up flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PathTypeChip type={path.path_type} />
        <UncertaintyPill level={path.uncertainty.level} />
      </div>
      <h3 className="display text-lg font-semibold">{path.target_occupation.name}</h3>
      <p className="text-sm leading-relaxed text-ink-600">{path.summary}</p>

      <Section title="收益" items={path.benefits} />
      <Section title="成本" items={path.costs} tone="cost" />
      <Section title="关键差距" items={path.key_gaps} tone="gap" />
      <Section title="反证" items={path.counterevidence} tone="risk" />

      <div>
        <div className="eyebrow mb-2">最小验证行动</div>
        <ul className="space-y-2">
          {path.minimum_validation_actions.map((a) => (
            <li key={a.action_id} className="rounded-lg border border-line p-3 text-sm">
              <div className="font-medium text-ink-800">{a.title}</div>
              <div className="mt-1 text-ink-500">预期信号：{a.expected_signal}</div>
              <div className="mt-1 text-xs text-ink-400">时间盒：{a.timebox_days} 天</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="eyebrow mb-2">证据</div>
        {evidence.length === 0 ? (
          <p className="text-sm text-ink-400">本路径暂无独立证据，见下方来源。</p>
        ) : (
          <ul className="space-y-2">
            {evidence.map((e) => (
              <li key={e.evidence_id} className="rounded-lg border border-line p-3">
                <div className="mb-1 flex items-center gap-2">
                  <EvidenceGradeBadge grade={e.evidence_grade} />
                  <ClassificationTag kind={e.classification} />
                </div>
                <p className="text-sm text-ink-800">{e.claim}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="eyebrow mb-1">来源</div>
        <SourceList sources={sources} />
      </div>

      <div className="mt-auto border-t border-line pt-3">
        <div className="mb-2 text-xs text-ink-500">
          五维度评分（历史可达性 / 中文市场 / 个人证据 / 偏好约束 / 数据覆盖）将在后端 F21 后填充，不合成单一成功率。
        </div>
        <div className="flex flex-wrap gap-1">
          {evidenceDimensions.map((d) => (
            <span key={d.key} className="rounded bg-ink-900/5 px-2 py-0.5 text-[11px] text-ink-500">
              {d.label}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          {(['selected', 'deferred', 'replaced'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDecision(d)}
              className={`rounded-lg border px-2 py-1 text-xs transition-colors duration-200 ${
                decision === d
                  ? 'border-brand-400 bg-brand-50 text-brand-700'
                  : 'border-line text-ink-500 hover:border-ink-900/20'
              }`}
            >
              {d === 'selected' ? '选择' : d === 'deferred' ? '暂缓' : '替换'}
            </button>
          ))}
        </div>
        {decision && (
          <p className="mt-2 text-xs text-emerald-700">已记录：{labelOf(decision)}</p>
        )}
      </div>
    </article>
  );
}

function labelOf(d: 'selected' | 'deferred' | 'replaced') {
  return d === 'selected' ? '选择此路径' : d === 'deferred' ? '暂缓此路径' : '用其他路径替换';
}

function Section({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: 'cost' | 'gap' | 'risk';
}) {
  if (items.length === 0) return null;
  const toneClass =
    tone === 'cost'
      ? 'text-amber-700'
      : tone === 'gap'
        ? 'text-sky-700'
        : tone === 'risk'
          ? 'text-red-700'
          : 'text-ink-700';
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      <ul className={`list-disc space-y-1 pl-5 text-sm ${toneClass}`}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function ComparePage() {
  const { phase, response } = useNavigation();
  const { mockScenario } = useAuth();
  const [params] = useSearchParams();
  const focus = params.get('focus');

  const columns = useMemo(() => {
    if (!response || response.status !== 'ok' || !response.data) return [];
    const { paths, evidence, sources } = response.data;
    return paths.map((p) => ({
      path: p,
      evidence: evidence.filter((e) => p.evidence_ids.includes(e.evidence_id)),
      sources: sources.filter((s) => p.source_ids.includes(s.source_id)),
    }));
  }, [response]);

  if (phase === 'idle') {
    return <EmptyState title="还没有可比较的路径" hint="先在首页生成职业地图。" />;
  }
  if (phase === 'loading') return <LoadingState />;
  if (columns.length === 0) {
    return <EmptyState title="当前响应无候选路径" hint={`演示状态：${mockScenario}`} />;
  }

  return (
    <div className="stagger space-y-6">
      <div>
        <p className="eyebrow">比较工作台</p>
        <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">三路径并排对照</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map(({ path, evidence, sources }) => (
          <div
            key={path.path_id}
            className={focus === path.path_id ? 'rounded-2xl ring-2 ring-brand-400' : ''}
          >
            <PathColumn path={path} evidence={evidence} sources={sources} />
          </div>
        ))}
      </div>
    </div>
  );
}
