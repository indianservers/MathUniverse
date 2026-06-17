import { describe, expect, it } from "vitest";
import { phaseFourConfigs, phaseFourRouteSlugs } from "../proofs/phase-four/phaseFourProofConfigs";
import { getVisualProof } from "./visualProofsIndex";

const expectedModels: Record<string, string> = {
  "pythagorean-theorem-area-rearrangement": "area-rearrangement",
  "triangle-angle-sum": "angle-model",
  "circle-circumference-unwrapping": "measurement-scene",
  "difference-of-squares": "tile-model",
  "square-of-difference": "tile-model",
  "product-of-binomials": "tile-model",
};

describe("Visual Proofs phase four premium proof cluster", () => {
  it("marks all six phase four routes as upgraded with required metadata", () => {
    for (const [categorySlug, proofSlug] of phaseFourRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe(expectedModels[proofSlug]);
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
    }
  });

  it("adds prediction prompts and formula tokens to every phase four config", () => {
    for (const config of phaseFourConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(2);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(2);
      expect(config.invariants(values).some((invariant) => invariant.holds)).toBe(true);
    }
  });

  it("exposes required direct-manipulation parameters", () => {
    const ids = phaseFourConfigs.map((config) => config.parameters.map((parameter) => parameter.id));
    expect(ids[0]).toEqual(["a", "b"]);
    expect(ids[1]).toEqual(["ax", "ay", "bx", "by", "cx", "cy"]);
    expect(ids[2]).toEqual(["radius"]);
    expect(ids[3]).toEqual(["a", "b"]);
    expect(ids[4]).toEqual(["a", "b"]);
    expect(ids[5]).toEqual(["x", "a", "b"]);
  });
});
