import { expect, test } from "@playwright/test";
import { expectNonblankSvgSurface, failOnFatalConsoleErrors, gotoWorkspaceRoute } from "./workspaceBrowserAssertions";

test.describe("geometry accuracy certification visual QA", () => {
  test("shows construction accuracy next to a nonblank geometry board", async ({ page }) => {
    const assertNoConsoleErrors = failOnFatalConsoleErrors(page);
    await gotoWorkspaceRoute(page, "/workspace/geometry");

    const board = page.getByTestId("workspace-geometry-board");
    const accuracy = page.getByTestId("workspace-geometry-accuracy");

    await expectNonblankSvgSurface(board, 8, { requirePath: false });
    await expect(accuracy).toBeVisible();
    await expect(accuracy).toContainText("Construction Accuracy");
    await expect(accuracy).toContainText(/certif|No construction constraints/i);
    await expect(page.getByTestId("workspace-geometry-graph-settings")).toBeVisible();
    await expect(page.getByTestId("workspace-geometry-setting-showMeasurements")).toBeVisible();
    await expect(page.getByText("Keyboard mode: select a point")).toBeVisible();

    await page.getByTestId("workspace-geometry-tool-point").click();
    await board.click({ position: { x: 100, y: 210 } });
    await board.click({ position: { x: 250, y: 210 } });
    await expect(board.locator("[data-point-id]")).toHaveCount(2);

    await page.getByTestId("workspace-geometry-tool-midpoint").click();
    await board.locator("[data-point-id]").nth(0).click();
    await board.locator("[data-point-id]").nth(1).click();
    await expect(accuracy).toContainText("Geometry accuracy certified.");
    await expect(accuracy).toContainText("100%");

    await assertNoConsoleErrors();
  });
});
