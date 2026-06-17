import { describe, expect, it } from "vitest";
import { phaseFiveConfigs, phaseFiveRouteSlugs, tangentRatioIdentityPhaseFiveConfig } from "../proofs/phase-five/phaseFiveProofConfigs";
import { phaseFiveTraceConfig } from "../proofs/phase-five/PhaseFiveTrigVisualModels";
import { getVisualProof } from "./visualProofsIndex";

const expectedModels: Record<string, string> = {
  "right-triangle-trig-ratios": "angle-model",
  "unit-circle-sine-cosine": "angle-model",
  "pythagorean-trig-identity": "angle-model",
  "tangent-ratio-identity": "angle-model",
  "radians-arc-radius": "measurement-scene",
  "trig-graphs-from-unit-circle": "graph-limit",
};

describe("Visual Proofs phase five trigonometry proof cluster", () => {
  it("marks all six phase five routes as upgraded with required metadata", () => {
    for (const [categorySlug, proofSlug] of phaseFiveRouteSlugs) {
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

  it("adds prediction prompts, misconception checks, formula tokens, and theta controls", () => {
    for (const config of phaseFiveConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.parameters.some((parameter) => parameter.id === "theta")).toBe(true);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes tangent undefined warnings and graph trace configuration", () => {
    const nearVertical = tangentRatioIdentityPhaseFiveConfig.liveValues({ theta: 90 });
    expect(nearVertical.some((value) => value.warning?.includes("undefined") || value.warning?.includes("near 0"))).toBe(true);
    expect(phaseFiveTraceConfig.graph).toBe("sine-from-unit-circle");
    expect(phaseFiveTraceConfig.keyTicks).toEqual(["0", "pi/2", "pi", "3pi/2", "2pi"]);
    expect(phaseFiveTraceConfig.model).toBe("graph-limit");
  });
});
