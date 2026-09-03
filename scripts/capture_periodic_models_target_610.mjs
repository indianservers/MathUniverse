/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0667-interactive-intermediate-advanced-financial-mathematics-and-modelling-periodic-models-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/610-periodic-models",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1013, height: 1553 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0667");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      amplitude: node.dataset.amplitude,
      period: node.dataset.period,
      phase: node.dataset.phase,
      midline: node.dataset.midline,
      peak: node.dataset.peak,
      trough: node.dataset.trough,
      locks: node.dataset.locks,
      dragging: node.dataset.dragging,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Amplitude a (Rs) slider").fill("5000");
await lesson.getByLabel("Period P (months)", { exact: true }).fill("8");
await lesson.getByLabel("Phase shift h (months) slider").fill("2");
await lesson.getByLabel("Midline d (Rs)", { exact: true }).fill("20000");
checks.controls = await state();
await lesson.getByLabel("Lock amplitude").click();
checks.locked = await state();
checks.disabled = await lesson
  .getByLabel("Amplitude a (Rs) slider")
  .isDisabled();
await lesson.getByLabel("Unlock amplitude").click();
const peak = lesson.locator("circle.peak"),
  peakBox = await peak.boundingBox();
if (peakBox) {
  await page.mouse.move(
    peakBox.x + peakBox.width / 2,
    peakBox.y + peakBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(peakBox.x + 35, peakBox.y - 14, { steps: 4 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".pm610-note").isVisible();
await lesson.getByRole("button", { name: "Reset all", exact: true }).click();
checks.reset = await state();
await lesson.getByLabel("Challenge amplitude").fill("3000");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge amplitude").fill("4000");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "New Challenge", exact: true })
  .click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.newChallenge = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0667");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (selector) => {
    const value = await lesson.locator(selector).first().boundingBox();
    return value
      ? {
          top: Math.round(value.y),
          height: Math.round(value.height),
          bottom: Math.round(value.y + value.height),
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
    hero: await measure(".pm610-hero"),
    tabs: await measure(".pm610-tabs"),
    lab: await measure(".pm610-lab"),
    theory: await measure(".pm610-theory"),
    challenge: await measure(".pm610-challenge"),
    adjacent: await measure(".pm610-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0667-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0667").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0667-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.amplitude === "3000" &&
    checks.initial.period === "12" &&
    checks.initial.phase === "0" &&
    checks.initial.midline === "10000" &&
    checks.initial.peak === "13000" &&
    checks.initial.trough === "7000" &&
    checks.controls.peak === "25000" &&
    checks.controls.trough === "15000" &&
    checks.locked.locks === "1" &&
    checks.disabled &&
    checks.drag.amplitude !== checks.controls.amplitude &&
    checks.formula &&
    checks.reset.amplitude === "3000" &&
    checks.reset.period === "12" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.newChallenge.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0667-reference.png"));
await writeFile(
  path.join(evidence, "0667-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
