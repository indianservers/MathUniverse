import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  compositeSolidsUnitsPhaseTwentyTwoConfig,
  coneVolumeSurfaceAreaPhaseTwentyTwoConfig,
  cuboidCubeSurfaceAreaPhaseTwentyTwoConfig,
  cuboidCubeVolumePhaseTwentyTwoConfig,
  cylinderVolumeSurfaceAreaPhaseTwentyTwoConfig,
  perimeterCircumferencePhaseTwentyTwoConfig,
  phaseTwentyTwoConfigs,
  phaseTwentyTwoRouteSlugs,
  rectangleSquareAreaPhaseTwentyTwoConfig,
  sphereSurfaceAreaVolumePhaseTwentyTwoConfig,
} from "../proofs/phase-twenty-two/phaseTwentyTwoProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-two mensuration launch", () => {
  it("creates all eight Phase 22 mensuration routes as upgraded measurement scenes", () => {
    for (const [categorySlug, proofSlug] of phaseTwentyTwoRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("measurement-scene");
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

  it("removes mensuration as a generic coming-soon starter experience", () => {
    const proofs = getVisualProofsByCategory("mensuration");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(proofs.every((proof) => proof.proofLearningModel === "measurement-scene")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentyTwoRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentyTwoConfigs) {
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

  it("exposes route-specific Phase 22 mensuration formula-token contracts", () => {
    expect((rectangleSquareAreaPhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("area-unit-square-grid");
    expect(tokenIds(rectangleSquareAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["length", "width", "length-x-width", "side-squared"]));
    expect((perimeterCircumferencePhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("boundary-length-unwrapped");
    expect(tokenIds(perimeterCircumferencePhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["perimeter", "two-l-plus-w", "two-pi-r", "pi-d"]));
    expect((cuboidCubeSurfaceAreaPhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("cuboid-face-pair-net");
    expect(tokenIds(cuboidCubeSurfaceAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["lw", "lh", "wh", "two-face-pairs", "six-s-squared"]));
    expect((cuboidCubeVolumePhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("unit-cube-layer-stack");
    expect(tokenIds(cuboidCubeVolumePhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["length-width", "height", "lwh", "side-cubed"]));
    expect((cylinderVolumeSurfaceAreaPhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("cylinder-disk-stack-unroll");
    expect(tokenIds(cylinderVolumeSurfaceAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["pi-r-squared", "two-pi-r", "two-pi-r-h", "two-pi-r-squared"]));
    expect((coneVolumeSurfaceAreaPhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("cone-cylinder-third-sector");
    expect(tokenIds(coneVolumeSurfaceAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["one-third", "pi-r-squared-h", "slant-height", "pi-r-l"]));
    expect((sphereSurfaceAreaVolumePhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("sphere-r-square-r-cube-scaling");
    expect(tokenIds(sphereSurfaceAreaVolumePhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["radius", "pi-r-squared", "four-pi-r-squared", "four-thirds-pi-r-cubed"]));
    expect((compositeSolidsUnitsPhaseTwentyTwoConfig as PhaseTwentyTwoConfigWithKey).phaseTwentyTwoModelKey).toBe("composite-decomposition-units");
    expect(tokenIds(compositeSolidsUnitsPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["add-parts", "subtract-holes", "cm-squared", "cm-cubed"]));
  });

  it("keeps live values aligned to mensuration concepts and units", () => {
    expect(ids(rectangleSquareAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["unit-square-count", "area", "square-mode", "area-grid-invariant"]));
    expect(ids(perimeterCircumferencePhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["shape-type", "boundary-length", "rounded-circumference", "pi-warning", "boundary-invariant"]));
    expect(ids(cuboidCubeSurfaceAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["face-area-lw", "face-area-lh", "face-area-wh", "total-surface-area", "cube-mode"]));
    expect(ids(cuboidCubeVolumePhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["base-area", "layers", "volume", "cube-mode", "unit-cube-invariant"]));
    expect(ids(cylinderVolumeSurfaceAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["base-area", "circumference", "volume", "curved-surface-area", "total-surface-area"]));
    expect(ids(coneVolumeSurfaceAreaPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["slant-height", "cylinder-comparison-volume", "cone-volume", "curved-surface-area", "slant-invariant"]));
    expect(ids(sphereSurfaceAreaVolumePhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["great-circle-area", "surface-area", "volume", "scaling-insight", "schematic-warning"]));
    expect(ids(compositeSolidsUnitsPhaseTwentyTwoConfig)).toEqual(expect.arrayContaining(["selected-mode", "part-dimensions", "part-areas-volumes", "subtracted-parts", "total", "unit-type", "unit-invariant"]));
  });
});

type PhaseTwentyTwoConfigWithKey = PhaseTwoProofConfig & { phaseTwentyTwoModelKey: string };

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
