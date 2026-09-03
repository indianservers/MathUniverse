/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0654-interactive-intermediate-advanced-financial-mathematics-and-modelling-loans-and-emis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/597-loans-and-emis";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1017, height: 1546 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0654");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((n) => ({
    principal: n.dataset.principal,
    rate: n.dataset.rate,
    years: n.dataset.years,
    months: n.dataset.months,
    emi: n.dataset.emi,
    interest: n.dataset.interest,
    firstPrincipal: n.dataset.firstPrincipal,
    graded: n.dataset.graded,
    actions: n.dataset.actions,
    chartLabels: n.querySelectorAll(".loan597-pattern svg text").length,
    tableRows: n.querySelectorAll(".loan597-lower tbody tr").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Loan principal (P)", { exact: true }).fill("600000");
checks.principal = await state();
await lesson.getByLabel("Annual interest rate (r)", { exact: true }).fill("10");
checks.rate = await state();
await lesson.getByLabel("Loan term (tenure)", { exact: true }).fill("10");
checks.term = await state();
await lesson.getByLabel("Loan currency").selectOption("US Dollar (USD)");
checks.currency = await lesson.getByLabel("Loan currency").inputValue();
await lesson.getByLabel("Loan principal (P) slider").fill("750000");
await lesson.getByLabel("Annual interest rate (r) slider").fill("8.5");
await lesson.getByLabel("Loan term (tenure) slider").fill("6");
checks.sliders = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".loan597-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Your EMI (₹)").fill("13000");
await lesson.getByLabel("Total interest (₹)").fill("200000");
await lesson.getByLabel("Principal repaid in Month 1 (₹)").fill("8000");
await lesson.getByRole("button", { name: "Check My Answers" }).click();
checks.wrong = await state();
await lesson.getByLabel("Your EMI (₹)").fill("13,333.79");
await lesson.getByLabel("Total interest (₹)").fill("210,032.77");
await lesson.getByLabel("Principal repaid in Month 1 (₹)").fill("8,021.29");
await lesson.getByRole("button", { name: "Check My Answers" }).click();
checks.correct = await state();
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
  hero: await box(".loan597-hero"),
  tabs: await box(".loan597-tabs"),
  top: await box(".loan597-top"),
  pattern: await box(".loan597-pattern"),
  lower: await box(".loan597-lower"),
  explore: await box(".loan597-explore"),
  adjacent: await box(".loan597-adjacent"),
};
await page.screenshot({ path: path.join(ev, "0654-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0654").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0654-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    near(checks.initial.emi, 10379.18) &&
    near(checks.initial.interest, 122750.66) &&
    near(checks.initial.firstPrincipal, 6629.18) &&
    checks.initial.months === "60" &&
    checks.initial.tableRows === 4 &&
    near(checks.principal.emi, 12455.02) &&
    checks.term.months === "120" &&
    checks.currency === "US Dollar (USD)" &&
    near(checks.sliders.emi, 13333.79) &&
    checks.sliders.months === "72" &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.final.principal === "500000" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0654-reference.png"));
await writeFile(
  path.join(ev, "0654-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
