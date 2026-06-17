import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import { phaseFourteenRouteSlugs } from "../proofs/phase-fourteen/phaseFourteenProofConfigs";
import {
  allCalculusPhaseRouteSlugs,
  derivativeOfExponentialPhaseFifteenConfig,
  derivativeOfSinePhaseFifteenConfig,
  fundamentalTheoremPhaseFifteenConfig,
  integrationByPartsPhaseFifteenConfig,
  meanValueTheoremPhaseFifteenConfig,
  optimizationPhaseFifteenConfig,
  phaseFifteenConfigs,
  phaseFifteenRouteSlugs,
  taylorSeriesPhaseFifteenConfig,
} from "../proofs/phase-fifteen/phaseFifteenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase fifteen calculus completion", () => {
  it("marks all seven Phase 15 routes as upgraded graph-limit experiences", () => {
    for (const [categorySlug, proofSlug] of phaseFifteenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("graph-limit");
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

  it("makes all fifteen calculus routes phase-upgraded and present in the smoke manifest", () => {
    const calculusProofs = getVisualProofsByCategory("calculus").filter((proof) => proof.status === "available");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(calculusProofs).toHaveLength(15);
    expect(calculusProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(calculusProofs.every((proof) => proof.proofLearningModel === "graph-limit")).toBe(true);
    expect(calculusProofs.every((proof) => proof.hasFormulaTokens && proof.hasPredictionPrompt && proof.hasSnapshotSupport)).toBe(true);
    expect(calculusProofs.every((proof) => proof.hasTeacherMode && proof.hasKeyboardControls && proof.hasStateInspector && proof.hasOlympyardPracticeExit)).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(allCalculusPhaseRouteSlugs.map(routeFromSlug)));
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseFourteenRouteSlugs.map(routeFromSlug)));
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseFifteenRouteSlugs.map(routeFromSlug)));
  });

  it("adds prediction prompts, misconception checks, formula tokens, live values, invariants, and SVG visuals", () => {
    for (const config of phaseFifteenConfigs) {
      const values = defaultValues(config);
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes required Phase 15 calculus interaction contracts", () => {
    expect(meanValueTheoremPhaseFifteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b", "c"]);
    expect(tokenIds(meanValueTheoremPhaseFifteenConfig)).toEqual(expect.arrayContaining(["f-prime-c", "f-b-minus-f-a", "b-minus-a", "secant-slope", "c"]));
    expect(fundamentalTheoremPhaseFifteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "x", "dx"]);
    expect(tokenIds(fundamentalTheoremPhaseFifteenConfig)).toEqual(expect.arrayContaining(["A-x", "integral-a-x", "f-x", "A-prime-x", "F-b-minus-F-a"]));
    expect(integrationByPartsPhaseFifteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["u", "v", "du", "dv"]);
    expect(tokenIds(integrationByPartsPhaseFifteenConfig)).toEqual(expect.arrayContaining(["uv", "u-dv", "v-du", "integral-u-dv", "uv-minus-integral-v-du"]));
    expect(tokenIds(derivativeOfSinePhaseFifteenConfig)).toEqual(expect.arrayContaining(["sin-x", "cos-x", "d-dx"]));
    expect(tokenIds(derivativeOfExponentialPhaseFifteenConfig)).toEqual(expect.arrayContaining(["exp-x", "derivative-exp-x", "height-equals-slope"]));
    expect(taylorSeriesPhaseFifteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "n", "x"]);
    expect(tokenIds(taylorSeriesPhaseFifteenConfig)).toEqual(expect.arrayContaining(["f-a", "linear-term", "higher-terms", "degree-n", "approximation-error"]));
    expect(optimizationPhaseFifteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["x"]);
    expect(tokenIds(optimizationPhaseFifteenConfig)).toEqual(expect.arrayContaining(["f-prime-positive", "f-prime-negative", "f-prime-zero", "max", "min"]));
  });

  it("keeps route-specific live values aligned with MVT, FTC, parts, derivative, Taylor, and optimization goals", () => {
    expect(meanValueTheoremPhaseFifteenConfig.liveValues({ a: -1.6, b: 2.4, c: 0.2 }).map((item) => item.id)).toEqual(expect.arrayContaining(["secant-slope", "f-prime-c", "slope-difference", "conditions"]));
    expect(fundamentalTheoremPhaseFifteenConfig.liveValues({ a: -1.4, x: 2.3, dx: 0.18 }).map((item) => item.id)).toEqual(expect.arrayContaining(["A-x", "thin-strip", "A-prime-x", "insight"]));
    expect(integrationByPartsPhaseFifteenConfig.liveValues({ u: 4, v: 3, du: 0.7, dv: 0.5 }).map((item) => item.id)).toEqual(expect.arrayContaining(["u-dv", "v-du", "product-change"]));
    expect(derivativeOfSinePhaseFifteenConfig.liveValues({ x: 0 }).find((item) => item.id === "cos-x")?.value).toBe("1.000");
    expect(derivativeOfExponentialPhaseFifteenConfig.liveValues({ a: 0 }).find((item) => item.id === "slope-y-difference")?.value).toBe("0");
    expect(taylorSeriesPhaseFifteenConfig.liveValues({ a: 0, n: 3, x: 1.2 }).map((item) => item.id)).toEqual(expect.arrayContaining(["degree-n", "approximation-error", "insight"]));
    expect(optimizationPhaseFifteenConfig.liveValues({ x: -1 }).find((item) => item.id === "classification")?.value).toBe("local max");
  });
});

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}

function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens(defaultValues(config)).map((token) => token.id);
}

function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
