/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0666-interactive-intermediate-advanced-financial-mathematics-and-modelling-exponential-and-logistic-models-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/609-exponential-and-logistic-models",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1000, height: 1573 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0666");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      kind: node.dataset.kind,
      p0: node.dataset.p0,
      capacity: node.dataset.capacity,
      rate: node.dataset.rate,
      inflection: node.dataset.inflection,
      p5: node.dataset.p5,
      p10: node.dataset.p10,
      rows: node.dataset.rows,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Initial value P0 slider").fill("2000");
await lesson.getByLabel("Carrying capacity K", { exact: true }).fill("20000");
await lesson.getByLabel("Growth rate r (per time unit) slider").fill("0.5");
await lesson.getByLabel("Table step").fill("2");
checks.parameters = await state();
await lesson.getByLabel("Inflection time t0", { exact: true }).fill("10");
checks.inflection = await state();
await lesson.getByRole("button", { name: "growth", exact: true }).click();
checks.growth = await state();
await lesson.getByRole("button", { name: "decay", exact: true }).click();
checks.decay = await state();
await lesson.getByRole("button", { name: "logistic", exact: true }).click();
checks.logistic = await state();
await lesson
  .getByRole("button", { name: "Reveal solution", exact: true })
  .click();
checks.solution = await lesson
  .locator(".el609-theory article:nth-child(3)>aside")
  .isVisible();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".el609-note").isVisible();
await lesson.getByRole("button", { name: "Reset all", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0666");
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
    hero: await measure(".el609-hero"),
    tabs: await measure(".el609-tabs"),
    lab: await measure(".el609-lab"),
    theory: await measure(".el609-theory"),
    worked: await measure(".el609-worked"),
    adjacent: await measure(".el609-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0666-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0666").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0666-mobile.png"),
  fullPage: true,
});
const near = (actual, expected, tolerance = 0.02) =>
    Math.abs(Number(actual) - expected) < tolerance,
  linkedRate = Math.log(9) / 10,
  passed =
    checks.initial.kind === "logistic" &&
    checks.initial.p0 === "1000" &&
    checks.initial.capacity === "10000" &&
    near(checks.initial.inflection, Math.log(9) / 0.44) &&
    checks.initial.rows === "11" &&
    checks.parameters.p0 === "2000" &&
    checks.parameters.capacity === "20000" &&
    checks.inflection.inflection === "10.0000" &&
    near(checks.inflection.rate, linkedRate) &&
    checks.growth.kind === "growth" &&
    near(checks.growth.p5, 2000 * Math.exp(linkedRate * 5), 0.03) &&
    checks.decay.kind === "decay" &&
    near(checks.decay.p5, 2000 * Math.exp(-linkedRate * 5), 0.03) &&
    checks.logistic.kind === "logistic" &&
    checks.solution &&
    checks.formula &&
    checks.reset.rate === "0.4400" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0666-reference.png"));
await writeFile(
  path.join(evidence, "0666-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
