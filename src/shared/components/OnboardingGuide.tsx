import { Link } from 'react-router';

interface Step {
  label: string;
  done: boolean;
  to: string;
}

interface OnboardingGuideProps {
  steps: Step[];
}

export function OnboardingGuide({ steps }: OnboardingGuideProps) {
  const doneCount = steps.filter((s) => s.done).length;
  const pct = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-800">设置指南</p>
        <span className="text-xs text-ink-400">{doneCount}/{steps.length}</span>
      </div>
      {/* Progress bar */}
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-accent-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Steps */}
      <ul className="space-y-2.5">
        {steps.map((step) => (
          <li key={step.label}>
            <Link to={step.to} className="flex items-center gap-2.5 group">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors ${
                step.done
                  ? 'border-success-500 bg-success-50 text-success-600'
                  : 'border-ink-200 text-transparent group-hover:border-accent-400'
              }`}>
                {step.done ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3"><path d="M20 6L9 17l-5-5" /></svg>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-200 group-hover:bg-accent-400" />
                )}
              </span>
              <span className={`text-sm transition-colors ${step.done ? 'text-ink-400 line-through' : 'text-ink-700 group-hover:text-ink-900'}`}>
                {step.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
