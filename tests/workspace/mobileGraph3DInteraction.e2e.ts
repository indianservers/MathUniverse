import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

test("3D graph panel closes cleanly and the scene survives layer and camera interactions", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/math-lab/3d-graphing");
  const root = page.locator(".graph-studio-3d-shell");
  await expect(root).toBeVisible({ timeout: 30_000 });
  const canvas = root.locator("canvas").first();
  await expect(canvas).toBeVisible();
  const initial = await canvas.boundingBox();
  expect(initial!.width).toBeGreaterThan(300);
  expect(initial!.height).toBeGreaterThan(500);

  await page.getByRole("button", { name: "Expressions menu" }).click();
  await expect(root).toHaveAttribute("data-mws-overlay", "expressions");
  await page.getByRole("button", { name: /Collapse Expressions & Layers/ }).click();
  await expect(root).toHaveAttribute("data-mws-overlay", "");
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  await page.mouse.move(box!.x + box!.width * 0.5, box!.y + box!.height * 0.45);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height * 0.6, { steps: 8 });
  await page.mouse.up();
  await expect(canvas).toBeVisible();

  await page.getByRole("button", { name: "Expressions menu" }).click();
  await page.getByRole("button", { name: "Add explicit surface" }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(2);
  await page.getByRole("button", { name: /Delete Surface 2/ }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(1);
  await page.getByRole("button", { name: /Collapse Expressions & Layers/ }).click();
  const toolbar = page.getByRole("navigation", { name: "3D graph tools" });
  await toolbar.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).last().click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(2);
  await toolbar.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Redo", exact: true }).last().click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(1);
  await page.getByRole("button", { name: "Expressions menu" }).click();
  await page.getByRole("button", { name: /Delete Surface 1/ }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(0);
  await expect(canvas).toBeVisible();
  await page.getByRole("button", { name: /Collapse Expressions & Layers/ }).click();
  await toolbar.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).last().click();
  await page.getByRole("button", { name: "Expressions menu" }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(1);
  await page.getByRole("button", { name: /Collapse Expressions & Layers/ }).click();
  await toolbar.getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: "Redo", exact: true }).last().click();
  await page.getByRole("button", { name: "Expressions menu" }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(0);
  await page.getByRole("button", { name: "Add explicit surface" }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear all surfaces" }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(0);
  await page.getByRole("button", { name: "Add explicit surface" }).click();
  await expect(root.locator(".gs3d-expression")).toHaveCount(1);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(() => canvas.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(700);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => canvas.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(500);
  expect(errors).toEqual([]);
});
