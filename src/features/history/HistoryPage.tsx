export function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">对话历史</p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">会话归档</h1>
        <p className="mt-1 text-sm text-ink-500">登录后的持久化会话将在历史服务接入后显示；匿名会话仅存于浏览器内存，关闭后消失。</p>
      </div>

      <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-500">
        暂无已保存的会话记录。
      </div>

      <p className="text-xs text-ink-400">生产数据不可用时显示明确空态，不使用隐藏演示数据。</p>
    </div>
  );
}