import { expect, test } from "@playwright/test";

test("3D Graph Studio supports unlimited independently styled expressions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("complementary", { name: "Expressions and layers" })).toBeVisible();

  const add = page.getByRole("button", { name: "Add expression" });
  for (let index = 0; index < 5; index += 1) await add.click();
  await expect(page.locator(".gs3d-expression")).toHaveCount(6);
  await expect(add).toBeEnabled();

  await page.getByRole("button", { name: "Edit Surface 4 style" }).click();
  await page.getByRole("button", { name: "style", exact: true }).click();
  await page.getByLabel("Low").fill("#123456");
  await page.getByLabel("High").fill("#abcdef");
  await expect(page.getByLabel("Low")).toHaveValue("#123456");
  await expect(page.getByLabel("High")).toHaveValue("#abcdef");
  await page.getByLabel("Opacity").fill("0.45");
  await page.getByLabel("Wireframe").check();
  await expect(page.locator(".gs3d-expression").nth(3).locator(".swatch")).toHaveAttribute("style", /rgb\(171, 205, 239\)/);

  await page.getByRole("button", { name: "Hide Surface 4" }).click();
  await expect(page.locator(".gs3d-layer-summary")).toContainText("5 visible");
  await page.getByRole("button", { name: "Delete Surface 4" }).click();
  await expect(page.locator(".gs3d-expression")).toHaveCount(5);
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`3D scene stays visible and bounded at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
    const canvas = page.locator("#surface-3d-panel canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => canvas.evaluate((element) => element.toDataURL("image/png").length)).toBeGreaterThan(2_000);
    expect(await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - innerWidth))).toBeLessThanOrEqual(4);
  });
}
