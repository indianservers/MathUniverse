/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0672-interactive-intermediate-advanced-financial-mathematics-and-modelling-residual-and-error-analysis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/615-residual-and-error-analysis";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1042, height: 1509 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0672");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      model: n.dataset.model,
      a: n.dataset.a,
      m: n.dataset.m,
      b: n.dataset.b,
      sse: n.dataset.sse,
      mae: n.dataset.mae,
      points: n.dataset.points,
      scale: n.dataset.scale,
      display: n.dataset.display,
      practice: n.dataset.practice,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Slope value").fill("1.5");
await lesson.getByLabel("Intercept value").fill("2");
checks.controls = await state();
await lesson.getByLabel("Residual scale").selectOption("fixed");
await lesson.getByLabel("Show residuals").uncheck();
await lesson.getByLabel("Show table").uncheck();
checks.display = await state();
await lesson.getByLabel("Model type").selectOption("quadratic");
await lesson.getByLabel("Quadratic coefficient").fill("0.2");
checks.quadratic = await state();
const point = lesson.locator("circle.observed").nth(3),
  box = await point.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y - 25, { steps: 4 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson
  .getByRole("button", { name: "Open Practice", exact: true })
  .click();
checks.practice = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".re615-note").isVisible();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0672");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (s) => {
  const v = await lesson.locator(s).first().boundingBox();
  return v
    ? {
        top: Math.round(v.y),
        height: Math.round(v.height),
        bottom: Math.round(v.y + v.height),
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
  hero: await measure(".re615-hero"),
  tabs: await measure(".re615-tabs"),
  lab: await measure(".re615-lab"),
  theory: await measure(".re615-theory"),
  adjacent: await measure(".re615-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0672-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0672").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0672-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.model === "linear" &&
    checks.initial.sse === "9.00" &&
    checks.initial.mae === "1.00" &&
    checks.controls.sse !== checks.initial.sse &&
    checks.display.scale === "fixed" &&
    !checks.display.display.includes("residuals") &&
    !checks.display.display.includes("table") &&
    checks.quadratic.model === "quadratic" &&
    checks.quadratic.a === "0.200" &&
    checks.drag.sse !== checks.quadratic.sse &&
    checks.practice.practice === "true" &&
    Number(checks.practice.sse) < Number(checks.drag.sse) &&
    checks.formula &&
    checks.reset.model === "linear" &&
    checks.reset.sse === "9.00" &&
    metrics.hero?.top === 109 &&
    metrics.hero?.bottom === 288 &&
    metrics.tabs?.top === 300 &&
    metrics.lab?.top === 368 &&
    metrics.lab?.bottom === 1282 &&
    metrics.theory?.top === 1294 &&
    metrics.theory?.bottom === 1438 &&
    metrics.adjacent?.top === 1450 &&
    metrics.adjacent?.bottom === 1498 &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0672-reference.png"));
await writeFile(
  path.join(evidence, "0672-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
