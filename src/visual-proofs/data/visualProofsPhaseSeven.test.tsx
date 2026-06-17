import { describe, expect, it } from "vitest";
import { phaseFiveConfigs, phaseFiveRouteSlugs, tangentRatioIdentityPhaseFiveConfig, radiansArcRadiusPhaseFiveConfig } from "../proofs/phase-five/phaseFiveProofConfigs";
import { phaseFiveTraceConfig } from "../proofs/phase-five/PhaseFiveTrigVisualModels";
import { phaseSixConfigs, phaseSixRouteSlugs } from "../proofs/phase-six/phaseSixProofConfigs";
import { arcLengthFormulaPhaseSevenConfig, phaseSevenConfigs, phaseSevenRouteSlugs, smallAngleApproximationPhaseSevenConfig } from "../proofs/phase-seven/phaseSevenProofConfigs";
import { approximationStatus, phaseSevenBrowserSmokeStatus } from "../proofs/phase-seven/PhaseSevenTrigVisualModels";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { trigonometryRouteSmokeManifest, visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const allTrigRouteSlugs = [...phaseFiveRouteSlugs, ...phaseSixRouteSlugs, ...phaseSevenRouteSlugs];
const allTrigConfigs = [...phaseFiveConfigs, ...phaseSixConfigs, ...phaseSevenConfigs];

describe("Visual Proofs phase seven trigonometry completion", () => {
  it("upgrades small-angle approximation and arc length formula with complete metadata", () => {
    for (const [categorySlug, proofSlug] of phaseSevenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("measurement-scene");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
    }
  });

  it("confirms all fifteen trigonometry routes are now phase-upgraded and config-backed", () => {
    const trigProofs = getVisualProofsByCategory("trigonometry").filter((proof) => proof.status === "available");
    expect(trigProofs).toHaveLength(15);
    expect(allTrigRouteSlugs).toHaveLength(15);
    expect(allTrigConfigs).toHaveLength(15);
    for (const proof of trigProofs) {
      expect(proof.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof.proofLearningModel).toBeTruthy();
      expect(proof.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof.hasKeyboardControls).toBe(true);
      expect(proof.hasStateInspector).toBe(true);
      expect(proof.hasTeacherMode).toBe(true);
      expect(proof.hasOlympyardPracticeExit).toBe(true);
    }
    for (const config of allTrigConfigs) {
      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question).toContain("?");
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
    }
  });

  it("checks special trigonometry warnings and smoke manifest foundation", () => {
    const smallValues = { theta: 28 };
    expect(smallAngleApproximationPhaseSevenConfig.liveValues(smallValues).some((value) => value.warning?.includes("Approximation"))).toBe(true);
    expect(smallAngleApproximationPhaseSevenConfig.assumptions.some((assumption) => assumption.includes("radians"))).toBe(true);
    expect(approximationStatus(2)).toBe("excellent");
    expect(tangentRatioIdentityPhaseFiveConfig.liveValues({ theta: 90 }).some((value) => value.warning?.includes("undefined") || value.warning?.includes("near 0"))).toBe(true);
    expect(radiansArcRadiusPhaseFiveConfig.parameters.map((parameter) => parameter.id)).toEqual(["theta", "radius"]);
    expect(arcLengthFormulaPhaseSevenConfig.parameters.map((parameter) => parameter.id)).toEqual(["theta", "radius"]);
    expect(phaseFiveTraceConfig.model).toBe("graph-limit");
    expect(phaseSevenBrowserSmokeStatus).toBe("metadata-manifest-no-browser-framework");
    expect(visualProofsRouteSmokeManifest.length).toBeGreaterThanOrEqual(20);
    expect(trigonometryRouteSmokeManifest.map((entry) => entry.route)).toEqual(expect.arrayContaining(allTrigRouteSlugs.map(([category, slug]) => `/visual-proofs/${category}/${slug}`)));
  });
});
