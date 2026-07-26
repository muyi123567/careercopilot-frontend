/**
 * 运行时契约校验（强化版 navigation-contract.js）。
 * 前端不信任任何后端响应：先用本模块校验，再渲染。
 */
import type {
  CareerNavigationResponse,
  Evidence,
  NavigationResult,
  PathType,
  ResponseStatus,
  Source,
  Uncertainty,
  CareerPath,
  EvidenceGrade,
  EvidenceClassification,
  UserConfirmation,
  SourceType,
  UncertaintyKind,
  UncertaintyLevel,
  ErrorCode,
} from './contract';

const STATUSES = new Set<ResponseStatus>(['ok', 'data_insufficient', 'service_failure']);
const PATH_TYPES = new Set<PathType>(['deepen', 'adjacent', 'explore']);
const GRADES = new Set<EvidenceGrade>(['A', 'B', 'C', 'D', 'U']);
const CLASSIFICATIONS = new Set<EvidenceClassification>(['fact', 'inference', 'recommendation']);
const CONFIRMATIONS = new Set<UserConfirmation>([
  'not_required',
  'pending',
  'confirmed',
  'rejected',
]);
const SOURCE_TYPES = new Set<SourceType>([
  'user_confirmed',
  'job_posting',
  'official_taxonomy',
  'survey',
  'trajectory_dataset',
  'market_dataset',
  'model_output',
  'other',
]);
const UNCERTAINTY_KINDS = new Set<UncertaintyKind>([
  'sample_variability',
  'model_estimate',
  'data_coverage',
  'extraction_quality',
  'not_available',
]);
const UNCERTAINTY_LEVELS = new Set<UncertaintyLevel>(['low', 'medium', 'high', 'unknown']);
const ERROR_CODES = new Set<ErrorCode>([
  'UPSTREAM_UNAVAILABLE',
  'CONTRACT_VIOLATION',
  'RATE_LIMITED',
  'AUTH_REQUIRED',
  'INTERNAL_ERROR',
]);

export class ContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
function oneOf<T>(set: Set<T>, value: unknown): value is T {
  return set.has(value as T);
}

function validateUncertainty(raw: unknown, where: string): Uncertainty {
  if (!isObject(raw)) throw new ContractError(`${where}.uncertainty 必须是对象`);
  if (!oneOf(UNCERTAINTY_KINDS, raw.kind)) throw new ContractError(`${where}.uncertainty.kind 非法`);
  if (!oneOf(UNCERTAINTY_LEVELS, raw.level))
    throw new ContractError(`${where}.uncertainty.level 非法`);
  if (!isString(raw.basis) || raw.basis.length === 0)
    throw new ContractError(`${where}.uncertainty.basis 必填`);
  if (!isString(raw.interpretation) || raw.interpretation.length === 0)
    throw new ContractError(`${where}.uncertainty.interpretation 必填`);
  const interval = raw.interval;
  if (interval !== null && interval !== undefined) {
    if (!isObject(interval)) throw new ContractError(`${where}.uncertainty.interval 非法`);
    if (!isNumber(interval.lower) || !isNumber(interval.upper))
      throw new ContractError(`${where}.uncertainty.interval 边界必为数字`);
    if (!isNumber(interval.coverage) || interval.coverage <= 0 || interval.coverage >= 1)
      throw new ContractError(`${where}.uncertainty.interval.coverage 必须在 (0,1)`);
  }
  return raw as unknown as Uncertainty;
}

function validateSource(raw: unknown, i: number): Source {
  const where = `data.sources[${i}]`;
  if (!isObject(raw)) throw new ContractError(`${where} 必须是对象`);
  if (!isString(raw.source_id) || !/^[A-Za-z0-9._:-]+$/.test(raw.source_id))
    throw new ContractError(`${where}.source_id 非法`);
  if (!oneOf(SOURCE_TYPES, raw.source_type)) throw new ContractError(`${where}.source_type 非法`);
  if (!isString(raw.title) || raw.title.length === 0)
    throw new ContractError(`${where}.title 必填`);
  if (!isString(raw.license) || raw.license.length === 0)
    throw new ContractError(`${where}.license 必填`);
  if (!isString(raw.version) || raw.version.length === 0)
    throw new ContractError(`${where}.version 必填`);
  if (!isString(raw.observed_at) || Number.isNaN(Date.parse(raw.observed_at)))
    throw new ContractError(`${where}.observed_at 必须是日期时间`);
  if (raw.sample_size !== null && raw.sample_size !== undefined && !isNumber(raw.sample_size))
    throw new ContractError(`${where}.sample_size 必须是数字或 null`);
  if (!isObject(raw.scope)) throw new ContractError(`${where}.scope 必须是对象`);
  if (!isObject(raw.methodology)) throw new ContractError(`${where}.methodology 必须是对象`);
  return raw as unknown as Source;
}

function validateEvidence(raw: unknown, i: number): Evidence {
  const where = `data.evidence[${i}]`;
  if (!isObject(raw)) throw new ContractError(`${where} 必须是对象`);
  if (!isString(raw.evidence_id) || !/^[A-Za-z0-9._:-]+$/.test(raw.evidence_id))
    throw new ContractError(`${where}.evidence_id 非法`);
  if (!isString(raw.claim) || raw.claim.length === 0)
    throw new ContractError(`${where}.claim 必填`);
  if (!oneOf(CLASSIFICATIONS, raw.classification))
    throw new ContractError(`${where}.classification 非法`);
  if (!oneOf(GRADES, raw.evidence_grade)) throw new ContractError(`${where}.evidence_grade 非法`);
  if (!isArray(raw.source_ids) || raw.source_ids.length === 0)
    throw new ContractError(`${where}.source_ids 至少一项`);
  if (!oneOf(CONFIRMATIONS, raw.user_confirmation))
    throw new ContractError(`${where}.user_confirmation 非法`);
  if (
    raw.extraction_confidence !== null &&
    raw.extraction_confidence !== undefined &&
    (!isNumber(raw.extraction_confidence) ||
      raw.extraction_confidence < 0 ||
      raw.extraction_confidence > 1)
  )
    throw new ContractError(`${where}.extraction_confidence 必须在 [0,1]`);
  validateUncertainty(raw.uncertainty, where);
  return raw as unknown as Evidence;
}

function validatePath(raw: unknown, i: number): CareerPath {
  const where = `data.paths[${i}]`;
  if (!isObject(raw)) throw new ContractError(`${where} 必须是对象`);
  if (!isString(raw.path_id) || !/^[A-Za-z0-9._:-]+$/.test(raw.path_id))
    throw new ContractError(`${where}.path_id 非法`);
  if (!oneOf(PATH_TYPES, raw.path_type)) throw new ContractError(`${where}.path_type 非法`);
  if (!isObject(raw.target_occupation) || !isString(raw.target_occupation.name))
    throw new ContractError(`${where}.target_occupation 非法`);
  if (!isString(raw.summary) || raw.summary.length === 0)
    throw new ContractError(`${where}.summary 必填`);
  if (!isArray(raw.benefits) || !isArray(raw.costs) || !isArray(raw.key_gaps))
    throw new ContractError(`${where}.benefits/costs/key_gaps 必须是数组`);
  if (!isArray(raw.counterevidence)) throw new ContractError(`${where}.counterevidence 必须是数组`);
  if (!isArray(raw.evidence_ids) || !isArray(raw.source_ids))
    throw new ContractError(`${where}.evidence_ids/source_ids 必须是数组`);
  if (!isArray(raw.minimum_validation_actions))
    throw new ContractError(`${where}.minimum_validation_actions 必须是数组`);
  for (const a of raw.minimum_validation_actions as unknown[]) {
    if (!isObject(a) || !isString(a.action_id) || !isString(a.title) || !isString(a.expected_signal))
      throw new ContractError(`${where}.minimum_validation_actions 项非法`);
    if (!isNumber(a.timebox_days) || a.timebox_days < 1 || a.timebox_days > 90)
      throw new ContractError(`${where}.minimum_validation_actions.timebox_days 必须在 1..90`);
  }
  validateUncertainty(raw.uncertainty, where);
  return raw as unknown as CareerPath;
}

function validateNavigationResult(raw: unknown): NavigationResult {
  const where = 'data';
  if (!isObject(raw)) throw new ContractError(`${where} 必须是对象`);
  if (raw.current_occupation !== null && !isObject(raw.current_occupation))
    throw new ContractError(`${where}.current_occupation 必须是对象或 null`);
  const paths = raw.paths;
  if (!isArray(paths) || paths.length > 3)
    throw new ContractError(`${where}.paths 必须是数组且最多 3 条`);
  const evidence = raw.evidence;
  if (!isArray(evidence)) throw new ContractError(`${where}.evidence 必须是数组`);
  const sources = raw.sources;
  if (!isArray(sources)) throw new ContractError(`${where}.sources 必须是数组`);
  const coverageGaps = raw.coverage_gaps;
  if (!isArray(coverageGaps)) throw new ContractError(`${where}.coverage_gaps 必须是数组`);
  paths.forEach((_, i) => validatePath(paths[i], i));
  evidence.forEach((_, i) => validateEvidence(evidence[i], i));
  sources.forEach((_, i) => validateSource(sources[i], i));
  return raw as unknown as NavigationResult;
}

export function validateNavigationResponse(data: unknown): CareerNavigationResponse {
  if (!isObject(data)) throw new ContractError('response 必须是对象');
  if (data.schema_version !== '2.0.0')
    throw new ContractError(`不支持的 schema 版本: ${String(data.schema_version)}`);
  if (!oneOf(STATUSES, data.status)) throw new ContractError(`未知响应状态: ${String(data.status)}`);
  if (!isString(data.request_id) || data.request_id.length === 0)
    throw new ContractError('request_id 必填');

  if (data.status === 'service_failure') {
    if (data.data !== null) throw new ContractError('service_failure 的 data 必须为 null');
    if (!isObject(data.error)) throw new ContractError('service_failure 必须包含 error');
    if (!oneOf(ERROR_CODES, (data.error as Record<string, unknown>).code))
      throw new ContractError('error.code 非法');
    return data as unknown as CareerNavigationResponse;
  }

  if (data.error !== null) throw new ContractError('非失败响应不能包含 error');
  if (data.status === 'data_insufficient') {
    const result = validateNavigationResult(data.data);
    if (result.coverage_gaps.length === 0)
      throw new ContractError('data_insufficient 必须包含 coverage_gaps');
    return data as unknown as CareerNavigationResponse;
  }
  // ok
  validateNavigationResult(data.data);
  return data as unknown as CareerNavigationResponse;
}

export type SafeValidation =
  | { ok: true; value: CareerNavigationResponse }
  | { ok: false; error: string };

export function validateNavigationResponseSafe(data: unknown): SafeValidation {
  try {
    return { ok: true, value: validateNavigationResponse(data) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
