/**
 * V2 §8.4 可信组件：ConsentNotice
 * 用途、范围、是否可撤回；不得预勾选。
 */
interface ConsentNoticeProps {
  purpose: string
  scope: string
  revocable?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function ConsentNotice({ purpose, scope, revocable = true, checked = false, onChange }: ConsentNoticeProps) {
  return (
    <label className="flex items-start gap-3 rounded-[12px] border border-(--border) bg-(--surface) p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-(--border) accent-(--primary)"
      />
      <div className="text-sm">
        <p className="font-medium text-(--ink)">{purpose}</p>
        <p className="mt-0.5 text-xs text-(--muted)">{scope}</p>
        {revocable && (
          <p className="mt-1 text-xs text-(--success)">可随时撤回</p>
        )}
      </div>
    </label>
  )
}
