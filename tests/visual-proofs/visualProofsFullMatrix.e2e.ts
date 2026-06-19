import { test } from "@playwright/test";
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

const routesByCategory = visualProofsRouteSmokeManifest.reduce<Record<string, VisualProofRouteSmokeEntry[]>>(
  (groups, entry) => {
    groups[entry.category] = [...(groups[entry.category] ?? []), entry];
    return groups;
  },
  {},
);

test.describe("Visual Proofs full route matrix", () => {
  for (const [category, routes] of Object.entries(routesByCategory)) {
    test(`${category} proof routes render shell, controls, snapshot access, and nonblank visuals`, async ({ page }) => {
      test.setTimeout(Math.max(90_000, routes.length * 15_000));

      for (const routeEntry of routes) {
        await test.step(routeEntry.route, async () => {
          await gotoOk(page, routeEntry.route);
          await expectNoBrowserErrorSurface(page);
          await expectProofShell(page);
          await expectNonblankPrimaryVisual(page, {
            expectedMinimumVisualElements: routeEntry.expectedMinimumVisualElements,
          });
        });
      }
    });
  }
});
