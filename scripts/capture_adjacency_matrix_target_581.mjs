/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0638-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-adjacency-matrix-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/581-adjacency-matrix";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0638");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(300);
const keys = [
    "edges",
    "edgeCount",
    "degrees",
    "degreeSum",
    "symmetric",
    "matrix",
    "selected",
    "positions",
    "challengeEdges",
    "graded",
    "revealed",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
const editor = lesson.locator(".am581-editor");
await editor.getByLabel("Matrix A C").click();
checks.added = await state();
await editor.getByLabel("Matrix C A").click();
checks.restored = await state();
await lesson.getByTestId("matrix-vertex-B").click();
checks.selected = await state();
const before = checks.selected.positions,
  vertex = lesson.getByTestId("matrix-vertex-B"),
  box = await vertex.boundingBox();
if (!box) throw new Error("Vertex B missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 65, box.y + box.height / 2 + 55, {
  steps: 10,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = before !== checks.dragged.positions;
await lesson.getByLabel("Undirected symmetric").uncheck();
checks.directed = await state();
await lesson.getByLabel("Undirected symmetric").check();
checks.symmetricAgain = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".am581-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
const challenge = lesson.locator(".am581-bottom article").nth(1);
await challenge.getByLabel("Matrix A E").click();
await challenge.getByRole("button", { name: "Check My Answer" }).click();
checks.wrong = await state();
await challenge.getByLabel("Matrix A E").click();
await challenge.getByLabel("Matrix A C").click();
await challenge.getByRole("button", { name: "Check My Answer" }).click();
checks.correct = await state();
await challenge.getByRole("button", { name: "Reveal Answer" }).click();
checks.revealed = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const b = selector
    ? await lesson.locator(selector).boundingBox()
    : await lesson.boundingBox();
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
  surface: await rect(null),
  hero: await rect(".am581-hero"),
  tabs: await rect(".am581-tabs"),
  lab: await rect(".am581-lab"),
  stats: await rect(".am581-stats"),
  theory: await rect(".am581-theory"),
  bottom: await rect(".am581-bottom"),
  adjacent: await rect(".am581-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0638-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`mobile ${message.type()}: ${message.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0638").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0638-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.edges === "AB,AD,BC,BD,BE,CE,DE" &&
  checks.initial.edgeCount === "7" &&
  checks.initial.degrees === "2,4,2,3,3" &&
  checks.initial.degreeSum === "14" &&
  checks.added.edgeCount === "8" &&
  checks.added.degrees === "3,4,3,3,3" &&
  checks.restored.edgeCount === "7" &&
  checks.selected.selected === "B" &&
  checks.dragChanged &&
  checks.directed.symmetric === "false" &&
  checks.directed.degreeSum === "7" &&
  checks.symmetricAgain.degrees === "2,4,2,3,3" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.correct.challengeEdges.includes("AC") &&
  checks.revealed.revealed === "true" &&
  checks.final.edgeCount === "7" &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0638-reference.png"));
await writeFile(
  path.join(evidence, "0638-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    { passed, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
