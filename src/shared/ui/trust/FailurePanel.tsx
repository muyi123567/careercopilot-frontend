/**
 * V2 §8.4 可信组件：FailurePanel
 * 错误类型、request id、草稿状态、重试。
 * V2 要求：生产失败绝不伪装成 Demo。
 */
interface FailurePanelProps {
  errorType: string
  requestId?: string
  message: string
  hasDraft?: boolean
  onRetry?: () => void
}

export function FailurePanel({ errorType, requestId, message, hasDraft, onRetry }: FailurePanelProps) {
  return (
    <div className="rounded-[12px] border border-(--danger) bg-(--danger-soft) p-4" role="alert">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-(--danger)">
            {errorType === 'service_failure' ? '服务故障' : errorType === 'data_insufficient' ? '数据不足' : '请求失败'}
          </p>
          <p className="mt-1 text-sm text-(--ink)">{message}</p>
        </div>
      </div>

      {requestId && (
        <p className="mt-2 font-mono text-xs text-(--muted)">
          Request ID: {requestId}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-[10px] bg-(--primary) px-4 py-1.5 text-xs font-medium text-white hover:bg-(--primary-hover)"
          >
            重试
          </button>
        )}
        {hasDraft && (
          <span className="text-xs text-(--success)">草稿已保存</span>
        )}
      </div>
    </div>
  )
}
