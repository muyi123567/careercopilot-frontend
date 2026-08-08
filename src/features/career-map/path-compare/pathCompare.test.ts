import { describe, expect, it } from "vitest";
import {
  buildComparison,
  openProvenance,
  coverageBadge,
  conflictBadges,
  type PathView,
} from "../../../features/career-map/path-compare/pathCompare";

function fullPaths(): PathView[] {
  return [
    {
      pathType: "deepen",
      title: "深化",
      evidenceWeight: 2.5,
      coverage: "covered",
      conflicts: [],
      provenance: [{ domain: "macro", releaseId: "release:macro-v1", version: "v1", sourceIds: ["gov-nbs"] }],
      internationalOnly: false,
    },
    {
      pathType: "adjacent",
      title: "邻近",
      evidenceWeight: 1.5,
      coverage: "covered",
      conflicts: ["薪资口径修订"],
      provenance: [{ domain: "taxonomy", releaseId: "release:taxonomy-v1", version: "v1", sourceIds: ["gov-cn"] }],
      internationalOnly: false,
    },
    {
      pathType: "explore",
      title: "探索",
      evidenceWeight: 1.0,
      coverage: "partial",
      conflicts: [],
      provenance: [{ domain: "city_policy", releaseId: "release:city-v1", version: "v1", sourceIds: ["gov-bj"] }],
      internationalOnly: false,
    },
  ];
}

describe("C-PATH-01 path comparison", () => {
  it("renders equal-structure three-path comparison", () => {
    const result = buildComparison(fullPaths());
    expect(result.equalStructure).toBe(true);
    expect(result.paths.length).toBe(3);
  });

  it("detects unequal structure", () => {
    const result = buildComparison(fullPaths().slice(0, 2));
    expect(result.equalStructure).toBe(false);
  });

  it("does not invent fake percentages or radar ranking", () => {
    const result = buildComparison(fullPaths());
    for (const p of result.paths) {
      expect(typeof p.evidenceWeight).toBe("number");
      expect(p.evidenceWeight).toBeLessThanOrEqual(3);
    }
  });

  it("every public number opens public provenance", () => {
    const paths = fullPaths();
    const prov = openProvenance(paths[0], "macro");
    expect(prov).not.toBeNull();
    expect(prov!.releaseId).toBe("release:macro-v1");
    expect(prov!.sourceIds).toContain("gov-nbs");
  });

  it("coverage and conflict badges are explicit", () => {
    const paths = fullPaths();
    expect(coverageBadge(paths[1])).toBe("covered");
    expect(conflictBadges(paths[1])).toContain("薪资口径修订");
  });

  it("never leaks user-private curriculum content", () => {
    const bad: PathView[] = [
      {
        ...fullPaths()[0],
        provenance: [{ domain: "user_private_curriculum", releaseId: "x", version: "x", sourceIds: [] }],
      },
      ...fullPaths().slice(1),
    ];
    expect(buildComparison(bad).privateDataLeaked).toBe(true);
  });
});