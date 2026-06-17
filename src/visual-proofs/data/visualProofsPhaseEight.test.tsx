import { describe, expect, it } from "vitest";
import { phaseEightConfigs, phaseEightRouteSlugs, slopeFormulaPhaseEightConfig, parallelLinesSlopePhaseEightConfig, perpendicularLinesSlopePhaseEightConfig, circleEquationPhaseEightConfig, translationOfPointsPhaseEightConfig } from "../proofs/phase-eight/phaseEightProofConfigs";
import { getVisualProof } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const expectedModels: Record<string, string> = {
  "distance-formula": "coordinate-grid",
  "midpoint-formula": "coordinate-grid",
  "slope-formula": "coordinate-grid",
  "slope-intercept-line-equation": "coordinate-grid",
  "parallel-lines-slope": "coordinate-grid",
  "perpendicular-lines-slope": "coordinate-grid",
  "circle-equation": "coordinate-grid",
  "translation-of-points": "transformation-grid",
};

describe("Visual Proofs phase eight coordinate geometry cluster", () => {
  it("marks all eight phase eight routes as upgraded with required metadata", () => {
    for (const [categorySlug, proofSlug] of phaseEightRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe(expectedModels[proofSlug]);
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
    }
  });

  it("adds prediction prompts, formula tokens, live values, and invariants", () => {
    for (const config of phaseEightConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("exposes special coordinate controls and smoke manifest entries", () => {
    expect(slopeFormulaPhaseEightConfig.liveValues({ x1: 2, y1: 1, x2: 2, y2: 7 }).some((value) => value.warning?.includes("undefined"))).toBe(true);
    expect(parallelLinesSlopePhaseEightConfig.invariants({ m1: 2, m2: 2, c1: -1, c2: 3 })[0]?.holds).toBe(true);
    expect(perpendicularLinesSlopePhaseEightConfig.invariants({ m1: 2, m2: -0.5, c: 0 })[0]?.holds).toBe(true);
    expect(circleEquationPhaseEightConfig.parameters.map((parameter) => parameter.id)).toEqual(["h", "k", "r", "angle"]);
    expect(translationOfPointsPhaseEightConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "y", "a", "b"]);
    expect(visualProofsRouteSmokeManifest.map((entry) => entry.route)).toEqual(expect.arrayContaining(phaseEightRouteSlugs.map(([category, slug]) => `/visual-proofs/${category}/${slug}`)));
  });
});
