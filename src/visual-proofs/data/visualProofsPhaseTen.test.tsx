import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import { generateSnapshotFilename, ensureSvgXmlNamespace, VISUAL_PROOF_SNAPSHOT_VERSION } from "../components/SnapshotExportButton";
import { phaseTwoConfigs, phaseTwoRouteSlugs } from "../proofs/phase-two/phaseTwoProofConfigs";
import { phaseFourConfigs, phaseFourRouteSlugs } from "../proofs/phase-four/phaseFourProofConfigs";
import { phaseFiveConfigs, phaseFiveRouteSlugs } from "../proofs/phase-five/phaseFiveProofConfigs";
import { phaseSixConfigs, phaseSixRouteSlugs } from "../proofs/phase-six/phaseSixProofConfigs";
import { phaseSevenConfigs, phaseSevenRouteSlugs } from "../proofs/phase-seven/phaseSevenProofConfigs";
import { phaseEightConfigs, phaseEightRouteSlugs } from "../proofs/phase-eight/phaseEightProofConfigs";
import { allCoordinateRouteSlugs, phaseNineConfigs, phaseNineRouteSlugs } from "../proofs/phase-nine/phaseNineProofConfigs";
import { phaseElevenConfigs, phaseElevenRouteSlugs } from "../proofs/phase-eleven/phaseElevenProofConfigs";
import { phaseTwelveConfigs, phaseTwelveRouteSlugs } from "../proofs/phase-twelve/phaseTwelveProofConfigs";
import { phaseThirteenConfigs, phaseThirteenRouteSlugs } from "../proofs/phase-thirteen/phaseThirteenProofConfigs";
import { phaseFourteenConfigs, phaseFourteenRouteSlugs } from "../proofs/phase-fourteen/phaseFourteenProofConfigs";
import { phaseFifteenConfigs, phaseFifteenRouteSlugs } from "../proofs/phase-fifteen/phaseFifteenProofConfigs";
import { phaseSixteenConfigs, phaseSixteenRouteSlugs } from "../proofs/phase-sixteen/phaseSixteenProofConfigs";
import { phaseSeventeenConfigs, phaseSeventeenRouteSlugs } from "../proofs/phase-seventeen/phaseSeventeenProofConfigs";
import { phaseEighteenConfigs, phaseEighteenRouteSlugs } from "../proofs/phase-eighteen/phaseEighteenProofConfigs";
import { phaseNineteenConfigs, phaseNineteenRouteSlugs } from "../proofs/phase-nineteen/phaseNineteenProofConfigs";
import { phaseTwentyConfigs, phaseTwentyRouteSlugs } from "../proofs/phase-twenty/phaseTwentyProofConfigs";
import { phaseTwentyOneConfigs, phaseTwentyOneRouteSlugs } from "../proofs/phase-twenty-one/phaseTwentyOneProofConfigs";
import { phaseTwentyTwoConfigs, phaseTwentyTwoRouteSlugs } from "../proofs/phase-twenty-two/phaseTwentyTwoProofConfigs";
import { phaseTwentyThreeConfigs, phaseTwentyThreeRouteSlugs } from "../proofs/phase-twenty-three/phaseTwentyThreeProofConfigs";
import { phaseTwentyFourConfigs, phaseTwentyFourRouteSlugs } from "../proofs/phase-twenty-four/phaseTwentyFourProofConfigs";
import { phaseTwentyFiveConfigs, phaseTwentyFiveRouteSlugs } from "../proofs/phase-twenty-five/phaseTwentyFiveProofConfigs";
import { phaseTwentySixConfigs, phaseTwentySixRouteSlugs } from "../proofs/phase-twenty-six/phaseTwentySixProofConfigs";
import { phaseTwentySevenConfigs, phaseTwentySevenRouteSlugs } from "../proofs/phase-twenty-seven/phaseTwentySevenProofConfigs";
import { getVisualProofComponentLoader } from "../proofs/loadVisualProofComponent";
import type { ProofLearningModel } from "./proofTypes";
import { visualProofsIndex, getVisualProofsByCategory } from "./visualProofsIndex";
import { coordinateGeometryRouteSmokeManifest, trigonometryRouteSmokeManifest, visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const supportedLearningModels = new Set<ProofLearningModel>([
  "area-rearrangement",
  "tile-model",
  "angle-model",
  "coordinate-grid",
  "graph-limit",
  "number-model",
  "pattern-model",
  "simulation-board",
  "data-display",
  "vector-field",
  "complex-plane",
  "measurement-scene",
  "comparison-model",
  "transformation-grid",
  "growth-scale",
  "applied-system",
]);

const allTrigRouteSlugs = [...phaseFiveRouteSlugs, ...phaseSixRouteSlugs, ...phaseSevenRouteSlugs];
const allPhaseRouteGroups = [
  phaseTwoRouteSlugs,
  phaseFourRouteSlugs,
  phaseFiveRouteSlugs,
  phaseSixRouteSlugs,
  phaseSevenRouteSlugs,
  phaseEightRouteSlugs,
  phaseNineRouteSlugs,
  phaseElevenRouteSlugs,
  phaseTwelveRouteSlugs,
  phaseThirteenRouteSlugs,
  phaseFourteenRouteSlugs,
  phaseFifteenRouteSlugs,
  phaseSixteenRouteSlugs,
  phaseSeventeenRouteSlugs,
  phaseEighteenRouteSlugs,
  phaseNineteenRouteSlugs,
  phaseTwentyRouteSlugs,
  phaseTwentyOneRouteSlugs,
  phaseTwentyTwoRouteSlugs,
  phaseTwentyThreeRouteSlugs,
  phaseTwentyFourRouteSlugs,
  phaseTwentyFiveRouteSlugs,
  phaseTwentySixRouteSlugs,
  phaseTwentySevenRouteSlugs,
];

type RouteSlug = readonly [string, string];

const configEntries: Array<[RouteSlug, PhaseTwoProofConfig]> = [
  ...zip(phaseTwoRouteSlugs, phaseTwoConfigs),
  ...zip(phaseFourRouteSlugs, phaseFourConfigs),
  ...zip(phaseFiveRouteSlugs, phaseFiveConfigs),
  ...zip(phaseSixRouteSlugs, phaseSixConfigs),
  ...zip(phaseSevenRouteSlugs, phaseSevenConfigs),
  ...zip(phaseEightRouteSlugs, phaseEightConfigs),
  ...zip(phaseNineRouteSlugs, phaseNineConfigs),
  ...zip(phaseElevenRouteSlugs, phaseElevenConfigs),
  ...zip(phaseTwelveRouteSlugs, phaseTwelveConfigs),
  ...zip(phaseThirteenRouteSlugs, phaseThirteenConfigs),
  ...zip(phaseFourteenRouteSlugs, phaseFourteenConfigs),
  ...zip(phaseFifteenRouteSlugs, phaseFifteenConfigs),
  ...zip(phaseSixteenRouteSlugs, phaseSixteenConfigs),
  ...zip(phaseSeventeenRouteSlugs, phaseSeventeenConfigs),
  ...zip(phaseEighteenRouteSlugs, phaseEighteenConfigs),
  ...zip(phaseNineteenRouteSlugs, phaseNineteenConfigs),
  ...zip(phaseTwentyRouteSlugs, phaseTwentyConfigs),
  ...zip(phaseTwentyOneRouteSlugs, phaseTwentyOneConfigs),
  ...zip(phaseTwentyTwoRouteSlugs, phaseTwentyTwoConfigs),
  ...zip(phaseTwentyThreeRouteSlugs, phaseTwentyThreeConfigs),
  ...zip(phaseTwentyFourRouteSlugs, phaseTwentyFourConfigs),
  ...zip(phaseTwentyFiveRouteSlugs, phaseTwentyFiveConfigs),
  ...zip(phaseTwentySixRouteSlugs, phaseTwentySixConfigs),
  ...zip(phaseTwentySevenRouteSlugs, phaseTwentySevenConfigs),
];

const configByRoute = new Map(configEntries.map(([[categorySlug, proofSlug], config]) => [`/visual-proofs/${categorySlug}/${proofSlug}`, config]));
const phaseUpgradedProofs = visualProofsIndex.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded");

describe("Visual Proofs phase ten final metadata and smoke audit", () => {
  it("includes every phase-upgraded proof in the route smoke manifest", () => {
    const manifestRoutes = new Set(visualProofsRouteSmokeManifest.map((entry) => entry.route));
    expect(phaseUpgradedProofs.length).toBeGreaterThanOrEqual(183);
    for (const proof of phaseUpgradedProofs) {
      expect(manifestRoutes.has(proof.route), proof.route).toBe(true);
    }
  });

  it("keeps core metadata complete for every phase-upgraded proof", () => {
    for (const proof of phaseUpgradedProofs) {
      expect(proof.route, proof.title).toBe(`/visual-proofs/${proof.categorySlug}/${proof.slug}`);
      expect(proof.title).toBeTruthy();
      expect(proof.categorySlug).toBeTruthy();
      expect(proof.proofLearningModel && supportedLearningModels.has(proof.proofLearningModel)).toBe(true);
      expect(proof.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof.hasTeacherMode).toBe(true);
      expect(proof.hasKeyboardControls).toBe(true);
      expect(proof.hasStateInspector).toBe(true);
      expect(proof.hasOlympyardPracticeExit).toBe(true);
      expect(proof.hasFormulaTokens).toBe(true);
      expect(proof.hasPredictionPrompt).toBe(true);
      expect(proof.hasSnapshotSupport).toBe(true);
      expect(proof.hasVisualRegressionTest).toBe(false);
    }
  });

  it("keeps every phase-upgraded proof backed by prompt, misconception, formula, values, and invariant config", () => {
    for (const proof of phaseUpgradedProofs) {
      const config = configByRoute.get(proof.route);
      expect(config, proof.route).toBeTruthy();
      if (!config) continue;

      const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
      expect(config.prediction.question, proof.route).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct), proof.route).toBe(true);
      expect(config.misconception.options.some((option) => option.correct), proof.route).toBe(true);
      expect(config.formulaTokens(values).length, proof.route).toBeGreaterThan(0);
      expect(config.liveValues(values).length, proof.route).toBeGreaterThan(0);
      expect(config.invariants(values).length, proof.route).toBeGreaterThan(0);
    }
  });

  it("exposes manifest visual, control, formula, inspector, and snapshot expectations", () => {
    for (const entry of visualProofsRouteSmokeManifest) {
      expect(entry.expectedVisualKind, entry.route).toBe("svg");
      expect(entry.expectedPrimarySelector, entry.route).toBe('[data-testid="visual-proof-primary-visual"] svg');
      expect(entry.expectedMinimumVisualElements, entry.route).toBeGreaterThanOrEqual(3);
      expect(entry.expectedControls, entry.route).toEqual(expect.arrayContaining(["previous", "next", "reset", "labels", "formula", "reveal", "challenge", "teacher"]));
      expect(entry.expectedFormulaTokens, entry.route).toEqual(expect.arrayContaining(["formula-token-list", "visual-highlight-target"]));
      expect(entry.expectedInspectorValues, entry.route).toEqual(expect.arrayContaining(["Parameters", "Live values", "Invariants"]));
      expect(entry.hasTeacherMode && entry.hasKeyboardControls && entry.hasStateInspector && entry.hasOlympyardPracticeExit, entry.route).toBe(true);
      expect(entry.hasSnapshotSupport, entry.route).toBe(true);
      expect(entry.hasVisualRegressionTest, entry.route).toBe(false);
    }
  });

  it("keeps every phase-upgraded component key mapped in the lazy proof resolver", () => {
    for (const proof of phaseUpgradedProofs) {
      expect(getVisualProofComponentLoader(proof.categorySlug, proof.componentKey), proof.componentKey).toEqual(expect.any(Function));
    }
  });

  it("keeps trigonometry and coordinate geometry fully phase-upgraded", () => {
    const trigProofs = getVisualProofsByCategory("trigonometry").filter((proof) => proof.status === "available");
    const coordinateProofs = getVisualProofsByCategory("coordinate-geometry").filter((proof) => proof.status === "available");
    expect(trigProofs).toHaveLength(15);
    expect(coordinateProofs).toHaveLength(15);
    expect(trigProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(coordinateProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(trigonometryRouteSmokeManifest.map((entry) => entry.route)).toEqual(expect.arrayContaining(allTrigRouteSlugs.map(routeFromSlug)));
    expect(coordinateGeometryRouteSmokeManifest.map((entry) => entry.route)).toEqual(expect.arrayContaining(allCoordinateRouteSlugs.map(routeFromSlug)));
  });

  it("keeps Phase 2 through Phase 9 route groups present in the manifest", () => {
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    for (const routeGroup of allPhaseRouteGroups) {
      expect(manifestRoutes).toEqual(expect.arrayContaining(routeGroup.map(routeFromSlug)));
    }
  });

  it("does not claim route-level visual regression coverage until browser tests are mapped per route", () => {
    const packageJson = readFileSync(fileURLToPath(new URL("../../../package.json", import.meta.url)), "utf8");
    const browserVisualRunnerConfigured = /playwright|cypress/.test(packageJson);
    expect(browserVisualRunnerConfigured).toBe(true);
    expect(phaseUpgradedProofs.some((proof) => proof.hasVisualRegressionTest)).toBe(false);
  });

  it("generates stable teacher snapshot filenames and SVG namespaces", () => {
    expect(VISUAL_PROOF_SNAPSHOT_VERSION).toBe("visual-proof-snapshot-v1");
    expect(generateSnapshotFilename("/visual-proofs/trigonometry/arc-length-formula", "2026-06-17T10:20:30.400Z", "svg")).toBe("arc-length-formula-2026-06-17T10-20-30-400Z.svg");
    expect(ensureSvgXmlNamespace("<svg viewBox=\"0 0 10 10\"></svg>")).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(ensureSvgXmlNamespace('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBe('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  });
});

function zip<T, U>(left: readonly T[], right: readonly U[]): Array<[T, U]> {
  return left.map((item, index) => [item, right[index]]);
}

function routeFromSlug([categorySlug, proofSlug]: RouteSlug) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}
