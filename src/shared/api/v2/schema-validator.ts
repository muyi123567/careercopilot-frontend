/**
 * v2 AJV 运行时校验 — 加载 B 仓 canonical JSON Schema。
 * V2 §9.4 强制：API 响应必须经 AJV 校验，校验失败抛 ContractViolationError。
 */
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ContractViolationError } from '../common/errors'

// B 仓 canonical schema（career-navigation-v2.0.0.schema.json）
// 构建时从 contracts/ 目录导入
import canonicalSchema from '../../../../contracts/career-navigation/career-navigation-v2.0.0.schema.json'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const validate = ajv.compile(canonicalSchema)

export function validateV2Response(data: unknown, endpoint: string): void {
  const valid = validate(data)
  if (!valid && validate.errors) {
    const violations = validate.errors.map(
      (e) => `${e.instancePath || '/'}: ${e.message}`,
    )
    throw new ContractViolationError(violations, endpoint)
  }
}
