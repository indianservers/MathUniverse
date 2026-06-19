import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  compositesPhaseSixteenConfig,
  digitSumPhaseSixteenConfig,
  divisibilityPhaseSixteenConfig,
  euclidPhaseSixteenConfig,
  evenOddPhaseSixteenConfig,
  factorTreePhaseSixteenConfig,
  gcdPhaseSixteenConfig,
  lcmPhaseSixteenConfig,
  modularClockPhaseSixteenConfig,
  phaseSixteenConfigs,
  phaseSixteenRouteSlugs,
  primesPhaseSixteenConfig,
  remainderCyclePhaseSixteenConfig,
  sqrtTwoPhaseSixteenConfig,
} from "../proofs/phase-sixteen/phaseSixteenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase sixteen number theory completion", () => {
  it("marks all twelve Phase 16 routes as upgraded number-model experiences", () => {
    for (const [categorySlug, proofSlug] of phaseSixteenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("number-model");
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

  it("makes all twelve Number Theory routes phase-upgraded and present in the smoke manifest", () => {
    const numberTheoryProofs = getVisualProofsByCategory("number-theory").filter((proof) => proof.status === "available");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(numberTheoryProofs).toHaveLength(12);
    expect(numberTheoryProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(numberTheoryProofs.every((proof) => proof.proofLearningModel === "number-model")).toBe(true);
    expect(numberTheoryProofs.every((proof) => proof.hasFormulaTokens && proof.hasPredictionPrompt && proof.hasSnapshotSupport)).toBe(true);
    expect(numberTheoryProofs.every((proof) => proof.hasTeacherMode && proof.hasKeyboardControls && proof.hasStateInspector && proof.hasOlympyardPracticeExit)).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseSixteenRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompts, misconception checks, formula tokens, live values, invariants, and SVG visuals", () => {
    for (const config of phaseSixteenConfigs) {
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

  it("exposes required Phase 16 number theory interaction contracts", () => {
    expect(evenOddPhaseSixteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["n"]);
    expect(tokenIds(evenOddPhaseSixteenConfig)).toEqual(expect.arrayContaining(["2k", "2k-plus-1", "leftover"]));
    expect((evenOddPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("parity");

    expect(divisibilityPhaseSixteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b"]);
    expect(tokenIds(divisibilityPhaseSixteenConfig)).toEqual(expect.arrayContaining(["a", "b", "q", "remainder-0"]));
    expect((divisibilityPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("quotient-remainder");

    expect(tokenIds(primesPhaseSixteenConfig)).toEqual(expect.arrayContaining(["one-by-n", "n-by-one", "no-other-rectangle", "two-divisors"]));
    expect(tokenIds(compositesPhaseSixteenConfig)).toEqual(expect.arrayContaining(["a-by-b", "factors", "composite"]));
    expect((primesPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("factor-pair-prime");
    expect((compositesPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("factor-pair-composite");

    expect(tokenIds(factorTreePhaseSixteenConfig)).toEqual(expect.arrayContaining(["n", "prime-leaves", "product-expression", "unique"]));
    expect((factorTreePhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("prime-factorization");

    expect(tokenIds(euclidPhaseSixteenConfig)).toEqual(expect.arrayContaining(["p-product", "plus-one", "remainder-1", "new-prime"]));
    expect((euclidPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("product-plus-one");

    expect(tokenIds(gcdPhaseSixteenConfig)).toEqual(expect.arrayContaining(["a-bq-r", "r", "gcd-b-r", "final-gcd"]));
    expect((gcdPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("euclidean-algorithm");

    expect(tokenIds(lcmPhaseSixteenConfig)).toEqual(expect.arrayContaining(["multiples-of-a", "multiples-of-b", "first-common"]));
    expect((lcmPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("multiple-alignment");

    expect(tokenIds(modularClockPhaseSixteenConfig)).toEqual(expect.arrayContaining(["a", "mod-m", "remainder"]));
    expect((modularClockPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("clock-mod");

    expect(tokenIds(remainderCyclePhaseSixteenConfig)).toEqual(expect.arrayContaining(["base-power-n", "mod-m", "cycle"]));
    expect((remainderCyclePhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("cycle");

    expect(tokenIds(digitSumPhaseSixteenConfig)).toEqual(expect.arrayContaining(["digit-sum", "ten-equiv-one", "mod-3", "mod-9"]));
    expect((digitSumPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("digit-sum-modulo");

    expect(tokenIds(sqrtTwoPhaseSixteenConfig)).toEqual(expect.arrayContaining(["sqrt2-p-over-q", "p-squared-2q-squared", "p-even", "q-even", "contradiction"]));
    expect((sqrtTwoPhaseSixteenConfig as PhaseSixteenConfigWithKey).phaseSixteenModelKey).toBe("contradiction-parity");
  });

  it("keeps route-specific live values aligned with parity, divisibility, factor, modular, and contradiction goals", () => {
    expect(evenOddPhaseSixteenConfig.liveValues({ n: 17 }).map((item) => item.id)).toEqual(expect.arrayContaining(["k", "remainder", "parity", "invariant"]));
    expect(divisibilityPhaseSixteenConfig.liveValues({ a: 42, b: 6 }).map((item) => item.id)).toEqual(expect.arrayContaining(["q", "remainder", "divisible", "invariant"]));
    expect(primesPhaseSixteenConfig.liveValues({ n: 13 }).find((item) => item.id === "prime-status")?.value).toBe("prime");
    expect(compositesPhaseSixteenConfig.liveValues({ n: 36, pairIndex: 0 }).map((item) => item.id)).toEqual(expect.arrayContaining(["factor-pairs", "selected-pair", "composite-status"]));
    expect(factorTreePhaseSixteenConfig.liveValues({ n: 180 }).map((item) => item.id)).toEqual(expect.arrayContaining(["prime-factors", "exponent-form", "invariant"]));
    expect(euclidPhaseSixteenConfig.liveValues({ primeCount: 4 }).map((item) => item.id)).toEqual(expect.arrayContaining(["product-P", "N", "remainders", "conclusion"]));
    expect(gcdPhaseSixteenConfig.liveValues({ a: 84, b: 30 }).find((item) => item.id === "final-gcd")?.value).toBe(6);
    expect(lcmPhaseSixteenConfig.liveValues({ a: 6, b: 8 }).find((item) => item.id === "first-common-multiple")?.value).toBe(24);
    expect(modularClockPhaseSixteenConfig.liveValues({ a: 12, m: 5 }).find((item) => item.id === "remainder")?.value).toBe(2);
    expect(remainderCyclePhaseSixteenConfig.liveValues({ base: 2, m: 5, n: 4 }).find((item) => item.id === "residues")?.value).toBe("2, 4, 3, 1");
    expect(digitSumPhaseSixteenConfig.liveValues({ number: 5382, divisor: 9 }).map((item) => item.id)).toEqual(expect.arrayContaining(["digit-sum", "digit-sum-mod", "number-mod", "invariant"]));
    expect(sqrtTwoPhaseSixteenConfig.liveValues({ proofStep: 5 }).map((item) => item.id)).toEqual(expect.arrayContaining(["assumption-status", "p-even", "q-even", "contradiction-status"]));
  });
});

type PhaseSixteenConfigWithKey = PhaseTwoProofConfig & { phaseSixteenModelKey: string };

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}

function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens(defaultValues(config)).map((token) => token.id);
}

function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
