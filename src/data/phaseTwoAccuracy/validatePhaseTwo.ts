import type { AdvancedAccuracyContract, CertificationEvidence, SystemAccuracyContract } from "./types";

export type PhaseTwoValidationIssue = { contractId: string; field: string; message: string };

export function validateAdvancedContracts(contracts: AdvancedAccuracyContract[]) {
  const issues: PhaseTwoValidationIssue[] = [];
  const ids = new Set<string>();
  for (const item of contracts) {
    if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(item.id)) issues.push({ contractId: item.id, field: "id", message: "Stable dotted ID required." });
    if (ids.has(item.id)) issues.push({ contractId: item.id, field: "id", message: "Duplicate ID." });
    ids.add(item.id);
    if (!item.route.startsWith("/")) issues.push({ contractId: item.id, field: "route", message: "Absolute app route required." });
    if (!item.definition || !item.formula || item.restrictions.length < 1) issues.push({ contractId: item.id, field: "accuracy", message: "Definition, formula, and restrictions are required." });
    if (item.invariants.length < 2 || !item.oracle) issues.push({ contractId: item.id, field: "validation", message: "At least two invariants and an independent oracle are required." });
    if (!item.misconception.claim || !item.misconception.correction || !item.misconception.counterexample) issues.push({ contractId: item.id, field: "misconception", message: "Claim, correction, and counterexample are required." });
    if (item.exampleContexts.length < 3) issues.push({ contractId: item.id, field: "examples", message: "At least three topic-specific contexts are required at contract stage." });
    if (new Set(item.assessmentModes).size !== 5) issues.push({ contractId: item.id, field: "assessment", message: "All five assessment modes are required." });
    if (item.accessibilityEvidence.length < 4) issues.push({ contractId: item.id, field: "accessibility", message: "Keyboard, text, motion, and non-color evidence are required." });
  }
  return issues;
}

export function validateSystemContracts(contracts: SystemAccuracyContract[]) {
  const issues: PhaseTwoValidationIssue[] = [];
  const ids = new Set<string>();
  for (const item of contracts) {
    if (ids.has(item.id)) issues.push({ contractId: item.id, field: "id", message: "Duplicate ID." });
    ids.add(item.id);
    if (!item.route.startsWith("/")) issues.push({ contractId: item.id, field: "route", message: "Absolute route required." });
    if (item.requirements.length < 3 || item.invariants.length < 2 || item.evidence.length < 3) issues.push({ contractId: item.id, field: "coverage", message: "Requirements, invariants, and evidence are incomplete." });
    if (!item.ownerFiles.length || item.ownerFiles.some((path) => !path.startsWith("src/") && !path.endsWith(".md"))) issues.push({ contractId: item.id, field: "ownerFiles", message: "Owner files must be repository paths." });
  }
  return issues;
}

export function deriveCertificationStatus(evidence: CertificationEvidence) {
  const dimensions = [evidence.mathematical, evidence.content, evidence.assessment, evidence.accessibility, evidence.browser];
  if (dimensions.every((value) => value === "passed") && evidence.reviewer && evidence.reviewedAt) return "certified" as const;
  if (dimensions.some((value) => value === "passed" || value === "partial")) return "in-progress" as const;
  return "inventory" as const;
}
