import { expect, type Page } from "@playwright/test";

export type VisualProofShellOptions = {
  expectSnapshotExport?: boolean;
};

export type VisualProofNonblankOptions = {
  expectedMinimumVisualElements?: number;
};

export async function gotoOk(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status(), route).toBe(200);
}

export async function expectNoBrowserErrorSurface(page: Page) {
  await expect(page.locator("vite-error-overlay")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("Internal server error");
  await expect(page.locator("body")).not.toContainText("Application error");
}

export async function expectProofShell(page: Page, options: VisualProofShellOptions = {}) {
  await expect(page.getByTestId("visual-proof-shell")).toBeVisible();
  await expect(page.getByTestId("visual-proof-primary-visual")).toBeVisible();
  await expect(page.getByTestId("visual-proof-controls")).toBeVisible();
  await expect(page.getByTestId("visual-proof-formula-panel")).toBeVisible();

  const inspector = page.getByTestId("visual-proof-state-inspector");
  if ((await inspector.count()) > 0) {
    await expect(inspector).toBeVisible();
  } else {
    await expect(page.getByRole("button", { name: /inspector|state/i })).toBeVisible();
  }

  if (options.expectSnapshotExport === false) {
    return;
  }

  if ((await page.getByTestId("visual-proof-snapshot-button").count()) === 0) {
    await page.getByTestId("visual-proof-controls").getByRole("button", { name: "Teacher", exact: true }).click();
  }

  await expect(page.getByTestId("visual-proof-snapshot-button")).toBeVisible();
}

export async function expectNonblankPrimaryVisual(page: Page, options: VisualProofNonblankOptions = {}) {
  const visual = page.getByTestId("visual-proof-primary-visual");
  const expectedMinimumVisualElements = options.expectedMinimumVisualElements ?? 3;
  const visualState = await visual.evaluate((element) => {
    const svg = element.querySelector("svg");
    const canvas = element.querySelector("canvas");
    const markCandidates = Array.from(
      element.querySelectorAll("path,line,circle,rect,polygon,polyline,text,ellipse,use,g"),
    );
    const visibleMarks = markCandidates.filter((mark) => {
      const style = window.getComputedStyle(mark);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
        return false;
      }
      if (mark.tagName.toLowerCase() === "g") {
        return mark.querySelector("path,line,circle,rect,polygon,polyline,text,ellipse,use") !== null;
      }
      return true;
    }).length;
    const box = element.getBoundingClientRect();
    const childElementCount = element.children.length;

    return {
      hasSvg: Boolean(svg),
      hasCanvas: Boolean(canvas),
      visibleMarks,
      textLength: element.textContent?.trim().length ?? 0,
      childElementCount,
      width: box.width,
      height: box.height,
      canvasWidth: canvas?.width ?? 0,
      canvasHeight: canvas?.height ?? 0,
    };
  });

  expect(visualState.width).toBeGreaterThan(0);
  expect(visualState.height).toBeGreaterThan(0);
  expect(
    visualState.hasSvg || visualState.hasCanvas || visualState.textLength > 0 || visualState.childElementCount > 0,
  ).toBe(true);

  if (visualState.hasSvg) {
    expect(visualState.visibleMarks).toBeGreaterThanOrEqual(expectedMinimumVisualElements);
  }

  if (visualState.hasCanvas) {
    expect(visualState.canvasWidth).toBeGreaterThan(0);
    expect(visualState.canvasHeight).toBeGreaterThan(0);
  }
}
