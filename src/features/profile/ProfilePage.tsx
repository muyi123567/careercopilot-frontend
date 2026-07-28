export function ProfilePage() {
  const skills = [
    { name: 'Python', level: 85, category: '技术' },
    { name: '分布式系统', level: 60, category: '技术' },
    { name: 'SQL', level: 75, category: '技术' },
    { name: '产品需求分析', level: 35, category: '产品' },
    { name: '用户研究', level: 25, category: '产品' },
    { name: '项目管理', level: 55, category: '通用' },
    { name: '技术写作', level: 70, category: '通用' },
    { name: '数据分析', level: 65, category: '技术' },
  ];

  const timeline = [
    { period: '2024.07 - 至今', role: '后端开发工程师', org: '某科技公司', highlights: ['主导微服务拆分', '搭建 CI/CD 流水线'] },
    { period: '2023.01 - 2024.06', role: '初级后端开发', org: '某创业公司', highlights: ['参与核心业务系统开发', '负责数据库优化'] },
    { period: '2019.09 - 2023.06', role: '计算机科学与技术 本科', org: '某大学', highlights: ['ACM 校赛银奖', '毕业设计：分布式任务调度'] },
  ];

  const preferences = [
    { label: '工作城市', value: '一线 / 新一线' },
    { label: '薪资预期', value: '25-40K' },
    { label: '工作模式', value: '混合办公优先' },
    { label: '行业偏好', value: '互联网 / AI / 金融科技' },
    { label: '岗位类型', value: '技术 / 技术管理 / 技术产品' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">记忆画像</p>
        <h1 className="display mt-1 text-2xl font-semibold sm:text-3xl">你的职业轮廓</h1>
        <p className="mt-1 text-sm text-ink-500">基于推演过程中提取的结构化信号构建。所有数据仅用于为你生成路径建议。</p>
      </div>

      {/* Skills radar */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-ink-800">技能图谱</h2>
        <div className="mt-4 space-y-3">
          {skills.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-medium text-ink-700">{s.name}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-ink-900/5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${s.category === '技术' ? 'bg-gradient-to-r from-brand-400 to-brand-600' : s.category === '产品' ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-gradient-to-r from-gold-400 to-gold-500'}`}
                  style={{ width: `${s.level}%` }}
                />
              </div>
              <span className="w-8 text-right text-[11px] font-semibold text-ink-500">{s.level}%</span>
              <span className={`w-10 text-right text-[10px] ${s.category === '技术' ? 'text-brand-600' : s.category === '产品' ? 'text-teal-600' : 'text-gold-600'}`}>{s.category}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 border-t border-line pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-ink-400"><span className="h-2 w-2 rounded-full bg-brand-500" />技术</span>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-400"><span className="h-2 w-2 rounded-full bg-teal-500" />产品</span>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-400"><span className="h-2 w-2 rounded-full bg-gold-500" />通用</span>
        </div>
      </div>

      {/* Experience timeline */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-ink-800">经历时间线</h2>
        <div className="relative mt-4 space-y-0 pl-6">
          <span className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(33,29,26,0.16)_0_5px,transparent_5px_10px)]" />
          {timeline.map((t, i) => (
            <div key={i} className="relative pb-6 last:pb-0">
              <span className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] ${i === 0 ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-surface text-ink-400'}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              <div className="ml-2 rounded-xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-700">{t.period}</span>
                  {i === 0 && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">当前</span>}
                </div>
                <h4 className="mt-1 text-sm font-semibold text-ink-800">{t.role}</h4>
                <p className="text-xs text-ink-500">{t.org}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.highlights.map((h) => (
                    <span key={h} className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[10px] text-ink-600">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-ink-800">偏好与约束</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {preferences.map((p) => (
            <div key={p.label} className="rounded-xl border border-line bg-paper px-4 py-3">
              <p className="text-xs text-ink-400">{p.label}</p>
              <p className="mt-0.5 text-sm font-medium text-ink-700">{p.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-400">偏好数据来自推演过程中的结构化提取。登录后可手动修正。</p>
      </div>
    </div>
  );
}
