/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0648-interactive-intermediate-advanced-financial-mathematics-and-modelling-simple-interest-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/591-simple-interest";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1028, height: 1530 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("finance-mockup-0648");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
    lesson.evaluate((n) => ({
      p: n.dataset.principal,
      rate: n.dataset.rate,
      time: n.dataset.time,
      interest: n.dataset.interest,
      amount: n.dataset.amount,
      annual: n.dataset.annual,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
      rows: n.querySelectorAll(".si591-lab tbody tr").length,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Simple interest principal").fill("15000");
checks.p15000 = await state();
await lesson.getByLabel("Simple interest annual rate").fill("8");
checks.r8 = await state();
await lesson
  .getByRole("spinbutton", { name: "Simple interest time", exact: true })
  .fill("3");
checks.t3 = await state();
await lesson.getByLabel("Principal slider").fill("25000");
await lesson.getByLabel("Rate slider").fill("9");
await lesson.getByLabel("Time slider").fill("4");
checks.sliders = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".si591-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Simple interest challenge interest").fill("8000");
await lesson.getByLabel("Simple interest challenge amount").fill("33000");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Simple interest challenge interest").fill("9,000");
await lesson.getByLabel("Simple interest challenge amount").fill("34,000");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
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
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await box(".si591-hero"),
    lab: await box(".si591-lab"),
    theory: await box(".si591-theory"),
    practice: await box(".si591-practice"),
    adjacent: await box(".si591-adjacent"),
  };
await page.screenshot({ path: path.join(ev, "0648-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0648").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0648-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.interest === "3000" &&
  checks.initial.amount === "13000" &&
  checks.initial.annual === "600" &&
  checks.initial.rows === 6 &&
  checks.p15000.interest === "4500" &&
  checks.r8.interest === "6000" &&
  checks.t3.interest === "3600" &&
  checks.t3.amount === "18600" &&
  checks.t3.rows === 4 &&
  checks.sliders.interest === "9000" &&
  checks.sliders.amount === "34000" &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.p === "10000" &&
  !metrics.overflow &&
  metrics.adjacent?.bottom <= 1530 &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0648-reference.png"));
await writeFile(
  path.join(ev, "0648-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
