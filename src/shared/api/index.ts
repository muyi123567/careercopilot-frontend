/**
 * shared/api 统一导出。
 * 业务组件（features/）通过此入口调用 API，不直接耦合 v1/v2 版本。
 */
export { v1Fetch } from './v1/client'
export { v2Fetch } from './v2/client'
export { validateV2Response } from './v2/schema-validator'
export { ApiError, ContractViolationError, handleApiError } from './common/errors'
export { API_CONFIG } from './common/config'
export { useHealth, useDevLogin, useMemorySearch, useProfile, useProjects } from './hooks'
