/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0624-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-weighted-graphs-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/567-weighted-graphs";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1026, height: 1532 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0624");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "edgeCount",
    "cheapestPath",
    "cheapestCost",
    "selectedEdge",
    "selectedPath",
    "positions",
    "zoom",
    "graded",
    "saved",
    "shared",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/For a path P, add every edge weight/)
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
const beforeDrag = checks.initial.positions,
  b = await lesson.getByTestId("weighted-vertex-B").first().boundingBox();
if (!b) throw new Error("B missing");
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.mouse.down();
await page.mouse.move(b.x + b.width / 2 + 35, b.y + b.height / 2 + 25, {
  steps: 8,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== beforeDrag;
const abLine = lesson.getByTestId("weighted-edge-AB").first().locator("line"),
  abBox = await abLine.boundingBox();
if (!abBox) throw new Error("AB edge missing");
await page.mouse.click(abBox.x + abBox.width / 2, abBox.y + abBox.height / 2);
checks.edgeSelected = await state();
await lesson.getByLabel("Selected edge weight").fill("8");
checks.reweighted = await state();
await lesson.getByRole("button", { name: "Select", exact: true }).click();
await lesson.getByLabel("Start vertex").selectOption("D");
await lesson.getByLabel("End vertex").selectOption("C");
checks.changedEndpoints = await state();
await lesson.getByLabel("Start vertex").selectOption("A");
await lesson.getByLabel("End vertex").selectOption("E");
await lesson.locator(".wg567-canvas-tools button").nth(1).click();
checks.zoomed = await state();
await lesson.locator(".wg567-canvas-tools button").last().click();
checks.fullscreen = await lesson.evaluate((node) =>
  node.classList.contains("fullscreen"),
);
await lesson.locator(".wg567-canvas-tools button").last().click();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
await lesson.getByRole("button", { name: /Save Progress|Saved/ }).click();
checks.persisted = await state();
await lesson.getByLabel("Practice vertex 2").selectOption("D");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.practice = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution =
  (await lesson
    .locator(".wg567-practice > aside button")
    .last()
    .textContent()) === "A → D → E";
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
  const x = await lesson.locator(s).boundingBox();
  return x
    ? {
        top: Math.round(x.y),
        left: Math.round(x.x),
        width: Math.round(x.width),
        height: Math.round(x.height),
        bottom: Math.round(x.y + x.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".wg567-hero"),
  tabs: await rect(".wg567-tabs"),
  observe: await rect(".wg567-observe"),
  manipulate: await rect(".wg567-manipulate"),
  theory: await rect(".wg567-theory"),
  practice: await rect(".wg567-practice"),
  adjacent: await rect(".wg567-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0624-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0624-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.edgeCount === "7" &&
  checks.initial.cheapestPath === "A,B,E" &&
  checks.initial.cheapestCost === "4" &&
  checks.formulaVisible &&
  checks.dragChanged &&
  checks.edgeSelected.selectedEdge === "AB" &&
  checks.reweighted.cheapestPath === "A,D,E" &&
  checks.reweighted.cheapestCost === "6" &&
  checks.changedEndpoints.cheapestPath === "D,E,C" &&
  checks.zoomed.zoom === "110" &&
  checks.fullscreen &&
  checks.persisted.saved === "true" &&
  checks.persisted.shared === "true" &&
  checks.practice.graded === "true" &&
  checks.solution &&
  checks.final.cheapestCost === "4" &&
  metrics.document.width === 1026 &&
  metrics.document.height === 1532 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0624-reference.png"));
await writeFile(
  path.join(evidence, "0624-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
