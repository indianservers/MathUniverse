/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0673-interactive-intermediate-advanced-financial-mathematics-and-modelling-scenario-comparison-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/616-scenario-comparison";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0673");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      principal: n.dataset.principal,
      rate: n.dataset.rate,
      years: n.dataset.years,
      worst: n.dataset.worst,
      best: n.dataset.best,
      base: n.dataset.baseOutput,
      worstOutput: n.dataset.worstOutput,
      bestOutput: n.dataset.bestOutput,
      graded: n.dataset.graded,
      shared: n.dataset.shared,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Starting amount (₹)", { exact: true }).fill("30000");
await lesson.getByLabel("Annual rate (%)", { exact: true }).fill("9");
await lesson.getByLabel("Years", { exact: true }).fill("8");
await lesson.getByLabel("Worst adjustment").fill("-3");
await lesson.getByLabel("Best adjustment").fill("4");
checks.controls = await state();
await lesson.getByLabel("Starting amount (₹) slider").fill("40000");
checks.slider = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "How it works", exact: true }).click();
checks.help = await lesson.locator(".sc616-board>.help").isVisible();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".sc616-note").isVisible();
await lesson.getByRole("button", { name: "Reset all", exact: true }).click();
checks.reset = await state();
await lesson.getByLabel("Challenge rate").fill("8");
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge rate").fill("9.14");
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "Show solution", exact: true })
  .click();
checks.solution = await lesson.locator(".sc616-bottom small").isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0673");
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
  hero: await measure(".sc616-hero"),
  sequence: await measure(".sc616-sequence"),
  board: await measure(".sc616-board"),
  bottom: await measure(".sc616-bottom"),
  adjacent: await measure(".sc616-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0673-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0673").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0673-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.base === "53973.12" &&
    checks.initial.worstOutput === "44771.19" &&
    checks.initial.bestOutput === "64843.56" &&
    checks.controls.base !== checks.initial.base &&
    checks.controls.worst === "-3" &&
    checks.controls.best === "4" &&
    checks.slider.principal === "40000" &&
    checks.shared.shared === "true" &&
    checks.help &&
    checks.formula &&
    checks.reset.principal === "25000" &&
    checks.reset.rate === "8" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.solution &&
    metrics.hero?.top === 99 &&
    metrics.hero?.bottom === 252 &&
    metrics.sequence?.top === 262 &&
    metrics.sequence?.bottom === 316 &&
    metrics.board?.top === 322 &&
    metrics.board?.bottom === 1022 &&
    metrics.bottom?.top === 1034 &&
    metrics.bottom?.bottom === 1372 &&
    metrics.adjacent?.top === 1385 &&
    metrics.adjacent?.bottom === 1429 &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0673-reference.png"));
await writeFile(
  path.join(evidence, "0673-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
