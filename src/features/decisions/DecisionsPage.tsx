export function DecisionsPage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">决策记录</h1>
        <p className="mt-1 text-sm text-ink-500">记录每一次职业选择，让未来的自己有据可循</p>
      </section>

      {/* Empty state */}
      <div className="rounded-xl border border-dashed border-line p-10 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10 text-ink-300" aria-hidden="true">
          <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <p className="mt-3 text-sm font-medium text-ink-600">还没有决策记录</p>
        <p className="mt-1 text-xs text-ink-400">
          当你面临职业选择时，在这里记录依据和结果。<br />
          回头看时，你会发现自己的判断模式。
        </p>
        <button className="mt-4 rounded-lg bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink-700">
          记录第一个决策
        </button>
      </div>
    </div>
  );
}
