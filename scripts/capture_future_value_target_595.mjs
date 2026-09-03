/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0652-interactive-intermediate-advanced-financial-mathematics-and-modelling-future-value-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/595-future-value";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 975, height: 1614 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0652");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((n) => ({
    principal: n.dataset.principal,
    rate: n.dataset.rate,
    periods: n.dataset.periods,
    frequency: n.dataset.frequency,
    future: n.dataset.future,
    interest: n.dataset.interest,
    reached: n.dataset.reached,
    actions: n.dataset.actions,
    points: n.querySelectorAll(".fv595-chart svg circle").length,
    factors: n.querySelectorAll(".fv595-factors b").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Present deposit (PV)", { exact: true }).fill("18000");
checks.principal = await state();
await lesson.getByLabel("Annual rate (r)", { exact: true }).fill("8");
checks.rate = await state();
await lesson.getByLabel("Number of periods (n)", { exact: true }).fill("10");
checks.periods = await state();
await lesson.getByLabel("Compounding frequency").selectOption("Quarterly");
checks.frequency = await state();
await lesson.getByLabel("Present deposit (PV) slider").fill("15000");
await lesson.getByLabel("Annual rate (r) slider").fill("7");
await lesson.getByLabel("Number of periods (n) slider").fill("8");
await lesson.getByLabel("Compounding frequency").selectOption("Annually");
checks.restored = await state();
await lesson.getByRole("button", { name: "+ Time" }).click();
checks.quickTime = await state();
await lesson.getByRole("button", { name: "+ Rate" }).click();
checks.quickRate = await state();
await lesson.getByRole("button", { name: "+ Deposit" }).click();
checks.quickDeposit = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".fv595-note").isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const box = async (s) => {
  const b = await lesson.locator(s).boundingBox();
  return b
    ? {
        top: Math.round(b.y),
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
  hero: await box(".fv595-hero"),
  tabs: await box(".fv595-tabs"),
  lab: await box(".fv595-lab"),
  theory: await box(".fv595-theory"),
  practice: await box(".fv595-practice"),
  adjacent: await box(".fv595-adjacent"),
};
await page.screenshot({ path: path.join(ev, "0652-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0652").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0652-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    near(checks.initial.future, 25772.79) &&
    checks.initial.points === 9 &&
    checks.initial.factors === 8 &&
    checks.initial.reached === "false" &&
    checks.principal.reached === "true" &&
    near(checks.rate.future, 33316.74) &&
    checks.periods.points === 11 &&
    checks.frequency.frequency === "Quarterly" &&
    near(checks.restored.future, 25772.79) &&
    checks.quickTime.periods === "9" &&
    checks.quickRate.rate === "8" &&
    checks.quickDeposit.principal === "18000" &&
    checks.quickDeposit.reached === "true" &&
    checks.formula &&
    checks.final.principal === "15000" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0652-reference.png"));
await writeFile(
  path.join(ev, "0652-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
