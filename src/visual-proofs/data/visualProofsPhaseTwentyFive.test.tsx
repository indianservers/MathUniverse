import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  changeOfBasePhaseTwentyFiveConfig,
  exponentialGrowthDecayPhaseTwentyFiveConfig,
  exponentsRepeatedMultiplicationPhaseTwentyFiveConfig,
  lawsOfExponentsSameBasePhaseTwentyFiveConfig,
  lawsOfLogarithmsPhaseTwentyFiveConfig,
  logarithmInverseExponentialPhaseTwentyFiveConfig,
  logarithmicScalePhaseTwentyFiveConfig,
  naturalExponentialPhaseTwentyFiveConfig,
  phaseTwentyFiveConfigs,
  phaseTwentyFiveRouteSlugs,
} from "../proofs/phase-twenty-five/phaseTwentyFiveProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-five logarithms and exponents launch", () => {
  it("creates all eight Phase 25 logarithm/exponent routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentyFiveRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("growth-scale");
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

  it("replaces logarithms and exponents as a generic coming-soon starter experience", () => {
    const proofs = getVisualProofsByCategory("logarithms-exponents");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentyFiveRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentyFiveConfigs) {
      const values = defaultValues(config);
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(5);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes route-specific Phase 25 formula-token contracts", () => {
    expect((exponentsRepeatedMultiplicationPhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("exponents-repeated-factor-growth-blocks");
    expect(tokenIds(exponentsRepeatedMultiplicationPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["base-a", "exponent-n", "power-a-n", "zero-exponent"]));
    expect((lawsOfExponentsSameBasePhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("same-base-exponent-laws-factor-counts");
    expect(tokenIds(lawsOfExponentsSameBasePhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["m", "n", "m-plus-n", "m-minus-n", "mn"]));
    expect((exponentialGrowthDecayPhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("exponential-growth-decay-constant-multiplier");
    expect(tokenIds(exponentialGrowthDecayPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["initial-a", "multiplier-b", "x-steps", "a-b-x"]));
    expect((logarithmInverseExponentialPhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("logarithm-inverse-reflection-exponential");
    expect(tokenIds(logarithmInverseExponentialPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["log-b-y", "x-exponent", "b-x", "inverse"]));
    expect((lawsOfLogarithmsPhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("log-laws-from-exponent-laws");
    expect(tokenIds(lawsOfLogarithmsPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["M", "N", "MN", "M-over-N", "M-power-p", "plus", "minus", "p-log-b-M"]));
    expect((changeOfBasePhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("change-of-base-log-scale-conversion");
    expect(tokenIds(changeOfBasePhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["log-b-x", "log-k-x", "log-k-b", "ratio"]));
    expect((logarithmicScalePhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("log-scale-equal-ratios-orders-magnitude");
    expect(tokenIds(logarithmicScalePhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["log10-x", "times-10", "orders-magnitude"]));
    expect((naturalExponentialPhaseTwentyFiveConfig as PhaseTwentyFiveConfigWithKey).phaseTwentyFiveModelKey).toBe("natural-exponential-height-slope-e-approximation");
    expect(tokenIds(naturalExponentialPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["e-x", "slope", "compound-growth", "e"]));
  });

  it("keeps live values aligned to logarithm and exponent concepts", () => {
    expect(ids(exponentsRepeatedMultiplicationPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["base-a", "exponent-n", "repeated-factors", "value-a-n", "growth-factor-from-previous-exponent"]));
    expect(ids(lawsOfExponentsSameBasePhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["base-a", "m", "n", "selected-law", "expanded-factors", "simplified-exponent", "value-comparison"]));
    expect(ids(exponentialGrowthDecayPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["initial-value-a", "base-multiplier-b", "x", "current-y", "growth-decay-status", "ratio-y-next-over-y"]));
    expect(ids(logarithmInverseExponentialPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["base-b", "exponent-x", "y-equals-b-x", "log-b-y", "reflected-point"]));
    expect(ids(lawsOfLogarithmsPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["base-b", "M", "N", "m-log-b-M", "n-log-b-N", "selected-log-law", "left-side", "right-side"]));
    expect(ids(changeOfBasePhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["b", "k", "x", "direct-log-b-x", "numerator-log-k-x", "denominator-log-k-b", "ratio"]));
    expect(ids(logarithmicScalePhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["value-x", "log10-x", "nearest-power-of-10", "order-of-magnitude", "linear-position", "log-position"]));
    expect(ids(naturalExponentialPhaseTwentyFiveConfig)).toEqual(expect.arrayContaining(["x", "e-x", "tangent-slope", "difference", "n", "approximation", "e-comparison", "natural-growth-insight"]));
  });
});

type PhaseTwentyFiveConfigWithKey = PhaseTwoProofConfig & { phaseTwentyFiveModelKey: string };

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
