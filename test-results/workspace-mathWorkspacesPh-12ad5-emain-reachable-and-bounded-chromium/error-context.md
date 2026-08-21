# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mathWorkspacesPhase3.e2e.ts >> Math Workspaces Phase 3 audit >> all required route and viewport combinations remain reachable and bounded
- Location: tests\workspace\mathWorkspacesPhase3.e2e.ts:36:3

# Error details

```
Error: /shapes clipped controls at 320x568: Grid [290,197 73x44], Reset view [367,197 111x44]

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

# Test source

```ts
  1   | import AxeBuilder from "@axe-core/playwright";
  2   | import { expect, test } from "@playwright/test";
  3   | import { mkdir, writeFile } from "node:fs/promises";
  4   | import path from "node:path";
  5   | 
  6   | const routes = [
  7   |   ["cas", "/workspace/data"],
  8   |   ["spreadsheet", "/workspace/data/spreadsheet"],
  9   |   ["geometry", "/workspace/geometry"],
  10  |   ["geometry-3d", "/workspace/3d"],
  11  |   ["graphs", "/workspace/graph?v_a=1&v_b=0"],
  12  |   ["graphs-3d", "/math-lab/3d-graphing"],
  13  |   ["shapes", "/shapes"],
  14  | ] as const;
  15  | 
  16  | const viewports = [
  17  |   [320, 568], [360, 800], [390, 844], [412, 915], [600, 960], [768, 1024], [820, 1180],
  18  |   [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440], [3840, 2160],
  19  | ] as const;
  20  | 
  21  | type RouteEvidence = {
  22  |   route: string;
  23  |   viewport: string;
  24  |   horizontalOverflow: number;
  25  |   stage: { width: number; height: number };
  26  |   canvasCount: number;
  27  |   clippedControls: number;
  28  |   clippedControlLabels: string[];
  29  |   smallTargets: number;
  30  |   landmarks: number;
  31  |   loadMs: number;
  32  |   consoleErrors: string[];
  33  | };
  34  | 
  35  | test.describe.serial("Math Workspaces Phase 3 audit", () => {
  36  |   test("all required route and viewport combinations remain reachable and bounded", async ({ browser }, testInfo) => {
  37  |     test.setTimeout(12 * 60_000);
  38  |     await mkdir(path.resolve("artifacts/math-workspaces-phase3"), { recursive: true });
  39  |     const evidence: RouteEvidence[] = [];
  40  |     for (const [width, height] of viewports) {
  41  |       const context = await browser.newContext({ baseURL: String(testInfo.project.use.baseURL), viewport: { width, height } });
  42  |       const page = await context.newPage();
  43  |       try {
  44  |         for (const [name, route] of routes) {
  45  |           const errors: string[] = [];
  46  |           const onConsole = (message: { type(): string; text(): string }) => { if (message.type() === "error") errors.push(message.text()); };
  47  |           page.on("console", onConsole);
  48  |           const started = Date.now();
  49  |           const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  50  |           await expect(page.locator(".math-workspace-layout"), `${route} at ${width}x${height} mounted`).toBeVisible();
  51  |           await page.waitForTimeout(name.includes("3d") || name === "shapes" ? 450 : 120);
  52  |           const measurements = await page.evaluate(() => {
  53  |           const stage = document.querySelector<HTMLElement>(".math-workspace-stage")?.getBoundingClientRect();
  54  |           const visible = (element: Element) => {
  55  |             const style = getComputedStyle(element);
  56  |             const rect = element.getBoundingClientRect();
  57  |             return style.visibility !== "hidden" && style.display !== "none" && style.pointerEvents !== "none" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  58  |           };
  59  |           const controls = Array.from(document.querySelectorAll<HTMLElement>("button,a[href],input,select,textarea")).filter(visible);
  60  |           const hasScrollableAncestor = (element: HTMLElement, axis: "x" | "y") => {
  61  |             let parent = element.parentElement;
  62  |             while (parent && parent !== document.body) {
  63  |               const style = getComputedStyle(parent);
  64  |               const overflow = axis === "x" ? style.overflowX : style.overflowY;
  65  |               const scrollable = /auto|scroll/.test(overflow) && (axis === "x" ? parent.scrollWidth > parent.clientWidth + 2 : parent.scrollHeight > parent.clientHeight + 2);
  66  |               if (scrollable) return true;
  67  |               parent = parent.parentElement;
  68  |             }
  69  |             return false;
  70  |           };
  71  |           const clipped = controls.filter((element) => {
  72  |             const rect = element.getBoundingClientRect();
  73  |             const clippedX = (rect.right > innerWidth + 2 || rect.left < -2) && !hasScrollableAncestor(element, "x");
  74  |             const clippedY = (rect.bottom > innerHeight + 2 || rect.top < -2) && !hasScrollableAncestor(element, "y");
  75  |             return clippedX || clippedY;
  76  |           });
  77  |           const smallTargets = matchMedia("(pointer: coarse)").matches ? controls.filter((element) => {
  78  |             const rect = element.getBoundingClientRect();
  79  |             return rect.width < 40 || rect.height < 40;
  80  |           }).length : 0;
  81  |           return {
  82  |             horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
  83  |             stage: { width: stage?.width ?? 0, height: stage?.height ?? 0 },
  84  |             canvasCount: document.querySelectorAll("canvas,svg[role='img'],svg[data-testid]").length,
  85  |             clippedControls: clipped.length,
  86  |             clippedControlLabels: clipped.slice(0, 20).map((element) => {
  87  |               const rect = element.getBoundingClientRect();
  88  |               const label = element.getAttribute("aria-label") ?? element.getAttribute("title") ?? element.textContent?.trim().slice(0, 80) ?? element.tagName;
  89  |               return `${label} [${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}]`;
  90  |             }),
  91  |             smallTargets,
  92  |             landmarks: document.querySelectorAll("main,nav,aside,[role='main'],[role='navigation'],[role='region'],[role='application'],[role='grid']").length,
  93  |           };
  94  |           });
  95  |           page.off("console", onConsole);
  96  |           expect(response?.ok(), `${route} at ${width}x${height}`).toBeTruthy();
  97  |           expect(measurements.horizontalOverflow, `${route} at ${width}x${height}`).toBeLessThanOrEqual(4);
  98  |           expect(measurements.stage.width).toBeGreaterThan(200);
  99  |           expect(measurements.stage.height).toBeGreaterThan(180);
> 100 |           expect(measurements.clippedControls, `${route} clipped controls at ${width}x${height}: ${measurements.clippedControlLabels.join(", ")}`).toBe(0);
      |                                                                                                                                                    ^ Error: /shapes clipped controls at 320x568: Grid [290,197 73x44], Reset view [367,197 111x44]
  101 |           expect(errors.filter((error) => !/WebGL|favicon/i.test(error)), `${route} console`).toEqual([]);
  102 |           evidence.push({ route, viewport: `${width}x${height}`, ...measurements, loadMs: Date.now() - started, consoleErrors: errors });
  103 |           if (["320x568", "768x1024", "1280x720", "1920x1080", "3840x2160"].includes(`${width}x${height}`) && ["cas", "graphs", "graphs-3d", "shapes"].includes(name)) {
  104 |             await page.screenshot({ path: `artifacts/math-workspaces-phase3/${name}-${width}x${height}.png`, fullPage: false });
  105 |           }
  106 |         }
  107 |         await saveEvidence("responsive.json", evidence);
  108 |       } finally {
  109 |         await context.close();
  110 |       }
  111 |     }
  112 |   });
  113 | 
  114 |   test("workspace landmarks, keyboard focus, and WCAG A/AA checks have no serious violations", async ({ page }) => {
  115 |     test.setTimeout(4 * 60_000);
  116 |     await page.setViewportSize({ width: 1440, height: 900 });
  117 |     const evidence = [];
  118 |     const failures: string[] = [];
  119 |     for (const [name, route] of routes) {
  120 |       await page.goto(route, { waitUntil: "domcontentloaded" });
  121 |       await expect(page.locator(".math-workspace-layout")).toBeVisible();
  122 |       await page.keyboard.press("Tab");
  123 |       const focused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, label: document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim().slice(0, 80) }));
  124 |       const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  125 |       const serious = result.violations.filter((item) => item.impact === "critical" || item.impact === "serious");
  126 |       evidence.push({ name, route, focused, violations: result.violations.map((item) => ({
  127 |         id: item.id,
  128 |         impact: item.impact,
  129 |         nodes: item.nodes.length,
  130 |         targets: item.nodes.slice(0, 8).map((node) => node.target.join(" ")),
  131 |       })) });
  132 |       expect(focused.tag).toBeTruthy();
  133 |       for (const violation of serious) failures.push(`${route}: ${violation.id} (${violation.nodes.length}) ${violation.nodes.slice(0, 4).map((node) => node.target.join(" ")).join(", ")}`);
  134 |     }
  135 |     await saveEvidence("accessibility.json", evidence);
  136 |     expect(failures, `Serious accessibility violations:\n${failures.join("\n")}`).toEqual([]);
  137 |   });
  138 | 
  139 |   test("3D routes release canvases across repeated route entry and exit", async ({ page }) => {
  140 |     test.setTimeout(4 * 60_000);
  141 |     const evidence = [];
  142 |     for (const route of ["/workspace/3d", "/math-lab/3d-graphing", "/shapes"]) {
  143 |       for (let iteration = 0; iteration < 3; iteration += 1) {
  144 |         await page.goto(route, { waitUntil: "domcontentloaded" });
  145 |         if (route === "/shapes") await page.getByRole("button", { name: "3D view" }).click();
  146 |         await expect(page.locator("canvas").first(), `${route} iteration ${iteration + 1} mounts a WebGL canvas`).toBeVisible({ timeout: 15_000 });
  147 |         const mounted = await page.locator("canvas").count();
  148 |         await page.locator("canvas").evaluateAll((canvases) => canvases.forEach((canvas) => canvas.setAttribute("data-phase3-workspace-canvas", "true")));
  149 |         await page.goto("/?section=math-workspaces", { waitUntil: "domcontentloaded" });
  150 |         await page.waitForTimeout(120);
  151 |         const remaining = await page.locator("canvas[data-phase3-workspace-canvas='true']").count();
  152 |         evidence.push({ route, iteration: iteration + 1, mounted, remaining });
  153 |         expect(mounted, `${route} iteration ${iteration + 1} mounted canvases`).toBeGreaterThan(0);
  154 |         expect(remaining, `${route} iteration ${iteration + 1} released canvases`).toBe(0);
  155 |       }
  156 |     }
  157 |     await saveEvidence("webgl-lifecycle.json", evidence);
  158 |   });
  159 | });
  160 | 
  161 | async function saveEvidence(file: string, value: unknown) {
  162 |   const directory = path.resolve("artifacts/math-workspaces-phase3");
  163 |   await mkdir(directory, { recursive: true });
  164 |   await writeFile(path.join(directory, file), JSON.stringify(value, null, 2));
  165 | }
  166 | 
```