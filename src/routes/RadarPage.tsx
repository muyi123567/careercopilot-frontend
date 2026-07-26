export function RadarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">市场雷达</h1>
      <p className="text-sm text-(--muted)">
        市场变化是否影响你的路线。需求、技能、地域、时间及覆盖度。
      </p>

      <div className="flex h-[300px] items-center justify-center rounded-[12px] border border-dashed border-(--border) bg-(--surface)">
        <div className="text-center">
          <p className="text-(--muted)">市场趋势图表</p>
          <p className="mt-1 text-xs text-(--unknown)">
            待 A 仓 F30-F32 实现后接入 · Recharts/ECharts
          </p>
        </div>
      </div>

      <p className="text-xs text-(--muted)">
        市场热度只影响"市场层证据"，不能覆盖个人约束或直接决定适合度。
      </p>
    </div>
  )
}
