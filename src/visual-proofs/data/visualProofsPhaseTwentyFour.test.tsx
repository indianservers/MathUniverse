import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  amGmInequalityPhaseTwentyFourConfig,
  cauchySchwarzPhaseTwentyFourConfig,
  compoundInequalitiesPhaseTwentyFourConfig,
  inequalityNumberLinePhaseTwentyFourConfig,
  linearInequalityRegionsPhaseTwentyFourConfig,
  phaseTwentyFourConfigs,
  phaseTwentyFourRouteSlugs,
  quadraticInequalitiesPhaseTwentyFourConfig,
  solvingLinearInequalitiesPhaseTwentyFourConfig,
  triangleInequalityPhaseTwentyFourConfig,
} from "../proofs/phase-twenty-four/phaseTwentyFourProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-four inequalities launch", () => {
  it("creates all eight Phase 24 inequality routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentyFourRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(["comparison-model", "coordinate-grid", "area-rearrangement", "vector-field"]).toContain(proof?.proofLearningModel);
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

  it("replaces inequalities as a generic coming-soon starter experience", () => {
    const proofs = getVisualProofsByCategory("inequalities");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentyFourRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentyFourConfigs) {
      const values = defaultValues(config);
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(4);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(5);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes route-specific Phase 24 inequality formula-token contracts", () => {
    expect((inequalityNumberLinePhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("number-line-boundary-open-closed-region");
    expect(tokenIds(inequalityNumberLinePhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["x", "operator", "a", "open-closed-circle"]));
    expect((solvingLinearInequalitiesPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("linear-inequality-sign-flip-solver");
    expect(tokenIds(solvingLinearInequalitiesPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["ax-plus-b", "c", "negative-division", "final-interval"]));
    expect((compoundInequalitiesPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("compound-interval-union-intersection");
    expect(tokenIds(compoundInequalitiesPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["and", "or", "endpoints", "interval-notation"]));
    expect((quadraticInequalitiesPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("quadratic-sign-chart-graph-regions");
    expect(tokenIds(quadraticInequalitiesPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["f-positive", "f-negative", "roots", "solution-interval"]));
    expect((amGmInequalityPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("am-gm-area-rearrangement-comparison");
    expect(tokenIds(amGmInequalityPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["arithmetic-mean", "geometric-mean", "greater-equal", "equality-case"]));
    expect((triangleInequalityPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("triangle-broken-path-shortest-direct-side");
    expect(tokenIds(triangleInequalityPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["side-a", "side-b", "side-c", "a-plus-b-greater-c"]));
    expect((cauchySchwarzPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("cauchy-schwarz-dot-product-projection-bound");
    expect(tokenIds(cauchySchwarzPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["u-dot-v", "u-magnitude", "v-magnitude", "cos-theta", "bound"]));
    expect((linearInequalityRegionsPhaseTwentyFourConfig as PhaseTwentyFourConfigWithKey).phaseTwentyFourModelKey).toBe("linear-half-plane-boundary-test-point");
    expect(tokenIds(linearInequalityRegionsPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["ax-plus-by", "c", "operator", "test-point"]));
  });

  it("keeps live values aligned to inequality concepts", () => {
    expect(ids(inequalityNumberLinePhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["boundary-a", "operator", "test-value-x", "truth-status", "interval-notation", "solution-region-invariant"]));
    expect(ids(solvingLinearInequalitiesPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["a", "b", "c", "operator", "isolated-boundary", "sign-flip-status", "interval-solution", "test-value-check"]));
    expect(ids(compoundInequalitiesPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["boundary-a", "boundary-b", "connector", "endpoint-inclusion", "resulting-interval-union", "test-value-status"]));
    expect(ids(quadraticInequalitiesPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["a", "b", "c", "discriminant", "roots", "selected-inequality", "sign-intervals", "solution-intervals"]));
    expect(ids(amGmInequalityPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["a", "b", "arithmetic-mean", "geometric-mean", "difference-am-gm", "equality-status"]));
    expect(ids(triangleInequalityPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["a", "b", "included-angle", "c", "a-plus-b", "difference-a-plus-b-minus-c", "triangle-valid-status"]));
    expect(ids(cauchySchwarzPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["u", "v", "angle-theta", "cos-theta", "dot-product", "magnitude-product", "cauchy-ratio"]));
    expect(ids(linearInequalityRegionsPhaseTwentyFourConfig)).toEqual(expect.arrayContaining(["a", "b", "c", "operator", "test-point", "expression-value", "truth-status", "boundary-style", "shaded-side"]));
  });
});

type PhaseTwentyFourConfigWithKey = PhaseTwoProofConfig & { phaseTwentyFourModelKey: string };

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
