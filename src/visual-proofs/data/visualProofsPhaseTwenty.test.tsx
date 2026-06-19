import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  crossProductAreaPhaseTwentyConfig,
  dotProductProjectionPhaseTwentyConfig,
  phaseTwentyConfigs,
  phaseTwentyRouteSlugs,
  scalarMultiplicationPhaseTwentyConfig,
  unitVectorsNormalizationPhaseTwentyConfig,
  vectorAdditionPhaseTwentyConfig,
  vectorDirectedSegmentPhaseTwentyConfig,
  vectorEquationLinePhaseTwentyConfig,
  vectorProjectionComponentPhaseTwentyConfig,
} from "../proofs/phase-twenty/phaseTwentyProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty vectors launch", () => {
  it("creates all eight Phase 20 vector routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentyRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("vector-field");
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

  it("keeps vectors free of generic coming-soon starter as the main experience", () => {
    const proofs = getVisualProofsByCategory("vectors");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(proofs.every((proof) => proof.proofLearningModel === "vector-field")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentyRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentyConfigs) {
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

  it("exposes route-specific Phase 20 vector contracts", () => {
    expect((vectorDirectedSegmentPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("component-magnitude-direction");
    expect(tokenIds(vectorDirectedSegmentPhaseTwentyConfig)).toEqual(expect.arrayContaining(["component-vector", "x-component", "y-component", "magnitude", "theta"]));
    expect((vectorAdditionPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("resultant-parallelogram");
    expect(tokenIds(vectorAdditionPhaseTwentyConfig)).toEqual(expect.arrayContaining(["u", "v", "u-plus-v", "component-sums", "parallelogram"]));
    expect((scalarMultiplicationPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("k-scaling");
    expect(tokenIds(scalarMultiplicationPhaseTwentyConfig)).toEqual(expect.arrayContaining(["k", "v", "kv", "scaled-components", "length-scale"]));
    expect((dotProductProjectionPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("projection-sign");
    expect(tokenIds(dotProductProjectionPhaseTwentyConfig)).toEqual(expect.arrayContaining(["u-dot-v", "u-magnitude", "v-magnitude", "cos-theta", "projection"]));
    expect((crossProductAreaPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("area-parallelogram");
    expect(tokenIds(crossProductAreaPhaseTwentyConfig)).toEqual(expect.arrayContaining(["cross-magnitude", "base-u", "height-v-sin-theta", "sin-theta", "area"]));
    expect((unitVectorsNormalizationPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("normalization-zero-warning");
    expect(tokenIds(unitVectorsNormalizationPhaseTwentyConfig)).toEqual(expect.arrayContaining(["v", "magnitude", "v-over-magnitude", "length-one", "unit-circle"]));
    expect((vectorEquationLinePhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("a-d-t-parameter");
    expect(tokenIds(vectorEquationLinePhaseTwentyConfig)).toEqual(expect.arrayContaining(["a", "d", "t", "r", "td"]));
    expect((vectorProjectionComponentPhaseTwentyConfig as PhaseTwentyConfigWithKey).phaseTwentyModelKey).toBe("residual-perpendicular");
    expect(tokenIds(vectorProjectionComponentPhaseTwentyConfig)).toEqual(expect.arrayContaining(["u-dot-v", "v-squared", "projection-scalar", "proj-v-u", "residual"]));
  });

  it("keeps live values aligned to directed segments, addition, scaling, products, areas, normalization, lines, and projections", () => {
    expect(ids(vectorDirectedSegmentPhaseTwentyConfig)).toEqual(expect.arrayContaining(["x-component", "y-component", "magnitude", "direction-angle", "quadrant"]));
    expect(ids(vectorAdditionPhaseTwentyConfig)).toEqual(expect.arrayContaining(["u-components", "v-components", "resultant-components", "resultant-magnitude"]));
    expect(ids(scalarMultiplicationPhaseTwentyConfig)).toEqual(expect.arrayContaining(["k", "kv-components", "scaled-magnitude", "direction-status"]));
    expect(ids(dotProductProjectionPhaseTwentyConfig)).toEqual(expect.arrayContaining(["theta", "cos-theta", "dot-product", "sign-meaning"]));
    expect(ids(crossProductAreaPhaseTwentyConfig)).toEqual(expect.arrayContaining(["base", "height", "area-cross-magnitude", "parallel-warning"]));
    expect(ids(unitVectorsNormalizationPhaseTwentyConfig)).toEqual(expect.arrayContaining(["normalized-components", "normalized-magnitude", "zero-vector-warning"]));
    expect(ids(vectorEquationLinePhaseTwentyConfig)).toEqual(expect.arrayContaining(["a-components", "d-components", "t", "td", "r"]));
    expect(ids(vectorProjectionComponentPhaseTwentyConfig)).toEqual(expect.arrayContaining(["dot-product", "v-squared", "projection-scalar", "projection-vector", "residual-vector", "perpendicular-check"]));
  });
});

type PhaseTwentyConfigWithKey = PhaseTwoProofConfig & { phaseTwentyModelKey: string };

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
