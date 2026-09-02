/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0643-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-subsets-and-power-sets-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/586-subsets-and-power-sets";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0643");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
  lesson.evaluate((node) => ({
    source: node.dataset.source,
    count: node.dataset.powerCount,
    subsets: node.dataset.subsets,
    graded: node.dataset.graded,
    actions: node.dataset.actions,
  }));
const checks = { initial: await state() };
const builder = lesson.locator(".ps586-builder").first();
await builder.getByRole("button", { name: "4", exact: true }).click();
checks.remove4 = await state();
await builder.getByRole("button", { name: "2", exact: true }).click();
checks.remove2 = await state();
await builder.getByRole("button", { name: "4", exact: true }).click();
checks.restore4 = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.reset = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".ps586-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Power set challenge count").fill("15");
await lesson
  .getByLabel("Power set size-two subsets")
  .fill("{p,q}, {p,r}, {p,s}, {q,r}, {q,s}");
await lesson.getByLabel("No", { exact: true }).check();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Power set challenge count").fill("16");
await lesson
  .getByLabel("Power set size-two subsets")
  .fill("{p,q}, {p,r}, {p,s}, {q,r}, {q,s}, {r,s}");
await lesson.getByLabel("Yes", { exact: true }).check();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show answer" }).click();
checks.answerVisible = await lesson
  .locator(".ps586-practice>output")
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
  const b = await lesson.locator(selector).boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
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
  hero: await box(".ps586-hero"),
  workspace: await box(".ps586-workspace"),
  theory: await box(".ps586-theory"),
  practice: await box(".ps586-practice"),
  adjacent: await box(".ps586-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0643-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0643").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0643-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.source === "1,2,3,4" &&
  checks.initial.count === "16" &&
  checks.initial.subsets.split("|").length === 16 &&
  checks.remove4.source === "1,2,3" &&
  checks.remove4.count === "8" &&
  checks.remove2.source === "1,3" &&
  checks.remove2.count === "4" &&
  checks.restore4.source === "1,3,4" &&
  checks.restore4.count === "8" &&
  checks.reset.count === "16" &&
  checks.formula &&
  checks.wrong.graded === "false,false,false" &&
  checks.correct.graded === "true,true,true" &&
  checks.answerVisible &&
  checks.final.count === "16" &&
  !metrics.overflow &&
  metrics.adjacent?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
const report = { passed, checks, metrics, mobileMetrics, consoleMessages };
await copyFile(reference, path.join(evidence, "0643-reference.png"));
await writeFile(
  path.join(evidence, "0643-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
