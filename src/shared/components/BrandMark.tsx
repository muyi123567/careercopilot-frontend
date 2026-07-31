/**
 * 见微行远 EvidWay 品牌 Mark
 * "见" = 抽象眼睛轮廓（椭圆）
 * "行" = 从瞳孔延伸的虚线路径（3个渐远节点）
 * stroke-only, 无填充, 单色可适配
 */
interface BrandMarkProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

export function BrandMark({ size = 24, color = 'currentColor', animate = false, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* 眼睛轮廓 - "见" */}
      <path d="M6 24c0 0 7-10 18-10s18 10 18 10-7 10-18 10S6 24 6 24z" />
      {/* 瞳孔 */}
      <circle cx="24" cy="24" r="5" />
      {/* 路径轨迹 - "行" (从瞳孔向右上方延伸) */}
      <path
        d="M29 21l4-4"
        strokeDasharray="2 2"
        className={animate ? 'animate-dash-flow' : undefined}
      />
      <circle cx="35" cy="15" r="1.5" fill={color} stroke="none" opacity="0.7" />
      <path
        d="M36.5 13.5l3-3"
        strokeDasharray="2 2"
        opacity="0.5"
        className={animate ? 'animate-dash-flow' : undefined}
      />
      <circle cx="41" cy="9" r="1" fill={color} stroke="none" opacity="0.4" />
      <path
        d="M42 8l2.5-2.5"
        strokeDasharray="1.5 2"
        opacity="0.3"
        className={animate ? 'animate-dash-flow' : undefined}
      />
    </svg>
  );
}
