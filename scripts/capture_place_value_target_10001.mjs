/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0675-school-class-6-numbers-and-arithmetic-place-value-explorer-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-numbers-and-arithmetic-place-value-explorer";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 967, height: 1642 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0675");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      number: n.dataset.number,
      system: n.dataset.system,
      selected: n.dataset.selectedPlace,
      practice: n.dataset.practiceGraded,
      quick: n.dataset.quickGraded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson
  .getByRole("button", { name: "THOUSANDS 1,000 (× 1000) 4" })
  .click();
await lesson.locator(".pv10001-digits button", { hasText: "7" }).click();
checks.click = await state();
const source = lesson.locator(".pv10001-digits button", { hasText: "5" }),
  target = lesson.locator(".pv10001-place-grid button").nth(2);
await source.dragTo(target);
checks.drag = await state();
await lesson.getByLabel("Number system").selectOption("Indian");
checks.system = await state();
await lesson.getByLabel("THOUSANDS practice digit").fill("1");
await lesson
  .getByRole("button", { name: "Check", exact: true })
  .first()
  .click();
checks.practiceWrong = await state();
await lesson.getByRole("button", { name: "Hint" }).click();
await lesson
  .getByRole("button", { name: "Check", exact: true })
  .first()
  .click();
checks.practiceCorrect = await state();
await lesson.getByLabel("Quick challenge answer").fill("50623");
await lesson.getByRole("button", { name: "Check", exact: true }).last().click();
checks.quickWrong = await state();
await lesson.getByLabel("Quick challenge answer").fill("50,632");
await lesson.getByRole("button", { name: "Check", exact: true }).last().click();
checks.quickCorrect = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0675");
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
  hero: await measure(".pv10001-hero"),
  tabs: await measure(".pv10001-tabs"),
  main: await measure(".pv10001-main"),
  middle: await measure(".pv10001-middle"),
  practice: await measure(".pv10001-practice"),
  challenge: await measure(".pv10001-challenge"),
  adjacent: await measure(".pv10001-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0675-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0675").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0675-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.number === "4382" &&
    checks.click.number === "7382" &&
    checks.drag.number === "7352" &&
    checks.system.system === "Indian" &&
    checks.practiceWrong.practice === "false" &&
    checks.practiceCorrect.practice === "true" &&
    checks.quickWrong.quick === "false" &&
    checks.quickCorrect.quick === "true" &&
    checks.reset.number === "4382" &&
    checks.reset.system === "International" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0675-reference.png"));
await writeFile(
  path.join(evidence, "0675-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
