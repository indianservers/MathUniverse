/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0674-interactive-intermediate-advanced-financial-mathematics-and-modelling-linear-programming-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/617-linear-programming";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1019, height: 1543 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0674");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      point: n.dataset.optimalPoint,
      value: n.dataset.optimalValue,
      corners: n.dataset.cornerCount,
      c1: n.dataset.constraintOne,
      c2: n.dataset.constraintTwo,
      objective: n.dataset.objective,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Constraint 1 y-intercept", { exact: true }).fill("6");
checks.constraint = await state();
await lesson.getByLabel("Objective y coefficient").fill("5");
checks.objective = await state();
const line = lesson.locator("line.constraint.one"),
  box = await line.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 20, { steps: 6 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByLabel("Objective sweep").fill("12");
await lesson.getByLabel("Animate sweep").check();
await page.waitForTimeout(220);
await lesson.getByLabel("Animate sweep").uncheck();
checks.sweep = await state();
await lesson.getByLabel("Challenge maximum value").fill("14");
await lesson.getByLabel("Challenge optimal point").fill("2, 2");
await lesson.getByRole("button", { name: "Check your answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge maximum value").fill("30");
await lesson.getByLabel("Challenge optimal point").fill("0, 6");
await lesson.getByRole("button", { name: "Check your answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0674");
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
  hero: await measure(".lp617-hero"),
  tabs: await measure(".lp617-tabs"),
  lab: await measure(".lp617-lab"),
  analysis: await measure(".lp617-analysis"),
  bottom: await measure(".lp617-bottom"),
  adjacent: await measure(".lp617-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0674-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0674").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0674-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.point === "8,0" &&
    checks.initial.value === "24" &&
    checks.initial.corners === "5" &&
    checks.constraint.c1 !== checks.initial.c1 &&
    checks.objective.objective === "3,5" &&
    checks.drag.c1 !== checks.constraint.c1 &&
    Number(checks.sweep.actions) > 0 &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.reset.point === "8,0" &&
    checks.reset.value === "24" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0674-reference.png"));
await writeFile(
  path.join(evidence, "0674-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
