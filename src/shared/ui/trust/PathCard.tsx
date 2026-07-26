/**
 * V2 §8.4 可信组件：PathCard
 * 路径类型、目标、关键证据、缺口、下一动作。
 */
interface PathCardProps {
  pathType: 'deepen' | 'adjacent' | 'explore'
  target: string
  keyEvidence?: string[]
  gaps?: string[]
  nextAction?: string
  strength?: string
}

const TYPE_LABELS = { deepen: '深化', adjacent: '邻近', explore: '探索' } as const
const TYPE_STYLES = {
  deepen: 'border-l-(--fact)',
  adjacent: 'border-l-(--inference)',
  explore: 'border-l-(--advice)',
} as const

export function PathCard({ pathType, target, keyEvidence, gaps, nextAction, strength }: PathCardProps) {
  return (
    <div className={`rounded-[12px] border border-(--border) border-l-4 bg-(--surface) p-4 ${TYPE_STYLES[pathType]}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-(--muted)">{TYPE_LABELS[pathType]}</span>
        {strength && (
          <span className="rounded bg-(--canvas) px-1.5 py-0.5 text-xs text-(--muted)">{strength}</span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-(--ink)">{target}</h3>

      {keyEvidence && keyEvidence.length > 0 && (
        <ul className="mt-2 space-y-1">
          {keyEvidence.map((e, i) => (
            <li key={i} className="text-xs text-(--muted)">• {e}</li>
          ))}
        </ul>
      )}

      {gaps && gaps.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-(--warning)">缺口</p>
          <ul className="mt-0.5 space-y-0.5">
            {gaps.map((g, i) => (
              <li key={i} className="text-xs text-(--warning)">• {g}</li>
            ))}
          </ul>
        </div>
      )}

      {nextAction && (
        <p className="mt-2 text-xs text-(--advice)">下一步：{nextAction}</p>
      )}
    </div>
  )
}
