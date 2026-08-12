import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const routes = [
  ["cas", "/workspace/data"],
  ["spreadsheet", "/workspace/data/spreadsheet"],
  ["geometry", "/workspace/geometry"],
  ["geometry-3d", "/workspace/3d"],
  ["graphs", "/workspace/graph?v_a=1&v_b=0"],
  ["graphs-3d", "/math-lab/3d-graphing"],
  ["shapes", "/shapes"],
] as const;

const viewports = [
  [320, 568], [360, 800], [390, 844], [412, 915], [600, 960], [768, 1024], [820, 1180],
  [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440], [3840, 2160],
] as const;

type RouteEvidence = {
  route: string;
  viewport: string;
  horizontalOverflow: number;
  stage: { width: number; height: number };
  canvasCount: number;
  clippedControls: number;
  clippedControlLabels: string[];
  smallTargets: number;
  landmarks: number;
  loadMs: number;
  consoleErrors: string[];
};

test.describe.serial("Math Workspaces Phase 3 audit", () => {
  test("all required route and viewport combinations remain reachable and bounded", async ({ browser }, testInfo) => {
    test.setTimeout(12 * 60_000);
    await mkdir(path.resolve("artifacts/math-workspaces-phase3"), { recursive: true });
    const evidence: RouteEvidence[] = [];
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ baseURL: String(testInfo.project.use.baseURL), viewport: { width, height } });
      const page = await context.newPage();
      try {
        for (const [name, route] of routes) {
          const errors: string[] = [];
          const onConsole = (message: { type(): string; text(): string }) => { if (message.type() === "error") errors.push(message.text()); };
          page.on("console", onConsole);
          const started = Date.now();
          const response = await page.goto(route, { waitUntil: "domcontentloaded" });
          await expect(page.locator(".math-workspace-layout"), `${route} at ${width}x${height} mounted`).toBeVisible();
          await page.waitForTimeout(name.includes("3d") || name === "shapes" ? 450 : 120);
          const measurements = await page.evaluate(() => {
          const stage = document.querySelector<HTMLElement>(".math-workspace-stage")?.getBoundingClientRect();
          const visible = (element: Element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.visibility !== "hidden" && style.display !== "none" && style.pointerEvents !== "none" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
          };
          const controls = Array.from(document.querySelectorAll<HTMLElement>("button,a[href],input,select,textarea")).filter(visible);
          const hasScrollableAncestor = (element: HTMLElement, axis: "x" | "y") => {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
              const style = getComputedStyle(parent);
              const overflow = axis === "x" ? style.overflowX : style.overflowY;
              const scrollable = /auto|scroll/.test(overflow) && (axis === "x" ? parent.scrollWidth > parent.clientWidth + 2 : parent.scrollHeight > parent.clientHeight + 2);
              if (scrollable) return true;
              parent = parent.parentElement;
            }
            return false;
          };
          const clipped = controls.filter((element) => {
            const rect = element.getBoundingClientRect();
            const clippedX = (rect.right > innerWidth + 2 || rect.left < -2) && !hasScrollableAncestor(element, "x");
            const clippedY = (rect.bottom > innerHeight + 2 || rect.top < -2) && !hasScrollableAncestor(element, "y");
            return clippedX || clippedY;
          });
          const smallTargets = matchMedia("(pointer: coarse)").matches ? controls.filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width < 40 || rect.height < 40;
          }).length : 0;
          return {
            horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
            stage: { width: stage?.width ?? 0, height: stage?.height ?? 0 },
            canvasCount: document.querySelectorAll("canvas,svg[role='img'],svg[data-testid]").length,
            clippedControls: clipped.length,
            clippedControlLabels: clipped.slice(0, 20).map((element) => {
              const rect = element.getBoundingClientRect();
              const label = element.getAttribute("aria-label") ?? element.getAttribute("title") ?? element.textContent?.trim().slice(0, 80) ?? element.tagName;
              return `${label} [${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}]`;
            }),
            smallTargets,
            landmarks: document.querySelectorAll("main,nav,aside,[role='main'],[role='navigation'],[role='region'],[role='application'],[role='grid']").length,
          };
          });
          page.off("console", onConsole);
          expect(response?.ok(), `${route} at ${width}x${height}`).toBeTruthy();
          expect(measurements.horizontalOverflow, `${route} at ${width}x${height}`).toBeLessThanOrEqual(4);
          expect(measurements.stage.width).toBeGreaterThan(200);
          expect(measurements.stage.height).toBeGreaterThan(180);
          expect(measurements.clippedControls, `${route} clipped controls at ${width}x${height}: ${measurements.clippedControlLabels.join(", ")}`).toBe(0);
          expect(errors.filter((error) => !/WebGL|favicon/i.test(error)), `${route} console`).toEqual([]);
          evidence.push({ route, viewport: `${width}x${height}`, ...measurements, loadMs: Date.now() - started, consoleErrors: errors });
          if (["320x568", "768x1024", "1280x720", "1920x1080", "3840x2160"].includes(`${width}x${height}`) && ["cas", "graphs", "graphs-3d", "shapes"].includes(name)) {
            await page.screenshot({ path: `artifacts/math-workspaces-phase3/${name}-${width}x${height}.png`, fullPage: false });
          }
        }
        await saveEvidence("responsive.json", evidence);
      } finally {
        await context.close();
      }
    }
  });

  test("workspace landmarks, keyboard focus, and WCAG A/AA checks have no serious violations", async ({ page }) => {
    test.setTimeout(4 * 60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const evidence = [];
    const failures: string[] = [];
    for (const [name, route] of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator(".math-workspace-layout")).toBeVisible();
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, label: document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim().slice(0, 80) }));
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = result.violations.filter((item) => item.impact === "critical" || item.impact === "serious");
      evidence.push({ name, route, focused, violations: result.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        nodes: item.nodes.length,
        targets: item.nodes.slice(0, 8).map((node) => node.target.join(" ")),
      })) });
      expect(focused.tag).toBeTruthy();
      for (const violation of serious) failures.push(`${route}: ${violation.id} (${violation.nodes.length}) ${violation.nodes.slice(0, 4).map((node) => node.target.join(" ")).join(", ")}`);
    }
    await saveEvidence("accessibility.json", evidence);
    expect(failures, `Serious accessibility violations:\n${failures.join("\n")}`).toEqual([]);
  });

  test("3D routes release canvases across repeated route entry and exit", async ({ page }) => {
    test.setTimeout(4 * 60_000);
    const evidence = [];
    for (const route of ["/workspace/3d", "/math-lab/3d-graphing", "/shapes"]) {
      for (let iteration = 0; iteration < 3; iteration += 1) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        if (route === "/shapes") await page.getByRole("button", { name: "3D view" }).click();
        await expect(page.locator("canvas").first(), `${route} iteration ${iteration + 1} mounts a WebGL canvas`).toBeVisible({ timeout: 15_000 });
        const mounted = await page.locator("canvas").count();
        await page.locator("canvas").evaluateAll((canvases) => canvases.forEach((canvas) => canvas.setAttribute("data-phase3-workspace-canvas", "true")));
        await page.goto("/?section=math-workspaces", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(120);
        const remaining = await page.locator("canvas[data-phase3-workspace-canvas='true']").count();
        evidence.push({ route, iteration: iteration + 1, mounted, remaining });
        expect(mounted, `${route} iteration ${iteration + 1} mounted canvases`).toBeGreaterThan(0);
        expect(remaining, `${route} iteration ${iteration + 1} released canvases`).toBe(0);
      }
    }
    await saveEvidence("webgl-lifecycle.json", evidence);
  });
});

async function saveEvidence(file: string, value: unknown) {
  const directory = path.resolve("artifacts/math-workspaces-phase3");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, file), JSON.stringify(value, null, 2));
}
