/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0676-school-class-6-numbers-and-arithmetic-indian-and-international-number-naming-systems-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-numbers-and-arithmetic-indian-and-international-number-naming-systems";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 958, height: 1641 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0676");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      number: n.dataset.number,
      indian: n.dataset.indian,
      international: n.dataset.international,
      comma: n.dataset.commaMode,
      practice: n.dataset.practiceGraded,
      choice: n.dataset.choiceGraded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Number to group").fill("24567890");
checks.input = await state();
await lesson.locator(".nn10002-lab .swap").click();
checks.swapped = await state();
await lesson
  .locator(".nn10002-lab .swap")
  .dragTo(lesson.locator(".nn10002-lab .comma"));
checks.drag = await state();
await lesson.getByRole("button", { name: /Random number/ }).click();
checks.random = await state();
await lesson.getByRole("button", { name: /Clear/ }).click();
checks.clear = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByLabel("International conversion answer").fill("7,896,543");
await lesson.getByRole("button", { name: /Check Answer/ }).click();
checks.practiceWrong = await state();
await lesson.getByLabel("International conversion answer").fill("78,965,432");
await lesson.getByRole("button", { name: /Check Answer/ }).click();
checks.practiceCorrect = await state();
await lesson.getByRole("button", { name: /Ninety Eight Million/ }).click();
checks.choiceCorrect = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0676");
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
  hero: await measure(".nn10002-hero"),
  tabs: await measure(".nn10002-tabs"),
  lab: await measure(".nn10002-lab"),
  notice: await measure(".nn10002-notice"),
  rules: await measure(".nn10002-rules"),
  practice: await measure(".nn10002-practice"),
  mistake: await measure(".nn10002-mistake"),
  adjacent: await measure(".nn10002-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0676-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0676").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0676-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.indian === "1,33,215" &&
    checks.initial.international === "133,215" &&
    checks.input.indian === "2,45,67,890" &&
    checks.input.international === "24,567,890" &&
    checks.swapped.comma === "swapped" &&
    checks.drag.comma === "correct" &&
    checks.random.number !== checks.initial.number &&
    checks.clear.number === "0" &&
    checks.reset.number === "133215" &&
    checks.practiceWrong.practice === "false" &&
    checks.practiceCorrect.practice === "true" &&
    checks.choiceCorrect.choice === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0676-reference.png"));
await writeFile(
  path.join(evidence, "0676-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
