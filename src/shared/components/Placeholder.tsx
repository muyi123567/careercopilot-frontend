export function Placeholder({
  title,
  feature,
  description,
}: {
  title: string;
  feature: string;
  description: string;
}) {
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="eyebrow">规划中</p>
      <h1 className="display text-2xl font-semibold">{title}</h1>
      <div className="card border-dashed border-line bg-paper/40 p-6 text-ink-500">
        <p className="text-sm">{description}</p>
        <p className="mt-3 text-xs text-ink-400">
          对应后端功能 <span className="font-mono">{feature}</span> 尚未就绪，页面骨架已预留，数据就绪后接入。
        </p>
      </div>
    </div>
  );
}
