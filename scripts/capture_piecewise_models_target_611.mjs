/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0668-interactive-intermediate-advanced-financial-mathematics-and-modelling-piecewise-models-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/611-piecewise-models";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1142, height: 1377 } });
const logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0668");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) => ({
    left: node.dataset.left,
    right: node.dataset.right,
    value: node.dataset.value,
    leftContinuous: node.dataset.leftContinuous,
    rightContinuous: node.dataset.rightContinuous,
    rules: node.dataset.rules,
    closed: node.dataset.closed,
    dragging: node.dataset.dragging,
    graded: node.dataset.graded,
    actions: node.dataset.actions,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Rule 1").fill("x + 5");
checks.ruleEdit = await state();
await lesson.getByLabel("Left breakpoint").fill("-2");
await lesson.getByLabel("Right breakpoint").fill("4");
checks.breakpoints = await state();
await lesson
  .getByRole("button", { name: "○ Open", exact: true })
  .first()
  .click();
checks.endpoint = await state();
await lesson.getByLabel("Evaluate x", { exact: true }).fill("6");
checks.evaluate = await state();
const line = lesson.locator("line.dragline").first();
const lineBox = await line.boundingBox();
if (lineBox) {
  await page.mouse.move(lineBox.x + lineBox.width / 2, lineBox.y + 40);
  await page.mouse.down();
  await page.mouse.move(lineBox.x + 45, lineBox.y + 40, { steps: 4 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: "Randomize", exact: true }).click();
checks.randomized = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".pw611-tabnote").isVisible();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await lesson.getByLabel("Challenge g(0)").fill("1");
await lesson.getByLabel("Challenge g(-3)").fill("-6");
await lesson.getByLabel("Challenge g(2)").fill("4");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge g(0)").fill("0");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await lesson.locator(".pw611-challenge small").isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0668");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (selector) => {
  const value = await lesson.locator(selector).first().boundingBox();
  return value
    ? {
        top: Math.round(value.y),
        height: Math.round(value.height),
        bottom: Math.round(value.y + value.height),
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
  hero: await measure(".pw611-hero"),
  sequence: await measure(".pw611-sequence"),
  builder: await measure(".pw611-builder"),
  theory: await measure(".pw611-theory"),
  adjacent: await measure(".pw611-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0668-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0668").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0668-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.left === "-1" &&
  checks.initial.right === "3" &&
  checks.initial.value === "3" &&
  checks.initial.leftContinuous === "true" &&
  checks.initial.rightContinuous === "false" &&
  checks.ruleEdit.leftContinuous === "false" &&
  checks.breakpoints.left === "-2" &&
  checks.breakpoints.right === "4" &&
  checks.endpoint.closed !== checks.breakpoints.closed &&
  checks.evaluate.value === "2" &&
  checks.drag.left !== checks.breakpoints.left &&
  checks.randomized.rules === "1,2|0,1|-1,6" &&
  checks.formula &&
  checks.reset.left === "-1" &&
  checks.reset.right === "3" &&
  checks.reset.rules === "1,4|0,3|1,-4" &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.hint &&
  metrics.hero?.top === 102 &&
  metrics.hero?.bottom === 287 &&
  metrics.sequence?.top === 297 &&
  metrics.builder?.top === 362 &&
  metrics.builder?.bottom === 960 &&
  metrics.theory?.top === 968 &&
  metrics.theory?.bottom === 1274 &&
  metrics.adjacent?.top === 1290 &&
  metrics.adjacent?.bottom === 1352 &&
  !metrics.overflow &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0668-reference.png"));
await writeFile(
  path.join(evidence, "0668-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
