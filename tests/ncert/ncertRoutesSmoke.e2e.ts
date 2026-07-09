import { expect, test } from "@playwright/test";
import { ncertSmokeRoutes } from "../helpers/routeInventory";

const desktopViewport = { width: 1280, height: 720 };
const mobileViewport = { width: 390, height: 844 };
const routeErrorPattern = /not found|route error|internal server error|something went wrong/i;
const unfinishedPattern = /coming soon|under construction|not implemented|lorem ipsum/i;

test.describe("NCERT route browser smoke", () => {
  test("desktop routes load with real content and interaction", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize(desktopViewport);

    for (const route of ncertSmokeRoutes()) {
      await page.goto(route.route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body"), route.route).toBeVisible();
      await expect(page.locator("body"), route.route).not.toContainText(routeErrorPattern);
      await expect(page.locator("body"), route.route).not.toContainText(unfinishedPattern);
      await expect(page.locator("main").first(), route.route).toContainText(/[A-Za-z0-9]/);
      expect(await page.getByRole("heading").count(), route.route).toBeGreaterThan(0);

      if (route.featureType === "NCERT" && route.route !== "/ncert") {
        const interactiveCount = await page.locator("button, input, select, textarea, [role='tab'], [role='slider'], svg, canvas").count();
        expect(interactiveCount, route.route).toBeGreaterThan(0);
      }
    }
  });

  test("mobile routes do not introduce horizontal overflow", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize(mobileViewport);

    for (const route of ncertSmokeRoutes()) {
      await page.goto(route.route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body"), route.route).not.toContainText(routeErrorPattern);

      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(horizontalOverflow, route.route).toBeLessThanOrEqual(4);
    }
  });
});
