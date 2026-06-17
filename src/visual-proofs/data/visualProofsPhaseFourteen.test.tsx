import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  chainRulePhaseFourteenConfig,
  definiteIntegralPhaseFourteenConfig,
  derivativePowerRulePhaseFourteenConfig,
  derivativeSlopePhaseFourteenConfig,
  limitApproachesPointPhaseFourteenConfig,
  phaseFourteenConfigs,
  phaseFourteenRouteSlugs,
  productRulePhaseFourteenConfig,
  riemannSumsPhaseFourteenConfig,
  secantBecomesTangentPhaseFourteenConfig,
} from "../proofs/phase-fourteen/phaseFourteenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const upgradedCalculusSlugs = [
  "limit-approaches-point",
  "derivative-slope-of-tangent",
  "secant-becomes-tangent",
  "derivative-power-rule",
  "product-rule-visual-proof",
  "chain-rule-visual-proof",
  "riemann-sums-area-under-curve",
  "definite-integral-accumulated-area",
];

describe("Visual Proofs phase fourteen calculus graph-limit upgrade", () => {
  it("marks the eight Phase 14 calculus routes as upgraded graph-limit experiences", () => {
    for (const [categorySlug, proofSlug] of phaseFourteenRouteSlugs) {
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

  it("keeps the Phase 14 routes upgraded as part of the calculus category", () => {
    const calculusProofs = getVisualProofsByCategory("calculus").filter((proof) => proof.status === "available");
    expect(calculusProofs).toHaveLength(15);
    expect(calculusProofs.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded").map((proof) => proof.slug)).toEqual(expect.arrayContaining(upgradedCalculusSlugs));
    expect(calculusProofs.filter((proof) => upgradedCalculusSlugs.includes(proof.slug)).every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
  });

  it("adds Phase 14 upgraded calculus routes to the route smoke manifest", () => {
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseFourteenRouteSlugs.map(routeFromSlug)));
    for (const [categorySlug, proofSlug] of phaseFourteenRouteSlugs) {
      const entry = visualProofsRouteSmokeManifest.find((item) => item.route === `/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(entry?.expectedVisualKind).toBe("svg");
      expect(entry?.expectedPrimarySelector).toBe('[data-testid="visual-proof-primary-visual"] svg');
      expect(entry?.hasTeacherMode).toBe(true);
      expect(entry?.hasKeyboardControls).toBe(true);
      expect(entry?.hasStateInspector).toBe(true);
      expect(entry?.hasOlympyardPracticeExit).toBe(true);
      expect(entry?.hasSnapshotSupport).toBe(true);
      expect(entry?.hasVisualRegressionTest).toBe(false);
    }
  });

  it("adds prediction prompts, misconception checks, formula tokens, live values, invariants, and SVG visuals", () => {
    for (const config of phaseFourteenConfigs) {
      const values = defaultValues(config);
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(4);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes required Phase 14 interaction contracts", () => {
    expect(limitApproachesPointPhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "h"]);
    expect(tokenIds(limitApproachesPointPhaseFourteenConfig)).toEqual(expect.arrayContaining(["x-to-a", "f-x", "L", "lim"]));
    expect(derivativeSlopePhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "h"]);
    expect(tokenIds(derivativeSlopePhaseFourteenConfig)).toEqual(expect.arrayContaining(["h", "rise", "over-h", "h-to-0", "derivative"]));
    expect(secantBecomesTangentPhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["x1", "dx"]);
    expect(tokenIds(secantBecomesTangentPhaseFourteenConfig)).toEqual(expect.arrayContaining(["delta-x", "delta-y", "avg-slope", "instantaneous"]));
    expect(derivativePowerRulePhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["n", "a", "h"]);
    expect(tokenIds(derivativePowerRulePhaseFourteenConfig)).toEqual(expect.arrayContaining(["x-power", "n", "x-power-minus-1", "nx-power-minus-1"]));
    expect(productRulePhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["u", "v", "du", "dv"]);
    expect(tokenIds(productRulePhaseFourteenConfig)).toEqual(expect.arrayContaining(["uv", "u-prime-v", "u-v-prime", "tiny-corner"]));
    expect(chainRulePhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "dx"]);
    expect(tokenIds(chainRulePhaseFourteenConfig)).toEqual(expect.arrayContaining(["g-prime", "f-prime-g", "rate-product", "chain-derivative"]));
    expect(riemannSumsPhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b", "n", "method"]);
    expect(tokenIds(riemannSumsPhaseFourteenConfig)).toEqual(expect.arrayContaining(["sigma", "height", "dx", "n-to-infinity"]));
    expect(definiteIntegralPhaseFourteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b", "n"]);
    expect(tokenIds(definiteIntegralPhaseFourteenConfig)).toEqual(expect.arrayContaining(["integral", "a", "b", "f-x", "dx"]));
  });

  it("keeps live calculus values aligned with limit, derivative, product, chain, and area goals", () => {
    expect(limitApproachesPointPhaseFourteenConfig.liveValues({ a: 2, h: 0.5 }).find((item) => item.id === "L")?.value).toBe("4.000");
    expect(derivativeSlopePhaseFourteenConfig.liveValues({ a: 1, h: 0.5 }).find((item) => item.id === "derivative")?.value).toBe("2.000");
    expect(productRulePhaseFourteenConfig.liveValues({ u: 4, v: 3, du: 0.7, dv: 0.5 }).map((item) => item.id)).toEqual(expect.arrayContaining(["u-prime-v", "u-v-prime", "tiny-corner"]));
    expect(chainRulePhaseFourteenConfig.liveValues({ x: 1, dx: 0.2 }).find((item) => item.id === "chain-derivative")?.value).toBe("4.000");
    expect(riemannSumsPhaseFourteenConfig.liveValues({ a: -1, b: 3, n: 8, method: 1 }).find((item) => item.id === "dx")?.value).toBe("0.500");
    expect(definiteIntegralPhaseFourteenConfig.liveValues({ a: -1.5, b: 2.5, n: 24 }).find((item) => item.id === "integral")?.value).toBeTruthy();
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
