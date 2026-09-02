/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0632-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-shortest-path-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/575-shortest-path";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1011, height: 1556 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0632");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "source",
    "target",
    "step",
    "current",
    "visited",
    "distances",
    "predecessors",
    "targetDistance",
    "finalDistance",
    "shortestPath",
    "done",
    "variant",
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
await lesson.getByRole("button", { name: /Next step/ }).click();
checks.afterD = await state();
await lesson.getByRole("button", { name: /Next step/ }).click();
checks.afterB = await state();
await lesson.getByRole("button", { name: /Run to completion/ }).click();
checks.complete = await state();
await lesson
  .locator(".sp575-lab")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
checks.reset = await state();
await lesson.getByLabel("Shortest path source").selectOption("E");
await lesson.getByLabel("Shortest path target").selectOption("A");
await lesson.getByRole("button", { name: /Run to completion/ }).click();
checks.reverse = await state();
await lesson.getByLabel("Dijkstra speed").fill("150");
await lesson
  .locator(".sp575-mode")
  .getByRole("button", { name: "Auto", exact: true })
  .click();
await page.waitForTimeout(900);
checks.auto = await state();
await lesson.getByRole("button", { name: /New graph/ }).click();
checks.alternate = await state();
await lesson.getByRole("button", { name: /Run to completion/ }).click();
checks.alternateComplete = await state();
await lesson.getByLabel("Show tentative distances").uncheck();
await lesson.getByLabel("Show predecessors").uncheck();
await lesson.getByLabel("Highlight shortest path").check();
checks.options = {
  distances: await lesson.getByLabel("Show tentative distances").isChecked(),
  pred: await lesson.getByLabel("Show predecessors").isChecked(),
  highlight: await lesson.getByLabel("Highlight shortest path").isChecked(),
};
const before = checks.alternateComplete.positions,
  vertex = await lesson.getByTestId("shortest-vertex-C").boundingBox();
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
await lesson.getByLabel("Toggle fullscreen").click();
checks.expanded = await lesson.evaluate((node) =>
  node.classList.contains("expanded"),
);
await lesson.getByLabel("Toggle fullscreen").click();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/finalized distance is shortest/)
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("A → D → C, cost 4").check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("A → B → E → C, cost 5").check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correctTie = await state();
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
  hero: await rect(".sp575-hero"),
  tabs: await rect(".sp575-tabs"),
  lab: await rect(".sp575-lab"),
  theory: await rect(".sp575-theory"),
  worked: await rect(".sp575-worked"),
  practice: await rect(".sp575-practice"),
  adjacent: await rect(".sp575-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0632-desktop.png"),
  fullPage: false,
});
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0632").waitFor({ timeout: 600000 });
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
  path: path.join(evidence, "0632-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.current === "A" &&
  checks.initial.targetDistance === "Infinity" &&
  checks.initial.distances.includes("B:2") &&
  checks.initial.distances.includes("D:1") &&
  checks.afterD.current === "D" &&
  checks.afterB.current === "B" &&
  checks.afterB.distances.includes("E:4") &&
  checks.complete.done === "true" &&
  checks.complete.finalDistance === "4" &&
  checks.complete.shortestPath === "A,B,E" &&
  checks.reset.step === "1" &&
  checks.reverse.finalDistance === "4" &&
  checks.reverse.shortestPath === "E,B,A" &&
  checks.auto.done === "true" &&
  checks.alternate.variant === "alternate" &&
  checks.alternateComplete.done === "true" &&
  !checks.options.distances &&
  !checks.options.pred &&
  checks.options.highlight &&
  checks.dragChanged &&
  checks.expanded &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correctTie.graded === "true" &&
  checks.final.source === "A" &&
  metrics.document.width === 1011 &&
  metrics.document.height === 1556 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0632-reference.png"));
await writeFile(
  path.join(evidence, "0632-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
