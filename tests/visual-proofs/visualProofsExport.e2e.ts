import { expect, test } from "@playwright/test";
import {
  expectNoBrowserErrorSurface,
  expectNonblankPrimaryVisual,
  expectProofShell,
  gotoOk,
} from "./visualProofsBrowserAssertions";
import { getExpectedSvgPngExportDimensions, inspectDownloadedPngArtifact } from "./visualProofsExportAssertions";

const exportRoutes = [
  "/visual-proofs/geometry/sector-area-formula",
  "/visual-proofs/trigonometry/unit-circle-sine-cosine",
  "/visual-proofs/coordinate-geometry/distance-formula",
  "/visual-proofs/statistics/linear-regression-least-squares",
  "/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field",
];

test.describe("Visual Proofs export controls", () => {
  for (const route of exportRoutes) {
    test(`${route} exposes JSON, SVG, and inspected PNG export controls`, async ({ page, context }, testInfo) => {
      test.setTimeout(60_000);
      await context.grantPermissions(["clipboard-write"]);
      await gotoOk(page, route);
      await expectNoBrowserErrorSurface(page);
      await expectProofShell(page);
      await expectNonblankPrimaryVisual(page);

      const snapshotPanel = page.getByTestId("visual-proof-snapshot-button");
      const jsonButton = page.getByTestId("visual-proof-json-export-button");
      const svgButton = page.getByTestId("visual-proof-svg-export-button");
      const pngButton = page.getByTestId("visual-proof-png-export-button");

      await expect(snapshotPanel).toBeVisible();
      await expect(jsonButton).toBeVisible();
      await expect(svgButton).toBeVisible();
      await expect(pngButton).toBeVisible();
      await expect(svgButton).toBeEnabled();
      await expect(pngButton).toBeEnabled();

      const expectedExportDimensions = await getExpectedSvgPngExportDimensions(page, route);

      await jsonButton.click();
      await expect(jsonButton).toContainText("Snapshot copied");

      const svgDownload = page.waitForEvent("download");
      await svgButton.click();
      const svg = await svgDownload;
      expect(svg.suggestedFilename()).toMatch(/\.svg$/);
      await expect(page.getByTestId("visual-proof-export-status")).toContainText("SVG downloaded");

      const pngDownload = page.waitForEvent("download");
      await pngButton.click();
      const png = await pngDownload;
      expect(png.suggestedFilename()).toMatch(/\.png$/);
      await expect(page.getByTestId("visual-proof-export-status")).toContainText("PNG downloaded");

      await inspectDownloadedPngArtifact({
        page,
        download: png,
        testInfo,
        route,
        expectedDimensions: expectedExportDimensions,
      });
    });
  }
});
