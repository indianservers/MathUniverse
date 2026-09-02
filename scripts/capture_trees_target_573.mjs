/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0630-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-trees-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/573-trees";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1009, height: 1559 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0630");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "vertexCount",
    "edgeCount",
    "height",
    "leaves",
    "root",
    "selected",
    "connected",
    "acyclic",
    "isTree",
    "preventCycles",
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
await lesson.getByRole("button", { name: /Add child/ }).click();
checks.added = await state();
await lesson.getByRole("button", { name: /Remove node/ }).click();
checks.removed = await state();
await lesson.getByTestId("tree-node-E").click();
await lesson.getByRole("button", { name: /Change root/ }).click();
checks.rerooted = await state();
await lesson.getByTestId("tree-node-C").click();
await lesson.getByLabel("Tree action").selectOption("root-edge");
await lesson.getByRole("button", { name: /Connect root/ }).click();
checks.blocked = await state();
checks.blockedMessage = await lesson.getByText(/Blocked C-E/).isVisible();
await lesson.getByLabel("Prevent cycles").uncheck();
await lesson.getByRole("button", { name: /Connect root/ }).click();
checks.cyclic = await state();
const before = checks.cyclic.positions,
  vertex = await lesson.getByTestId("tree-node-C").boundingBox();
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
await lesson.getByRole("button", { name: /Clear/ }).click();
checks.cleared = await state();
await lesson
  .locator(".tr573-lab")
  .getByRole("button", { name: /Reset/ })
  .click();
checks.reset = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.getByText(/Every finite tree/).isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Tree challenge e").fill("7");
await lesson
  .locator(".tr573-lower")
  .getByRole("button", { name: "Check", exact: true })
  .click();
checks.wrong = await state();
await lesson.getByLabel("Tree challenge e").fill("8");
await lesson
  .locator(".tr573-lower")
  .getByRole("button", { name: "Check", exact: true })
  .click();
checks.correct = await state();
await lesson.getByRole("button", { name: /New tree/ }).click();
checks.newTreePrompt = await lesson.getByText(/exactly 7 vertices/).isVisible();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hintVisible = await lesson.getByText(/Count nodes first/).isVisible();
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
  hero: await rect(".tr573-hero"),
  tabs: await rect(".tr573-tabs"),
  lab: await rect(".tr573-lab"),
  middle: await rect(".tr573-middle"),
  lower: await rect(".tr573-lower"),
  adjacent: await rect(".tr573-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0630-desktop.png"),
  fullPage: false,
});
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0630").waitFor({ timeout: 600000 });
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
  path: path.join(evidence, "0630-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.vertexCount === "8" &&
  checks.initial.edgeCount === "7" &&
  checks.initial.height === "3" &&
  checks.initial.leaves === "D,F,G,H" &&
  checks.initial.isTree === "true" &&
  checks.added.vertexCount === "9" &&
  checks.added.edgeCount === "8" &&
  checks.added.isTree === "true" &&
  checks.removed.vertexCount === "8" &&
  checks.rerooted.root === "E" &&
  checks.rerooted.height === "4" &&
  checks.blocked.edgeCount === "7" &&
  checks.blockedMessage &&
  checks.cyclic.edgeCount === "8" &&
  checks.cyclic.acyclic === "false" &&
  checks.cyclic.isTree === "false" &&
  checks.dragChanged &&
  checks.cleared.vertexCount === "1" &&
  checks.cleared.isTree === "true" &&
  checks.reset.root === "A" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.newTreePrompt &&
  checks.hintVisible &&
  checks.final.leaves === "D,F,G,H" &&
  metrics.document.width === 1009 &&
  metrics.document.height === 1559 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0630-reference.png"));
await writeFile(
  path.join(evidence, "0630-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
