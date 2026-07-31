export function RadarPage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">市场雷达</h1>
        <p className="mt-1 text-sm text-ink-500">跟踪与你相关的岗位变动和行业信号</p>
      </section>

      {/* Coming soon state */}
      <div className="rounded-xl border border-dashed border-line p-10 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10 text-ink-300" aria-hidden="true">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="mt-3 text-sm font-medium text-ink-600">市场雷达即将上线</p>
        <p className="mt-1 text-xs text-ink-400">
          我们正在接入岗位市场数据源。<br />
          上线后，你可以在这里看到与你档案匹配的市场信号。
        </p>
        <span className="mt-4 inline-block rounded-full bg-ink-100 px-3 py-1 text-[10px] font-medium text-ink-500">
          敬请期待
        </span>
      </div>
    </div>
  );
}
