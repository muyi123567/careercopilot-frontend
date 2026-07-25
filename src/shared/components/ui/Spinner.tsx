interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const DIM: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-b-2',
};

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-3 text-ink-500">
      <span
        className={`inline-block animate-spin rounded-full border-brand-600 ${DIM[size]}`}
        aria-hidden="true"
      />
      {label && <span className="text-sm">{label}</span>}
    </span>
  );
}
