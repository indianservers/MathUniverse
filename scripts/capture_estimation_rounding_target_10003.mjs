/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0677-school-class-6-numbers-and-arithmetic-estimation-and-rounding-lab-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-numbers-and-arithmetic-estimation-and-rounding-lab";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 958, height: 1641 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0677");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      number: n.dataset.number,
      step: n.dataset.step,
      rounded: n.dataset.rounded,
      error: n.dataset.error,
      items: n.dataset.items,
      estimate: n.dataset.estimateTotal,
      actual: n.dataset.actualTotal,
      totalError: n.dataset.totalError,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByRole("button", { name: "67", exact: true }).click();
checks.quick = await state();
await lesson.getByLabel("Rounding place").selectOption("100");
checks.place = await state();
await lesson.getByLabel("Rounding place").selectOption("10");
const dot = lesson.locator("circle.number"),
  box = await dot.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: "53", exact: true }).first().click();
await lesson.getByRole("button", { name: /Add number/ }).click();
checks.add = await state();
await lesson.locator(".er10003-totals .chips button").first().click();
checks.remove = await state();
await lesson.getByRole("button", { name: /Clear all/ }).click();
checks.clear = await state();
await lesson
  .getByRole("button", { name: "Reset", exact: true })
  .first()
  .click();
checks.reset = await state();
await lesson.getByLabel("Challenge estimate").fill("90");
await lesson.getByLabel("Challenge error").fill("8");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge estimate").fill("80");
await lesson.getByLabel("Challenge error").fill("2");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0677");
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
  hero: await measure(".er10003-hero"),
  tabs: await measure(".er10003-tabs"),
  lab: await measure(".er10003-lab"),
  totals: await measure(".er10003-totals"),
  theory: await measure(".er10003-theory"),
  challenge: await measure(".er10003-challenge"),
  adjacent: await measure(".er10003-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0677-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0677").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0677-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.number === "53" &&
    checks.initial.rounded === "50" &&
    checks.initial.estimate === "130" &&
    checks.initial.actual === "128" &&
    checks.quick.number === "67" &&
    checks.quick.rounded === "70" &&
    checks.place.step === "100" &&
    checks.place.rounded === "100" &&
    checks.drag.number !== checks.quick.number &&
    checks.add.items.split(",").length === 4 &&
    checks.remove.items.split(",").length === 3 &&
    checks.clear.items === "" &&
    checks.reset.items === "53,27,48" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0677-reference.png"));
await writeFile(
  path.join(evidence, "0677-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
