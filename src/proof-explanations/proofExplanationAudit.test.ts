import { describe, expect, it } from "vitest";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";
import { buildProofExplanationAuditReport } from "./proofExplanationAudit";

describe("proof explanation stabilization audit", () => {
  const report = buildProofExplanationAuditReport();

  it("covers visual proofs and theorem proof surfaces", () => {
    expect(report.visualProofCount).toBeGreaterThan(0);
    expect(report.phaseUpgradedVisualProofCount).toBeGreaterThan(150);
    expect(report.theoremCount).toBeGreaterThan(200);
    expect(report.theoremDraftReadyCount).toBeGreaterThan(0);
  });

  it("keeps core proof explanations structurally ready", () => {
    expect(report.ready, report.errors.map((issue) => `${issue.id}: ${issue.message}`).join("\n")).toBe(true);
  });

  it("tracks planned theorem proof gaps without blocking Phase 1", () => {
    expect(report.theoremPlannedCount).toBeGreaterThan(0);
    expect(report.warnings.some((issue) => issue.message.includes("step-by-step draft"))).toBe(true);
  });

  it("keeps draft-ready theorem proof explanations above the Phase 2 clarity floor", () => {
    const nonPlannedWarnings = report.warnings.filter((issue) => !issue.message.includes("step-by-step draft"));

    expect(nonPlannedWarnings, nonPlannedWarnings.map((issue) => `${issue.id}: ${issue.message}`).join("\n")).toEqual([]);
  });

  it("keeps phase-upgraded visual proof explanations classroom-ready across every category", () => {
    const phaseUpgradedProofs = visualProofsIndex.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded");
    const categorySlugs = new Set(phaseUpgradedProofs.map((proof) => proof.categorySlug));

    expect(categorySlugs.size).toBe(18);
    expect(phaseUpgradedProofs.every((proof) => proof.longDescription.trim().length >= 110)).toBe(true);
    expect(phaseUpgradedProofs.every((proof) => proof.learningOutcomes.length >= 2)).toBe(true);
    expect(phaseUpgradedProofs.every((proof) => proof.hasFormulaTokens && proof.hasPredictionPrompt && proof.hasSnapshotSupport)).toBe(true);
  });
});
