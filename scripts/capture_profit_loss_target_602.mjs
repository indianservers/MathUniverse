/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0659-interactive-intermediate-advanced-financial-mathematics-and-modelling-profit-loss-markup-and-margin-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/602-profit-loss-markup-and-margin",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1009, height: 1559 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0659");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      selling: n.dataset.selling,
      profit: n.dataset.profit,
      markup: n.dataset.markup,
      margin: n.dataset.margin,
      display: n.dataset.display,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
      rows: n.querySelectorAll(".pl602-row tbody tr").length,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Selling price slider").fill("600");
checks.loss = await state();
await lesson.getByRole("button", { name: "Show as loss", exact: true }).click();
checks.lossDisplay = await state();
await lesson.getByRole("row", { name: /^1,400/ }).click();
checks.table = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".pl602-note").isVisible();
for (const [label, value] of [
  ["Selling price (₹)", "1"],
  ["Profit (₹)", "1"],
  ["Margin (%)", "1"],
])
  await lesson.getByLabel(label, { exact: true }).fill(value);
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
for (const [label, value] of [
  ["Selling price (₹)", "1140"],
  ["Profit (₹)", "190"],
  ["Margin (%)", "16.67"],
])
  await lesson.getByLabel(label, { exact: true }).fill(value);
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0659");
await lesson.waitFor();
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
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await box(".pl602-hero"),
    tabs: await box(".pl602-tabs"),
    lab: await box(".pl602-lab"),
    upper: await box(".pl602-row:not(.pl602-lower)"),
    lower: await box(".pl602-lower"),
    adjacent: await box(".pl602-adjacent"),
  };
await page.screenshot({ path: path.join(ev, "0659-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0659").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0659-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    checks.initial.selling === "1100" &&
    checks.initial.profit === "300" &&
    near(checks.initial.markup, 37.5) &&
    near(checks.initial.margin, 27.27) &&
    checks.initial.rows === 5 &&
    checks.loss.profit === "-200" &&
    near(checks.loss.markup, -25) &&
    near(checks.loss.margin, -33.33) &&
    checks.lossDisplay.display === "loss" &&
    checks.table.selling === "1400" &&
    checks.table.profit === "600" &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0659-reference.png"));
await writeFile(
  path.join(ev, "0659-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
