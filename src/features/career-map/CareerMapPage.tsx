const DEMO_NODES = [
  { id: 'n1', role: '后端开发工程师', period: '2024.07 - 至今', probability: null, type: 'current' as const, stats: { sampleSize: 342, avgTransitionMonths: 0 } },
  { id: 'n2', role: '高级后端工程师', period: '典型路径 · 1-2 年', probability: 72, type: 'deepen' as const, stats: { sampleSize: 342, avgTransitionMonths: 14 } },
  { id: 'n3', role: '技术产品经理', period: '邻近迁移 · 6-12 月', probability: 38, type: 'adjacent' as const, stats: { sampleSize: 128, avgTransitionMonths: 9 } },
  { id: 'n4', role: '独立开发者', period: '跨行业探索 · 不确定', probability: 15, type: 'explore' as const, stats: { sampleSize: 56, avgTransitionMonths: 18 } },
];

const typeColors: Record<string, string> = {
  current: 'border-brand-500 bg-brand-500 text-white',
  deepen: 'border-brand-300 bg-brand-50 text-brand-700',
  adjacent: 'border-teal-600 bg-teal-50 text-teal-700',
  explore: 'border-gold-400 bg-gold-50 text-gold-600',
};

const typeLabels: Record<string, string> = {
  current: '当前',
  deepen: '本行业深化',
  adjacent: '邻近迁移',
  explore: '跨行业探索',
};

export function CareerMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">职业地图</p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">群体轨迹详情</h1>
        <p className="mt-1 text-sm text-ink-500">基于群体轨迹统计的转岗路径可视化。所有概率均标注样本量和数据来源。</p>
      </div>

      {/* Timeline visualization */}
      <div className="card p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-800">路径节点时间线</h2>
        <div className="relative space-y-0 pl-8">
          <span className="absolute bottom-4 left-[13px] top-4 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(33,29,26,0.16)_0_5px,transparent_5px_10px)]" />
          {DEMO_NODES.map((node) => (
            <div key={node.id} className="relative pb-8 last:pb-0">
              <span className={`absolute -left-8 top-1 flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-xs font-bold ${typeColors[node.type]}`}>
                {node.type === 'current' ? '●' : `${node.probability}%`}
              </span>
              <div className="ml-2 rounded-xl border border-line bg-paper p-4 transition-all duration-200 hover:border-brand-200 hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-ink-800">{node.role}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${node.type === 'current' ? 'bg-brand-50 text-brand-700' : node.type === 'adjacent' ? 'bg-teal-50 text-teal-700' : node.type === 'explore' ? 'bg-gold-50 text-gold-600' : 'bg-brand-50 text-brand-700'}`}>
                    {typeLabels[node.type]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-400">{node.period}</p>
                {node.probability !== null && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-ink-400">
                      <span>转岗概率（群体统计）</span>
                      <span className="font-semibold text-ink-600">{node.probability}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-900/5">
                      <div className={`h-full rounded-full transition-all duration-700 ${node.type === 'adjacent' ? 'bg-gradient-to-r from-teal-500 to-teal-600' : node.type === 'explore' ? 'bg-gradient-to-r from-gold-400 to-gold-500' : 'bg-gradient-to-r from-brand-400 to-brand-600'}`} style={{ width: `${node.probability}%` }} />
                    </div>
                  </div>
                )}
                <div className="mt-2 flex gap-4 text-[10px] text-ink-400">
                  <span>样本量：n={node.stats.sampleSize}</span>
                  {node.stats.avgTransitionMonths > 0 && <span>平均转型周期：{node.stats.avgTransitionMonths} 个月</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card relative overflow-hidden p-5">
          <span className="absolute left-0 top-0 h-full w-1 bg-brand-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">总样本量</p>
          <p className="display mt-1 text-2xl font-bold text-brand-800">526</p>
          <p className="text-[11px] text-ink-400">来自脉脉、拉勾、Boss 直聘</p>
        </div>
        <div className="card relative overflow-hidden p-5">
          <span className="absolute left-0 top-0 h-full w-1 bg-teal-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">数据截止</p>
          <p className="display mt-1 text-2xl font-bold text-teal-700">2025.12</p>
          <p className="text-[11px] text-ink-400">存在 6 个月滞后</p>
        </div>
        <div className="card relative overflow-hidden p-5">
          <span className="absolute left-0 top-0 h-full w-1 bg-gold-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">覆盖地域</p>
          <p className="display mt-1 text-2xl font-bold text-gold-600">一线 + 新一线</p>
          <p className="text-[11px] text-ink-400">二三线城市数据不足</p>
        </div>
      </div>

      <p className="text-xs text-ink-400">概率为群体统计结果，不代表个人成功率。我们明确标注 Unknown 状态，绝不伪造确定性。</p>
    </div>
  );
}

