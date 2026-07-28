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

/* ===== F13 群体职业轨迹参照 ===== */

export interface TrajectoryNode {
  occupation_id: string;
  name: string;
  transition_count: number;
  transition_rate: number; // (0,1)
  sample_size: number;
}

export interface TrajectoryEdge {
  from_occupation_id: string;
  to_occupation_id: string;
  count: number;
  rate: number; // (0,1)
}

export interface TrajectoryResponse {
  status: 'ok' | 'data_insufficient' | 'service_failure';
  request_id: string;
  current_occupation: Occupation | null;
  nodes: TrajectoryNode[];
  edges: TrajectoryEdge[];
  sources: Source[];
  scope: DataScope;
  coverage_gaps: string[];
  uncertainty: Uncertainty;
  error: ApiError | null;
}

export interface TrajectoryQuery {
  current_occupation?: string;
  target_occupation?: string;
  region?: string;
  experience_min?: number;
  experience_max?: number;
}

/* ===== F23 三路径比较 - 决策选择 ===== */

export interface PathSelectionInput {
  source_navigation_request_id: string;
  selected_path_id: string;
  selection_reason: string;
  unresolved_questions: string[];
}

export interface PathSelectionResult {
  decision_id: string;
  created_at: string;
  status: 'recorded';
}

/* ===== F41 行动计划与证据闭环 ===== */

export type ActionStatus = 'proposed' | 'active' | 'completed' | 'abandoned';

export interface CheckIn {
  checkin_id: string;
  at: string; // date-time
  note: string;
  subjective_feeling: string;
  before_after_delta?: string | null;
}

export interface UserAction {
  action_id: string;
  path_id: string;
  title: string;
  expected_signal: string;
  timebox_days: number;
  status: ActionStatus;
  evidence_links: string[];
  reason?: string | null;
  unresolved_questions: string[];
  reminder_enabled: boolean;
  checkins: CheckIn[];
  created_at: string;
  updated_at: string;
}

export interface CreateActionInput {
  path_id: string;
  title: string;
  expected_signal: string;
  timebox_days: number;
  evidence_links?: string[];
  reason?: string;
  unresolved_questions?: string[];
}

export interface UpdateActionInput {
  title?: string;
  status?: ActionStatus;
  evidence_links?: string[];
  reason?: string;
  unresolved_questions?: string[];
  reminder_enabled?: boolean;
}

export interface CreateCheckInInput {
  note: string;
  subjective_feeling: string;
  before_after_delta?: string;
}
