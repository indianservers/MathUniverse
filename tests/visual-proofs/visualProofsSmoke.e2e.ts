import { expect, test } from "@playwright/test";
import { visualProofCategories } from "../../src/visual-proofs/data/visualProofCategories";
import {
  visualProofsRepresentativeSmokeRoutes,
} from "../../src/visual-proofs/data/visualProofsRouteSmokeList";
import { visualProofsIndex } from "../../src/visual-proofs/data/visualProofsIndex";
import type { VisualProofComponentKey } from "../../src/visual-proofs/data/proofTypes";
import {
  expectNoBrowserErrorSurface,
  expectNonblankPrimaryVisual,
  expectProofShell,
  gotoOk,
} from "./visualProofsBrowserAssertions";

const categoryRoutes = visualProofCategories.map((category) => ({
  label: category.title,
  route: `/visual-proofs/${category.slug}`,
}));

const representativeRoutes = visualProofsRepresentativeSmokeRoutes.map((route) => ({
  label: route.split("/").slice(-2).join("/"),
  route,
}));

const denseMobileComponentKeys: Array<{ label: string; componentKey: VisualProofComponentKey }> = [
  { label: "calculus graph route", componentKey: "RiemannSumsAreaUnderCurveProof" },
  { label: "conic route", componentKey: "ParabolaFocusDirectrixProof" },
  { label: "engineering mathematics route", componentKey: "FirstOrderDifferentialEquationSlopeFieldProof" },
  { label: "statistics regression route", componentKey: "LinearRegressionLeastSquaresProof" },
  { label: "vector route", componentKey: "DotProductAsProjectionProof" },
  { label: "complex route", componentKey: "ComplexMultiplicationRotationScalingProof" },
  { label: "coordinate geometry route", componentKey: "DistanceFormulaProof" },
  { label: "trigonometry route", componentKey: "TrigGraphsFromUnitCircleProof" },
];

const denseMobileRoutes = denseMobileComponentKeys.map(({ label, componentKey }) => {
  const proof = visualProofsIndex.find((item) => item.componentKey === componentKey);
  if (!proof) throw new Error(`Missing Visual Proof smoke route for ${componentKey}`);
  return { label, route: proof.route };
});

const mobileViewports = [
  { width: 320, height: 900 },
  { width: 375, height: 900 },
  { width: 390, height: 900 },
  { width: 430, height: 900 },
  { width: 768, height: 1024 },
];

test.describe("Visual Proofs browser smoke", () => {
  test("loads the Visual Proofs hub", async ({ page }) => {
    await gotoOk(page, "/visual-proofs");

    await expect(page.getByRole("heading", { name: /visual proofs/i })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Proof not found");
    await expect(page.locator("body")).not.toContainText("Internal server error");
  });

  test("loads every Visual Proofs category page", async ({ page }) => {
    test.setTimeout(60_000);

    for (const { label, route } of categoryRoutes) {
      await gotoOk(page, route);

      await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible();
      await expect(page.locator("body")).not.toContainText("Proof not found");
    }
  });

  test("renders one representative proof shell and nonblank visual per category", async ({ page }) => {
    test.setTimeout(180_000);

    for (const { route } of representativeRoutes) {
      await gotoOk(page, route);
      await expectNoBrowserErrorSurface(page);
      await expectProofShell(page);
      await expectNonblankPrimaryVisual(page);
    }
  });

  for (const viewport of mobileViewports) {
    test(`mobile dense-route smoke has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize(viewport);

      for (const { route } of denseMobileRoutes) {
        await gotoOk(page, route);
        await expectProofShell(page, { expectSnapshotExport: false });
        await expectNonblankPrimaryVisual(page);

        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(horizontalOverflow, route).toBeLessThanOrEqual(4);
      }
    });
  }
});
