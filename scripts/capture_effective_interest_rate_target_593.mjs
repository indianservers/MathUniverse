/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0650-interactive-intermediate-advanced-financial-mathematics-and-modelling-effective-interest-rate-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/593-effective-interest-rate";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1019, height: 1543 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0650");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((n) => ({
    rate: n.dataset.rate,
    frequency: n.dataset.frequency,
    principal: n.dataset.principal,
    time: n.dataset.time,
    amount: n.dataset.amount,
    ear: n.dataset.ear,
    extra: n.dataset.extra,
    graded: n.dataset.graded,
    actions: n.dataset.actions,
    bars: n.querySelectorAll(".eir593-bars button").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Nominal APR (r)", { exact: true }).fill("10");
checks.rate = await state();
await lesson.getByTitle("Select Quarterly").click();
checks.quarterly = await state();
await lesson.getByLabel("Principal (P)", { exact: true }).fill("20000");
checks.principal = await state();
await lesson.getByLabel("Time (t)", { exact: true }).fill("2");
checks.time = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".eir593-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Match 1").selectOption("4");
await lesson.getByLabel("Match 2").selectOption("12");
await lesson.getByLabel("Match 3").selectOption("52");
await lesson.getByRole("button", { name: "Check Answers" }).click();
checks.wrong = await state();
await lesson.getByLabel("Match 1").selectOption("12");
await lesson.getByLabel("Match 2").selectOption("4");
await lesson.getByLabel("Match 3").selectOption("12");
await lesson.getByRole("button", { name: "Check Answers" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show explanation" }).click();
checks.explanation = await lesson.locator(".eir593-explanation").isVisible();
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
  hero: await box(".eir593-hero"),
  tabs: await box(".eir593-tabs"),
  lab: await box(".eir593-lab"),
  theory: await box(".eir593-theory"),
  worked: await box(".eir593-worked"),
  practice: await box(".eir593-practice"),
  adjacent: await box(".eir593-adjacent"),
};
await page.screenshot({ path: path.join(ev, "0650-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0650").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0650-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    near(checks.initial.amount, 11268.25) &&
    near(checks.initial.ear, 12.6825) &&
    checks.initial.bars === 6 &&
    near(checks.rate.ear, 10.4713) &&
    checks.quarterly.frequency === "4" &&
    near(checks.quarterly.ear, 10.3813) &&
    near(checks.principal.amount, 22076.26) &&
    near(checks.time.amount, 24368.06) &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.explanation &&
    checks.final.rate === "12" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0650-reference.png"));
await writeFile(
  path.join(ev, "0650-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
