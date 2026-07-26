/* AUTO-GENERATED from contracts/career-navigation/career-navigation-v2.0.0.schema.json
 * 源：B 仓 product-library。不要手改——改源 schema 后 npm run codegen。
 * 这是"契约驱动 / 前后端脱钩"的类型真相源。
 */

/**
 * Canonical V2 response contract. It reports evidence and uncertainty; it never represents a career path as a success probability.
 */
export type CareerNavigationAPIResponse = CareerNavigationAPIResponse1 & CareerNavigationAPIResponse2
export type CareerNavigationAPIResponse1 = {
  [k: string]: unknown
}

export interface CareerNavigationAPIResponse2 {
  schema_version: '2.0.0'
  status: 'ok' | 'data_insufficient' | 'service_failure'
  request_id: string
  generated_at: string
  data: NavigationResult | null
  error: Error | null
}
export interface NavigationResult {
  current_occupation: Occupation | null
  /**
   * @maxItems 3
   */
  paths: [] | [Path] | [Path, Path] | [Path, Path, Path]
  evidence: Evidence[]
  sources: Source[]
  coverage_gaps: string[]
}
export interface Occupation {
  occupation_id: string
  name: string
}
export interface Path {
  path_id: string
  path_type: 'deepen' | 'adjacent' | 'explore'
  target_occupation: Occupation
  summary: string
  benefits: string[]
  costs: string[]
  key_gaps: string[]
  minimum_validation_actions: ValidationAction[]
  counterevidence: string[]
  evidence_ids: string[]
  source_ids: string[]
  uncertainty: Uncertainty
}
export interface ValidationAction {
  action_id: string
  title: string
  expected_signal: string
  timebox_days: number
}
export interface Uncertainty {
  kind: 'sample_variability' | 'model_estimate' | 'data_coverage' | 'extraction_quality' | 'not_available'
  level: 'low' | 'medium' | 'high' | 'unknown'
  basis: string
  interval?: {
    lower: number
    upper: number
    coverage: number
  } | null
  /**
   * Must explain what is uncertain. It must not describe path success or personal suitability as a probability.
   */
  interpretation: string
}
export interface Evidence {
  evidence_id: string
  claim: string
  classification: 'fact' | 'inference' | 'recommendation'
  evidence_grade: 'A' | 'B' | 'C' | 'D' | 'U'
  /**
   * @minItems 1
   */
  source_ids: [string, ...string[]]
  user_confirmation: 'not_required' | 'pending' | 'confirmed' | 'rejected'
  /**
   * Quality of information extraction only; never a career success or suitability probability.
   */
  extraction_confidence: number | null
  uncertainty: Uncertainty
}
export interface Source {
  source_id: string
  source_type:
    | 'user_confirmed'
    | 'job_posting'
    | 'official_taxonomy'
    | 'survey'
    | 'trajectory_dataset'
    | 'market_dataset'
    | 'model_output'
    | 'other'
  title: string
  url?: string | null
  license: string
  version: string
  observed_at: string
  sample_size?: number | null
  scope: DataScope
  methodology: Methodology
}
export interface DataScope {
  geographies: string[]
  industries: string[]
  experience_levels: string[]
  population: string
  time_window: TimeWindow
}
export interface TimeWindow {
  start: string
  end: string
}
export interface Methodology {
  method_id: string
  name: string
  description: string
  version: string
  parameters?: {
    [k: string]: unknown
  }
}
export interface Error {
  code: 'UPSTREAM_UNAVAILABLE' | 'CONTRACT_VIOLATION' | 'RATE_LIMITED' | 'AUTH_REQUIRED' | 'INTERNAL_ERROR'
  message: string
  retryable: boolean
  trace_id: string
}
