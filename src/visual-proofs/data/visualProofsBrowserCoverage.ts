import { visualProofsIndex } from "./visualProofsIndex";

export type VisualProofBrowserCoverageLevel = "none" | "smoke" | "nonblank-dom" | "screenshot-baseline";

export type VisualProofBrowserCoverage = {
  route: string;
  category: string;
  coverageLevel: VisualProofBrowserCoverageLevel;
  browser: "chromium";
  testFile: string;
  hasMobileCoverage: boolean;
  hasSnapshotControlCheck: boolean;
};

const mobileCoveredComponentKeys = new Set([
  "RiemannSumsAreaUnderCurveProof",
  "ParabolaFocusDirectrixProof",
  "FirstOrderDifferentialEquationSlopeFieldProof",
  "LinearRegressionLeastSquaresProof",
  "DotProductAsProjectionProof",
  "ComplexMultiplicationRotationScalingProof",
  "DistanceFormulaProof",
  "TrigGraphsFromUnitCircleProof",
]);

export const visualProofsBrowserCoverage: VisualProofBrowserCoverage[] = visualProofsIndex
  .filter((proof) => proof.proofUpgradeStatus === "phase-upgraded")
  .map((proof) => ({
    route: proof.route,
    category: proof.categorySlug,
    coverageLevel: "nonblank-dom",
    browser: "chromium",
    testFile: "tests/visual-proofs/visualProofsFullMatrix.e2e.ts",
    hasMobileCoverage: mobileCoveredComponentKeys.has(proof.componentKey),
    hasSnapshotControlCheck: proof.hasSnapshotSupport === true,
  }));

export const visualProofsBrowserCoverageByRoute = new Map(
  visualProofsBrowserCoverage.map((coverage) => [coverage.route, coverage]),
);
