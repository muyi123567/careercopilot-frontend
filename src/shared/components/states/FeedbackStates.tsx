import type { ReactNode } from 'react';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

export function LoadingState({ label = '正在读取结构化证据...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <Spinner size="lg" />
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  requestId,
  onRetry,
  onBack,
}: {
  message: string;
  requestId?: string;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="card border-red-200 bg-red-50/60 p-6 text-red-800" role="alert">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        <h2 className="text-base font-bold">出错了</h2>
      </div>
      <p className="mt-2 text-sm">{message}</p>
      {requestId && (
        <p className="mt-2 font-mono text-xs text-red-700">request_id: {requestId}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {onRetry && (
          <Button variant="destructive" size="sm" onClick={onRetry}>
            重试
          </Button>
        )}
        {onBack && (
          <Button variant="secondary" size="sm" onClick={onBack}>
            返回
          </Button>
        )}
      </div>
    </div>
  );
}

export function DataInsufficientState({ gaps, children }: { gaps: string[]; children?: ReactNode }) {
  return (
    <div className="card border-amber-200 bg-amber-50/60 p-6 text-amber-900" role="status">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
        <h2 className="font-bold">当前数据不足</h2>
      </div>
      <p className="mt-2 text-sm">系统不会用默认值或灰色低分替代缺失数据。以下缺口补全后可得可用结论：</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {gaps.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
      {children}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card p-8 text-center text-ink-500" role="status">
      <p className="font-medium text-ink-700">{title}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
    </div>
  );
}
