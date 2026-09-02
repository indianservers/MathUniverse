/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0616-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-permutations-with-repetition-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/559-permutations-with-repetition";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 981, height: 1604 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0616");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "counts",
    "total",
    "slots",
    "generated",
    "generatedCount",
    "view",
    "challengeTotal",
    "challengeGenerated",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByRole("button", { name: "+", exact: true }).last().click();
checks.addedC = await state();
await lesson
  .locator(".rep559-source")
  .filter({ hasText: /^A$/ })
  .dragTo(lesson.getByTestId("repeated-slot-1"));
checks.dragged = await state();
await lesson
  .getByRole("button", { name: "Generate unique arrangements" })
  .click();
checks.generated = await state();
await lesson.getByRole("button", { name: /List/ }).click();
checks.list = await state();
await lesson.getByRole("button", { name: /Random arrangement/ }).click();
checks.random = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge R count").fill("3");
checks.challengeChanged = await state();
await lesson.getByRole("button", { name: "Generate & Count" }).click();
checks.challengeGenerated = await state();
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
    hero: await rect(".rep559-hero"),
    tabs: await rect(".perm558-tabs"),
    observe: await rect(".rep559-observe"),
    middle: await rect(".rep559-middle"),
    worked: await rect(".rep559-worked"),
    practice: await rect(".rep559-practice"),
    adjacent: await rect(".perm558-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0616-desktop.png"),
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
  path: path.join(evidence, "0616-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.counts === "2,2,1" &&
  checks.initial.total === "30" &&
  checks.initial.generatedCount === "30" &&
  checks.addedC.counts === "2,2,2" &&
  checks.addedC.total === "90" &&
  checks.addedC.slots === "______" &&
  checks.dragged.slots === "A_____" &&
  checks.generated.generatedCount === "90" &&
  checks.list.view === "list" &&
  checks.random.slots.length === 6 &&
  checks.formulaClass.includes("active") &&
  checks.challengeChanged.challengeTotal === "420" &&
  checks.challengeGenerated.challengeGenerated === "true" &&
  checks.final.total === "30" &&
  metrics.document.width === 981 &&
  metrics.document.height === 1604 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0616-reference.png"));
await writeFile(
  path.join(evidence, "0616-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
