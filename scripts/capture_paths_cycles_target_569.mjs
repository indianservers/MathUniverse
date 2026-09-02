/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0626-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-paths-and-cycles-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/569-paths-and-cycles";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1023, height: 1538 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0626");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "graph",
    "walk",
    "current",
    "length",
    "edgesUsed",
    "valid",
    "trail",
    "path",
    "cycle",
    "shortestCycle",
    "shortestCycleLength",
    "positions",
    "graded",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByTestId("path-vertex-D").click();
checks.invalid = await state();
await lesson.getByTestId("path-vertex-E").click();
checks.extended = await state();
await lesson.getByTestId("path-vertex-A").click();
checks.closed = await state();
await lesson.getByRole("button", { name: /Undo/ }).click();
checks.undo = await state();
await lesson.getByRole("button", { name: /Close cycle to A/ }).click();
checks.autoClosed = await state();
await lesson.getByLabel("Graph variant").selectOption("Graph 2");
checks.graph2 = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
const before = checks.reset.positions,
  b = await lesson.getByTestId("path-vertex-B").boundingBox();
if (!b) throw new Error("B missing");
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.mouse.down();
await page.mouse.move(b.x + b.width / 2 + 40, b.y + b.height / 2 + 25, {
  steps: 8,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== before;
await lesson.getByRole("button", { name: "Find shortest cycle" }).click();
checks.shortest = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/Length is the sum of edge weights/)
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Cycle answer").fill("A-B-C-E-D-A");
await lesson.getByRole("button", { name: "Submit" }).click();
checks.wrong = await state();
await lesson.getByLabel("Cycle answer").fill("A → B → C → E → A");
await lesson.getByRole("button", { name: "Submit" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution = await lesson
  .locator(".pc569-bottom>article:last-child>button")
  .last()
  .textContent();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
  const b = await lesson.locator(s).boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        left: Math.round(b.x),
        width: Math.round(b.width),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
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
  hero: await rect(".pc569-hero"),
  tabs: await rect(".pc569-tabs"),
  lab: await rect(".pc569-lab"),
  theory: await rect(".pc569-theory"),
  bottom: await rect(".pc569-bottom"),
  adjacent: await rect(".pc569-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0626-desktop.png"),
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
  path: path.join(evidence, "0626-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.walk === "A,B,C" &&
  checks.initial.length === "5" &&
  checks.initial.path === "true" &&
  checks.initial.shortestCycleLength === "8" &&
  checks.invalid.walk === "A,B,C" &&
  checks.extended.walk === "A,B,C,E" &&
  checks.extended.length === "6" &&
  checks.closed.walk === "A,B,C,E,A" &&
  checks.closed.cycle === "true" &&
  checks.closed.length === "8" &&
  checks.undo.walk === "A,B,C,E" &&
  checks.autoClosed.cycle === "true" &&
  checks.graph2.graph === "Graph 2" &&
  checks.graph2.walk === "A" &&
  checks.reset.graph === "Graph 1" &&
  checks.dragChanged &&
  checks.shortest.cycle === "true" &&
  checks.shortest.length === "8" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.solution?.includes("A") &&
  checks.final.walk === "A,B,C" &&
  metrics.document.width === 1023 &&
  metrics.document.height === 1538 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0626-reference.png"));
await writeFile(
  path.join(evidence, "0626-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
