// C-EXP-01: experiment creation UI logic with visible time/money budgets,
// explicit stop conditions, and optional research sharing. Private curriculum
// content is never presented as shared evidence.

export interface ExperimentDraft {
  goal: string;
  successCriteria: string[];
  stopConditions: string[];
  budgetTimeMinutes: number;
  budgetMoneyCny: number;
  shareForResearch: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const MIN_BUDGET_TIME = 30; // minutes
export const MAX_BUDGET_TIME = 24 * 60 * 7; // one week

export function validateDraft(draft: ExperimentDraft): ValidationResult {
  const errors: string[] = [];
  if (!draft.goal.trim()) errors.push("goal_required");
  if (draft.successCriteria.length === 0) errors.push("success_criteria_required");
  if (draft.stopConditions.length === 0) errors.push("stop_conditions_required");
  if (draft.budgetTimeMinutes < MIN_BUDGET_TIME) errors.push("budget_time_too_low");
  if (draft.budgetTimeMinutes > MAX_BUDGET_TIME) errors.push("budget_time_too_high");
  if (draft.budgetMoneyCny < 0) errors.push("budget_money_negative");
  return { valid: errors.length === 0, errors };
}

export interface BudgetDisplay {
  timeMinutes: number;
  moneyCny: number;
  formatted: string;
}

export function formatBudget(draft: Pick<ExperimentDraft, "budgetTimeMinutes" | "budgetMoneyCny">): BudgetDisplay {
  const hours = Math.floor(draft.budgetTimeMinutes / 60);
  const minutes = draft.budgetTimeMinutes % 60;
  const timePart = hours > 0 ? `${hours}h${minutes > 0 ? `${minutes}m` : ""}` : `${minutes}m`;
  return {
    timeMinutes: draft.budgetTimeMinutes,
    moneyCny: draft.budgetMoneyCny,
    formatted: `预算 ${timePart} / ¥${draft.budgetMoneyCny}`,
  };
}

export function stopConditionsExplicit(draft: ExperimentDraft): boolean {
  return draft.stopConditions.length > 0 && draft.stopConditions.every((c) => c.trim().length > 0);
}

export function researchShareAllowed(draft: ExperimentDraft): boolean {
  return draft.shareForResearch;
}

export function assertNoPrivateCurriculumEvidence(evidenceBlob: string): boolean {
  const tokens = ["private_chunk", "private_embedding", "private_summary", "private_citation", "user_private_curriculum"];
  return !tokens.some((token) => evidenceBlob.includes(token));
}