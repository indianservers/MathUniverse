import { describe, expect, it } from "vitest";
import { visualProofsIndex } from "./visualProofsIndex";
import {
  visualProofsBrowserCoverage,
  visualProofsBrowserCoverageByRoute,
} from "./visualProofsBrowserCoverage";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

const phaseUpgradedProofs = visualProofsIndex.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded");

describe("Visual Proofs browser coverage map", () => {
  it("maps every phase-upgraded route to the full-matrix browser smoke", () => {
    expect(visualProofsBrowserCoverage).toHaveLength(184);
    expect(visualProofsBrowserCoverage).toHaveLength(phaseUpgradedProofs.length);
    expect(visualProofsBrowserCoverage).toHaveLength(visualProofsRouteSmokeManifest.length);

    const coverageRoutes = visualProofsBrowserCoverage.map((coverage) => coverage.route).sort();
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route).sort();
    const indexRoutes = phaseUpgradedProofs.map((proof) => proof.route).sort();

    expect(coverageRoutes).toEqual(manifestRoutes);
    expect(coverageRoutes).toEqual(indexRoutes);
  });

  it("records Chromium nonblank DOM coverage without claiming screenshot baselines", () => {
    for (const coverage of visualProofsBrowserCoverage) {
      expect(coverage.coverageLevel, coverage.route).toBe("nonblank-dom");
      expect(coverage.browser, coverage.route).toBe("chromium");
      expect(coverage.testFile, coverage.route).toBe("tests/visual-proofs/visualProofsFullMatrix.e2e.ts");
      expect(coverage.hasSnapshotControlCheck, coverage.route).toBe(true);
    }

    expect(visualProofsBrowserCoverage.some((coverage) => coverage.coverageLevel === "screenshot-baseline")).toBe(false);
    expect(phaseUpgradedProofs.some((proof) => proof.hasVisualRegressionTest)).toBe(false);
    expect(visualProofsRouteSmokeManifest.some((entry) => entry.hasVisualRegressionTest)).toBe(false);
  });

  it("keeps mobile coverage explicit and limited to dense smoke routes", () => {
    const mobileCoveredRoutes = visualProofsBrowserCoverage.filter((coverage) => coverage.hasMobileCoverage);

    expect(mobileCoveredRoutes).toHaveLength(8);
    expect(mobileCoveredRoutes.map((coverage) => coverage.route)).toEqual(
      expect.arrayContaining([
        "/visual-proofs/calculus/riemann-sums-area-under-curve",
        "/visual-proofs/conic-sections/parabola-focus-directrix",
        "/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field",
        "/visual-proofs/statistics/linear-regression-least-squares",
        "/visual-proofs/vectors/dot-product-as-projection",
        "/visual-proofs/complex-numbers/complex-multiplication-rotation-scaling",
        "/visual-proofs/coordinate-geometry/distance-formula",
        "/visual-proofs/trigonometry/trig-graphs-from-unit-circle",
      ]),
    );
  });

  it("supports direct lookup by route", () => {
    for (const proof of phaseUpgradedProofs) {
      expect(visualProofsBrowserCoverageByRoute.get(proof.route)?.category, proof.route).toBe(proof.categorySlug);
    }
  });
});
