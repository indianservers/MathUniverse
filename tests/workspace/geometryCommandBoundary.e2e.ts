import { expect, test } from "@playwright/test";
import {
  expectNonblankSvgSurface,
  failOnFatalConsoleErrors,
  gotoWorkspaceRoute,
} from "./workspaceBrowserAssertions";

async function geometryBoardState(page: import("@playwright/test").Page) {
  return page.getByTestId("workspace-geometry-board").evaluate((board) => ({
    points: board.querySelectorAll("[data-point-id]").length,
    lines: board.querySelectorAll("[data-object-type='line']").length,
    circles: board.querySelectorAll("[data-object-type='circle']").length,
    polygons: board.querySelectorAll("[data-object-type='polygon']").length,
    measurementText: board.querySelector("[data-testid='workspace-geometry-measurements']")?.textContent?.trim() ?? "",
  }));
}

async function clickBoardPoint(page: import("@playwright/test").Page, x: number, y: number) {
  await page.getByTestId("workspace-geometry-board").click({ position: { x, y } });
}

async function clickRenderedPoint(page: import("@playwright/test").Page, index: number) {
  const point = page.getByTestId("workspace-geometry-board").locator("[data-point-id]").nth(index);
  await expect(point).toBeVisible();
  const box = await point.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test.describe("Geometry command-boundary regression", () => {
  test("selects and deletes a geometry point through the extracted panel boundary", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);
    await gotoWorkspaceRoute(page, "/workspace/geometry");

    const board = page.getByTestId("workspace-geometry-board");
    await expectNonblankSvgSurface(board, 8, { requirePath: false });
    const beforeCreate = await geometryBoardState(page);
    await page.getByTestId("workspace-geometry-tool-point").click();
    await clickBoardPoint(page, 280, 120);

    const afterCreate = await geometryBoardState(page);
    expect(afterCreate.points).toBe(beforeCreate.points + 1);

    await page.getByRole("button", { name: "Move", exact: true }).click();
    await clickRenderedPoint(page, afterCreate.points - 1);
    await page.keyboard.press("Delete");

    const afterDelete = await geometryBoardState(page);
    expect(afterDelete.points).toBe(beforeCreate.points);
    await expectNonblankSvgSurface(board, 8, { requirePath: false });
    await assertNoFatalErrors();
  });

  test("delete and transform commands fail safely with no geometry selection", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);
    await gotoWorkspaceRoute(page, "/workspace/geometry");

    const board = page.getByTestId("workspace-geometry-board");
    const before = await geometryBoardState(page);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Delete");

    await expect(page.getByTestId("workspace-safety-status")).toContainText("Delete selection is not supported");
    expect(await geometryBoardState(page)).toEqual(before);

    await page.getByRole("button", { name: "Move Selected", exact: true }).click();
    await expect(page.getByTestId("workspace-safety-status")).toContainText("Geometry transform is not supported");
    expect(await geometryBoardState(page)).toEqual(before);
    await expectNonblankSvgSurface(board, 8, { requirePath: false });
    await assertNoFatalErrors();
  });

  test("measurement overlays remain visible after point drag", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);
    await gotoWorkspaceRoute(page, "/workspace/geometry");

    const board = page.getByTestId("workspace-geometry-board");
    await expect(board.getByTestId("workspace-geometry-measurements")).toBeAttached();
    const box = await board.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    await page.getByTestId("workspace-geometry-tool-point").click();
    await clickBoardPoint(page, 220, 300);
    await clickBoardPoint(page, 360, 260);
    await page.getByTestId("workspace-geometry-tool-line").click();
    await clickRenderedPoint(page, 0);
    await clickRenderedPoint(page, 1);

    const before = await geometryBoardState(page);
    expect(before.lines).toBeGreaterThan(0);
    expect(before.measurementText.length).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Move", exact: true }).click();
    await page.mouse.move(box.x + 220, box.y + 300);
    await page.mouse.down();
    await page.mouse.move(box.x + 250, box.y + 280, { steps: 4 });
    await page.mouse.up();

    const after = await geometryBoardState(page);
    expect(after.measurementText.length).toBeGreaterThan(0);
    await expect(board.getByTestId("workspace-geometry-measurements")).toBeAttached();
    await assertNoFatalErrors();
  });

  test("geometry tool switching preserves existing construction state", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);
    await gotoWorkspaceRoute(page, "/workspace/geometry");

    const before = await geometryBoardState(page);
    await page.getByTestId("workspace-geometry-tool-line").click();
    await page.getByTestId("workspace-geometry-tool-circle").click();
    await page.getByTestId("workspace-geometry-tool-point").click();
    await page.getByRole("button", { name: "Move", exact: true }).click();

    expect(await geometryBoardState(page)).toEqual(before);
    await assertNoFatalErrors();
  });
});
