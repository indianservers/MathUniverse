import { expect, test } from "@playwright/test";
import {
  expectNonblankSvgSurface,
  expectThreeCanvasEvidence,
  expectVisibleBox,
  expectWorkspaceShell,
  failOnFatalConsoleErrors,
  gotoWorkspaceRoute,
} from "./workspaceBrowserAssertions";

test.describe("Workspace browser visual smoke", () => {
  test("workspace home renders the default graphing surface", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace");

    await expect(page.getByText("Graph, CAS, And Algebra")).toBeVisible();
    await expectWorkspaceShell(page);
    await expectNonblankSvgSurface(page.getByTestId("workspace-graph-surface"), 8, { requirePath: true });
    await page.getByRole("button", { name: "Run QA" }).click();
    await assertNoFatalErrors();
  });

  test("graph route renders nonblank SVG output and survives expression edits", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/graph");

    await expect(page.getByText("Desmos-style Graphing Lab")).toBeVisible();
    await expectWorkspaceShell(page);
    await expectNonblankSvgSurface(page.getByTestId("workspace-graph-surface"), 8, { requirePath: true });

    const expressionInput = page.getByPlaceholder(/sin\(x\), x\^2/i);
    await expressionInput.fill("x^2");
    await page.getByRole("button", { name: "Add graph" }).click();
    await expectNonblankSvgSurface(page.getByTestId("workspace-graph-surface"), 9, { requirePath: true });

    await expressionInput.fill("window.alert(1)");
    await page.getByRole("button", { name: "Add graph" }).click();
    await expect(page.getByTestId("workspace-graph-surface")).toBeVisible();
    await expect(page.locator("body")).toContainText("Graph, CAS, And Algebra");
    await assertNoFatalErrors();
  });

  test("geometry route renders board SVG and supports point creation plus drag", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/geometry");

    await expect(page.getByRole("heading", { name: "Geometry Constructor" })).toBeVisible();
    await expectWorkspaceShell(page);
    const board = page.getByTestId("workspace-geometry-board");
    await expectNonblankSvgSurface(board, 8, { requirePath: false });

    await page.getByRole("button", { name: /^Point$/ }).click();
    await board.click({ position: { x: 320, y: 210 } });
    const point = page.locator("[data-point-id]").first();
    await expect(point).toBeVisible();

    const box = await board.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      await page.mouse.move(box.x + 320, box.y + 210);
      await page.mouse.down();
      await page.mouse.move(box.x + 360, box.y + 240, { steps: 4 });
      await page.mouse.up();
    }

    await expectNonblankSvgSurface(board, 9, { requirePath: false });
    await assertNoFatalErrors();
  });

  test("3D route renders a browser canvas/container and supports view interaction", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/3d");

    await expect(page.getByText("3D Graphing And Solids Lab")).toBeVisible();
    await expectWorkspaceShell(page);
    await expectVisibleBox(page.getByTestId("workspace-3d-surface"));
    await expectThreeCanvasEvidence(page.getByTestId("workspace-3d-canvas"));

    await page.getByRole("button", { name: "Pause rotation", exact: true }).click();
    await expect(page.getByRole("button", { name: "Start rotation", exact: true })).toBeVisible();
    await assertNoFatalErrors();
    await page.goto("about:blank");
  });

  test("data/CAS route renders visual panels and navigates to spreadsheet safely", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/data");

    await expect(page.getByRole("heading", { name: "Data Workspace" })).toBeVisible();
    await expectWorkspaceShell(page);
    await expectVisibleBox(page.getByTestId("workspace-data-surface"));
    await expect(page.getByRole("link", { name: "Spreadsheet", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Function Analysis/i })).toBeVisible();

    await page.getByRole("link", { name: /Spreadsheet/i }).first().click();
    await expect(page).toHaveURL(/\/workspace\/data\/spreadsheet$/);
    await expect(page.getByRole("heading", { name: "Spreadsheet", exact: true })).toBeVisible();
    await assertNoFatalErrors();
  });

  test("teacher route renders classroom controls and toggles presentation mode safely", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/teach");

    await expect(page.getByText("Teaching, Library, And Export")).toBeVisible();
    await expectWorkspaceShell(page);
    await expectVisibleBox(page.getByTestId("workspace-teacher-surface"));
    await expect(page.getByText("Guided Activity Mode")).toBeVisible();
    await expect(page.getByText("Teacher Presentation")).toBeVisible();

    await page.getByRole("button", { name: /^Teaching mode$/ }).click();
    await expect(page.getByText("Teacher presentation mode is active")).toBeVisible();
    await assertNoFatalErrors();
  });
});
