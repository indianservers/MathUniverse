/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0613-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-fundamental-counting-principle-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/556-fundamental-counting-principle",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1208, height: 1302 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0613");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(700);
const keys = [
    "tops",
    "pants",
    "shoes",
    "total",
    "selected",
    "meal",
    "mealTotal",
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
await lesson.getByRole("button", { name: "Outfit 2-2-2" }).click();
checks.selected = await state();
await lesson.getByRole("button", { name: "Increase Tops" }).click();
checks.fourTops = await state();
await lesson.getByRole("button", { name: "Increase Pants" }).click();
checks.threePants = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByRole("button", { name: "Increase Starters" }).click();
checks.meal = await state();
await lesson.getByLabel("Meal combinations answer").fill("12");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Meal combinations answer").fill("18");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(500);
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
    hero: await rect(".fcp556-hero"),
    tabs: await rect(".fcp556-tabs"),
    lab: await rect(".fcp556-lab"),
    tree: await rect(".fcp556-tree"),
    theory: await rect(".fcp556-theory"),
    practice: await rect(".fcp556-practice"),
    adjacent: await rect(".fcp556-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0613-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0613-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.total === "12" &&
  checks.initial.mealTotal === "12" &&
  checks.fourTops.total === "16" &&
  checks.threePants.total === "24" &&
  checks.selected.selected === "1-1-1" &&
  checks.formula.includes("active") &&
  checks.meal.meal === "3-3-2" &&
  checks.meal.mealTotal === "18" &&
  checks.wrong.graded === "true" &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.final.total === "12" &&
  metrics.document.width === 1208 &&
  metrics.document.height === 1302 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0613-reference.png"));
await writeFile(
  path.join(evidence, "0613-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
