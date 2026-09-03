/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0662-interactive-intermediate-advanced-financial-mathematics-and-modelling-investment-comparison-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/605-investment-comparison",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0662");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      capital: node.dataset.capital,
      rateA: node.dataset.rateA,
      rateB: node.dataset.rateB,
      years: node.dataset.years,
      fee: node.dataset.fee,
      finalA: node.dataset.finalA,
      finalB: node.dataset.finalB,
      points: node.dataset.points,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Starting capital (Rs) slider").fill("30000");
await lesson.getByLabel("Plan A rate (p.a.)", { exact: true }).fill("5");
await lesson.getByLabel("Plan B rate (p.a.) slider").fill("9");
await lesson.getByLabel("Time horizon (years)", { exact: true }).fill("4");
await lesson.getByLabel("Fees (% of balance p.a.) slider").fill("0.5");
checks.changed = await state();
await lesson.getByLabel("Risk volatility").selectOption("High");
checks.risk = await lesson.getByLabel("Risk volatility").inputValue();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".ic605-note").isVisible();
await lesson.getByLabel("Matching annual rate").fill("8");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Matching annual rate").fill("9");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "Show solution", exact: true })
  .click();
checks.solution = await lesson
  .locator(".ic605-challenge aside small")
  .isVisible();
await lesson
  .getByRole("button", { name: "Reset to defaults", exact: true })
  .click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0662");
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
    hero: await box(".ic605-hero"),
    tabs: await box(".ic605-tabs"),
    sequence: await box(".ic605-sequence"),
    lab: await box(".ic605-lab"),
    theory: await box(".ic605-theory"),
    challenge: await box(".ic605-challenge"),
    adjacent: await box(".ic605-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0662-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0662").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0662-mobile.png"),
  fullPage: true,
});
const expectedA = 30000 * (1.05 * 0.995) ** 4,
  expectedB = 30000 * (1.09 * 0.995) ** 4,
  near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.011,
  passed =
    checks.initial.capital === "20000" &&
    checks.initial.finalA === "25452.78" &&
    checks.initial.finalB === "27946.33" &&
    checks.initial.points === "6" &&
    near(checks.changed.finalA, expectedA) &&
    near(checks.changed.finalB, expectedB) &&
    checks.changed.points === "5" &&
    checks.risk === "High" &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.solution &&
    checks.reset.finalA === "25452.78" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = {
    passed,
    checks,
    expectedChanged: { a: expectedA.toFixed(2), b: expectedB.toFixed(2) },
    metrics,
    mobileMetrics,
    logs,
  };
await copyFile(reference, path.join(evidence, "0662-reference.png"));
await writeFile(
  path.join(evidence, "0662-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
