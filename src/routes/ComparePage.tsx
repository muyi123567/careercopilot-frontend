export function ComparePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">三路径比较</h1>
      <p className="text-sm text-(--muted)">
        深化、邻近、探索三条路径的证据、代价和不确定性并排展示。
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {(['deepen', 'adjacent', 'explore'] as const).map((type) => (
          <div
            key={type}
            className="rounded-[12px] border border-(--border) bg-(--surface) p-4"
          >
            <h2 className="mb-2 text-sm font-medium text-(--ink)">
              {type === 'deepen' ? '深化' : type === 'adjacent' ? '邻近' : '探索'}
            </h2>
            <div className="space-y-2 text-xs text-(--muted)">
              <p>历史可达性：<span className="text-(--unknown)">Unknown</span></p>
              <p>中文市场：<span className="text-(--unknown)">Unknown</span></p>
              <p>个人匹配：<span className="text-(--unknown)">Unknown</span></p>
              <p>偏好约束：<span className="text-(--unknown)">Unknown</span></p>
              <p>数据覆盖：<span className="text-(--unknown)">0/4 层</span></p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-(--muted)">
        四层证据独立展示，不合成为总分或成功概率。
      </p>
    </div>
  )
}
