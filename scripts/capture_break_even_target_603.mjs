/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0660-interactive-intermediate-advanced-financial-mathematics-and-modelling-break-even-analysis-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/603-break-even-analysis";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 992, height: 1586 } });
const logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0660");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) => ({
    fixed: node.dataset.fixed,
    variable: node.dataset.variable,
    price: node.dataset.price,
    quantity: node.dataset.quantity,
    revenue: node.dataset.revenue,
    cost: node.dataset.cost,
    profit: node.dataset.profit,
    cm: node.dataset.cm,
    be: node.dataset.be,
    graded: node.dataset.graded,
    actions: node.dataset.actions,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Quantity slider").fill("150");
checks.quantity = await state();
await lesson.getByLabel("Fixed cost (Rs) slider").fill("80000");
await lesson
  .getByLabel("Variable cost per unit (Rs)", { exact: true })
  .fill("300");
await lesson
  .getByLabel("Selling price per unit (Rs)", { exact: true })
  .fill("750");
checks.assumptions = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".be603-note").isVisible();
await lesson.getByLabel("Break-even challenge answer").fill("177");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Break-even challenge answer").fill("178");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show Hint", exact: true }).click();
checks.hint = await lesson.locator(".be603-challenge > aside p").isVisible();
await lesson.getByRole("button", { name: "Reset All", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0660");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
  const value = await lesson.locator(selector).first().boundingBox();
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
  hero: await box(".be603-hero"),
  tabs: await box(".be603-tabs"),
  body: await box(".be603-body"),
  chart: await box(".be603-chart"),
  controls: await box(".be603-controls"),
  challenge: await box(".be603-challenge"),
  adjacent: await box(".be603-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0660-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0660").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0660-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.fixed === "50000" &&
  checks.initial.variable === "400" &&
  checks.initial.price === "900" &&
  checks.initial.quantity === "100" &&
  checks.initial.revenue === "90000" &&
  checks.initial.cost === "90000" &&
  checks.initial.profit === "0" &&
  checks.initial.cm === "500" &&
  checks.initial.be === "100.00" &&
  checks.quantity.revenue === "135000" &&
  checks.quantity.cost === "110000" &&
  checks.quantity.profit === "25000" &&
  checks.assumptions.be === "177.78" &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.hint &&
  checks.reset.be === "100.00" &&
  !metrics.overflow &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0660-reference.png"));
await writeFile(
  path.join(evidence, "0660-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
