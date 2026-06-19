import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  divergenceCurlVectorFieldPhaseTwentySevenConfig,
  fourierWaveBuildingPhaseTwentySevenConfig,
  gradientSteepestIncreasePhaseTwentySevenConfig,
  laplaceTransformDecayPhaseTwentySevenConfig,
  linearProgrammingFeasibleRegionPhaseTwentySevenConfig,
  phaseTwentySevenConfigs,
  phaseTwentySevenRouteSlugs,
  simpleHarmonicMotionPhaseTwentySevenConfig,
  slopeFieldDifferentialEquationPhaseTwentySevenConfig,
  trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig,
} from "../proofs/phase-twenty-seven/phaseTwentySevenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-seven engineering mathematics launch", () => {
  it("creates all eight Phase 27 engineering mathematics routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentySevenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("applied-system");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasFormulaTokens).toBe(true);
      expect(proof?.hasPredictionPrompt).toBe(true);
      expect(proof?.hasSnapshotSupport).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
      expect(proof?.expectedVisualKind).toBe("svg");
      expect(proof?.expectedPrimarySelector).toBe('[data-testid="visual-proof-primary-visual"] svg');
    }
  });

  it("replaces engineering mathematics as a generic coming-soon starter experience", () => {
    const proofs = getVisualProofsByCategory("engineering-mathematics");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentySevenRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentySevenConfigs) {
      const values = defaultValues(config);
      expect((config as PhaseTwentySevenConfigWithKey).phaseTwentySevenModelKey).toBeTruthy();
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(6);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes route-specific Phase 27 formula-token contracts", () => {
    expect(tokenIds(slopeFieldDifferentialEquationPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["dy-dx", "fxy", "initial-condition", "solution-curve"]));
    expect(tokenIds(simpleHarmonicMotionPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["a", "omega", "phi", "cos", "x-t"]));
    expect(tokenIds(fourierWaveBuildingPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["harmonic", "sum", "approximation", "n"]));
    expect(tokenIds(laplaceTransformDecayPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["e-minus-at", "laplace", "s-domain", "a"]));
    expect(tokenIds(gradientSteepestIncreasePhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["df-dx", "df-dy", "gradient", "steepest-increase", "contour"]));
    expect(tokenIds(divergenceCurlVectorFieldPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["div-f", "curl-f", "partial-terms"]));
    expect(tokenIds(trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["h", "endpoint-terms", "two-fi", "trapezoid-areas"]));
    expect(tokenIds(linearProgrammingFeasibleRegionPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["constraints", "feasible-region", "objective", "vertex"]));
  });

  it("keeps live values aligned to applied engineering mathematics concepts", () => {
    expect(ids(slopeFieldDifferentialEquationPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["equation-type", "initial-x0-y0", "selected-point", "local-slope", "step-size", "approximate-next-point"]));
    expect(ids(simpleHarmonicMotionPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["A", "omega", "phi", "t", "x-t", "period", "max-min-displacement"]));
    expect(ids(fourierWaveBuildingPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["target-type", "harmonics-included", "current-t", "component-values", "summed-value", "approximation-error"]));
    expect(ids(laplaceTransformDecayPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["a", "selected-t", "time-value", "selected-s", "transform-value-approximation"]));
    expect(ids(gradientSteepestIncreasePhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["point-x-y", "f-x-y", "gradient-components", "gradient-magnitude", "selected-direction", "directional-derivative"]));
    expect(ids(divergenceCurlVectorFieldPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["selected-field", "point-x-y", "approximate-divergence", "approximate-curl", "qualitative-status"]));
    expect(ids(trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["a-b", "n", "h", "trapezoid-heights", "approximation", "reference-area", "error"]));
    expect(ids(linearProgrammingFeasibleRegionPhaseTwentySevenConfig)).toEqual(expect.arrayContaining(["constraints", "feasible-vertices", "objective-coefficients", "objective-value-at-vertices", "optimum-vertex", "bounded-unbounded-status"]));
  });
});

type PhaseTwentySevenConfigWithKey = PhaseTwoProofConfig & { phaseTwentySevenModelKey: string };

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}
function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens(defaultValues(config)).map((token) => token.id);
}
function ids(config: PhaseTwoProofConfig) {
  return config.liveValues(defaultValues(config)).map((item) => item.id);
}
function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
