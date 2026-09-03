/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0671-interactive-intermediate-advanced-financial-mathematics-and-modelling-sensitivity-analysis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/614-sensitivity-analysis";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1146, height: 1373 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0671");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      factor: n.dataset.factor,
      change: n.dataset.change,
      baseline: n.dataset.baseline,
      current: n.dataset.current,
      impact: n.dataset.impact,
      most: n.dataset.mostSensitive,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Factor to test").selectOption("rate");
checks.rate = await state();
await lesson.getByLabel("Percentage change value").fill("-10");
checks.negative = await state();
await lesson.getByLabel("Percentage change", { exact: true }).fill("15");
checks.slider = await state();
await lesson.locator(".sa614-dashboard>header button").nth(1).click();
checks.zero = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".sa614-note").isVisible();
await lesson
  .getByRole("button", { name: "Reset to baseline", exact: true })
  .click();
checks.reset = await state();
const expected = 20000 * 1.098 ** 5,
  baseline = 20000 * 1.09 ** 5,
  impact = (expected / baseline - 1) * 100;
await lesson.getByLabel("Challenge output").fill("100");
await lesson.getByLabel("Challenge impact").fill("1");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge output").fill(expected.toFixed(2));
await lesson.getByLabel("Challenge impact").fill(impact.toFixed(2));
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0671");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (s) => {
  const v = await lesson.locator(s).first().boundingBox();
  return v
    ? {
        top: Math.round(v.y),
        height: Math.round(v.height),
        bottom: Math.round(v.y + v.height),
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
  hero: await measure(".sa614-hero"),
  sequence: await measure(".sa614-sequence"),
  dashboard: await measure(".sa614-dashboard"),
  theory: await measure(".sa614-theory"),
  adjacent: await measure(".sa614-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0671-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0671").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0671-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.factor === "principal" &&
    checks.initial.change === "10" &&
    checks.rate.factor === "rate" &&
    checks.rate.current !== checks.initial.current &&
    Number(checks.negative.impact) < 0 &&
    checks.slider.change === "15" &&
    checks.zero.impact === "0.00" &&
    checks.formula &&
    checks.reset.factor === "principal" &&
    checks.reset.change === "10" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    metrics.sequence?.top === 290 &&
    metrics.sequence?.bottom === 352 &&
    metrics.dashboard?.top === 366 &&
    metrics.dashboard?.bottom === 1038 &&
    metrics.theory?.top === 1054 &&
    metrics.theory?.bottom === 1265 &&
    metrics.adjacent?.top === 1278 &&
    metrics.adjacent?.bottom === 1335 &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0671-reference.png"));
await writeFile(
  path.join(evidence, "0671-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
