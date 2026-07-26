export function MapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">职业轨迹地图</h1>
      <p className="text-sm text-(--muted)">
        与你相近的人走向哪里。默认显示 1-2 跳，每条边标注来源、时间、范围和样本。
      </p>

      {/* 图谱区域（后续接入 Cytoscape.js） */}
      <div className="flex h-[400px] items-center justify-center rounded-[12px] border border-dashed border-(--border) bg-(--surface)">
        <div className="text-center">
          <p className="text-(--muted)">职业关系图谱</p>
          <p className="mt-1 text-xs text-(--unknown)">
            待接入 Cytoscape.js · 将有等价表格视图
          </p>
        </div>
      </div>

      {/* 表格回退视图 */}
      <div className="rounded-[12px] border border-(--border) bg-(--surface) p-4">
        <h2 className="mb-2 text-sm font-medium text-(--ink)">表格视图</h2>
        <p className="text-xs text-(--muted)">
          键盘用户可通过此表完成同一任务。图谱加载后同步显示。
        </p>
      </div>
    </div>
  )
}
