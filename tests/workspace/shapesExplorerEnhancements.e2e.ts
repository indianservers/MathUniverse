import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

const sizes = [
  { name: "desktop", width: 1600, height: 960 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "phone", width: 390, height: 844 },
] as const;
const shapesUrl = process.env.SHAPES_TEST_URL ?? "/shapes";

for (const size of sizes) {
  test(`Shapes Explorer is usable on ${size.name}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto(shapesUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await expect(page.locator(".shapes-stage")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    if (size.name === "desktop") {
      await expect(page.getByLabel("Shape property filter")).toBeVisible();
      const modes = page.getByLabel("Explorer modes");
      await modes.getByRole("button", { name: "Compare", exact: true }).click();
      await expect(page.locator(".shapes-compare-grid article")).toHaveCount(2);
      await modes.getByRole("button", { name: "Learn", exact: true }).click();
      await expect(page.getByText("Guided lesson", { exact: true })).toBeVisible();
      await modes.getByRole("button", { name: "Properties", exact: true }).click();
      await expect(page.getByText("Cross-section", { exact: true })).toBeVisible();
      await modes.getByRole("button", { name: "Formulas", exact: true }).click();
      await expect(page.getByText("Formula dependencies")).toBeVisible();
      await page.getByRole("button", { name: "Settings", exact: true }).click();
      await expect(page.getByRole("dialog", { name: "Shape Explorer settings" })).toBeVisible();
    } else {
      await expect(page.getByLabel("Workspace settings")).toBeVisible();
      await expect(page.locator(".shapes-mobile-properties")).toBeVisible();
    }
  });
}
