/**
 * V2 §8.4 可信组件：CoverageBadge
 * 显示：sufficient/limited/unknown 和原因。
 */
interface CoverageBadgeProps {
  level: 'sufficient' | 'limited' | 'unknown'
  reason?: string
}

const STYLES = {
  sufficient: 'bg-(--success-soft) text-(--success)',
  limited: 'bg-(--warning-soft) text-(--warning)',
  unknown: 'bg-(--unknown-soft) text-(--unknown)',
} as const

const LABELS = {
  sufficient: '数据充分',
  limited: '数据有限',
  unknown: '数据未知',
} as const

export function CoverageBadge({ level, reason }: CoverageBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[level]}`}
      title={reason}
    >
      {LABELS[level]}
      {reason && <span className="font-normal opacity-75">· {reason}</span>}
    </span>
  )
}
