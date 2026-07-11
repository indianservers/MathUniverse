import { expect, test } from "@playwright/test";
import { formulaVisualizerConfigs } from "../../src/data/formulaVisualizerRoutes";

const routes = formulaVisualizerConfigs.map((config) => config.route);

test.describe("Formula visualizer route inventory", () => {
  for (const route of routes) {
    test(`${route} loads as an interactive formula visualizer`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText(/coming soon/i);
      await expect(page.locator("body")).not.toContainText(/placeholder-only/i);
      await expect(page.locator("body")).not.toContainText(/not implemented/i);
      if (route === "/trigonometry/formula-visualizer") {
        await expect(page.getByRole("tab", { name: "Formula Gallery" })).toBeVisible();
        await expect(page.getByRole("tab", { name: "Steps" })).toBeVisible();
      } else {
        await expect(page.getByRole("button", { name: "Explore" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Formula Bank" })).toBeVisible();
      }
      await expect(page.locator("body")).toContainText(/formula/i);
      await expect(page.locator("button, input, select, [role='slider']").first()).toBeVisible();
      await expect(page.locator("svg[role='img']").first()).toBeVisible();

      const bodyText = await page.locator("body").innerText();
      expect(bodyText.length).toBeGreaterThan(600);
      expect(bodyText).toMatch(/Explore|Formula Bank|Examples|Why it Works|Practice|Visualize|Journey|Formula/i);
    });
  }
});
