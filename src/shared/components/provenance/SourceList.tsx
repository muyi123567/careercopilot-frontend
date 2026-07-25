import { useState } from 'react';
import type { Source } from '../../api/contract';
import { sourceTypeLabel } from '../../api/labels';
import { Drawer } from '../ui/Drawer';

function SourceDetail({ source }: { source: Source }) {
  const s = source.scope;
  return (
    <div className="space-y-4 text-sm">
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">类型</div>
        <div className="mt-1 text-ink-800">{sourceTypeLabel[source.source_type]}</div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">许可 / 版本</div>
        <div className="mt-1 text-ink-800">
          {source.license} · v{source.version}
        </div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">观察时间</div>
        <div className="mt-1 text-ink-800">
          {new Date(source.observed_at).toLocaleString('zh-CN')}
        </div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">样本量</div>
        <div className="mt-1 text-ink-800">
          {source.sample_size != null ? source.sample_size.toLocaleString('zh-CN') : '未公开'}
        </div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">数据范围</div>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-800">
          <li>地域：{s.geographies.join('、') || '—'}</li>
          <li>行业：{s.industries.join('、') || '—'}</li>
          <li>经验：{s.experience_levels.join('、') || '—'}</li>
          <li>人群：{s.population}</li>
          <li>
            时间窗：{s.time_window.start} ~ {s.time_window.end}
          </li>
        </ul>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">方法</div>
        <div className="mt-1 text-ink-800">
          {source.methodology.name}（{source.methodology.version}）
        </div>
        <p className="mt-1 text-ink-500">{source.methodology.description}</p>
      </div>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-brand-700 underline"
        >
          打开来源
        </a>
      )}
    </div>
  );
}

export function SourceList({ sources }: { sources: Source[] }) {
  const [active, setActive] = useState<Source | null>(null);
  if (sources.length === 0) {
    return <p className="text-sm text-ink-400">暂无来源。</p>;
  }
  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {sources.map((src) => (
          <li key={src.source_id}>
            <button
              onClick={() => setActive(src)}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-700 transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50"
            >
              {src.title}
            </button>
          </li>
        ))}
      </ul>
      <Drawer open={!!active} title={active?.title ?? ''} onClose={() => setActive(null)}>
        {active && <SourceDetail source={active} />}
      </Drawer>
    </>
  );
}
