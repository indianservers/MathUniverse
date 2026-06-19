import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  congruenceRigidMotionsPhaseTwentySixConfig,
  dilationSimilarityScaleFactorPhaseTwentySixConfig,
  lineRotationalSymmetryPhaseTwentySixConfig,
  reflectionMirrorLinePhaseTwentySixConfig,
  rotationAboutPointPhaseTwentySixConfig,
  tessellationsRepeatedTransformationsPhaseTwentySixConfig,
  transformationMatrices2dPhaseTwentySixConfig,
  translationSlidingVectorPhaseTwentySixConfig,
  phaseTwentySixConfigs,
  phaseTwentySixRouteSlugs,
} from "../proofs/phase-twenty-six/phaseTwentySixProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-six transformations and symmetry launch", () => {
  it("creates all eight Phase 26 transformation and symmetry routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentySixRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("transformation-grid");
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

  it("replaces transformations and symmetry as a generic coming-soon starter experience", () => {
    const proofs = getVisualProofsByCategory("transformations-symmetry");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentySixRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentySixConfigs) {
      const values = defaultValues(config);
      expect((config as PhaseTwentySixConfigWithKey).phaseTwentySixModelKey).toBeTruthy();
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(6);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes route-specific Phase 26 formula-token contracts", () => {
    expect(tokenIds(translationSlidingVectorPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["xy", "x-plus-a-y-plus-b", "translation-vector", "same-vector"]));
    expect(tokenIds(reflectionMirrorLinePhaseTwentySixConfig)).toEqual(expect.arrayContaining(["mirror-line", "equal-distance", "x-neg-y", "neg-x-y"]));
    expect(tokenIds(rotationAboutPointPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["center", "angle", "neg-y-x", "distance-preserved"]));
    expect(tokenIds(dilationSimilarityScaleFactorPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["k", "kx-ky", "center", "similar"]));
    expect(tokenIds(congruenceRigidMotionsPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["translation", "rotation", "reflection", "same-size", "same-shape", "congruent"]));
    expect(tokenIds(lineRotationalSymmetryPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["line-symmetry", "rotation-angle", "order", "maps-to-itself"]));
    expect(tokenIds(tessellationsRepeatedTransformationsPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["translation", "rotation-reflection", "no-gaps", "no-overlaps", "angle-fit"]));
    expect(tokenIds(transformationMatrices2dPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["matrix-entries", "basis-vectors", "transformed-shape", "coordinate-rule"]));
  });

  it("keeps live values aligned to transformation and symmetry concepts", () => {
    expect(ids(translationSlidingVectorPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["translation-vector", "original-coordinates", "image-coordinates", "side-lengths-before-after", "orientation-before-after", "translation-invariant"]));
    expect(ids(reflectionMirrorLinePhaseTwentySixConfig)).toEqual(expect.arrayContaining(["selected-mirror-line", "original-coordinates", "reflected-coordinates", "distance-to-mirror-before-after", "orientation-status", "reflection-invariant"]));
    expect(ids(rotationAboutPointPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["center", "angle", "original-coordinates", "rotated-coordinates", "distances-from-center-before-after", "orientation-status", "rotation-invariant"]));
    expect(ids(dilationSimilarityScaleFactorPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["center", "scale-factor-k", "original-side-lengths", "image-side-lengths", "side-ratios", "angle-preservation", "dilation-invariant"]));
    expect(ids(congruenceRigidMotionsPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["side-lengths-original", "side-lengths-image", "angles-original", "angles-image", "transformation-sequence", "congruence-status", "rigid-motion-invariant"]));
    expect(ids(lineRotationalSymmetryPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["selected-shape", "line-symmetry-count", "rotational-symmetry-order", "selected-angle", "maps-to-itself-status", "symmetry-invariant"]));
    expect(ids(tessellationsRepeatedTransformationsPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["tile-type", "transformation-mode", "repeat-spacing", "gap-overlap-status", "angle-fit-around-vertex", "tessellation-status", "tessellation-invariant"]));
    expect(ids(transformationMatrices2dPhaseTwentySixConfig)).toEqual(expect.arrayContaining(["selected-matrix", "input-point-vector", "output-point-vector", "determinant", "area-scale", "orientation-status", "matrix-rule-invariant"]));
  });
});

type PhaseTwentySixConfigWithKey = PhaseTwoProofConfig & { phaseTwentySixModelKey: string };

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
