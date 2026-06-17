import { describe, expect, it } from "vitest";
import { phaseSixConfigs, phaseSixRouteSlugs, cosineAngleAdditionPhaseSixConfig, doubleAngleIdentitiesPhaseSixConfig, sineRulePhaseSixConfig, cosineRulePhaseSixConfig } from "../proofs/phase-six/phaseSixProofConfigs";
import { phaseSixDoubleAngleTabs } from "../proofs/phase-six/PhaseSixTrigVisualModels";
import { getVisualProof } from "./visualProofsIndex";

describe("Visual Proofs phase six advanced trigonometry cluster", () => {
  it("marks all seven phase six routes as upgraded angle-model proofs with required metadata", () => {
    for (const [categorySlug, proofSlug] of phaseSixRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("angle-model");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
    }
  });

  it("adds prediction prompts, misconception checks, formula tokens, values, and invariants", () => {
    for (const config of phaseSixConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes two-angle, triangle, and double-angle interaction contracts", () => {
    expect(cosineAngleAdditionPhaseSixConfig.parameters.map((parameter) => parameter.id)).toEqual(["A", "B"]);
    expect(sineRulePhaseSixConfig.parameters.map((parameter) => parameter.id)).toEqual(["ax", "ay", "bx", "by", "cx", "cy"]);
    expect(cosineRulePhaseSixConfig.parameters.map((parameter) => parameter.id)).toEqual(["a", "b", "C"]);
    expect(doubleAngleIdentitiesPhaseSixConfig.parameters.map((parameter) => parameter.id)).toEqual(["theta"]);
    expect(phaseSixDoubleAngleTabs).toEqual(["sin(2theta)", "cos(2theta)", "alternate cosine forms"]);
  });
});
