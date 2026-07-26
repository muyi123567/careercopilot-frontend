/**
 * V2 §8.4 可信组件：SourceChip
 * 显示：来源类型、数据日期、国家/中国/合成标签。
 */
interface SourceChipProps {
  sourceType: string
  dataDate?: string
  country?: string
  isSynthetic?: boolean
}

export function SourceChip({ sourceType, dataDate, country, isSynthetic }: SourceChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--surface) px-2 py-0.5 text-xs text-(--muted)">
      <span className="font-medium text-(--ink)">{sourceType}</span>
      {dataDate && <span>· {dataDate}</span>}
      {country && <span>· {country}</span>}
      {isSynthetic && (
        <span className="rounded bg-(--warning-soft) px-1 text-(--warning)">合成</span>
      )}
    </span>
  )
}
