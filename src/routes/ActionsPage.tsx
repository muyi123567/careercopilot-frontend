export function ActionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">行动计划</h1>
      <p className="text-sm text-(--muted)">
        下一步做什么，何时停止。每个行动含截止、最小成功标准和停止条件。
      </p>

      <div className="rounded-[12px] border border-(--border) bg-(--surface) p-6">
        <div className="space-y-2 text-sm text-(--muted)">
          <p>状态机：planned → active → done / abandoned</p>
          <p>检查点：发生了什么、新证据、原因、主观感受</p>
          <p className="text-xs text-(--unknown)">
            行动列表将在对接 A 仓 /api/v1/actions 后显示
          </p>
        </div>
      </div>
    </div>
  )
}
