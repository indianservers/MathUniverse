/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0617-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-circular-permutations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/560-circular-permutations";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1201, height: 1309 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0617");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
  "n",
  "total",
  "arrangement",
  "visible",
  "anchor",
  "showRotations",
  "rotation",
  "canUndo",
  "canRedo",
  "challengeTotal",
  "graded",
  "correct",
  "actions",
];
const state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson
  .getByRole("button", { name: /Ben/ })
  .dragTo(lesson.getByTestId("circular-seat-3"));
checks.swapped = await state();
await lesson.getByRole("button", { name: "Undo", exact: true }).click();
checks.undone = await state();
await lesson.getByRole("button", { name: "Redo", exact: true }).click();
checks.redone = await state();
await lesson.getByRole("button", { name: "6", exact: true }).click();
checks.six = await state();
await lesson.getByRole("switch").first().click();
await lesson.getByRole("switch").last().click();
checks.toggles = await state();
await lesson.getByRole("button", { name: /Check another rotation/ }).click();
checks.rotated = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Circular challenge answer").fill("5040");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Circular challenge answer").fill("720");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show Solution/ }).click();
checks.solution = await lesson
  .getByText("6! = 720", { exact: true })
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
  const r = await lesson.locator(s).boundingBox();
  return r
    ? {
        top: Math.round(r.y),
        left: Math.round(r.x),
        width: Math.round(r.width),
        height: Math.round(r.height),
        bottom: Math.round(r.y + r.height),
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
  hero: await rect(".circ560-hero"),
  tabs: await rect(".circ560-tabs"),
  lab: await rect(".circ560-lab"),
  theory: await rect(".circ560-theory"),
  bottom: await rect(".circ560-bottom"),
  adjacent: await rect(".circ560-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0617-desktop.png"),
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
  path: path.join(evidence, "0617-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.n === "5" &&
  checks.initial.total === "24" &&
  checks.initial.arrangement === "ABCDE" &&
  checks.swapped.arrangement === "ACBDE" &&
  checks.swapped.canUndo === "true" &&
  checks.undone.arrangement === "ABCDE" &&
  checks.undone.canRedo === "true" &&
  checks.redone.arrangement === "ACBDE" &&
  checks.six.n === "6" &&
  checks.six.total === "120" &&
  checks.six.arrangement === "ABCDEF" &&
  checks.toggles.anchor === "false" &&
  checks.toggles.showRotations === "false" &&
  checks.rotated.rotation === "1" &&
  checks.formulaClass.includes("active") &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.solution &&
  checks.final.total === "24" &&
  metrics.document.width === 1201 &&
  metrics.document.height === 1309 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0617-reference.png"));
await writeFile(
  path.join(evidence, "0617-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
