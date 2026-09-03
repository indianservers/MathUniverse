/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0682-school-class-6-data-handling-survey-to-frequency-table-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-data-handling-survey-to-frequency-table",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 968, height: 1628 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0682");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((n) => ({ ...n.dataset })),
  checks = { initial: await state() };
await lesson
  .getByRole("button", { name: /Cricket/ })
  .first()
  .click();
checks.add = await state();
await lesson.getByRole("button", { name: /Undo last/ }).click();
checks.undo = await state();
await lesson.getByLabel("Another sport").fill("Hockey");
await lesson.getByRole("button", { name: "Add", exact: true }).first().click();
checks.custom = await state();
await lesson.getByRole("button", { name: /Sort/ }).click();
await lesson.getByRole("button", { name: /Vertical bars/ }).click();
await lesson.getByRole("button", { name: /Hide counts/ }).click();
checks.chart = await state();
await lesson.getByRole("button", { name: /Reset graph/ }).click();
checks.reset = await state();
for (let i = 0; i < 4; i++)
  await lesson.getByRole("button", { name: /Apple/ }).last().click();
for (let i = 0; i < 3; i++)
  await lesson
    .getByRole("button", { name: /Banana/ })
    .last()
    .click();
checks.practice = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0682");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (s) => {
    const b = await lesson.locator(s).first().boundingBox();
    return b
      ? {
          top: Math.round(b.y),
          height: Math.round(b.height),
          bottom: Math.round(b.y + b.height),
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
    hero: await measure(".sf10008-hero"),
    tabs: await measure(".sf10008-tabs"),
    steps: await measure(".sf10008-steps"),
    main: await measure(".sf10008-main"),
    practice: await measure(".sf10008-practice"),
    bottom: await measure(".sf10008-bottom"),
    adjacent: await measure(".sf10008-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0682-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0682").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0682-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.counts === "9,4,3,2,2" &&
    checks.initial.total === "20" &&
    checks.add.counts === "10,4,3,2,2" &&
    checks.undo.counts === "9,4,3,2,2" &&
    checks.custom.total === "21" &&
    checks.chart.orientation === "horizontal" &&
    checks.chart.showCounts === "false" &&
    checks.reset.orientation === "vertical" &&
    checks.reset.showCounts === "true" &&
    checks.practice.practiceCounts === "4,3,0,0,0" &&
    checks.practice.practiceTotal === "7" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0682-reference.png"));
await writeFile(
  path.join(evidence, "0682-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
