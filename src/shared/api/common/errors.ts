/**
 * 统一错误处理。
 * V2 §5.1 状态语义：ok / data_insufficient / service_failure / HTTP 错误。
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ContractViolationError extends Error {
  constructor(
    public readonly violations: string[],
    public readonly endpoint: string,
  ) {
    super(`API 响应不符合 canonical schema: ${endpoint}`)
    this.name = 'ContractViolationError'
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof ApiError) throw error
  if (error instanceof ContractViolationError) throw error
  if (error instanceof Error) {
    throw new ApiError(0, 'network_error', error.message)
  }
  throw new ApiError(0, 'unknown_error', '未知错误')
}
