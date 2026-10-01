import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("desktop 2D graph expression editing and deletion", async ({ page }) => {
  await page.goto("/workspace/graph");
  await expect(page.locator(".graph-studio-2d-shell")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("textbox", { name: "Function 1", exact: true }).fill("x^2");
  await page.getByRole("textbox", { name: "Function 2", exact: true }).fill("4");
  await expect(page.locator(".gs2d-expression")).toHaveCount(2);
  await page.getByRole("button", { name: "Expression options" }).nth(1).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.locator(".gs2d-expression")).toHaveCount(1);
});

test("desktop 3D graph surface creation and deletion", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/math-lab/3d-graphing");
  await expect(page.locator(".graph-studio-3d-shell")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Add explicit surface" }).click();
  await expect(page.locator(".gs3d-expression")).toHaveCount(2);
  await page.getByRole("button", { name: /Delete Surface 2/ }).click();
  await expect(page.locator(".gs3d-expression")).toHaveCount(1);
  await expect(page.locator("canvas").first()).toBeVisible();
});

test("desktop 2D geometry point creation", async ({ page }) => {
  await page.goto("/workspace/geometry");
  const board = page.getByTestId("workspace-geometry-board");
  await expect(board).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Point", exact: true }).first().click();
  await board.click({ position: { x: 240, y: 200 } });
  await expect(board.locator("[data-point-id]")).toHaveCount(1);
});

test("desktop 3D geometry creates an object and preserves camera canvas", async ({ page }) => {
  await page.goto("/workspace/3d");
  const root = page.locator(".object-studio-shell");
  await expect(root).toBeVisible({ timeout: 30_000 });
  const initialCount = await root.locator(".os-object-list > div").count();
  await page.getByRole("button", { name: "Add Cube" }).click();
  await expect(root.locator(".os-object-list > div")).toHaveCount(initialCount + 1);
  await expect(root.locator("canvas").first()).toBeVisible();
});
