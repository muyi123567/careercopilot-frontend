import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-(--ink)">
          证据型职业导航
        </h1>
        <p className="max-w-[600px] text-(--muted)">
          从群体职业轨迹中找到现实候选，用个人证据比较"深化、邻近、探索"三条路径，
          再通过低成本行动验证选择。
        </p>
      </section>

      <section className="flex gap-4">
        <Link
          to="/start"
          className="rounded-[10px] bg-(--primary) px-6 py-3 text-sm font-medium text-white hover:bg-(--primary-hover)"
        >
          开始决策
        </Link>
        <Link
          to="/map"
          className="rounded-[10px] border border-(--border) px-6 py-3 text-sm font-medium text-(--ink) hover:border-(--primary)"
        >
          浏览职业地图
        </Link>
      </section>

      <section className="rounded-[12px] border border-(--border) bg-(--surface) p-4">
        <p className="text-sm text-(--muted)">
          数据边界：当前使用国际公开轨迹样本作为历史参照，不代表中国职业市场统计。
          所有评估基于已确认证据和历史观察频率，不构成职业建议。
        </p>
      </section>
    </div>
  )
}
