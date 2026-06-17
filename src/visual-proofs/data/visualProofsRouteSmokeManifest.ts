import { visualProofsIndex } from "./visualProofsIndex";
import type { VisualProofExpectedVisualKind } from "./proofTypes";

export type VisualProofRouteSmokeEntry = {
  route: string;
  title: string;
  category: string;
  learningModel: string;
  expectedControls: string[];
  expectedFormulaTokens: string[];
  expectedInspectorValues: string[];
  expectedVisualKind: VisualProofExpectedVisualKind;
  expectedPrimarySelector: string;
  expectedMinimumVisualElements: number;
  expectedInteractiveControls: string[];
  hasTeacherMode: boolean;
  hasKeyboardControls: boolean;
  hasStateInspector: boolean;
  hasOlympyardPracticeExit: boolean;
  hasSnapshotSupport: boolean;
  hasVisualRegressionTest: boolean;
};

const standardControls = ["previous", "next", "reset", "labels", "formula", "reveal", "challenge", "teacher"];
const standardInspectorValues = ["Parameters", "Live values", "Invariants"];

export const visualProofsRouteSmokeManifest: VisualProofRouteSmokeEntry[] = visualProofsIndex
  .filter((proof) => proof.proofUpgradeStatus === "phase-upgraded")
  .map((proof) => ({
    route: proof.route,
    title: proof.title,
    category: proof.categorySlug,
    learningModel: proof.proofLearningModel ?? "applied-system",
    expectedControls: proof.expectedInteractiveControls ?? standardControls,
    expectedFormulaTokens: ["formula-token-list", "visual-highlight-target"],
    expectedInspectorValues: standardInspectorValues,
    expectedVisualKind: proof.expectedVisualKind ?? "svg",
    expectedPrimarySelector: proof.expectedPrimarySelector ?? '[data-testid="visual-proof-primary-visual"] svg',
    expectedMinimumVisualElements: proof.expectedMinimumVisualElements ?? 3,
    expectedInteractiveControls: proof.expectedInteractiveControls ?? standardControls,
    hasTeacherMode: proof.hasTeacherMode === true,
    hasKeyboardControls: proof.hasKeyboardControls === true,
    hasStateInspector: proof.hasStateInspector === true,
    hasOlympyardPracticeExit: proof.hasOlympyardPracticeExit === true,
    hasSnapshotSupport: proof.hasSnapshotSupport === true,
    hasVisualRegressionTest: proof.hasVisualRegressionTest === true,
  }));

export const trigonometryRouteSmokeManifest = visualProofsRouteSmokeManifest.filter((entry) => entry.category === "trigonometry");
export const coordinateGeometryRouteSmokeManifest = visualProofsRouteSmokeManifest.filter((entry) => entry.category === "coordinate-geometry");
