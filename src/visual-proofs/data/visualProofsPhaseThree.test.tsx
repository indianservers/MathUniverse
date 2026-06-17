import { describe, expect, it } from "vitest";
import {
  naturalNumberSumPhaseTwoConfig,
  oddNumberSumPhaseTwoConfig,
  parallelogramAreaPhaseTwoConfig,
  phaseTwoRouteSlugs,
  squareOfSumPhaseTwoConfig,
  triangleAreaPhaseTwoConfig,
} from "../proofs/phase-two/phaseTwoProofConfigs";
import { getVisualProof } from "./visualProofsIndex";

const phaseThreeConfigs = [
  naturalNumberSumPhaseTwoConfig,
  oddNumberSumPhaseTwoConfig,
  triangleAreaPhaseTwoConfig,
  parallelogramAreaPhaseTwoConfig,
  squareOfSumPhaseTwoConfig,
];

describe("Visual Proofs phase three learning intelligence", () => {
  it("keeps the five upgraded routes phase-ready in metadata", () => {
    for (const [categorySlug, proofSlug] of phaseTwoRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
    }
  });

  it("adds prediction prompts, misconception options, and formula tokens to every phase three proof", () => {
    for (const config of phaseThreeConfigs) {
      const defaultValues = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.misconception.explanation.length).toBeGreaterThan(20);
      expect(config.formulaTokens(defaultValues).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps required Phase 3 drag parameters available for targeted proofs", () => {
    expect(triangleAreaPhaseTwoConfig.parameters.map((parameter) => parameter.id)).toEqual(["base", "height"]);
    expect(parallelogramAreaPhaseTwoConfig.parameters.map((parameter) => parameter.id)).toContain("slant");
    expect(squareOfSumPhaseTwoConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b"]);
  });
});
