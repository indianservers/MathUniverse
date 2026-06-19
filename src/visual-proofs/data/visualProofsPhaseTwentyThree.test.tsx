import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  circleLocusPhaseTwentyThreeConfig,
  coneSlicingPhaseTwentyThreeConfig,
  directrixFocusEquationsPhaseTwentyThreeConfig,
  eccentricityClassificationPhaseTwentyThreeConfig,
  ellipseSumPhaseTwentyThreeConfig,
  hyperbolaDifferencePhaseTwentyThreeConfig,
  parabolaFocusDirectrixPhaseTwentyThreeConfig,
  parabolaReflectivePhaseTwentyThreeConfig,
  phaseTwentyThreeConfigs,
  phaseTwentyThreeRouteSlugs,
} from "../proofs/phase-twenty-three/phaseTwentyThreeProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase twenty-three conic sections launch", () => {
  it("creates all eight Phase 23 conic routes as upgraded experiences", () => {
    for (const [categorySlug, proofSlug] of phaseTwentyThreeRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(["coordinate-grid", "measurement-scene"]).toContain(proof?.proofLearningModel);
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

  it("removes conic sections as a generic coming-soon starter experience", () => {
    const proofs = getVisualProofsByCategory("conic-sections");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(proofs).toHaveLength(8);
    expect(proofs.every((proof) => proof.status === "available")).toBe(true);
    expect(proofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(proofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseTwentyThreeRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseTwentyThreeConfigs) {
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

  it("exposes route-specific Phase 23 conic formula-token contracts", () => {
    expect((circleLocusPhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("circle-center-radius-locus");
    expect(tokenIds(circleLocusPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["center", "radius", "x-minus-h", "y-minus-k", "r-squared"]));
    expect((parabolaFocusDirectrixPhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("parabola-focus-directrix-equality");
    expect(tokenIds(parabolaFocusDirectrixPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["focus", "directrix", "pf", "distance-directrix", "x-squared-4py"]));
    expect((ellipseSumPhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("ellipse-foci-distance-sum");
    expect(tokenIds(ellipseSumPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["f1", "f2", "pf1-pf2", "constant", "a", "b"]));
    expect((hyperbolaDifferencePhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("hyperbola-foci-distance-difference");
    expect(tokenIds(hyperbolaDifferencePhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["f1", "f2", "pf1-minus-pf2", "constant", "asymptotes"]));
    expect((eccentricityClassificationPhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("eccentricity-conic-classifier");
    expect(tokenIds(eccentricityClassificationPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["e", "ellipse-range", "parabola-equals-one", "hyperbola-greater-one", "focus-directrix-ratio"]));
    expect((coneSlicingPhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("double-cone-slice-classifier");
    expect(tokenIds(coneSlicingPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["circle", "ellipse", "parabola", "hyperbola", "slicing-angle", "double-cone"]));
    expect((parabolaReflectivePhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("parabola-tangent-focus-reflection");
    expect(tokenIds(parabolaReflectivePhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["parallel-ray", "focus", "tangent", "equal-angles"]));
    expect((directrixFocusEquationsPhaseTwentyThreeConfig as PhaseTwentyThreeConfigWithKey).phaseTwentyThreeModelKey).toBe("focus-directrix-standard-equation-comparison");
    expect(tokenIds(directrixFocusEquationsPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["focus-directrix", "standard-equation", "plus-sign", "minus-sign", "four-p"]));
  });

  it("keeps live values aligned to conic geometry concepts", () => {
    expect(ids(circleLocusPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["h", "k", "r", "selected-point", "distance-from-center", "equation-left-side", "r-squared"]));
    expect(ids(parabolaFocusDirectrixPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["p", "focus", "directrix", "selected-point", "distance-to-focus", "distance-to-directrix", "difference-error"]));
    expect(ids(ellipseSumPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["a", "b", "c", "foci-coordinates", "pf1", "pf2", "distance-sum"]));
    expect(ids(hyperbolaDifferencePhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["a", "b", "c", "foci", "pf1", "pf2", "absolute-difference", "asymptote-slopes"]));
    expect(ids(eccentricityClassificationPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["e", "conic-type", "focus-directrix-ratio", "current-equation-shape-note", "classification-status"]));
    expect(ids(coneSlicingPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["slice-angle", "slice-position", "cone-angle", "resulting-conic-type", "geometric-condition-note"]));
    expect(ids(parabolaReflectivePhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["p", "point-p", "tangent-slope", "incoming-angle", "reflected-angle", "focus-check"]));
    expect(ids(directrixFocusEquationsPhaseTwentyThreeConfig)).toEqual(expect.arrayContaining(["selected-conic", "parameters", "focus-directrix-data", "standard-equation", "classification-note"]));
  });
});

type PhaseTwentyThreeConfigWithKey = PhaseTwoProofConfig & { phaseTwentyThreeModelKey: string };

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
