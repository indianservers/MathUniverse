import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import { phaseTwoRouteSlugs } from "../proofs/phase-two/phaseTwoProofConfigs";
import {
  allSequenceSeriesPhaseRouteSlugs,
  arithmeticProgressionPhaseThirteenConfig,
  arithmeticProgressionSumPhaseThirteenConfig,
  finiteGeometricSeriesPhaseThirteenConfig,
  fibonacciSpiralPhaseThirteenConfig,
  fibonacciSumPhaseThirteenConfig,
  fibonacciTilingPhaseThirteenConfig,
  geometricProgressionPhaseThirteenConfig,
  harmonicGrowthPhaseThirteenConfig,
  inductionDominoPhaseThirteenConfig,
  infiniteGeometricSeriesPhaseThirteenConfig,
  pascalTrianglePhaseThirteenConfig,
  phaseThirteenConfigs,
  phaseThirteenRouteSlugs,
  squareNumbersOddLayersPhaseThirteenConfig,
  triangularNumbersPhaseThirteenConfig,
} from "../proofs/phase-thirteen/phaseThirteenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const expectedSequenceSlugs = [
  "arithmetic-progression-equal-steps",
  "sum-first-n-natural-numbers",
  "sum-first-n-odd-numbers",
  "sum-arithmetic-progression",
  "geometric-progression-repeated-scaling",
  "finite-geometric-series-sum",
  "infinite-geometric-series-convergence",
  "triangular-numbers",
  "square-numbers-odd-layers",
  "fibonacci-sequence-tiling",
  "fibonacci-spiral-approximation",
  "sum-of-fibonacci-numbers",
  "pascal-triangle-binomial-coefficients",
  "visual-induction-domino-growth",
  "harmonic-series-growth-intuition",
];

describe("Visual Proofs phase thirteen sequences and series completion", () => {
  it("marks all thirteen phase thirteen routes as upgraded pattern-model experiences", () => {
    for (const [categorySlug, proofSlug] of phaseThirteenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("pattern-model");
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
    for (const config of phaseThirteenConfigs) {
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

  it("keeps all fifteen Sequences and Series routes phase-upgraded and in the smoke manifest", () => {
    const sequenceProofs = getVisualProofsByCategory("sequences-and-series").filter((proof) => proof.status === "available");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(sequenceProofs).toHaveLength(15);
    expect(sequenceProofs.map((proof) => proof.slug)).toEqual(expect.arrayContaining(expectedSequenceSlugs));
    expect(sequenceProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(sequenceProofs.every((proof) => proof.proofLearningModel === "pattern-model")).toBe(true);
    expect(sequenceProofs.every((proof) => proof.hasFormulaTokens && proof.hasPredictionPrompt && proof.hasSnapshotSupport)).toBe(true);
    expect(sequenceProofs.every((proof) => proof.hasTeacherMode && proof.hasKeyboardControls && proof.hasStateInspector && proof.hasOlympyardPracticeExit)).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(expectedSequenceSlugs.map((slug) => `/visual-proofs/sequences-and-series/${slug}`)));
    expect(manifestRoutes).toEqual(expect.arrayContaining(allSequenceSeriesPhaseRouteSlugs.map(routeFromSlug)));
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwoRouteSlugs.filter(([category]) => category === "sequences-and-series").map(routeFromSlug)));
  });

  it("exposes required Phase 13 sequence interaction contracts", () => {
    expect(arithmeticProgressionPhaseThirteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "d", "n"]);
    expect(tokenIds(arithmeticProgressionPhaseThirteenConfig)).toEqual(expect.arrayContaining(["a", "d", "n-minus-1", "a-n"]));
    expect(tokenIds(arithmeticProgressionSumPhaseThirteenConfig)).toEqual(expect.arrayContaining(["n", "a", "l", "a-plus-l", "half"]));
    expect(geometricProgressionPhaseThirteenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "r", "n"]);
    expect(tokenIds(finiteGeometricSeriesPhaseThirteenConfig)).toEqual(expect.arrayContaining(["s-n", "r-s-n", "one-minus-r-n", "one-minus-r"]));
    expect(tokenIds(infiniteGeometricSeriesPhaseThirteenConfig)).toEqual(expect.arrayContaining(["condition", "limit-factor"]));
    expect(tokenIds(triangularNumbersPhaseThirteenConfig)).toEqual(expect.arrayContaining(["n", "n-plus-1", "half", "t-n"]));
    expect(tokenIds(squareNumbersOddLayersPhaseThirteenConfig)).toEqual(expect.arrayContaining(["latest-odd", "n-square", "odd-layers"]));
    expect(tokenIds(fibonacciTilingPhaseThirteenConfig)).toEqual(expect.arrayContaining(["f-n-minus-1", "f-n-minus-2", "f-n", "plus"]));
    expect(tokenIds(fibonacciSpiralPhaseThirteenConfig)).toEqual(expect.arrayContaining(["ratio", "phi", "quarter-arcs"]));
    expect(tokenIds(fibonacciSumPhaseThirteenConfig)).toEqual(expect.arrayContaining(["fib-sum", "f-n-plus-2", "minus-one"]));
    expect(tokenIds(pascalTrianglePhaseThirteenConfig)).toEqual(expect.arrayContaining(["c-n-k", "row-n", "expansion"]));
    expect(tokenIds(inductionDominoPhaseThirteenConfig)).toEqual(expect.arrayContaining(["base-case", "inductive-step", "all-n"]));
    expect(tokenIds(harmonicGrowthPhaseThirteenConfig)).toEqual(expect.arrayContaining(["one-over-n", "group-half", "diverges"]));
  });

  it("keeps route-specific live values aligned with AP, GP, Fibonacci, Pascal, induction, and harmonic goals", () => {
    expect(arithmeticProgressionPhaseThirteenConfig.liveValues({ a: 2, d: 3, n: 5 }).find((item) => item.id === "n-minus-1")?.value).toBe(4);
    expect(arithmeticProgressionSumPhaseThirteenConfig.liveValues({ a: 2, d: 2, n: 7 }).map((item) => item.id)).toEqual(expect.arrayContaining(["l", "a-plus-l", "duplicated", "sum"]));
    expect(geometricProgressionPhaseThirteenConfig.liveValues({ a: 2, r: 2, n: 5 }).find((item) => item.id === "a-n")?.value).toBe("32");
    expect(finiteGeometricSeriesPhaseThirteenConfig.liveValues({ a: 3, r: 0.5, n: 6 }).map((item) => item.id)).toEqual(expect.arrayContaining(["r-n", "direct-sum", "formula-sum", "warning"]));
    expect(infiniteGeometricSeriesPhaseThirteenConfig.liveValues({ a: 4, r: 0.5, n: 8 }).find((item) => item.id === "status")?.value).toBe("convergent");
    expect(fibonacciTilingPhaseThirteenConfig.liveValues({ n: 8 }).find((item) => item.id === "next")?.value).toBe(21);
    expect(pascalTrianglePhaseThirteenConfig.liveValues({ n: 6, k: 3 }).find((item) => item.id === "c-n-k")?.value).toBe(20);
    expect(inductionDominoPhaseThirteenConfig.liveValues({ n: 12 }).find((item) => item.id === "step")?.value).toContain("k+1");
    expect(harmonicGrowthPhaseThirteenConfig.liveValues({ groups: 5 }).find((item) => item.id === "insight")?.value).toContain("without bound");
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
