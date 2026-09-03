/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0656-interactive-intermediate-advanced-financial-mathematics-and-modelling-depreciation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/599-depreciation";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1052, height: 1495 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0656");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) => ({
    cost: node.dataset.cost,
    residual: node.dataset.residual,
    life: node.dataset.life,
    rate: node.dataset.rate,
    slEnd: node.dataset.slEnd,
    rbEnd: node.dataset.rbEnd,
    view: node.dataset.view,
    actions: node.dataset.actions,
    rows: node.querySelectorAll(".dep599-pattern tbody tr").length,
  }));
const checks = { initial: await state() };
await lesson.getByLabel("Asset cost (P)", { exact: true }).fill("120000");
await lesson.getByLabel("Residual value (S)", { exact: true }).fill("10000");
await lesson.getByLabel("Useful life (n)", { exact: true }).fill("6");
await lesson
  .getByLabel("Reducing-balance rate (r)", { exact: true })
  .fill("20");
checks.inputs = await state();
await lesson.getByLabel("Useful life (n) slider").fill("8");
await lesson.getByLabel("Reducing-balance rate (r) slider").fill("25");
checks.sliders = await state();
await lesson.getByRole("button", { name: "Table", exact: true }).click();
checks.table = {
  ...(await state()),
  rows: await lesson
    .locator(".dep599-work main .dep599-table tbody tr")
    .count(),
};
await lesson.getByRole("button", { name: "Graph", exact: true }).click();
const methods = lesson.locator('fieldset input[type="checkbox"]');
await methods.nth(0).setChecked(false);
checks.rbOnly = {
  sl: await lesson.locator(".dep599-work main svg polyline.sl").count(),
  rb: await lesson.locator(".dep599-work main svg polyline.rb").count(),
};
await methods.nth(1).setChecked(false);
checks.none = {
  sl: await lesson.locator(".dep599-work main svg polyline.sl").count(),
  rb: await lesson.locator(".dep599-work main svg polyline.rb").count(),
};
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".dep599-note").isVisible();
await lesson
  .getByRole("button", { name: "Reset to defaults", exact: true })
  .click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0656");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
  const b = await lesson.locator(selector).boundingBox();
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
  hero: await box(".dep599-hero"),
  tabs: await box(".dep599-tabs"),
  lab: await box(".dep599-lab"),
  pattern: await box(".dep599-pattern"),
  rule: await box(".dep599-rule"),
  practice: await box(".dep599-practice"),
  adjacent: await box(".dep599-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0656-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0656").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0656-mobile.png"),
  fullPage: true,
});
const near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.02,
  passed =
    checks.initial.cost === "100000" &&
    checks.initial.life === "5" &&
    near(checks.initial.slEnd, 0) &&
    near(checks.initial.rbEnd, 44370.53) &&
    checks.initial.rows === 6 &&
    checks.inputs.cost === "120000" &&
    checks.inputs.residual === "10000" &&
    checks.inputs.life === "6" &&
    checks.inputs.rate === "20" &&
    near(checks.inputs.slEnd, 10000) &&
    near(checks.inputs.rbEnd, 31457.28) &&
    checks.sliders.life === "8" &&
    checks.sliders.rate === "25" &&
    checks.table.view === "Table" &&
    checks.table.rows === 9 &&
    checks.rbOnly.sl === 0 &&
    checks.rbOnly.rb === 1 &&
    checks.none.sl === 0 &&
    checks.none.rb === 0 &&
    checks.formula &&
    checks.reset.cost === "100000" &&
    checks.reset.view === "Graph" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0656-reference.png"));
await writeFile(
  path.join(evidence, "0656-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
