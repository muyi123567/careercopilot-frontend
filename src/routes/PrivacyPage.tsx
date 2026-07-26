export function PrivacyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">隐私中心</h1>
      <p className="text-sm text-(--muted)">
        系统保存了什么，如何导出或删除。
      </p>

      <div className="space-y-4">
        <div className="rounded-[12px] border border-(--border) bg-(--surface) p-4">
          <h2 className="mb-2 text-sm font-medium text-(--ink)">数据清单</h2>
          <p className="text-xs text-(--muted)">
            来源文档、证据项、决策快照、行动记录、同意记录的完整清单。
          </p>
        </div>

        <div className="rounded-[12px] border border-(--border) bg-(--surface) p-4">
          <h2 className="mb-2 text-sm font-medium text-(--ink)">同意管理</h2>
          <p className="text-xs text-(--muted)">
            产品使用、群体学习、案例公开分别同意，可随时撤回。不预勾选。
          </p>
        </div>

        <div className="rounded-[12px] border border-(--border) bg-(--surface) p-4">
          <h2 className="mb-2 text-sm font-medium text-(--danger)">导出与删除</h2>
          <p className="text-xs text-(--muted)">
            导出全部个人数据（JSON）或请求删除账户。删除覆盖主数据、派生物、向量和缓存。
          </p>
        </div>
      </div>
    </div>
  )
}
