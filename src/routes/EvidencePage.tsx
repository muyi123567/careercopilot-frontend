export function EvidencePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">证据账本</h1>
      <p className="text-sm text-(--muted)">
        系统对你的理解是否准确。逐条确认、修订或驳回候选证据。
      </p>

      <div className="rounded-[12px] border border-(--border) bg-(--surface) p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-(--fact-soft) px-2 py-0.5 text-xs font-medium text-(--fact)">事实</span>
            <span className="text-sm text-(--ink)">候选证据将显示在此</span>
          </div>
          <p className="text-xs text-(--muted)">
            状态：extracted_candidate → confirmed / revised / rejected
          </p>
        </div>
      </div>
    </div>
  )
}
