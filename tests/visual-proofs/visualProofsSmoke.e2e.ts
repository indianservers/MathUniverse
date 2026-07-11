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

const categoryRoutes = visualProofCategories.map((category) => {
  const proofs = visualProofsIndex.filter((proof) => proof.categorySlug === category.slug);
  return {
    label: category.title,
    route: `/visual-proofs/${category.slug}`,
    availableProofCount: proofs.filter((proof) => proof.status === "available").length,
    plannedProofCount: proofs.filter((proof) => proof.status === "coming-soon").length,
  };
});

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

  for (const { availableProofCount, label, plannedProofCount, route } of categoryRoutes) {
    test(`loads Visual Proofs category page: ${label}`, async ({ page }) => {
      await gotoOk(page, route);

      await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible();
      await expectNoBrowserErrorSurface(page);
      await expect(page.locator("body")).not.toContainText("Proof not found");
      await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

      if (availableProofCount > 0) {
        await expect(page.getByRole("link", { name: /Open Proof/i }).first()).toBeVisible();
      }

      if (plannedProofCount > 0 && (await page.getByRole("heading", { name: "Planned proofs", exact: true }).count()) > 0) {
        await expect(page.getByRole("link", { name: /Open Roadmap/i }).first()).toBeVisible();
      }
    });
  }

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
    for (const { label, route } of denseMobileRoutes) {
      test(`mobile dense-route smoke has no horizontal overflow at ${viewport.width}px: ${label}`, async ({ page }) => {
        test.setTimeout(45_000);
        await page.setViewportSize(viewport);

        await gotoOk(page, route);
        await expectProofShell(page, { expectSnapshotExport: false });
        await expectNonblankPrimaryVisual(page);

        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(horizontalOverflow, `${route} at ${viewport.width}px`).toBeLessThanOrEqual(4);
      });
    }
  }
});
