/**
 * 空状态 SVG 插画组件
 * 风格: 线性 stroke, ink-300, strokeWidth 1.5, 80x80 viewBox
 */

export function EmptyEvidence({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'h-20 w-20 text-ink-300'} aria-hidden="true">
      <rect x="20" y="16" width="40" height="52" rx="4" />
      <path d="M30 30h20M30 38h20M30 46h12" />
      <circle cx="56" cy="56" r="12" />
      <path d="M56 52v8M52 56h8" strokeDasharray="2 2" />
    </svg>
  );
}

export function EmptyAction({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'h-20 w-20 text-ink-300'} aria-hidden="true">
      <path d="M44 20L28 44h12l-4 16 16-24H40l4-16z" />
      <rect x="16" y="12" width="48" height="56" rx="6" strokeDasharray="4 3" />
    </svg>
  );
}

export function EmptyMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'h-20 w-20 text-ink-300'} aria-hidden="true">
      <circle cx="24" cy="56" r="6" />
      <circle cx="56" cy="24" r="6" strokeDasharray="3 2" />
      <path d="M29 51C36 42 44 34 51 29" strokeDasharray="4 3" />
      <circle cx="40" cy="40" r="3" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  );
}

export function EmptyDecision({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'h-20 w-20 text-ink-300'} aria-hidden="true">
      <circle cx="40" cy="24" r="6" />
      <path d="M40 30v10" />
      <path d="M40 40L26 56" />
      <path d="M40 40l14 16" />
      <circle cx="26" cy="58" r="4" strokeDasharray="2 2" />
      <circle cx="54" cy="58" r="4" strokeDasharray="2 2" />
    </svg>
  );
}
