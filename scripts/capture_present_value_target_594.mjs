/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0651-interactive-intermediate-advanced-financial-mathematics-and-modelling-present-value-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/594-present-value";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1042, height: 1509 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0651");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((n) => ({
    future: n.dataset.future,
    rate: n.dataset.rate,
    years: n.dataset.years,
    present: n.dataset.present,
    discount: n.dataset.discount,
    graded: n.dataset.graded,
    actions: n.dataset.actions,
    steps: n.querySelectorAll(".pv594-timeline section p").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Future cash flow (FV)", { exact: true }).fill("50000");
checks.future = await state();
await lesson.getByLabel("Interest rate (r)", { exact: true }).fill("10");
checks.rate = await state();
await lesson.getByLabel("Years (n)", { exact: true }).fill("3");
checks.years = await state();
await lesson.getByLabel("Future cash flow (FV) slider").fill("30000");
await lesson.getByLabel("Interest rate (r) slider").fill("5");
await lesson.getByLabel("Years (n) slider").fill("4");
checks.sliders = await state();
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.formula = await lesson.locator(".pv594-note").isVisible();
await lesson.getByRole("button", { name: /Interact/ }).click();
await lesson.getByLabel("Present value challenge answer").fill("7900");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Present value challenge answer").fill("7,938.32");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
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
  hero: await box(".pv594-hero"),
  tabs: await box(".pv594-tabs"),
  lab: await box(".pv594-lab"),
  theory: await box(".pv594-theory"),
  practice: await box(".pv594-practice"),
  adjacent: await box(".pv594-adjacent"),
};
await page.screenshot({ path: path.join(ev, "0651-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0651").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0651-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    near(checks.initial.present, 17824.65) &&
    checks.initial.steps === 5 &&
    near(checks.future.present, 35649.3) &&
    near(checks.rate.present, 31046.07) &&
    near(checks.years.present, 37565.74) &&
    checks.years.steps === 3 &&
    near(checks.sliders.present, 24681.07) &&
    checks.sliders.steps === 4 &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.reset.future === "25000" &&
    checks.final.rate === "7" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0651-reference.png"));
await writeFile(
  path.join(ev, "0651-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
