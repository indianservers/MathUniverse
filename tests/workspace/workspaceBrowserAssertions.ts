import { expect, type Locator, type Page } from "@playwright/test";

const allowedConsoleErrorFragments = [
  "THREE.WebGLRenderer: Context Lost",
];

export function failOnFatalConsoleErrors(page: Page) {
  const failures: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (allowedConsoleErrorFragments.some((fragment) => text.includes(fragment))) return;
    failures.push(text);
  });

  page.on("pageerror", (error) => {
    failures.push(error.message);
  });

  return async () => {
    await expect(page.locator("vite-error-overlay")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("Internal server error");
    await expect(page.locator("body")).not.toContainText("Application error");
    await expect(page.locator("body")).not.toContainText("Cannot read properties");
    expect(failures, failures.join("\n")).toEqual([]);
  };
}

export async function gotoWorkspaceRoute(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status(), route).toBe(200);
  await page.waitForLoadState("networkidle");
}

export async function expectWorkspaceShell(page: Page) {
  await expect(page.getByTestId("workspace-command-bar")).toBeVisible();
  await expect(page.getByTestId("workspace-tool-rail")).toBeVisible();
}

export async function expectVisibleBox(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(20);
  expect(box?.height ?? 0).toBeGreaterThan(20);
}

export async function expectNonblankSvgSurface(locator: Locator, minimumMarks = 5, options: { requirePath?: boolean } = {}) {
  await expectVisibleBox(locator);
  const state = await locator.evaluate((element) => {
    const marks = Array.from(element.querySelectorAll("path,line,circle,rect,polygon,polyline,ellipse,text"));
    const visibleMarks = marks.filter((mark) => {
      const style = window.getComputedStyle(mark);
      return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
    });
    const nonEmptyPaths = Array.from(element.querySelectorAll("path")).filter((path) => path.getAttribute("d")?.trim());
    const box = element.getBoundingClientRect();
    return {
      width: box.width,
      height: box.height,
      visibleMarks: visibleMarks.length,
      nonEmptyPaths: nonEmptyPaths.length,
    };
  });

  expect(state.width).toBeGreaterThan(20);
  expect(state.height).toBeGreaterThan(20);
  expect(state.visibleMarks).toBeGreaterThanOrEqual(minimumMarks);
  if (options.requirePath ?? true) {
    expect(state.nonEmptyPaths).toBeGreaterThan(0);
  }
}

export async function expectThreeCanvasEvidence(locator: Locator) {
  await expectVisibleBox(locator);
  const state = await locator.evaluate((element) => {
    const canvas = element.querySelector("canvas");
    const box = element.getBoundingClientRect();
    return {
      width: box.width,
      height: box.height,
      canvasWidth: canvas?.width ?? 0,
      canvasHeight: canvas?.height ?? 0,
      dataUrlLength: canvas?.toDataURL("image/png").length ?? 0,
      textLength: element.textContent?.trim().length ?? 0,
    };
  });

  expect(state.width).toBeGreaterThan(20);
  expect(state.height).toBeGreaterThan(20);
  expect(state.canvasWidth).toBeGreaterThan(20);
  expect(state.canvasHeight).toBeGreaterThan(20);
  expect(state.dataUrlLength).toBeGreaterThan(1_000);
}
