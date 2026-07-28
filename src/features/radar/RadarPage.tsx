const DEMO_TRENDS = [
  { role: '技术产品经理', region: '一线', demand: 88, growth: '+15%', avgSalary: '30-45K', sampleSize: 256, lastUpdated: '2025.12' },
  { role: '高级后端工程师', region: '一线', demand: 82, growth: '+8%', avgSalary: '35-55K', sampleSize: 342, lastUpdated: '2025.12' },
  { role: '数据分析师', region: '新一线', demand: 76, growth: '+22%', avgSalary: '20-35K', sampleSize: 189, lastUpdated: '2025.11' },
  { role: '独立开发者', region: '全国', demand: 45, growth: '+35%', avgSalary: '不确定', sampleSize: 56, lastUpdated: '2025.10' },
  { role: '技术总监', region: '一线', demand: 62, growth: '+5%', avgSalary: '50-80K', sampleSize: 128, lastUpdated: '2025.12' },
  { role: 'AI 工程师', region: '一线', demand: 94, growth: '+48%', avgSalary: '40-70K', sampleSize: 98, lastUpdated: '2025.12' },
];

const TIME_FILTERS = ['近 3 月', '近 6 月', '近 1 年'] as const;
const REGION_FILTERS = ['全国', '一线', '新一线', '二线'] as const;

export function RadarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">市场雷达</p>
          <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">职业市场趋势</h1>
          <p className="mt-1 text-sm text-ink-500">职业/地域/时间三维趋势。所有数据标注来源、样本量与截止时间。</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gold-50 px-3 py-1 text-[11px] font-medium text-gold-600 border border-gold-100">数据截止：2025.12</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-400">时间：</span>
          {TIME_FILTERS.map((t, i) => (
            <button key={t} type="button" className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${i === 2 ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-ink-500 hover:text-brand-700'}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-400">地域：</span>
          {REGION_FILTERS.map((r, i) => (
            <button key={r} type="button" className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${i === 0 ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-ink-500 hover:text-brand-700'}`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Trend table */}
      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-xs text-ink-500">
              <th className="px-4 py-3 font-medium">职业</th>
              <th className="px-4 py-3 font-medium">地域</th>
              <th className="px-4 py-3 font-medium">需求热度</th>
              <th className="px-4 py-3 font-medium">增长率</th>
              <th className="px-4 py-3 font-medium">薪资范围</th>
              <th className="px-4 py-3 font-medium">样本量</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_TRENDS.map((t) => (
              <tr key={t.role + t.region} className="border-b border-line last:border-b-0 transition-colors hover:bg-brand-50/30">
                <td className="px-4 py-3 font-medium text-ink-800">{t.role}</td>
                <td className="px-4 py-3 text-ink-500">{t.region}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-ink-900/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700" style={{ width: `${t.demand}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-ink-600">{t.demand}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${t.growth.startsWith('+') && parseInt(t.growth) > 20 ? 'text-teal-600' : 'text-ink-600'}`}>{t.growth}</span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-600">{t.avgSalary}</td>
                <td className="px-4 py-3 text-xs text-ink-400">n={t.sampleSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-line bg-paper px-4 py-3 text-xs text-ink-400">
        数据来源：脉脉职言、拉勾网、Boss 直聘公开数据聚合。市场热度不等于个人适合度。增长率基于同比 JD 数量变化。
      </div>
    </div>
  );
}
