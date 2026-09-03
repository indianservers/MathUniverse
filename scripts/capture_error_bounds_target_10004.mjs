/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0678-school-class-6-numbers-and-arithmetic-approximation-and-error-bounds-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-numbers-and-arithmetic-approximation-and-error-bounds";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 958, height: 1641 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0678");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      exact: n.dataset.exact,
      step: n.dataset.step,
      rounded: n.dataset.rounded,
      lower: n.dataset.lower,
      upper: n.dataset.upper,
      absolute: n.dataset.absolute,
      relative: n.dataset.relative,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Exact value", { exact: true }).fill("47.628");
await lesson.getByLabel("Round to place").selectOption("0.01");
checks.precision = await state();
for (const name of ["Show bounds", "Show rounded value", "Show exact value"]) {
  await lesson.getByLabel(name).uncheck();
  await lesson.getByLabel(name).check();
}
checks.toggles = await state();
const dot = lesson.locator("circle.exact"),
  box = await dot.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 25, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
}
checks.drag = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByLabel("Mini challenge rounded value").fill("12.8");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Mini challenge rounded value").fill("12.9");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0678");
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
  hero: await measure(".eb10004-hero"),
  tabs: await measure(".eb10004-tabs"),
  lab: await measure(".eb10004-lab"),
  pattern: await measure(".eb10004-pattern"),
  lower: await measure(".eb10004-lower"),
  adjacent: await measure(".eb10004-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0678-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0678").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0678-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.rounded === "4.3" &&
    checks.initial.lower === "4.25" &&
    checks.initial.upper === "4.35" &&
    checks.precision.rounded === "47.63" &&
    checks.precision.lower === "47.625" &&
    checks.precision.upper === "47.635" &&
    checks.precision.absolute === "0.0020" &&
    checks.drag.exact !== checks.precision.exact &&
    Number(checks.toggles.actions) >= 8 &&
    checks.reset.exact === "4.3268" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0678-reference.png"));
await writeFile(
  path.join(evidence, "0678-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
