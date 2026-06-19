import { expect, test } from "@playwright/test";
import {
  type VisualProofRouteSmokeEntry,
  visualProofsRouteSmokeManifest,
} from "../../src/visual-proofs/data/visualProofsRouteSmokeManifest";
import {
  expectNoBrowserErrorSurface,
  expectNonblankPrimaryVisual,
  expectProofShell,
  gotoOk,
} from "./visualProofsBrowserAssertions";
import { getExpectedSvgPngExportDimensions, inspectDownloadedPngArtifact } from "./visualProofsExportAssertions";

const exportableSvgRoutes = visualProofsRouteSmokeManifest.filter((entry) => entry.expectedVisualKind === "svg");

const routesByCategory = exportableSvgRoutes.reduce<Record<string, VisualProofRouteSmokeEntry[]>>((groups, entry) => {
  groups[entry.category] = [...(groups[entry.category] ?? []), entry];
  return groups;
}, {});

test.describe("Visual Proofs full PNG export artifact matrix", () => {
  for (const [category, routes] of Object.entries(routesByCategory)) {
    test(`${category} SVG-backed proof routes export valid nonblank PNG artifacts`, async ({ page }, testInfo) => {
      test.setTimeout(Math.max(120_000, routes.length * 30_000));

      for (const routeEntry of routes) {
        await test.step(routeEntry.route, async () => {
          await gotoOk(page, routeEntry.route);
          await expectNoBrowserErrorSurface(page);
          await expectProofShell(page);
          await expectNonblankPrimaryVisual(page, {
            expectedMinimumVisualElements: routeEntry.expectedMinimumVisualElements,
          });

          const svgButton = page.getByTestId("visual-proof-svg-export-button");
          const pngButton = page.getByTestId("visual-proof-png-export-button");

          await expect(svgButton, `${routeEntry.route} should expose SVG export`).toBeVisible();
          await expect(pngButton, `${routeEntry.route} should expose PNG export`).toBeVisible();
          await expect(svgButton, `${routeEntry.route} SVG export should be enabled`).toBeEnabled();
          await expect(pngButton, `${routeEntry.route} PNG export should be enabled`).toBeEnabled();

          const expectedExportDimensions = await getExpectedSvgPngExportDimensions(page, routeEntry.route);

          const pngDownload = page.waitForEvent("download");
          await pngButton.click();
          const png = await pngDownload;
          await expect(page.getByTestId("visual-proof-export-status"), `${routeEntry.route} should report PNG download success`).toContainText("PNG downloaded");

          await inspectDownloadedPngArtifact({
            page,
            download: png,
            testInfo,
            route: routeEntry.route,
            expectedDimensions: expectedExportDimensions,
          });
        });
      }
    });
  }
});
