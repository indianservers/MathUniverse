import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  additionPhaseSeventeenConfig,
  complementPhaseSeventeenConfig,
  conditionalPhaseSeventeenConfig,
  expectedValuePhaseSeventeenConfig,
  experimentalPhaseSeventeenConfig,
  favorableTotalPhaseSeventeenConfig,
  multiplicationPhaseSeventeenConfig,
  phaseSeventeenConfigs,
  phaseSeventeenRouteSlugs,
  treePhaseSeventeenConfig,
} from "../proofs/phase-seventeen/phaseSeventeenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase seventeen probability launch", () => {
  it("creates all eight Phase 17 probability routes as upgraded simulation-board experiences", () => {
    for (const [categorySlug, proofSlug] of phaseSeventeenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("simulation-board");
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

  it("keeps probability free of generic coming-soon starter as the main experience", () => {
    const probabilityProofs = getVisualProofsByCategory("probability");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(probabilityProofs).toHaveLength(8);
    expect(probabilityProofs.every((proof) => proof.status === "available")).toBe(true);
    expect(probabilityProofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(probabilityProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(probabilityProofs.every((proof) => proof.proofLearningModel === "simulation-board")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseSeventeenRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseSeventeenConfigs) {
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

  it("exposes route-specific Phase 17 simulation contracts", () => {
    expect((favorableTotalPhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("sample-space");
    expect(tokenIds(favorableTotalPhaseSeventeenConfig)).toEqual(expect.arrayContaining(["P-A", "favorable-outcomes", "total-outcomes", "fraction"]));
    expect((complementPhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("complement");
    expect(tokenIds(complementPhaseSeventeenConfig)).toEqual(expect.arrayContaining(["A", "A-complement", "one", "one-minus-P-A"]));
    expect((additionPhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("union-intersection");
    expect(tokenIds(additionPhaseSeventeenConfig)).toEqual(expect.arrayContaining(["A-union-B", "P-A", "P-B", "A-intersection-B", "subtract-overlap"]));
    expect((multiplicationPhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("independent-product");
    expect(tokenIds(multiplicationPhaseSeventeenConfig)).toEqual(expect.arrayContaining(["P-A", "P-B", "P-A-times-P-B", "A-intersection-B"]));
    expect((conditionalPhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("restricted-sample-space");
    expect(tokenIds(conditionalPhaseSeventeenConfig)).toEqual(expect.arrayContaining(["B", "A-intersection-B", "P-A-given-B", "divide-by-P-B"]));
    expect((treePhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("branch-path");
    expect(tokenIds(treePhaseSeventeenConfig)).toEqual(expect.arrayContaining(["branch-probability", "path-product", "sum-of-paths"]));
    expect((experimentalPhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("trials-frequency");
    expect(tokenIds(experimentalPhaseSeventeenConfig)).toEqual(expect.arrayContaining(["successes-over-trials", "theoretical-p", "large-number"]));
    expect((expectedValuePhaseSeventeenConfig as PhaseSeventeenConfigWithKey).phaseSeventeenModelKey).toBe("outcome-contribution");
    expect(tokenIds(expectedValuePhaseSeventeenConfig)).toEqual(expect.arrayContaining(["x-i", "P-x-i", "x-i-P-x-i", "sum"]));
  });

  it("keeps live values aligned to sample space, complement, union, product, conditional, tree, frequency, and expected value goals", () => {
    expect(favorableTotalPhaseSeventeenConfig.liveValues({ total: 10, favorable: 3 }).map((item) => item.id)).toEqual(expect.arrayContaining(["total-outcomes", "favorable-outcomes", "probability-fraction", "decimal", "percent"]));
    expect(complementPhaseSeventeenConfig.liveValues({ total: 10, aCount: 7 }).find((item) => item.id === "P-A-complement")?.value).toBe("0.3");
    expect(additionPhaseSeventeenConfig.liveValues({ total: 40, aCount: 18, bCount: 16, intersection: 6 }).map((item) => item.id)).toEqual(expect.arrayContaining(["intersection-count", "union-count", "P-union"]));
    expect(multiplicationPhaseSeventeenConfig.liveValues({ pA: 0.5, pB: 1 / 3 }).find((item) => item.id === "P-intersection")?.value).toBe("0.167");
    expect(conditionalPhaseSeventeenConfig.liveValues({ total: 40, bCount: 20, intersection: 8 }).find((item) => item.id === "P-A-given-B")?.value).toBe("0.4");
    expect(treePhaseSeventeenConfig.liveValues({ pA: 0.6, pBGivenA: 0.7, pBGivenNotA: 0.25 }).map((item) => item.id)).toEqual(expect.arrayContaining(["stage-1-probabilities", "path-products", "total-probability"]));
    expect(experimentalPhaseSeventeenConfig.liveValues({ p: 0.5, trials: 100 }).map((item) => item.id)).toEqual(expect.arrayContaining(["trials", "successes", "experimental-probability", "theoretical-probability"]));
    expect(expectedValuePhaseSeventeenConfig.liveValues({ x1: 1, x2: 4, x3: 8, p1: 0.25, p2: 0.35 }).map((item) => item.id)).toEqual(expect.arrayContaining(["outcomes", "probabilities", "contributions", "expected-value"]));
  });
});

type PhaseSeventeenConfigWithKey = PhaseTwoProofConfig & { phaseSeventeenModelKey: string };

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}

function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens(defaultValues(config)).map((token) => token.id);
}

function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
