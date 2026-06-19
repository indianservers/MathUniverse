import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { visualProofCategories } from "./visualProofCategories";
import { visualProofsIndex } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";
import { visualProofsAllSmokeRoutes, visualProofsCategorySmokeRoutes, visualProofsPhaseUpgradedSmokeRoutes, visualProofsRepresentativeSmokeRoutes } from "./visualProofsRouteSmokeList";

const expectedCategoryCounts: Record<string, number> = {
  "geometry": 11,
  "algebraic-identities": 12,
  "trigonometry": 15,
  "coordinate-geometry": 15,
  "calculus": 15,
  "number-theory": 12,
  "probability": 8,
  "statistics": 8,
  "sequences-and-series": 15,
  "matrices-linear-algebra": 8,
  "vectors": 8,
  "complex-numbers": 8,
  "mensuration": 8,
  "conic-sections": 8,
  "inequalities": 8,
  "logarithms-exponents": 8,
  "transformations-symmetry": 8,
  "engineering-mathematics": 8,
};

const formerGeneratedStarterCategories = [
  "probability",
  "statistics",
  "matrices-linear-algebra",
  "vectors",
  "complex-numbers",
  "mensuration",
  "conic-sections",
  "inequalities",
  "logarithms-exponents",
  "transformations-symmetry",
  "engineering-mathematics",
];

const phaseUpgradedProofs = visualProofsIndex.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded");

describe("Visual Proofs phase twenty-eight final metadata and route hardening", () => {
  it("confirms every category is real, available, and backed by routes", () => {
    expect(visualProofCategories).toHaveLength(18);
    expect(visualProofCategories.every((category) => category.status === "available")).toBe(true);
    expect(visualProofsIndex.some((proof) => proof.status === "coming-soon")).toBe(false);

    for (const category of visualProofCategories) {
      const proofs = visualProofsIndex.filter((proof) => proof.categorySlug === category.slug);
      expect(proofs.length, category.slug).toBeGreaterThan(0);
      expect(proofs.some((proof) => proof.slug === "starter-visual-proof"), category.slug).toBe(false);
      expect(proofs.length, category.slug).toBe(expectedCategoryCounts[category.slug]);
      expect(category.proofCount, category.slug).toBe(expectedCategoryCounts[category.slug]);
    }
  });

  it("keeps every phase-upgraded proof fully described for premium shell rendering", () => {
    expect(phaseUpgradedProofs).toHaveLength(183);
    for (const proof of phaseUpgradedProofs) {
      expect(proof.route, proof.id).toBe(`/visual-proofs/${proof.categorySlug}/${proof.slug}`);
      expect(proof.title, proof.route).toBeTruthy();
      expect(proof.categorySlug, proof.route).toBeTruthy();
      expect(proof.proofLearningModel, proof.route).toBeTruthy();
      expect(proof.hasFormulaTokens, proof.route).toBe(true);
      expect(proof.hasPredictionPrompt, proof.route).toBe(true);
      expect(proof.misconceptionCheckCount, proof.route).toBeGreaterThanOrEqual(1);
      expect(proof.hasKeyboardControls, proof.route).toBe(true);
      expect(proof.hasStateInspector, proof.route).toBe(true);
      expect(proof.hasTeacherMode, proof.route).toBe(true);
      expect(proof.hasOlympyardPracticeExit, proof.route).toBe(true);
      expect(proof.hasSnapshotSupport, proof.route).toBe(true);
      expect(proof.expectedVisualKind, proof.route).toBe("svg");
      expect(proof.expectedPrimarySelector, proof.route).toBe('[data-testid="visual-proof-primary-visual"] svg');
    }
  });

  it("keeps route smoke manifest internally consistent with metadata", () => {
    const indexRoutes = new Set(visualProofsIndex.map((proof) => proof.route));
    const manifestRoutes = new Set(visualProofsRouteSmokeManifest.map((entry) => entry.route));

    for (const proof of phaseUpgradedProofs) {
      expect(manifestRoutes.has(proof.route), proof.route).toBe(true);
    }

    for (const entry of visualProofsRouteSmokeManifest) {
      expect(indexRoutes.has(entry.route), entry.route).toBe(true);
      expect(entry.expectedVisualKind, entry.route).toBe("svg");
      expect(entry.expectedPrimarySelector, entry.route).toBe('[data-testid="visual-proof-primary-visual"] svg');
      expect(entry.hasVisualRegressionTest, entry.route).toBe(false);
    }
  });

  it("keeps former generated starter categories converted to real families", () => {
    for (const slug of formerGeneratedStarterCategories) {
      const category = visualProofCategories.find((item) => item.slug === slug);
      const proofs = visualProofsIndex.filter((proof) => proof.categorySlug === slug);
      expect(category?.status, slug).toBe("available");
      expect(proofs).toHaveLength(expectedCategoryCounts[slug]);
      expect(proofs.every((proof) => proof.status === "available"), slug).toBe(true);
      expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded"), slug).toBe(true);
      expect(proofs.some((proof) => proof.slug === "starter-visual-proof"), slug).toBe(false);
    }
  });

  it("does not claim route-level visual regression coverage until browser tests are mapped per route", () => {
    const packageJson = readFileSync(fileURLToPath(new URL("../../../package.json", import.meta.url)), "utf8");
    const browserVisualRunnerConfigured = /playwright|cypress/.test(packageJson);
    expect(browserVisualRunnerConfigured).toBe(true);
    expect(phaseUpgradedProofs.some((proof) => proof.hasVisualRegressionTest)).toBe(false);
    expect(visualProofsRouteSmokeManifest.some((entry) => entry.hasVisualRegressionTest)).toBe(false);
  });

  it("exports generated route smoke lists for future browser tests", () => {
    expect(visualProofsCategorySmokeRoutes).toHaveLength(18);
    expect(visualProofsPhaseUpgradedSmokeRoutes).toHaveLength(183);
    expect(visualProofsRepresentativeSmokeRoutes).toHaveLength(18);
    expect(visualProofsAllSmokeRoutes).toContain("/visual-proofs");
    expect(visualProofsAllSmokeRoutes).toContain("/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field");
  });

  it("documents lazy-splitting as deferred with a typed migration plan", () => {
    const planPath = fileURLToPath(new URL("../../../docs/visual-proofs/PHASE_28_LAZY_SPLITTING_PLAN.md", import.meta.url));
    expect(existsSync(planPath)).toBe(true);
    const plan = readFileSync(planPath, "utf8");
    expect(plan).toContain("typed category-to-loader map");
    expect(plan).toContain("direct URL behavior");
    expect(plan).toContain("Acceptance Criteria");
  });
});
