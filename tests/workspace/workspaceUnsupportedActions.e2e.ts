import { expect, test } from "@playwright/test";
import {
  expectNonblankSvgSurface,
  expectVisibleBox,
  failOnFatalConsoleErrors,
  gotoWorkspaceRoute,
} from "./workspaceBrowserAssertions";

test.describe("Workspace unsupported-action safety", () => {
  test("invalid graph expression shows validation and preserves existing plot", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/graph");
    await expectNonblankSvgSurface(page.getByTestId("workspace-graph-surface"), 8, { requirePath: true });

    await page.getByPlaceholder(/sin\(x\), x\^2/i).fill("window.alert(1)");
    await page.getByRole("button", { name: "Add graph" }).click();

    await expect(page.getByTestId("workspace-graph-validation-message")).toContainText("not supported");
    await expect(page.getByTestId("workspace-graph-validation-message")).toContainText("Try:");
    await expectNonblankSvgSurface(page.getByTestId("workspace-graph-surface"), 8, { requirePath: true });
    await assertNoFatalErrors();
  });

  test("unsupported command bar command shows explicit safe result", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/graph");

    await page.getByPlaceholder(/plot sin\(x\), solve x\^2/i).fill("hyperbolicCompass[triangle]");
    await page.getByRole("button", { name: "Run", exact: true }).click();

    await expect(page.getByText("Unsupported workspace action").first()).toBeVisible();
    await expect(page.getByText("Workspace command is not supported in this workspace yet.").first()).toBeVisible();
    await expect(page.getByText("No workspace state was changed.").first()).toBeVisible();
    await assertNoFatalErrors();
  });

  test("geometry no-selection transform reports safe unsupported state", async ({ page }) => {
    const assertNoFatalErrors = failOnFatalConsoleErrors(page);

    await gotoWorkspaceRoute(page, "/workspace/geometry");

    await page.getByRole("button", { name: "Move Selected" }).click();

    await expect(page.getByTestId("workspace-safety-status")).toContainText("Geometry transform is not supported");
    await expectNonblankSvgSurface(page.getByTestId("workspace-geometry-board"), 8, { requirePath: false });
    await assertNoFatalErrors();
  });

  test("3D no-selection delete reports safe unsupported state", async ({ page }) => {
    await gotoWorkspaceRoute(page, "/workspace/3d");
    await expectVisibleBox(page.getByTestId("workspace-3d-surface"));

    await page.getByRole("button", { name: "Select", exact: true }).nth(1).click();
    await page.keyboard.press("Delete");

    await expect(page.getByTestId("workspace-safety-status")).toContainText("Delete selection is not supported");
    await page.goto("about:blank");
  });
});
