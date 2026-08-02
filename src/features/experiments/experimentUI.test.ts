import { describe, expect, it } from "vitest";
import {
  validateDraft,
  formatBudget,
  stopConditionsExplicit,
  researchShareAllowed,
  assertNoPrivateCurriculumEvidence,
  type ExperimentDraft,
} from "./experimentUI";

function goodDraft(): ExperimentDraft {
  return {
    goal: "验证数据分析师转型",
    successCriteria: ["Day7 完成 3 次实操"],
    stopConditions: ["时间预算耗尽"],
    budgetTimeMinutes: 420,
    budgetMoneyCny: 100,
    shareForResearch: false,
  };
}

describe("C-EXP-01 experiment UI", () => {
  it("validates draft with budget and stop conditions", () => {
    expect(validateDraft(goodDraft()).valid).toBe(true);
  });

  it("time and money budget are visible", () => {
    const display = formatBudget({ budgetTimeMinutes: 420, budgetMoneyCny: 100 });
    expect(display.formatted).toBe("预算 7h / ¥100");
    expect(display.timeMinutes).toBe(420);
    expect(display.moneyCny).toBe(100);
  });

  it("stop conditions are explicit", () => {
    expect(stopConditionsExplicit(goodDraft())).toBe(true);
    const empty = { ...goodDraft(), stopConditions: [] };
    expect(stopConditionsExplicit(empty)).toBe(false);
  });

  it("users can choose not to share results for research", () => {
    const optOut = { ...goodDraft(), shareForResearch: false };
    const optIn = { ...goodDraft(), shareForResearch: true };
    expect(researchShareAllowed(optOut)).toBe(false);
    expect(researchShareAllowed(optIn)).toBe(true);
  });

  it("private curriculum content is never presented as shared evidence", () => {
    expect(assertNoPrivateCurriculumEvidence("用户上传的正常证据")).toBe(true);
    expect(assertNoPrivateCurriculumEvidence("{\"private_chunk\":\"私密\"}")).toBe(false);
  });

  it("rejects missing criteria and tiny budgets", () => {
    const bad = { ...goodDraft(), successCriteria: [], budgetTimeMinutes: 5 };
    const result = validateDraft(bad);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("success_criteria_required");
    expect(result.errors).toContain("budget_time_too_low");
  });
});