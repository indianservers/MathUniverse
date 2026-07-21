import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { PHASE_TWO_ADVANCED_DOMAINS } from "./types";
import { deriveCertificationStatus, validateAdvancedContracts, validateSystemContracts } from "./validatePhaseTwo";
import { advancedExampleCoverage, advancedExampleRequirements, auditLearningLibraries, automatedEvidenceSummary, curriculumCoverageSummary, phaseTwoAdvancedAssessments, phaseTwoAdvancedContracts, phaseTwoAdvancedExamples, phaseTwoCertificationEvidence, phaseTwoCertificationSummary, phaseTwoCurriculumMappings } from ".";
import { phaseTwoSystemContracts } from "./systemContracts";

describe("Phase 2 accuracy roadmap contracts", () => {
  it("covers every advanced roadmap row with a valid contract", () => {
    expect(phaseTwoAdvancedContracts).toHaveLength(54);
    expect(validateAdvancedContracts(phaseTwoAdvancedContracts)).toEqual([]);
    expect(new Set(phaseTwoAdvancedContracts.map((item) => item.id)).size).toBe(54);
  });

  it("matches the roadmap count for every advanced domain", () => {
    const expected = new Map([
      ["complex-numbers", 5], ["combinatorics", 5], ["sets-relations-functions", 5], ["mathematical-logic", 5],
      ["linear-algebra", 10], ["statistics-probability", 8], ["graph-discrete", 10], ["ai-engineering", 6],
    ]);
    for (const domain of PHASE_TWO_ADVANCED_DOMAINS) expect(phaseTwoAdvancedContracts.filter((item) => item.domain === domain)).toHaveLength(expected.get(domain)!);
  });

  it("covers every library, tool, AR, practice, curriculum, and certification system", () => {
    expect(phaseTwoSystemContracts).toHaveLength(15);
    expect(validateSystemContracts(phaseTwoSystemContracts)).toEqual([]);
    expect(new Set(phaseTwoSystemContracts.map((item) => item.area))).toEqual(new Set(["libraries", "tools-workspaces", "ar-xr", "practice", "curriculum", "certification"]));
  });

  it("maps every contract to an existing top-level application route", async () => {
    const appSource = await readFile(new URL("../../App.tsx", import.meta.url), "utf8");
    for (const contract of [...phaseTwoAdvancedContracts, ...phaseTwoSystemContracts]) {
      const topLevel = contract.route.split("/").filter(Boolean)[0];
      expect(appSource, `${contract.id} route is not registered`).toContain(`path="${topLevel}`);
    }
  });

  it("prevents certification without every evidence dimension and reviewer sign-off", () => {
    const base = { contractId: "complex.plane", mathematical: "passed", content: "passed", assessment: "passed", accessibility: "passed", browser: "passed", reviewer: null, reviewedAt: null } as const;
    expect(deriveCertificationStatus(base)).toBe("in-progress");
    expect(deriveCertificationStatus({ ...base, reviewer: "Math reviewer", reviewedAt: "2026-07-18" })).toBe("certified");
    expect(deriveCertificationStatus({ ...base, mathematical: "missing", content: "missing", assessment: "missing", accessibility: "missing", browser: "missing" })).toBe("inventory");
  });

  it("maps every advanced contract to curriculum metadata with no duplicate keys", () => {
    expect(curriculumCoverageSummary()).toMatchObject({ mapped: 54, total: 54, percentage: 100 });
    expect(phaseTwoCurriculumMappings).toHaveLength(54);
    expect(new Set(phaseTwoCurriculumMappings.map((item) => `${item.board}:${item.grade}:${item.chapter}:${item.conceptId}`)).size).toBe(54);
    for (const mapping of phaseTwoCurriculumMappings) {
      expect(mapping.learningOutcome).toContain("verify");
      expect(mapping.sourceEdition).toBeTruthy();
      expect(mapping.reviewDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("reports evidence honestly without self-certifying unfinished work", () => {
    expect(phaseTwoCertificationEvidence).toHaveLength(69);
    expect(phaseTwoCertificationSummary()).toEqual({ total: 69, inventory: 0, inProgress: 69, certified: 0 });
  });

  it("provides the complete 14-example depth target for every advanced concept", () => {
    expect(phaseTwoAdvancedExamples).toHaveLength(54 * 14);
    expect(new Set(phaseTwoAdvancedExamples.map((item) => item.id)).size).toBe(54 * 14);
    for (const contract of phaseTwoAdvancedContracts) expect(advancedExampleCoverage(contract.id)).toEqual(advancedExampleRequirements);
  });

  it("provides all five assessed modes with hints, rubric, misconception, and oracle", () => {
    expect(phaseTwoAdvancedAssessments).toHaveLength(54 * 5);
    for (const contract of phaseTwoAdvancedContracts) {
      const items = phaseTwoAdvancedAssessments.filter((item) => item.conceptId === contract.id);
      expect(new Set(items.map((item) => item.mode))).toEqual(new Set(contract.assessmentModes));
      expect(items.every((item) => item.hintLadder.length === 2 && item.scoringRule.criteria.length === 4 && item.oracle)).toBe(true);
    }
  });

  it("audits formula, theorem, and visual-proof libraries with stable IDs", () => {
    const audit = auditLearningLibraries();
    expect(audit.formulas).toBeGreaterThan(100);
    expect(audit.theorems).toBeGreaterThan(100);
    expect(audit.visualProofs).toBeGreaterThan(100);
    expect(audit.errors).toBe(0);
  });

  it("publishes automated evidence without claiming manual certification", () => {
    expect(automatedEvidenceSummary()).toEqual({ contracts: 54, withFullExamples: 54, withFullAssessments: 54, awaitingManualReview: 54 });
  });
});
