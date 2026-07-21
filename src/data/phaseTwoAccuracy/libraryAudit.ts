import { formulaCategories } from "../formulaLibrary";
import { theoremCategories } from "../theoremLibrary";
import { visualProofsIndex } from "../../visual-proofs/data/visualProofsIndex";

export type LibraryAuditFinding = { id: string; severity: "error" | "warning"; message: string };

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const formulaAuditRecords = formulaCategories.flatMap((category) => category.formulas.map((formula) => ({
  conceptId: `formula.${category.id}.${slug(formula.title)}`,
  category: category.id,
  ...formula,
  assumptionsAndDomain: formula.note,
  scope: /matrix|calculus|probability|complex|vector/i.test(category.title) ? "advanced" as const : "school-and-advanced" as const,
  ownerRoute: `/formulas?category=${category.id}`,
})));

export const theoremAuditRecords = theoremCategories.flatMap((category) => category.theorems.map((theorem) => ({
  conceptId: `theorem.${category.id}.${theorem.slug}`,
  category: category.id,
  ...theorem,
  hasProofOutline: Boolean(theorem.proofIdea && theorem.proofSteps?.length),
  hasCounterexamplePrompt: Boolean(theorem.commonMistakes?.length),
  ownerRoute: `/theorems/${category.id}/${theorem.slug}`,
})));

export const visualProofAuditRecords = visualProofsIndex.map((proof) => ({
  conceptId: `visual-proof.${proof.id}`,
  ...proof,
  separatesIllustrationFromProof: Boolean(proof.longDescription && proof.learningOutcomes.length),
  accessibilityFlags: [proof.hasKeyboardControls ? "keyboard" : null, proof.hasStateInspector ? "state-text" : null, proof.hasFormulaTokens ? "formula-text" : null].filter(Boolean),
}));

export function auditLearningLibraries() {
  const findings: LibraryAuditFinding[] = [];
  findings.push(...duplicateFindings(formulaAuditRecords.map((item) => item.conceptId), "formula"));
  findings.push(...duplicateFindings(theoremAuditRecords.map((item) => item.conceptId), "theorem"));
  findings.push(...duplicateFindings(visualProofAuditRecords.map((item) => item.conceptId), "visual proof"));
  for (const item of formulaAuditRecords) {
    if (!item.formula.trim() || !item.note.trim()) findings.push({ id: item.conceptId, severity: "error", message: "Formula or assumptions/domain note is empty." });
  }
  for (const item of theoremAuditRecords) {
    if (!item.statement.trim() || !item.hasProofOutline) findings.push({ id: item.conceptId, severity: "error", message: "Theorem statement or proof outline is missing." });
    if (!item.prerequisites.length) findings.push({ id: item.conceptId, severity: "warning", message: "No explicit prerequisite is recorded." });
  }
  for (const item of visualProofAuditRecords.filter((proof) => proof.status === "available")) {
    if (!item.separatesIllustrationFromProof) findings.push({ id: item.conceptId, severity: "error", message: "Proof purpose and reasoning outcomes are incomplete." });
    if (!item.hasKeyboardControls) findings.push({ id: item.conceptId, severity: "warning", message: "Keyboard-control evidence is not yet recorded." });
    if (!item.hasStateInspector) findings.push({ id: item.conceptId, severity: "warning", message: "Text/state inspector evidence is not yet recorded." });
  }
  return {
    formulas: formulaAuditRecords.length,
    theorems: theoremAuditRecords.length,
    visualProofs: visualProofAuditRecords.length,
    errors: findings.filter((item) => item.severity === "error").length,
    warnings: findings.filter((item) => item.severity === "warning").length,
    findings,
  };
}

function duplicateFindings(ids: string[], label: string): LibraryAuditFinding[] {
  const seen = new Set<string>();
  return ids.flatMap((id) => {
    if (seen.has(id)) return [{ id, severity: "error" as const, message: `Duplicate canonical ${label} ID.` }];
    seen.add(id);
    return [];
  });
}
