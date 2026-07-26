import { memo } from 'react'

/**
 * V2 §8.4 可信组件：ProvenanceDrawer
 * 来源、许可状态、样本、范围、方法、限制。
 * 点击数字/来源必须能打开此抽屉。
 */
interface ProvenanceDrawerProps {
  open: boolean
  onClose: () => void
  source: {
    name: string
    licenseStatus: string
    sampleSize?: number
    scope?: string
    methodology?: string
    limitations?: string
    observedFrom?: string
    observedTo?: string
  } | null
}

export const ProvenanceDrawer = memo(function ProvenanceDrawer({ open, onClose, source }: ProvenanceDrawerProps) {
  if (!open || !source) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="来源详情">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <aside className="relative w-full max-w-[360px] overflow-y-auto border-l border-(--border) bg-(--surface) p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-(--ink)">来源与解释</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-(--muted) hover:bg-(--canvas) hover:text-(--ink)"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs text-(--muted)">来源名称</dt>
            <dd className="text-(--ink)">{source.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-(--muted)">许可状态</dt>
            <dd className="text-(--ink)">{source.licenseStatus}</dd>
          </div>
          {source.sampleSize != null && (
            <div>
              <dt className="text-xs text-(--muted)">样本量</dt>
              <dd className="font-mono text-(--ink)">{source.sampleSize}</dd>
            </div>
          )}
          {source.scope && (
            <div>
              <dt className="text-xs text-(--muted)">范围</dt>
              <dd className="text-(--ink)">{source.scope}</dd>
            </div>
          )}
          {source.observedFrom && (
            <div>
              <dt className="text-xs text-(--muted)">观察时间窗</dt>
              <dd className="font-mono text-(--ink)">
                {source.observedFrom} ~ {source.observedTo ?? '至今'}
              </dd>
            </div>
          )}
          {source.methodology && (
            <div>
              <dt className="text-xs text-(--muted)">方法</dt>
              <dd className="text-(--ink)">{source.methodology}</dd>
            </div>
          )}
          {source.limitations && (
            <div>
              <dt className="text-xs text-(--muted)">限制</dt>
              <dd className="text-(--warning)">{source.limitations}</dd>
            </div>
          )}
        </dl>
      </aside>
    </div>
  )
})
