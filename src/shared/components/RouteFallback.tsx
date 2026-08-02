/**
 * 路由级 Suspense fallback — 轻量骨架屏，与页面结构匹配。
 */
export function RouteFallback() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="页面加载中">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-48 rounded bg-ink-100" />
        <div className="h-4 w-72 rounded bg-ink-100/60" />
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-xl bg-ink-100/40" />
        <div className="h-24 rounded-xl bg-ink-100/40" />
        <div className="h-24 rounded-xl bg-ink-100/40" />
      </div>
      <div className="h-40 rounded-xl bg-ink-100/30" />
    </div>
  );
}
