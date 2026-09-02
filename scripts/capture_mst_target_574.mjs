/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0631-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-minimum-spanning-tree-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/574-minimum-spanning-tree";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1047, height: 1501 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0631");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "algorithm",
    "graph",
    "selectedCount",
    "selectedEdges",
    "totalWeight",
    "optimalWeight",
    "complete",
    "difference",
    "rejected",
    "positions",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() },
  add = async (name) => lesson.getByLabel(`Add edge ${name}`).click();
for (const edge of ["A-D", "C-E", "A-B", "B-E"]) await add(edge);
checks.kruskal = await state();
await add("B-C");
checks.cycleRejected = await state();
checks.cycleMessage = await lesson
  .getByText(/creates a cycle/)
  .first()
  .isVisible();
await lesson
  .locator(".mst574-builder")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
await lesson.getByRole("button", { name: "Prim", exact: true }).click();
await add("C-E");
checks.primRejected = await state();
checks.primMessage = await lesson.getByText(/Prim starts at A/).isVisible();
for (const edge of ["A-D", "A-B", "B-E", "C-E"]) await add(edge);
checks.prim = await state();
const before = checks.prim.positions,
  vertex = await lesson.getByTestId("mst-vertex-C").first().boundingBox();
if (!vertex) throw new Error("C missing");
await page.mouse.move(
  vertex.x + vertex.width / 2,
  vertex.y + vertex.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  vertex.x + vertex.width / 2 + 30,
  vertex.y + vertex.height / 2 + 18,
  { steps: 8 },
);
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== before;
await lesson.getByRole("button", { name: /New graph/ }).click();
checks.alternate = await state();
await lesson.getByLabel("Show edge order").uncheck();
checks.orderHidden = !(await lesson
  .locator(".mst574-builder-grid table")
  .isVisible());
await lesson.getByRole("button", { name: /Start Challenge/ }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/minimum possible total weight/)
  .first()
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
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
  hero: await rect(".mst574-hero"),
  tabs: await rect(".mst574-tabs"),
  sequence: await rect(".mst574-sequence"),
  builder: await rect(".mst574-builder"),
  theory: await rect(".mst574-theory"),
  summary: await rect(".mst574-summary"),
  adjacent: await rect(".mst574-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0631-desktop.png"),
  fullPage: false,
});
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0631").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0631-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.optimalWeight === "6" &&
  checks.initial.selectedCount === "0" &&
  checks.kruskal.selectedEdges === "AD,CE,AB,BE" &&
  checks.kruskal.totalWeight === "6" &&
  checks.kruskal.complete === "true" &&
  checks.kruskal.difference === "0" &&
  checks.cycleRejected.selectedCount === "4" &&
  checks.cycleRejected.rejected.includes("BC") &&
  checks.cycleMessage &&
  checks.primRejected.selectedCount === "0" &&
  checks.primRejected.rejected.includes("CE") &&
  checks.primMessage &&
  checks.prim.complete === "true" &&
  checks.prim.totalWeight === "6" &&
  checks.dragChanged &&
  checks.alternate.graph === "alternate" &&
  checks.alternate.selectedCount === "0" &&
  checks.orderHidden &&
  checks.challenge.graph === "challenge" &&
  checks.challenge.optimalWeight === "9" &&
  checks.formulaVisible &&
  checks.final.graph === "base" &&
  metrics.document.width === 1047 &&
  metrics.document.height === 1501 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0631-reference.png"));
await writeFile(
  path.join(evidence, "0631-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
