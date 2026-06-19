import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  determinantPhaseNineteenConfig,
  eigenvectorsPhaseNineteenConfig,
  linearSystemPhaseNineteenConfig,
  matrixAdditionPhaseNineteenConfig,
  matrixInversePhaseNineteenConfig,
  matrixMultiplicationPhaseNineteenConfig,
  matrixTransformationPhaseNineteenConfig,
  phaseNineteenConfigs,
  phaseNineteenRouteSlugs,
  rowOperationsPhaseNineteenConfig,
} from "../proofs/phase-nineteen/phaseNineteenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase nineteen matrices and linear algebra launch", () => {
  it("creates all eight Phase 19 matrix routes as upgraded experiences", () => {
    const expectedModels = new Map([
      ["matrix-addition-cell-by-cell", "tile-model"],
      ["matrix-multiplication-row-column", "tile-model"],
      ["matrix-linear-transformation-grid", "transformation-grid"],
      ["determinant-area-scale-factor", "transformation-grid"],
      ["linear-system-line-intersection", "coordinate-grid"],
      ["row-operations-preserve-solutions", "tile-model"],
      ["eigenvectors-directions-do-not-turn", "transformation-grid"],
      ["matrix-inverse-undo-transformation", "transformation-grid"],
    ]);
    for (const [categorySlug, proofSlug] of phaseNineteenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe(expectedModels.get(proofSlug));
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

  it("keeps matrices free of generic coming-soon starter as the main experience", () => {
    const proofs = getVisualProofsByCategory("matrices-linear-algebra");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseNineteenRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseNineteenConfigs) {
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

  it("exposes route-specific Phase 19 matrix contracts", () => {
    expect((matrixAdditionPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("cell-by-cell");
    expect(tokenIds(matrixAdditionPhaseNineteenConfig)).toEqual(expect.arrayContaining(["A-ij", "B-ij", "A-plus-B-ij", "same-size"]));
    expect((matrixMultiplicationPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("row-column-dot-product");
    expect(tokenIds(matrixMultiplicationPhaseNineteenConfig)).toEqual(expect.arrayContaining(["row-i", "column-j", "dot-product-terms", "AB-ij"]));
    expect((matrixTransformationPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("basis-vector-transformation");
    expect(tokenIds(matrixTransformationPhaseNineteenConfig)).toEqual(expect.arrayContaining(["first-column", "second-column", "Av", "matrix-entries"]));
    expect((determinantPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("area-scale");
    expect(tokenIds(determinantPhaseNineteenConfig)).toEqual(expect.arrayContaining(["ad", "bc", "ad-minus-bc", "transformed-area"]));
    expect((linearSystemPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("line-intersection");
    expect(tokenIds(linearSystemPhaseNineteenConfig)).toEqual(expect.arrayContaining(["first-equation", "second-equation", "intersection", "determinant-condition"]));
    expect((rowOperationsPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("solution-preservation");
    expect(tokenIds(rowOperationsPhaseNineteenConfig)).toEqual(expect.arrayContaining(["row-operation", "solution-point", "equivalent-system"]));
    expect((eigenvectorsPhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("Av-lambda-v");
    expect(tokenIds(eigenvectorsPhaseNineteenConfig)).toEqual(expect.arrayContaining(["Av", "lambda-v", "same-direction-line", "lambda"]));
    expect((matrixInversePhaseNineteenConfig as PhaseNineteenConfigWithKey).phaseNineteenModelKey).toBe("determinant-invertibility");
    expect(tokenIds(matrixInversePhaseNineteenConfig)).toEqual(expect.arrayContaining(["A", "A-inverse", "I", "determinant-nonzero"]));
  });

  it("keeps live values aligned to matrix addition, products, transformations, systems, row operations, eigenvectors, and inverses", () => {
    expect(matrixAdditionPhaseNineteenConfig.liveValues(defaultValues(matrixAdditionPhaseNineteenConfig)).map((item) => item.id)).toEqual(expect.arrayContaining(["matrix-dimensions", "selected-row-column", "A-ij", "B-ij", "result-entry"]));
    expect(matrixMultiplicationPhaseNineteenConfig.liveValues(defaultValues(matrixMultiplicationPhaseNineteenConfig)).map((item) => item.id)).toEqual(expect.arrayContaining(["row-vector", "column-vector", "pairwise-products", "dot-product-sum"]));
    expect(matrixTransformationPhaseNineteenConfig.liveValues(defaultValues(matrixTransformationPhaseNineteenConfig)).map((item) => item.id)).toEqual(expect.arrayContaining(["matrix-entries", "input-vector-v", "transformed-vector-Av", "transformed-basis-vectors"]));
    expect(determinantPhaseNineteenConfig.liveValues(defaultValues(determinantPhaseNineteenConfig)).map((item) => item.id)).toEqual(expect.arrayContaining(["determinant", "absolute-area-scale", "orientation-sign"]));
    expect(linearSystemPhaseNineteenConfig.liveValues(defaultValues(linearSystemPhaseNineteenConfig)).map((item) => item.id)).toEqual(expect.arrayContaining(["intersection-point", "determinant", "solution-status"]));
    expect(rowOperationsPhaseNineteenConfig.liveValues({ k: 1 }).map((item) => item.id)).toEqual(expect.arrayContaining(["original-system", "transformed-system", "operation", "original-solution", "transformed-solution"]));
    expect(eigenvectorsPhaseNineteenConfig.liveValues({ theta: 0 }).find((item) => item.id === "eigenvector-status")?.value).toBe("aligned");
    expect(matrixInversePhaseNineteenConfig.liveValues(defaultValues(matrixInversePhaseNineteenConfig)).map((item) => item.id)).toEqual(expect.arrayContaining(["determinant", "invertible-status", "Av", "A-inverse-Av"]));
  });
});

type PhaseNineteenConfigWithKey = PhaseTwoProofConfig & { phaseNineteenModelKey: string };

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}

function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens(defaultValues(config)).map((token) => token.id);
}

function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
