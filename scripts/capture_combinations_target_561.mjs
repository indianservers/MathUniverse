/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0618-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-combinations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/561-combinations";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1210, height: 1300 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0618");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "n",
    "r",
    "permutations",
    "combinations",
    "selected",
    "full",
    "challengeTotal",
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
  .locator(".comb561-pool")
  .getByRole("button", { name: "A", exact: true })
  .click();
checks.capped = await state();
await lesson
  .locator(".comb561-pool")
  .getByRole("button", { name: "B", exact: true })
  .click();
await lesson
  .locator(".comb561-pool")
  .getByRole("button", { name: "A", exact: true })
  .click();
checks.reordered = await state();
await lesson.getByRole("button", { name: /Clear basket/ }).click();
checks.cleared = await state();
await lesson.getByRole("button", { name: "Increase pool" }).click();
await lesson.getByRole("button", { name: "Increase selection size" }).click();
checks.sixThree = await state();
for (const item of ["A", "B", "C"])
  await lesson
    .locator(".comb561-pool")
    .getByRole("button", { name: item, exact: true })
    .click();
checks.selectedThree = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge n").fill("8");
checks.challengeEight = await state();
await lesson.getByLabel("Combination challenge answer").fill("35");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Combination challenge answer").fill("56");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hint = await lesson
  .getByText(/Order does not matter/)
  .last()
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
    hero: await rect(".comb561-hero"),
    tabs: await rect(".comb561-tabs"),
    layout: await rect(".comb561-layout"),
    adjacent: await rect(".comb561-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0618-desktop.png"),
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
  path: path.join(evidence, "0618-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.n === "5" &&
  checks.initial.r === "2" &&
  checks.initial.combinations === "10" &&
  checks.initial.selected === "BD" &&
  checks.capped.selected === "BD" &&
  checks.reordered.selected === "AD" &&
  checks.cleared.selected === "" &&
  checks.sixThree.n === "6" &&
  checks.sixThree.r === "3" &&
  checks.sixThree.combinations === "20" &&
  checks.selectedThree.selected === "ABC" &&
  checks.formulaClass.includes("active") &&
  checks.challengeEight.challengeTotal === "56" &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.hint &&
  checks.final.selected === "BD" &&
  metrics.document.width === 1210 &&
  metrics.document.height === 1300 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0618-reference.png"));
await writeFile(
  path.join(evidence, "0618-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
