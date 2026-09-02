/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0649-interactive-intermediate-advanced-financial-mathematics-and-modelling-compound-interest-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/592-compound-interest";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0649");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((node) => ({
    principal: node.dataset.principal,
    rate: node.dataset.rate,
    frequency: node.dataset.frequency,
    time: node.dataset.time,
    year: node.dataset.year,
    amount: node.dataset.amount,
    simple: node.dataset.simple,
    interest: node.dataset.interest,
    graded: node.dataset.graded,
    actions: node.dataset.actions,
    rows: node.querySelectorAll(".ci592-table-wrap tbody tr").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Principal (P)", { exact: true }).fill("20000");
checks.principal = await state();
await lesson.getByLabel("Annual rate (r)", { exact: true }).fill("10");
checks.rate = await state();
await lesson.getByLabel("Compounding per year (n)", { exact: true }).fill("4");
checks.frequency = await state();
await lesson.getByLabel("Time (t)", { exact: true }).fill("3");
checks.time = await state();
await lesson.getByLabel("Displayed year").fill("2");
checks.displayYear = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".ci592-tab-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("A₹16,078.66").click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel(/B₹17,212.85/).click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByLabel("Time (t)", { exact: true }).fill("2");
await lesson.getByRole("button", { name: "Play animation" }).click();
await page.waitForTimeout(1200);
checks.play = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
  const value = await lesson.locator(selector).boundingBox();
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
  hero: await box(".ci592-hero"),
  tabs: await box(".ci592-tabs"),
  lab: await box(".ci592-lab"),
  theory: await box(".ci592-theory"),
  adjacent: await box(".ci592-adjacent"),
};
await page.screenshot({ path: path.join(ev, "0649-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0649").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0649-mobile.png"),
  fullPage: true,
});
const near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.02;
const passed =
  near(checks.initial.amount, 14693.28) &&
  checks.initial.rows === 6 &&
  near(checks.principal.amount, 29386.56) &&
  near(checks.rate.amount, 32210.2) &&
  near(checks.frequency.amount, 32772.33) &&
  checks.time.rows === 4 &&
  near(checks.time.amount, 26897.78) &&
  checks.displayYear.year === "2" &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.play.year === "2" &&
  checks.final.principal === "10000" &&
  !metrics.overflow &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0649-reference.png"));
await writeFile(
  path.join(ev, "0649-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
