/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0655-interactive-intermediate-advanced-financial-mathematics-and-modelling-amortisation-table-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/598-amortisation-table";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 971, height: 1620 } });
const logs = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    logs.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0655");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) => ({
    principal: node.dataset.principal,
    rate: node.dataset.rate,
    years: node.dataset.years,
    frequency: node.dataset.frequency,
    emi: node.dataset.emi,
    extra: node.dataset.extra,
    payoff: node.dataset.payoff,
    interest: node.dataset.interest,
    month: node.dataset.month,
    closing: node.dataset.closing,
    chartRange: node.dataset.chartRange,
    graded: node.dataset.graded,
    actions: node.dataset.actions,
    rows: node.querySelectorAll(".am598-table tbody tr").length,
  }));
const checks = { initial: await state() };

await lesson.getByLabel("Loan principal (₹)", { exact: true }).fill("750000");
await lesson
  .getByLabel("Annual interest rate (%)", { exact: true })
  .fill("8.5");
await lesson.getByLabel("Loan term (years)", { exact: true }).fill("6");
checks.inputs = await state();
await lesson.getByLabel("Loan principal (₹) slider").fill("600000");
await lesson.getByLabel("Annual interest rate (%) slider").fill("10");
await lesson.getByLabel("Loan term (years) slider").fill("10");
checks.sliders = await state();
await lesson.getByLabel("Extra payment amount", { exact: true }).fill("1000");
checks.extra = await state();
await lesson.getByLabel("Selected amortisation month").fill("24");
checks.scrubber = await state();
await lesson.getByRole("row", { name: /^23 / }).click();
checks.tableSelection = await state();
await lesson.getByLabel("Chart range").selectOption("First year");
checks.chart = await state();
await lesson.getByLabel("Payment frequency").selectOption("Weekly");
checks.frequency = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".am598-note").isVisible();

await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0655");
await lesson.waitFor();
await lesson.getByLabel("Challenge months earlier").fill("1");
await lesson.getByLabel("Challenge interest saved").fill("1");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge months earlier").fill("6");
await lesson.getByLabel("Challenge interest saved").fill("13874.37");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Reset all", exact: true }).click();
checks.reset = await state();

await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0655");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
  const bounds = await lesson.locator(selector).boundingBox();
  return bounds
    ? {
        top: Math.round(bounds.y),
        height: Math.round(bounds.height),
        bottom: Math.round(bounds.y + bounds.height),
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
  hero: await box(".am598-hero"),
  tabs: await box(".am598-tabs"),
  lab: await box(".am598-lab"),
  theory: await box(".am598-theory"),
  challenge: await box(".am598-challenge"),
  adjacent: await box(".am598-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0655-desktop.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0655").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0655-mobile.png"),
  fullPage: true,
});

const near = (actual, expected) =>
  Math.abs(Number(actual) - expected) < 0.02;
const passed =
  near(checks.initial.emi, 10379.18) &&
  checks.initial.payoff === "60" &&
  checks.initial.month === "12" &&
  near(checks.initial.closing, 417084.99) &&
  checks.initial.rows === 5 &&
  checks.inputs.principal === "750000" &&
  checks.inputs.rate === "8.5" &&
  checks.inputs.years === "6" &&
  checks.sliders.principal === "600000" &&
  checks.sliders.rate === "10" &&
  checks.sliders.years === "10" &&
  checks.extra.extra === "1000" &&
  Number(checks.extra.payoff) < Number(checks.sliders.payoff) &&
  checks.scrubber.month === "24" &&
  checks.tableSelection.month === "23" &&
  checks.chart.chartRange === "First year" &&
  checks.frequency.frequency === "Weekly" &&
  Number(checks.frequency.payoff) > 0 &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.reset.principal === "500000" &&
  checks.reset.month === "12" &&
  checks.reset.extra === "0" &&
  !metrics.overflow &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0655-reference.png"));
await writeFile(
  path.join(evidence, "0655-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
