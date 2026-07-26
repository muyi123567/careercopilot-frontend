/**
 * V2 §8.4 可信组件：EvidenceLabel
 * 事实/推断/建议分别标识。V2 §8.2 颜色 token。
 */
interface EvidenceLabelProps {
  type: 'fact' | 'inference' | 'recommendation'
}

const STYLES = {
  fact: 'bg-(--fact-soft) text-(--fact)',
  inference: 'bg-(--inference-soft) text-(--inference)',
  recommendation: 'bg-(--advice-soft) text-(--advice)',
} as const

const LABELS = {
  fact: '事实',
  inference: '推断',
  recommendation: '建议',
} as const

export function EvidenceLabel({ type }: EvidenceLabelProps) {
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${STYLES[type]}`}>
      {LABELS[type]}
    </span>
  )
}
