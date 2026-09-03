/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0657-interactive-intermediate-advanced-financial-mathematics-and-modelling-inflation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/600-inflation",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0657");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      price: n.dataset.price,
      rate: n.dataset.rate,
      years: n.dataset.years,
      future: n.dataset.future,
      graded: n.dataset.graded,
      solution: n.dataset.solution,
      actions: n.dataset.actions,
      points: n.querySelectorAll(".inf600-chart svg circle").length,
      cells: n.querySelectorAll(".inf600-chart table td").length,
    })),
  checks = { initial: await state() };
await lesson
  .getByLabel("Today's basket price (P₀)", { exact: true })
  .fill("3000");
await lesson.getByLabel("Inflation rate (r)", { exact: true }).fill("5");
await lesson.getByLabel("Years (n)", { exact: true }).fill("6");
checks.inputs = await state();
await lesson.getByLabel("Today's basket price (P₀) slider").fill("1500");
await lesson.getByLabel("Inflation rate (r) slider").fill("7");
await lesson.getByLabel("Years (n) slider").fill("10");
checks.challenge = await state();
await lesson
  .getByRole("button", { name: "Check my answer", exact: true })
  .click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "Show solution", exact: true })
  .click();
checks.solution = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".inf600-note").isVisible();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0657");
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
    hero: await box(".inf600-hero"),
    tabs: await box(".inf600-tabs"),
    lab: await box(".inf600-lab"),
    theory: await box(".inf600-theory"),
    challenge: await box(".inf600-challenge"),
    adjacent: await box(".inf600-adjacent"),
  };
await page.screenshot({ path: path.join(ev, "0657-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0657").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0657-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    near(checks.initial.future, 3187.7) &&
    checks.initial.points === 9 &&
    checks.initial.cells === 9 &&
    checks.inputs.price === "3000" &&
    checks.inputs.rate === "5" &&
    checks.inputs.years === "6" &&
    checks.challenge.price === "1500" &&
    checks.challenge.rate === "7" &&
    checks.challenge.years === "10" &&
    near(checks.challenge.future, 2950.73) &&
    checks.correct.graded === "true" &&
    checks.solution.solution === "true" &&
    checks.formula &&
    checks.reset.price === "2000" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0657-reference.png"));
await writeFile(
  path.join(ev, "0657-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
