export function CoverageBadge({ gaps }: { gaps: string[] }) {
  if (gaps.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        数据覆盖完整
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
      title={gaps.join('、')}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
      数据缺口 {gaps.length} 项
    </span>
  );
}
