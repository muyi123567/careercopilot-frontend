// C-PATH-01: equal-structure three-path comparison with coverage/conflict badges
// and provenance drawer. No fake percentage or radar-area ranking; every public
// number must open public provenance.

export type PathType = "deepen" | "adjacent" | "explore";

export interface PublicEvidenceRef {
  domain: string;
  releaseId: string;
  version: string;
  sourceIds: string[];
}

export interface PathView {
  pathType: PathType;
  title: string;
  evidenceWeight: number | null; // null = not computed, never a fake percentage
  coverage: "covered" | "partial" | "not_covered";
  conflicts: string[];
  provenance: PublicEvidenceRef[];
  internationalOnly: boolean;
}

export interface CompareResult {
  paths: PathView[];
  equalStructure: boolean;
  privateDataLeaked: boolean;
}

const FORBIDDEN_PRIVATE_TOKENS = [
  "private_chunk",
  "private_embedding",
  "private_summary",
  "private_citation",
  "user_private_curriculum",
];

export function buildComparison(paths: PathView[]): CompareResult {
  const equalStructure =
    paths.length === 3 &&
    new Set(paths.map((p) => p.pathType)).size === 3;
  const blob = JSON.stringify(paths);
  const privateDataLeaked = FORBIDDEN_PRIVATE_TOKENS.some((token) =>
    blob.includes(token),
  );
  return { paths, equalStructure, privateDataLeaked };
}

export function openProvenance(path: PathView, domain: string): PublicEvidenceRef | null {
  // Every public number opens public provenance; returns null for unknown.
  return path.provenance.find((ref) => ref.domain === domain) ?? null;
}

export function coverageBadge(path: PathView): "covered" | "partial" | "not_covered" {
  return path.coverage;
}

export function conflictBadges(path: PathView): string[] {
  return path.conflicts;
}