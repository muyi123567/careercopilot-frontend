/**
 * V2 §8.4 可信组件：DataFreshness
 * 数据截至日期和是否过期。
 */
interface DataFreshnessProps {
  asOfDate: string
  isStale?: boolean
}

export function DataFreshness({ asOfDate, isStale }: DataFreshnessProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${isStale ? 'text-(--warning)' : 'text-(--muted)'}`}>
      <span>数据截至 {asOfDate}</span>
      {isStale && <span className="rounded bg-(--warning-soft) px-1 font-medium">可能过期</span>}
    </span>
  )
}
