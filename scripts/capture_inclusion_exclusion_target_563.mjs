/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0620-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-inclusion-exclusion-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/563-inclusionexclusion";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1023, height: 1537 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0620");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "a",
    "b",
    "overlap",
    "union",
    "formula",
    "third",
    "sequence",
    "practiceA",
    "practiceB",
    "practiceOverlap",
    "practiceUnion",
    "graded",
    "correct",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson
  .getByRole("button", { name: "Counter 7" })
  .dragTo(lesson.getByTestId("venn-zone-a"));
checks.addedA = await state();
await lesson
  .getByRole("button", { name: "Counter 7" })
  .dragTo(lesson.getByTestId("venn-zone-i"));
checks.toOverlap = await state();
await lesson.getByRole("button", { name: "Counter 3" }).click();
checks.removedB = await state();
await lesson.getByLabel("Show 3rd set (C)").click();
await lesson
  .getByRole("button", { name: "Counter 8" })
  .dragTo(lesson.getByTestId("venn-zone-c"));
checks.third = await state();
await lesson.getByRole("button", { name: "New Numbers" }).click();
checks.random = await state();
await lesson
  .getByRole("button", { name: /Understand/ })
  .first()
  .click();
checks.sequence = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Practice A only").fill("2");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice A only").fill("3");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Solution/ }).click();
checks.solution = await lesson
  .getByText("5 + 4 - 2 = 7", { exact: true })
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
    const r = await lesson.locator(s).boundingBox();
    return r
      ? {
          top: Math.round(r.y),
          left: Math.round(r.x),
          width: Math.round(r.width),
          height: Math.round(r.height),
          bottom: Math.round(r.y + r.height),
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
    hero: await rect(".ie563-hero"),
    tabs: await rect(".ie563-tabs"),
    lab: await rect(".ie563-lab"),
    rule: await rect(".ie563-rule"),
    example: await rect(".ie563-example"),
    practice: await rect(".ie563-practice"),
    adjacent: await rect(".ie563-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0620-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0620-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.a === "4" &&
  checks.initial.b === "4" &&
  checks.initial.overlap === "2" &&
  checks.initial.union === "6" &&
  checks.addedA.a === "5" &&
  checks.addedA.union === "7" &&
  checks.toOverlap.a === "5" &&
  checks.toOverlap.b === "5" &&
  checks.toOverlap.overlap === "3" &&
  checks.removedB.b === "4" &&
  checks.removedB.union === "6" &&
  checks.third.third === "true" &&
  checks.third.a === "5" &&
  checks.random.formula === checks.random.union &&
  checks.sequence.sequence === "4" &&
  checks.formulaClass.includes("active") &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.correct.practiceUnion === "7" &&
  checks.solution &&
  checks.final.union === "6" &&
  metrics.document.width === 1023 &&
  metrics.document.height === 1537 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0620-reference.png"));
await writeFile(
  path.join(evidence, "0620-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
