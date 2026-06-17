import { describe, expect, it } from "vitest";
import {
  allCoordinateRouteSlugs,
  coordinatePythagoreanPhaseNineConfig,
  phaseNineConfigs,
  phaseNineRouteSlugs,
  pointSlopeLinePhaseNineConfig,
  reflectionAcrossAxesPhaseNineConfig,
  rotationAboutOriginPhaseNineConfig,
  scalingDilationOriginPhaseNineConfig,
  sectionFormulaPhaseNineConfig,
  triangleAreaCoordinatesPhaseNineConfig,
} from "../proofs/phase-nine/phaseNineProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const transformationSlugs = new Set(["translation-of-points", "reflection-across-axes", "rotation-about-origin", "scaling-dilation-origin"]);

describe("Visual Proofs phase nine coordinate geometry completion", () => {
  it("marks all seven phase nine routes as upgraded with required metadata", () => {
    for (const [categorySlug, proofSlug] of phaseNineRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe(transformationSlugs.has(proofSlug) ? "transformation-grid" : "coordinate-grid");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
    }
  });

  it("keeps all fifteen coordinate geometry routes phase-upgraded and in the smoke manifest", () => {
    const coordinateProofs = getVisualProofsByCategory("coordinate-geometry");
    expect(coordinateProofs).toHaveLength(15);
    expect(coordinateProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(coordinateProofs.every((proof) => (proof.misconceptionCheckCount ?? 0) >= 1)).toBe(true);
    expect(coordinateProofs.every((proof) => proof.hasTeacherMode && proof.hasKeyboardControls && proof.hasStateInspector && proof.hasOlympyardPracticeExit)).toBe(true);
    expect(visualProofsRouteSmokeManifest.map((entry) => entry.route)).toEqual(expect.arrayContaining(allCoordinateRouteSlugs.map(([category, slug]) => `/visual-proofs/${category}/${slug}`)));
  });

  it("adds prompts, misconception checks, formula tokens, live values, and invariants", () => {
    for (const config of phaseNineConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(5);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("exposes required special controls for phase nine concepts", () => {
    expect(sectionFormulaPhaseNineConfig.parameters.map((parameter) => parameter.id)).toEqual(["x1", "y1", "x2", "y2", "m", "n"]);
    expect(pointSlopeLinePhaseNineConfig.parameters.map((parameter) => parameter.id)).toEqual(["x1", "y1", "m", "x"]);
    expect(triangleAreaCoordinatesPhaseNineConfig.formulaTokens({}).map((token) => token.id)).toEqual(expect.arrayContaining(["term1", "term2", "term3", "half", "abs"]));
    expect(reflectionAcrossAxesPhaseNineConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "y", "axis"]);
    expect(rotationAboutOriginPhaseNineConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "y", "angle"]);
    expect(scalingDilationOriginPhaseNineConfig.parameters.map((parameter) => parameter.id)).toEqual(["x", "y", "k"]);
    expect(coordinatePythagoreanPhaseNineConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b"]);
  });
});
