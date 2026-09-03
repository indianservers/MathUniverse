/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0683-school-class-6-data-handling-misleading-graph-detection-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-data-handling-misleading-graph-detection",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 963, height: 1634 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0683");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((n) => ({ ...n.dataset })),
  checks = { initial: await state() };
await lesson.getByLabel("Truncated Y-axis").uncheck();
checks.honestAxis = await state();
await lesson.getByLabel("Truncated Y-axis").check();
await lesson.getByLabel("Start at").selectOption("150");
await lesson.getByLabel("Maximum").selectOption("350");
checks.truncated = await state();
await lesson.getByRole("checkbox", { name: "Unequal intervals" }).check();
await lesson.getByLabel("Compress lower end").selectOption("Strong");
checks.unequal = await state();
await lesson.getByLabel("Chart style").selectOption("3D Perspective");
checks.threeD = await state();
await lesson.getByLabel("No, it is not misleading").check();
await lesson.getByLabel("Unequal intervals", { exact: true }).last().check();
await lesson
  .getByLabel("Evidence explanation")
  .fill("The intervals look different.");
await lesson.getByRole("button", { name: "Check verdict" }).click();
checks.wrong = await state();
await lesson.getByLabel("Yes, it is misleading").check();
await lesson.getByLabel("Truncated axis", { exact: true }).check();
await lesson
  .getByLabel("Evidence explanation")
  .fill("The Y-axis starts at 160 instead of 0, exaggerating the change.");
await lesson.getByRole("button", { name: "Check verdict" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0683");
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
    hero: await measure(".mg10009-hero"),
    tabs: await measure(".mg10009-tabs"),
    compare: await measure(".mg10009-compare"),
    manip: await measure(".mg10009-manip"),
    pattern: await measure(".mg10009-pattern"),
    rule: await measure(".mg10009-rule"),
    practice: await measure(".mg10009-practice"),
    adjacent: await measure(".mg10009-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0683-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0683").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0683-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.truncated === "true" &&
    checks.honestAxis.start === "0" &&
    checks.truncated.start === "150" &&
    checks.truncated.end === "350" &&
    checks.unequal.unequal === "true" &&
    checks.threeD.threeD === "true" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0683-reference.png"));
await writeFile(
  path.join(evidence, "0683-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
