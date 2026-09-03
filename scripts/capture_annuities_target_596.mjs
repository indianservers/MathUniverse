/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0653-interactive-intermediate-advanced-financial-mathematics-and-modelling-annuities-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/596-annuities";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 989, height: 1591 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0653");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((n) => ({
    payment: n.dataset.payment,
    rate: n.dataset.rate,
    periods: n.dataset.periods,
    timing: n.dataset.timing,
    fv: n.dataset.fv,
    pv: n.dataset.pv,
    view: n.dataset.view,
    graded: n.dataset.graded,
    actions: n.dataset.actions,
    payments: n.querySelectorAll(".an596-payments .paid").length,
    points: n.querySelectorAll(".an596-middle svg circle").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Payment (PMT)").fill("10000");
checks.payment = await state();
await lesson.getByLabel("Rate per period (i)", { exact: true }).fill("8");
checks.rate = await state();
await lesson.getByLabel("Number of periods (n)").fill("7");
checks.periods = await state();
await lesson.getByRole("button", { name: "Due (beginning)" }).click();
checks.due = await state();
await lesson.getByRole("button", { name: "PV (Present Value)" }).click();
checks.pvView = await state();
await lesson.getByLabel("Manipulate payment").fill("4000");
await lesson.getByLabel("Manipulate rate").fill("6");
await lesson.getByLabel("Manipulate periods").fill("10");
checks.sliders = await state();
await lesson.getByRole("button", { name: "Ordinary" }).click();
checks.ordinary = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".an596-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.locator(".an596-challenge label").nth(0).click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.locator(".an596-challenge label").nth(1).click();
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
  hero: await box(".an596-hero"),
  tabs: await box(".an596-tabs"),
  observe: await box(".an596-observe"),
  middle: await box(".an596-middle"),
  lower: await box(".an596-lower"),
  worked: await box(".an596-worked"),
  adjacent: await box(".an596-adjacent"),
};
await page.screenshot({ path: path.join(ev, "0653-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0653").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0653-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    near(checks.initial.fv, 65903.97) &&
    near(checks.initial.pv, 36800.44) &&
    checks.initial.payments === 10 &&
    near(checks.payment.fv, 131807.95) &&
    checks.periods.payments === 7 &&
    checks.due.timing === "due" &&
    checks.pvView.view === "PV" &&
    checks.sliders.payment === "4000" &&
    checks.ordinary.timing === "ordinary" &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.reset.payment === "5000" &&
    checks.final.rate === "6" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0653-reference.png"));
await writeFile(
  path.join(ev, "0653-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
