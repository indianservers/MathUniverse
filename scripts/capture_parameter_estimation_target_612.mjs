/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0669-interactive-intermediate-advanced-financial-mathematics-and-modelling-parameter-estimation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/612-parameter-estimation";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1017, height: 1546 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0669");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      slope: n.dataset.slope,
      intercept: n.dataset.intercept,
      fitSlope: n.dataset.fitSlope,
      fitIntercept: n.dataset.fitIntercept,
      sse: n.dataset.sse,
      rmse: n.dataset.rmse,
      r2: n.dataset.r2,
      points: n.dataset.points,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Slope", { exact: true }).fill("2.5");
await lesson.getByLabel("Intercept", { exact: true }).fill("20");
checks.controls = await state();
await lesson
  .getByRole("button", { name: "Suggest Best Fit", exact: true })
  .click();
checks.suggested = await state();
const point = lesson.locator("circle.point").nth(15),
  box = await point.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y - 30, { steps: 4 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".pe612-note").isVisible();
await lesson.getByRole("button", { name: "Reset model", exact: true }).click();
checks.reset = await state();
await lesson.getByLabel("Challenge slope").fill("2.5");
await lesson.getByLabel("Challenge intercept").fill("3");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge slope").fill("2.40");
await lesson.getByLabel("Challenge intercept").fill("3.15");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0669");
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
  hero: await measure(".pe612-hero"),
  sequence: await measure(".pe612-sequence"),
  lab: await measure(".pe612-lab"),
  theory: await measure(".pe612-theory"),
  challenge: await measure(".pe612-challenge"),
  adjacent: await measure(".pe612-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0669-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0669").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0669-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.slope === "4.000" &&
    checks.initial.intercept === "10.000" &&
    checks.initial.points === "32" &&
    checks.controls.slope === "2.500" &&
    checks.controls.intercept === "20.000" &&
    checks.controls.sse !== checks.initial.sse &&
    checks.suggested.slope === checks.suggested.fitSlope &&
    checks.suggested.intercept === checks.suggested.fitIntercept &&
    checks.drag.fitSlope !== checks.suggested.fitSlope &&
    checks.formula &&
    checks.reset.slope === "4.000" &&
    checks.reset.intercept === "10.000" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    metrics.hero?.top === 111 &&
    metrics.hero?.bottom === 298 &&
    metrics.sequence?.top === 339 &&
    metrics.lab?.top === 412 &&
    metrics.lab?.bottom === 944 &&
    metrics.theory?.top === 958 &&
    metrics.theory?.bottom === 1289 &&
    metrics.challenge?.top === 1301 &&
    metrics.challenge?.bottom === 1390 &&
    metrics.adjacent?.top === 1402 &&
    metrics.adjacent?.bottom === 1456 &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0669-reference.png"));
await writeFile(
  path.join(evidence, "0669-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
