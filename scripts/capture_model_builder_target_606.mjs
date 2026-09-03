/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0663-interactive-intermediate-advanced-financial-mathematics-and-modelling-model-builder-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/606-model-builder",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 986, height: 1595 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0663");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      relationship: node.dataset.relationship,
      fitMethod: node.dataset.fitMethod,
      points: node.dataset.points,
      a: node.dataset.a,
      b: node.dataset.b,
      r2: node.dataset.r2,
      prediction: node.dataset.prediction,
      fitted: node.dataset.fitted,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Point 6 y").fill("5500");
checks.edited = await state();
await lesson.getByLabel("Fit method").selectOption("two-point");
checks.twoPoint = await state();
await lesson.getByRole("button", { name: "Fit Model", exact: true }).click();
checks.fitted = await state();
await lesson
  .getByRole("button", { name: "Add data point", exact: true })
  .click();
checks.added = await state();
await lesson.getByLabel("Remove point 7").click();
checks.removed = await state();
await lesson.getByRole("button", { name: "Exponential", exact: true }).click();
checks.exponential = await state();
await lesson.getByRole("button", { name: "table", exact: true }).click();
checks.table = await lesson.locator(".mb606-model>table").isVisible();
await lesson.getByRole("button", { name: "equation", exact: true }).click();
checks.equation = await lesson.locator(".mb606-model .equation").isVisible();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".mb606-note").isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0663");
await lesson.waitFor();
await lesson.getByLabel("Prediction x").fill("8");
checks.prediction = await state();
await lesson.getByLabel("Challenge model").fill("250x+500");
await lesson.getByLabel("Challenge cost").fill("3000");
await lesson.getByLabel("Challenge months").fill("18");
await lesson
  .getByRole("button", { name: "Check answers", exact: true })
  .click();
checks.wrong = await state();
await lesson.getByLabel("Challenge cost").fill("3250");
await lesson
  .getByRole("button", { name: "Check answers", exact: true })
  .click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0663");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
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
    hero: await box(".mb606-hero"),
    tabs: await box(".mb606-tabs"),
    builder: await box(".mb606-builder"),
    middle: await box(".mb606-middle"),
    lower: await box(".mb606-lower"),
    adjacent: await box(".mb606-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0663-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0663").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0663-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.a === "800.0000" &&
    checks.initial.b === "1000.0000" &&
    checks.initial.r2 === "1.0000" &&
    checks.initial.prediction === "6600.00" &&
    checks.edited.fitted === "false" &&
    checks.twoPoint.fitMethod === "two-point" &&
    checks.twoPoint.a === "900.0000" &&
    checks.twoPoint.b === "1000.0000" &&
    checks.fitted.fitted === "true" &&
    checks.added.points === "7" &&
    checks.removed.points === "6" &&
    checks.exponential.relationship === "exponential" &&
    checks.table &&
    checks.equation &&
    checks.formula &&
    checks.prediction.prediction === "7400.00" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0663-reference.png"));
await writeFile(
  path.join(evidence, "0663-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
