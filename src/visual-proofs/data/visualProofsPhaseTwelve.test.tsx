import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  completingSquarePhaseTwelveConfig,
  cubeOfDifferencePhaseTwelveConfig,
  cubeOfSumPhaseTwelveConfig,
  distributiveLawPhaseTwelveConfig,
  perfectSquareRecognitionPhaseTwelveConfig,
  phaseTwelveConfigs,
  phaseTwelveRouteSlugs,
  quadraticFactorizationPhaseTwelveConfig,
  sumDifferenceProductPhaseTwelveConfig,
  threeTermSquarePhaseTwelveConfig,
} from "../proofs/phase-twelve/phaseTwelveProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const expectedAlgebraSlugs = [
  "square-of-sum",
  "square-of-difference",
  "difference-of-squares",
  "product-of-binomials",
  "distributive-law-area-model",
  "three-term-square",
  "completing-the-square",
  "quadratic-factorization-area-model",
  "perfect-square-trinomial-recognition",
  "cube-of-sum",
  "cube-of-difference",
  "sum-and-difference-product",
];

describe("Visual Proofs phase twelve algebraic identities completion", () => {
  it("marks all eight phase twelve routes as upgraded tile-model experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwelveRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("tile-model");
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

  it("adds prediction prompts, misconception checks, formula tokens, live values, and invariants", () => {
    for (const config of phaseTwelveConfigs) {
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

  it("keeps all twelve Algebraic Identities routes phase-upgraded and in the smoke manifest", () => {
    const algebraProofs = getVisualProofsByCategory("algebraic-identities").filter((proof) => proof.status === "available");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(algebraProofs).toHaveLength(12);
    expect(algebraProofs.map((proof) => proof.slug)).toEqual(expect.arrayContaining(expectedAlgebraSlugs));
    expect(algebraProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(algebraProofs.every((proof) => proof.proofLearningModel === "tile-model")).toBe(true);
    expect(algebraProofs.every((proof) => proof.hasFormulaTokens && proof.hasPredictionPrompt && proof.hasSnapshotSupport)).toBe(true);
    expect(algebraProofs.every((proof) => proof.hasTeacherMode && proof.hasKeyboardControls && proof.hasStateInspector && proof.hasOlympyardPracticeExit)).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(expectedAlgebraSlugs.map((slug) => `/visual-proofs/algebraic-identities/${slug}`)));
  });

  it("exposes required Phase 12 algebra interaction contracts", () => {
    expect(distributiveLawPhaseTwelveConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b", "c", "d"]);
    expect(tokenIds(distributiveLawPhaseTwelveConfig)).toEqual(expect.arrayContaining(["ac", "ad", "bc", "bd", "full"]));
    expect(tokenIds(threeTermSquarePhaseTwelveConfig)).toEqual(expect.arrayContaining(["a2", "b2", "c2", "twoab", "twobc", "twoca", "full"]));
    expect(threeTermSquarePhaseTwelveConfig.liveValues({ a: 3, b: 3, c: 2 }).find((value) => value.id === "regions")?.value).toBe(9);
    expect(completingSquarePhaseTwelveConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "b"]);
    expect(tokenIds(completingSquarePhaseTwelveConfig)).toEqual(expect.arrayContaining(["x2", "bx", "half", "complete", "corner"]));
    expect(quadraticFactorizationPhaseTwelveConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "m", "n"]);
    expect(quadraticFactorizationPhaseTwelveConfig.liveValues({ x: 4, m: 3, n: 4 }).map((value) => value.id)).toEqual(expect.arrayContaining(["p", "q"]));
    expect(perfectSquareRecognitionPhaseTwelveConfig.liveValues({ x: 5, a: 3 }).find((value) => value.id === "checklist")?.value).toContain("twice product");
    expect(cubeOfSumPhaseTwelveConfig.liveValues({ a: 5, b: 2 }).map((value) => value.id)).toEqual(expect.arrayContaining(["a3", "a2b", "ab2", "b3"]));
    expect(cubeOfDifferencePhaseTwelveConfig.liveValues({ a: 5, b: 2 }).map((value) => value.id)).toEqual(expect.arrayContaining(["a-minus-b", "a3", "a2b", "ab2", "b3"]));
    expect(sumDifferenceProductPhaseTwelveConfig.liveValues({ a: 7, b: 3 }).find((value) => value.id === "cancellation")?.value).toContain("cancel");
  });
});

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}

function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens({ a: 5, b: 2, c: 3, d: 4, x: 4, m: 3, n: 4 }).map((token) => token.id);
}
