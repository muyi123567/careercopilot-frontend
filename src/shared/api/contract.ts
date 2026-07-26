/**
 * Career Navigation API v2 — 前端契约类型
 * 由 contracts/career-navigation/career-navigation-v2.0.0.schema.json 生成。
 * 前端只消费版本化 JSON，绝不解析 LLM 自由文本。
 */

export const SCHEMA_VERSION = '2.0.0' as const;

export type ResponseStatus = 'ok' | 'data_insufficient' | 'service_failure';
export type PathType = 'deepen' | 'adjacent' | 'explore';
export type EvidenceClassification = 'fact' | 'inference' | 'recommendation';
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D' | 'U';
export type UserConfirmation = 'not_required' | 'pending' | 'confirmed' | 'rejected';
export type UncertaintyKind =
  | 'sample_variability'
  | 'model_estimate'
  | 'data_coverage'
  | 'extraction_quality'
  | 'not_available';
export type UncertaintyLevel = 'low' | 'medium' | 'high' | 'unknown';
export type SourceType =
  | 'user_confirmed'
  | 'job_posting'
  | 'official_taxonomy'
  | 'survey'
  | 'trajectory_dataset'
  | 'market_dataset'
  | 'model_output'
  | 'other';
export type ErrorCode =
  | 'UPSTREAM_UNAVAILABLE'
  | 'CONTRACT_VIOLATION'
  | 'RATE_LIMITED'
  | 'AUTH_REQUIRED'
  | 'INTERNAL_ERROR';

export interface TimeWindow {
  start: string; // date
  end: string; // date
}

export interface DataScope {
  geographies: string[];
  industries: string[];
  experience_levels: string[];
  population: string;
  time_window: TimeWindow;
}

export interface Methodology {
  method_id: string;
  name: string;
  description: string;
  version: string;
  parameters?: Record<string, unknown>;
}

export interface UncertaintyInterval {
  lower: number;
  upper: number;
  coverage: number; // (0,1)
}

export interface Uncertainty {
  kind: UncertaintyKind;
  level: UncertaintyLevel;
  basis: string;
  interval?: UncertaintyInterval | null;
  interpretation: string;
}

export interface Source {
  source_id: string;
  source_type: SourceType;
  title: string;
  url?: string | null;
  license: string;
  version: string;
  observed_at: string; // date-time
  sample_size?: number | null;
  scope: DataScope;
  methodology: Methodology;
}

export interface Evidence {
  evidence_id: string;
  claim: string;
  classification: EvidenceClassification;
  evidence_grade: EvidenceGrade;
  source_ids: string[];
  user_confirmation: UserConfirmation;
  extraction_confidence?: number | null;
  uncertainty: Uncertainty;
}

export interface Occupation {
  occupation_id: string;
  name: string;
}

export interface ValidationAction {
  action_id: string;
  title: string;
  expected_signal: string;
  timebox_days: number; // 1..90
}

export interface CareerPath {
  path_id: string;
  path_type: PathType;
  target_occupation: Occupation;
  summary: string;
  benefits: string[];
  costs: string[];
  key_gaps: string[];
  minimum_validation_actions: ValidationAction[];
  counterevidence: string[];
  evidence_ids: string[];
  source_ids: string[];
  uncertainty: Uncertainty;
}

export interface NavigationResult {
  current_occupation: Occupation | null;
  paths: CareerPath[]; // max 3
  evidence: Evidence[];
  sources: Source[];
  coverage_gaps: string[];
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  trace_id: string;
}

export interface CareerNavigationResponse {
  schema_version: typeof SCHEMA_VERSION;
  status: ResponseStatus;
  request_id: string;
  generated_at: string; // date-time
  data: NavigationResult | null;
  error: ApiError | null;
}

/** 前端请求体（对应后端 NavigationRequest / demo /process） */
export interface NavigationRequestInput {
  current_occupation?: Occupation | null;
  target_occupation?: Occupation | null;
  region?: string;
  experience_level?: string;
}
