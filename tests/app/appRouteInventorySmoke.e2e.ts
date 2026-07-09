import { expect, test } from "@playwright/test";
import { appSmokeRoutes } from "../helpers/routeInventory";

const routeErrorPattern = /not found|route error|internal server error|something went wrong/i;

test.describe("App route inventory smoke", () => {
  test("important app surfaces load without blank or crash pages", async ({ page }) => {
    test.setTimeout(120_000);

    for (const route of appSmokeRoutes()) {
      await page.goto(route.route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body"), route.route).toBeVisible();
      await expect(page.locator("body"), route.route).not.toContainText(routeErrorPattern);
      await expect(page.locator("main").first(), route.route).toContainText(/[A-Za-z0-9]/);
      expect(await page.getByRole("heading").count(), route.route).toBeGreaterThan(0);
    }
  });

  test("home search/menu surfaces expose priority modules", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("body")).toContainText(/NCERT/i);
    await expect(page.locator("body")).toContainText(/Math Lab|Math Workspace/i);
    await expect(page.locator("body")).toContainText(/AR Math Lab|AR/i);
  });
});
