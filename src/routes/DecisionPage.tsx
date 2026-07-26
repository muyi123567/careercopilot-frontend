import { useParams } from 'react-router-dom'

export function DecisionPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-(--ink)">决策快照</h1>
      <p className="text-sm text-(--muted)">
        决策 {id} 的不可变快照与后续变化。历史建议不可被覆盖。
      </p>

      <div className="rounded-[12px] border border-(--border) bg-(--surface) p-6">
        <p className="text-sm text-(--unknown)">
          决策快照加载后将显示：目标职业、路径类型、证据依据、创建时间。
        </p>
      </div>
    </div>
  )
}
