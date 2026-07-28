const DEMO_SESSIONS = [
  { id: 's1', date: '2026-07-28 14:32', turns: 6, summary: '从后端转产品的可行性分析', conclusion: '技术背景是差异化优势，建议先做 2 次信息访谈验证', status: 'completed' },
  { id: 's2', date: '2026-07-25 09:15', turns: 4, summary: '独立开发者路径的风险评估', conclusion: '3 年存活率约 15%，建议先用 2 周做 MVP 验证', status: 'completed' },
  { id: 's3', date: '2026-07-20 20:48', turns: 8, summary: '薪资预期与市场匹配度', conclusion: '一线城市技术 PM 中位薪资 30-45K，与预期匹配', status: 'completed' },
  { id: 's4', date: '2026-07-18 16:05', turns: 3, summary: '简历结构化提取测试', conclusion: '成功提取 12 个结构化信号，覆盖技能/经历/教育', status: 'completed' },
];

export function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">对话历史</p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">会话归档</h1>
        <p className="mt-1 text-sm text-ink-500">匿名会话仅存于浏览器内存，关闭后消失。以下为登录后的持久化记录（演示数据）。</p>
      </div>

      <div className="space-y-3">
        {DEMO_SESSIONS.map((s) => (
          <div key={s.id} className="card card-hover animate-slide-up p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-400">{s.date}</span>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-medium text-teal-700">{s.turns} 轮对话</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink-800">{s.summary}</h3>
            <div className="mt-2 rounded-lg bg-paper px-3 py-2">
              <p className="text-xs text-ink-500"><span className="font-medium text-brand-700">关键结论：</span>{s.conclusion}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-400">对话数据加密存储，你可以随时在设置中导出或删除。</p>
    </div>
  );
}

