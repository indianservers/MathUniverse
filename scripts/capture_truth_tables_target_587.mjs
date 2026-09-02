/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0644-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-truth-tables-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/587-truth-tables";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0644");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
    lesson.evaluate((node) => ({
      op: node.dataset.op,
      results: node.dataset.results,
      classification: node.dataset.classification,
      row: node.dataset.activeRow,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Toggle q truth value").click();
checks.toggleQ = await state();
await lesson.getByLabel("Toggle p truth value").click();
checks.toggleP = await state();
const statement = lesson.getByLabel("Truth table statement");
await statement.selectOption("and");
checks.and = await state();
await statement.selectOption("or");
checks.or = await state();
await statement.selectOption("iff");
checks.iff = await state();
await statement.selectOption("implies");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".tt587-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
const selects = lesson.locator(".tt587-practice select");
for (let i = 0; i < 12; i++) await selects.nth(i).selectOption("F");
await lesson.getByRole("button", { name: "Check My Answer" }).click();
checks.wrong = await state();
const expected = ["T", "T", "T", "T", "F", "T", "F", "T", "T", "F", "F", "F"];
for (let i = 0; i < 12; i++) await selects.nth(i).selectOption(expected[i]);
await lesson.getByRole("button", { name: "Check My Answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const box = async (s) => {
    const b = await lesson.locator(s).boundingBox();
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
    hero: await box(".tt587-hero"),
    lab: await box(".tt587-lab"),
    theory: await box(".tt587-theory"),
    example: await box(".tt587-example"),
    practice: await box(".tt587-practice"),
    adjacent: await box(".tt587-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0644-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0644").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0644-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.results === "TFTT" &&
  checks.initial.row === "1" &&
  checks.toggleQ.row === "0" &&
  checks.toggleP.row === "2" &&
  checks.and.results === "TFFF" &&
  checks.or.results === "TTTF" &&
  checks.iff.results === "TFFT" &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.results === "TFTT" &&
  !metrics.overflow &&
  metrics.adjacent?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
const report = { passed, checks, metrics, mobileMetrics, consoleMessages };
await copyFile(reference, path.join(evidence, "0644-reference.png"));
await writeFile(
  path.join(evidence, "0644-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
