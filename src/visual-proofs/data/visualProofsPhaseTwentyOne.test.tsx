import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  complexAdditionPhaseTwentyOneConfig,
  complexConjugatePhaseTwentyOneConfig,
  complexMultiplicationPhaseTwentyOneConfig,
  complexPlanePointPhaseTwentyOneConfig,
  eulerFormPhaseTwentyOneConfig,
  modulusArgumentPhaseTwentyOneConfig,
  multiplicationByIPhaseTwentyOneConfig,
  phaseTwentyOneConfigs,
  phaseTwentyOneRouteSlugs,
  rootsOfUnityPhaseTwentyOneConfig,
} from "../proofs/phase-twenty-one/phaseTwentyOneProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-one complex numbers launch", () => {
  it("creates all eight Phase 21 complex-number routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentyOneRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("complex-plane");
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

  it("keeps complex numbers free of generic coming-soon starter as the main experience", () => {
    const proofs = getVisualProofsByCategory("complex-numbers");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(proofs.every((proof) => proof.proofLearningModel === "complex-plane")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentyOneRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentyOneConfigs) {
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

  it("exposes route-specific Phase 21 complex-number contracts", () => {
    expect((complexPlanePointPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("real-imag-plane-point");
    expect(tokenIds(complexPlanePointPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["a", "bi", "z", "coordinate-pair"]));
    expect((modulusArgumentPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("modulus-argument");
    expect(tokenIds(modulusArgumentPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["modulus", "component-squares", "arg-z", "theta"]));
    expect((complexAdditionPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("component-vector-addition");
    expect(tokenIds(complexAdditionPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["a-plus-c", "b-plus-d", "z1", "z2", "z1-plus-z2"]));
    expect((complexMultiplicationPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("rotation-scaling");
    expect(tokenIds(complexMultiplicationPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["r1-r2", "theta1-plus-theta2", "z1-z2-product", "cis"]));
    expect((multiplicationByIPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("ninety-degree-rotation");
    expect(tokenIds(multiplicationByIPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["i", "a-plus-bi", "negative-b-plus-ai", "ninety-degrees"]));
    expect((complexConjugatePhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("real-axis-reflection");
    expect(tokenIds(complexConjugatePhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["a", "bi-to-negative-bi", "zbar", "real-axis"]));
    expect((rootsOfUnityPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("root-count-unit-circle");
    expect(tokenIds(rootsOfUnityPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["z-power-n-equals-one", "two-pi-k-over-n", "cis-angle", "n-roots"]));
    expect((eulerFormPhaseTwentyOneConfig as PhaseTwentyOneConfigWithKey).phaseTwentyOneModelKey).toBe("cos-sin-unit-circle");
    expect(tokenIds(eulerFormPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["e-i-theta", "cos-theta", "i-sin-theta", "theta"]));
  });

  it("keeps live values aligned to plane points, polar form, addition, multiplication, rotations, conjugates, roots, and Euler form", () => {
    expect(ids(complexPlanePointPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["real-part-a", "imaginary-part-b", "coordinate-point", "quadrant"]));
    expect(ids(modulusArgumentPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["modulus", "argument-degrees", "argument-radians", "quadrant"]));
    expect(ids(complexAdditionPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["z1-real-imag", "z2-real-imag", "result-real-imag", "result-modulus", "result-argument"]));
    expect(ids(complexMultiplicationPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["r1", "theta1", "r2", "theta2", "product-modulus", "product-argument", "product-rectangular"]));
    expect(ids(multiplicationByIPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["z-real-imag", "iz-real-imag", "original-argument", "rotated-argument", "modulus-before-after"]));
    expect(ids(complexConjugatePhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["z", "conjugate", "real-part", "imaginary-part", "product-z-zbar", "modulus-squared"]));
    expect(ids(rootsOfUnityPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["n", "k", "selected-angle", "selected-root", "root-count"]));
    expect(ids(eulerFormPhaseTwentyOneConfig)).toEqual(expect.arrayContaining(["theta-degrees", "theta-radians", "cos-theta", "sin-theta", "complex-form", "modulus", "argument"]));
  });
});

type PhaseTwentyOneConfigWithKey = PhaseTwoProofConfig & { phaseTwentyOneModelKey: string };

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
