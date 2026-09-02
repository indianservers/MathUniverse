/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0635-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-planar-graphs-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/578-planar-graphs";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 977, height: 1610 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0635");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(400);
const keys = [
    "kind",
    "vertexCount",
    "edgeCount",
    "crossingCount",
    "planar",
    "faces",
    "euler",
    "reason",
    "positions",
    "history",
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
await lesson.getByLabel("Planar graph choice").selectOption("k33");
checks.k33 = await state();
await lesson.getByLabel("Planar graph choice").selectOption("k4");
checks.k4 = await state();
const before = checks.k4.positions,
  editableD = lesson.locator(".pl578-canvas").getByTestId("planar-vertex-D");
await editableD.click();
const v = await editableD.boundingBox();
if (!v) throw new Error("K4 vertex D missing");
await lesson
  .locator(".pl578-canvas nav button")
  .filter({ hasText: "Move" })
  .click();
await page.mouse.move(v.x + v.width / 2, v.y + v.height / 2);
await page.mouse.down();
await page.mouse.move(v.x + v.width / 2 - 120, v.y + v.height / 2 + 105, {
  steps: 10,
});
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== before;
await lesson.getByRole("button", { name: /Undo/ }).click();
checks.undo = await state();
await lesson.getByRole("button", { name: /Redo/ }).click();
checks.redo = await state();
await lesson.getByRole("button", { name: /Add Vertex/ }).click();
checks.added = await state();
await lesson.getByRole("button", { name: /Undo/ }).click();
checks.addUndo = await state();
await lesson.getByLabel("Show crossings").uncheck();
await lesson.getByLabel("Show faces").uncheck();
await lesson.getByLabel("Show edge labels").check();
checks.toggles = {
  crossings: await lesson.getByLabel("Show crossings").isChecked(),
  faces: await lesson.getByLabel("Show faces").isChecked(),
  labels: await lesson.getByLabel("Show edge labels").isChecked(),
};
await lesson.getByRole("button", { name: "FORMULA", exact: true }).click();
checks.formulaVisible = await lesson.locator(".pl578-note").isVisible();
await lesson.getByRole("button", { name: "INTERACT", exact: true }).click();
await lesson.getByLabel("Planar challenge f").fill("3");
await lesson.getByRole("button", { name: "Check result" }).click();
checks.wrong = await state();
await lesson.getByLabel("Planar challenge f").fill("4");
await lesson.getByLabel("Planar challenge v").fill("4");
await lesson.getByRole("button", { name: "Check result" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(300);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
  const b = s
    ? await lesson.locator(s).boundingBox()
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
  hero: await rect(".pl578-hero"),
  tabs: await rect(".pl578-tabs"),
  lab: await rect(".pl578-lab"),
  theory: await rect(".pl578-theory"),
  bottom: await rect(".pl578-bottom"),
  adjacent: await rect(".pl578-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0635-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0635").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(300);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0635-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.kind === "k5" &&
  checks.initial.edgeCount === "10" &&
  checks.initial.planar === "false" &&
  Number(checks.initial.crossingCount) > 0 &&
  checks.initial.reason.includes("3V") &&
  checks.k33.edgeCount === "9" &&
  checks.k33.planar === "false" &&
  checks.k33.reason.includes("Bipartite") &&
  checks.k4.edgeCount === "6" &&
  checks.k4.crossingCount === "0" &&
  checks.k4.planar === "true" &&
  checks.k4.faces === "4" &&
  checks.k4.euler === "2" &&
  checks.dragChanged &&
  Number(checks.dragged.crossingCount) > 0 &&
  checks.undo.positions === checks.k4.positions &&
  checks.redo.positions === checks.dragged.positions &&
  checks.added.vertexCount === "5" &&
  checks.addUndo.vertexCount === "4" &&
  !checks.toggles.crossings &&
  !checks.toggles.faces &&
  checks.toggles.labels &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.kind === "k5" &&
  metrics.document.width === 977 &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1610 &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0635-reference.png"));
await writeFile(
  path.join(evidence, "0635-validation.json"),
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
