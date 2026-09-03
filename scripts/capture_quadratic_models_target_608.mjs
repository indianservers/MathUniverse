/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0665-interactive-intermediate-advanced-financial-mathematics-and-modelling-quadratic-models-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/608-quadratic-models",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 966, height: 1628 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0665");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      a: node.dataset.a,
      b: node.dataset.b,
      c: node.dataset.c,
      vertexX: node.dataset.vertexX,
      vertexY: node.dataset.vertexY,
      roots: node.dataset.roots,
      mode: node.dataset.mode,
      dragging: node.dataset.dragging,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("a slider").fill("-1");
await lesson.getByLabel("b", { exact: true }).fill("2");
await lesson.getByLabel("c slider").fill("-3");
checks.coefficients = await state();
await lesson.getByRole("button", { name: "Points", exact: true }).click();
await lesson.getByLabel("Vertex x slider").fill("2");
checks.pointsMode = await state();
await lesson.getByLabel("Show roots").uncheck();
await lesson.getByLabel("Show axis of symmetry").uncheck();
checks.toggles = {
  roots: await lesson.getByLabel("Show roots").isChecked(),
  axis: await lesson.getByLabel("Show axis of symmetry").isChecked(),
};
await lesson.getByRole("button", { name: "How to use", exact: true }).click();
checks.help = await lesson.locator(".qm608-help").isVisible();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
const vertex = lesson.locator("circle.vertex"),
  vertexBox = await vertex.boundingBox();
if (vertexBox) {
  await page.mouse.move(
    vertexBox.x + vertexBox.width / 2,
    vertexBox.y + vertexBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(vertexBox.x + 45, vertexBox.y - 20, { steps: 4 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".qm608-note").isVisible();
await lesson.getByLabel("Maximum projectile height").fill("20");
await lesson.getByLabel("Projectile ground time").fill("4");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Maximum projectile height").fill("25");
await lesson.getByLabel("Projectile ground time").fill("4.24");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0665");
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
    hero: await measure(".qm608-hero"),
    tabs: await measure(".qm608-tabs"),
    sequence: await measure(".qm608-sequence"),
    lab: await measure(".qm608-lab"),
    strip: await measure(".qm608-strip"),
    theory: await measure(".qm608-theory"),
    challenge: await measure(".qm608-challenge"),
    adjacent: await measure(".qm608-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0665-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0665").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0665-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.a === "-2" &&
    checks.initial.b === "4" &&
    checks.initial.c === "-1" &&
    checks.initial.vertexX === "1.00" &&
    checks.initial.vertexY === "1.00" &&
    checks.initial.roots === "0.29,1.71" &&
    checks.coefficients.vertexX === "1.00" &&
    checks.coefficients.vertexY === "-2.00" &&
    checks.coefficients.roots === "" &&
    checks.pointsMode.mode === "points" &&
    checks.pointsMode.vertexX === "2.00" &&
    !checks.toggles.roots &&
    !checks.toggles.axis &&
    checks.help &&
    checks.reset.vertexX === "1.00" &&
    checks.drag.vertexX !== "1.00" &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0665-reference.png"));
await writeFile(
  path.join(evidence, "0665-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
