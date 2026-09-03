/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0664-interactive-intermediate-advanced-financial-mathematics-and-modelling-linear-models-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/607-linear-models",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1009, height: 1558 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0664");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      slope: node.dataset.slope,
      intercept: node.dataset.intercept,
      points: node.dataset.points,
      residuals: node.dataset.residuals,
      dragging: node.dataset.dragging,
      output: node.dataset.output,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Slope (rate of change) m slider").fill("1200");
await lesson
  .getByLabel("Intercept (start value) b", { exact: true })
  .fill("1500");
checks.controls = await state();
await lesson.getByLabel("Show residuals").uncheck();
checks.residuals = await state();
await lesson.getByRole("button", { name: "Add Point", exact: true }).click();
checks.added = await state();
await lesson.getByRole("button", { name: "Drag Line", exact: true }).click();
const graph = lesson.getByLabel("Interactive linear model graph"),
  box = await graph.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.25);
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".lm607-note").isVisible();
await lesson.getByRole("button", { name: "Reset lesson", exact: true }).click();
checks.reset = await state();
await lesson.getByLabel("Taxi slope").fill("15");
await lesson.getByLabel("Taxi intercept").fill("50");
await lesson.getByLabel("Taxi fare").fill("230");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Taxi slope").fill("16");
await lesson.getByLabel("Taxi fare").fill("242");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show hint", exact: true }).click();
checks.hint = await lesson
  .locator(".lm607-lower article:nth-child(2)>small")
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0664");
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
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await measure(".lm607-hero"),
    tabs: await measure(".lm607-tabs"),
    journey: await measure(".lm607-journey"),
    lab: await measure(".lm607-lab"),
    theory: await measure(".lm607-theory"),
    lower: await measure(".lm607-lower"),
    adjacent: await measure(".lm607-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0664-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0664").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0664-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.slope === "800" &&
    checks.initial.intercept === "1000" &&
    checks.initial.output === "9000" &&
    checks.initial.points === "6" &&
    checks.controls.output === "13500" &&
    checks.residuals.residuals === "false" &&
    checks.added.points === "7" &&
    checks.drag.slope !== checks.controls.slope &&
    checks.formula &&
    checks.reset.slope === "800" &&
    checks.reset.intercept === "1000" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.hint &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0664-reference.png"));
await writeFile(
  path.join(evidence, "0664-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
