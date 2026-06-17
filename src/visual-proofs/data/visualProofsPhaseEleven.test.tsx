import { describe, expect, it } from "vitest";
import {
  circleAreaUnrollingPhaseElevenConfig,
  exteriorAnglePhaseElevenConfig,
  phaseElevenConfigs,
  phaseElevenRouteSlugs,
  polygonInteriorAnglePhaseElevenConfig,
  sectorAreaPhaseElevenConfig,
  similarTrianglesPhaseElevenConfig,
  trapezoidAreaPhaseElevenConfig,
} from "../proofs/phase-eleven/phaseElevenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const expectedModels: Record<string, string> = {
  "exterior-angle-theorem": "angle-model",
  "similar-triangles-proportional-sides": "angle-model",
  "sector-area-formula": "measurement-scene",
  "trapezoid-area-duplication": "area-rearrangement",
  "polygon-interior-angle-sum": "angle-model",
  "area-of-circle-by-unrolling": "area-rearrangement",
};

const expectedGeometrySlugs = [
  "pythagorean-theorem-area-rearrangement",
  "triangle-area-half-rectangle",
  "triangle-angle-sum",
  "exterior-angle-theorem",
  "similar-triangles-proportional-sides",
  "circle-circumference-unwrapping",
  "sector-area-formula",
  "parallelogram-area-shearing",
  "trapezoid-area-duplication",
  "polygon-interior-angle-sum",
  "area-of-circle-by-unrolling",
];

describe("Visual Proofs phase eleven geometry completion", () => {
  it("marks all six phase eleven routes as upgraded with required metadata", () => {
    for (const [categorySlug, proofSlug] of phaseElevenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe(expectedModels[proofSlug]);
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasSnapshotSupport).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
      expect(proof?.expectedVisualKind).toBe("svg");
      expect(proof?.expectedPrimarySelector).toBe('[data-testid="visual-proof-primary-visual"] svg');
    }
  });

  it("adds prediction prompts, misconception checks, formula tokens, live values, and invariants", () => {
    for (const config of phaseElevenConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(4);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("includes all six phase eleven routes and all eleven geometry routes in the smoke manifest", () => {
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseElevenRouteSlugs.map(routeFromSlug)));
    expect(manifestRoutes).toEqual(expect.arrayContaining(expectedGeometrySlugs.map((slug) => `/visual-proofs/geometry/${slug}`)));
  });

  it("keeps all eleven geometry routes phase-upgraded", () => {
    const geometryProofs = getVisualProofsByCategory("geometry").filter((proof) => proof.status === "available");
    expect(geometryProofs).toHaveLength(11);
    expect(geometryProofs.map((proof) => proof.slug)).toEqual(expect.arrayContaining(expectedGeometrySlugs));
    expect(geometryProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(geometryProofs.every((proof) => proof.hasFormulaTokens && proof.hasPredictionPrompt && proof.hasSnapshotSupport)).toBe(true);
    expect(geometryProofs.every((proof) => proof.hasTeacherMode && proof.hasKeyboardControls && proof.hasStateInspector && proof.hasOlympyardPracticeExit)).toBe(true);
    expect(geometryProofs.some((proof) => proof.hasVisualRegressionTest)).toBe(false);
  });

  it("exposes required geometry interaction contracts", () => {
    expect(sectorAreaPhaseElevenConfig.parameters.map((parameter) => parameter.id)).toEqual(["radius", "theta"]);
    expect(trapezoidAreaPhaseElevenConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b", "h"]);
    expect(polygonInteriorAnglePhaseElevenConfig.parameters.map((parameter) => parameter.id)).toEqual(["n", "radius", "rotation"]);
    expect(circleAreaUnrollingPhaseElevenConfig.parameters.map((parameter) => parameter.id)).toEqual(["radius", "sectors"]);
    expect(similarTrianglesPhaseElevenConfig.parameters.map((parameter) => parameter.id)).toEqual(["scale"]);
    expect(exteriorAnglePhaseElevenConfig.invariants({ ax: 210, ay: 370, bx: 550, by: 365, cx: 370, cy: 165 })[0]?.label).toContain("exterior angle");
    expect(circleAreaUnrollingPhaseElevenConfig.liveValues({ radius: 5, sectors: 40 }).some((value) => String(value.value).includes("smooth"))).toBe(true);
  });
});

function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
