/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0685-school-class-6-patterns-shape-pattern-completion-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-patterns-shape-pattern-completion",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 963, height: 1634 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0685");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((n) => ({ ...n.dataset })),
  checks = { initial: await state() };
await lesson.getByLabel("Figure number").fill("6");
checks.figureSix = await state();
await lesson.getByLabel("Show added pieces").uncheck();
checks.hidden = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByLabel("Tile answer").fill("30");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Tile answer").fill("29");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show explanation" }).click();
checks.explanation = await lesson
  .getByText("2 × 15 − 1 = 29 tiles.")
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0685");
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
    hero: await measure(".sp10011-hero"),
    tabs: await measure(".sp10011-tabs"),
    observe: await measure(".sp10011-observe"),
    middle: await measure(".sp10011-middle"),
    rules: await measure(".sp10011-rules"),
    lower: await measure(".sp10011-lower"),
    adjacent: await measure(".sp10011-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0685-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0685").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0685-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.figure === "4" &&
    checks.initial.total === "7" &&
    checks.figureSix.total === "11" &&
    checks.hidden.showAdded === "false" &&
    checks.reset.figure === "4" &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.explanation &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0685-reference.png"));
await writeFile(
  path.join(evidence, "0685-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
