/**
 * AlertDialog — 危险操作确认对话框。
 * 基于原生 <dialog> 实现，复用 Button destructive variant。
 */
import { useRef, useEffect, type ReactNode } from 'react';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  children?: ReactNode;
}

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '确认',
  cancelLabel = '取消',
  variant = 'danger',
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-[110] m-auto w-full max-w-sm rounded-xl border border-line bg-surface p-0 shadow-lift backdrop:bg-scrim"
    >
      <div className="p-6">
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        <p className="mt-2 text-sm text-ink-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100/50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-accent-500 hover:bg-accent-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
