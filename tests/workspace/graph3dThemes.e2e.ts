import { expect, test } from "@playwright/test";

const themeNames = ["Simple Gradient", "Aurora Neon", "Solar Flare", "Arctic Glass", "Emerald Matrix", "Cosmic Candy", "Minimal Pearl", "Thermal Spectrum"];

test("3D graph themes update and persist without remounting the camera", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
  const canvas = page.locator("#surface-3d-panel canvas").first();
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  await canvas.evaluate((element) => { element.dataset.themeTestIdentity = "original"; });

  await page.getByRole("button", { name: "style", exact: true }).click({ force: true });
  for (const name of themeNames) await expect(page.getByRole("radio", { name, exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "Solar Flare", exact: true }).click({ force: true });
  await expect(canvas).toHaveAttribute("data-theme-test-identity", "original");
  expect(await page.evaluate(() => localStorage.getItem("math-universe-3d-graph-theme-v1"))).toBe("solar-flare");
  await expect(page.getByRole("radio", { name: "Solar Flare", exact: true })).toHaveAttribute("aria-checked", "true");
});

test("sampling sweep can be shown and hidden from Scene layers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
  const sweep = page.getByRole("checkbox", { name: "Sampling sweep" });
  await expect(sweep).toBeChecked();
  await sweep.uncheck();
  await expect(sweep).not.toBeChecked();
  await sweep.check();
  await expect(sweep).toBeChecked();
});

test("the themed WebGL scene is nonblank on desktop and mobile", async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/math-lab/3d-graphing", { waitUntil: "domcontentloaded" });
    const canvas = page.locator("#surface-3d-panel canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => canvas.evaluate((element) => element.toDataURL("image/png").length)).toBeGreaterThan(2_000);
  }
});
