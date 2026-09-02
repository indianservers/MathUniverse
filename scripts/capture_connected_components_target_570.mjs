/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0627-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-connected-components-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/570-connected-components";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 977, height: 1610 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0627");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "componentCount",
    "componentSizes",
    "components",
    "reachable",
    "mode",
    "edgeCount",
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
await lesson.getByLabel("Reachability to").selectOption("C");
checks.reachableWithin = await state();
await lesson.getByLabel("Reachability to").selectOption("F");
await lesson.getByRole("button", { name: /Add edge/ }).click();
await lesson.getByTestId("component-vertex-C").click();
await lesson.getByTestId("component-vertex-D").click();
checks.merged = await state();
await lesson.getByRole("button", { name: /Remove edge/ }).click();
const line = lesson.getByTestId("component-edge-CD").locator("line"),
  box = await line.boundingBox();
if (!box) throw new Error("CD missing");
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
checks.split = await state();
const before = checks.split.positions,
  boundary = await lesson.getByTestId("component-boundary-A").boundingBox();
if (!boundary) throw new Error("A boundary missing");
await page.mouse.move(
  boundary.x + boundary.width / 2,
  boundary.y + boundary.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  boundary.x + boundary.width / 2 + 30,
  boundary.y + boundary.height / 2 + 20,
  { steps: 8 },
);
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== before;
await lesson.getByRole("button", { name: /Add isolated node/ }).click();
checks.isolated = await state();
await lesson.getByRole("button", { name: /Random graph/ }).click();
checks.random = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/disjoint partition/)
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Predicted components").fill("3");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Predicted components").fill("4");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Reset graph/ }).click();
checks.reset = await state();
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
  hero: await rect(".cc570-hero"),
  tabs: await rect(".cc570-tabs"),
  lab: await rect(".cc570-lab"),
  quick: await rect(".cc570-quick"),
  theory: await rect(".cc570-theory"),
  misconception: await rect(".cc570-misconception"),
  challenge: await rect(".cc570-challenge"),
  adjacent: await rect(".cc570-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0627-desktop.png"),
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
  path: path.join(evidence, "0627-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.componentCount === "3" &&
  checks.initial.componentSizes === "3,3,1" &&
  checks.initial.reachable === "false" &&
  checks.reachableWithin.reachable === "true" &&
  checks.merged.componentCount === "2" &&
  checks.merged.componentSizes === "6,1" &&
  checks.merged.reachable === "true" &&
  checks.split.componentCount === "3" &&
  checks.split.reachable === "false" &&
  checks.dragChanged &&
  checks.isolated.componentCount === "4" &&
  checks.isolated.componentSizes === "3,3,1,1" &&
  checks.random.componentCount === "4" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.reset.componentCount === "3" &&
  checks.final.components === "ABC|DEF|G" &&
  metrics.document.width === 977 &&
  metrics.document.height === 1610 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0627-reference.png"));
await writeFile(
  path.join(evidence, "0627-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
