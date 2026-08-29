/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0354-interactive-intermediate-advanced-cas-workspace-step-by-step-algebra-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/symbolic-mathematics/448-step-by-step-algebra";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1003, height: 1568 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0354");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "step",
        "expression",
        "expected-move",
        "feedback",
        "practice-feedback",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.locator('[data-lesson-control="move-constants"]').click();
checks.invalidFirst = await state();
await lesson.locator('[data-lesson-control="move-distribute"]').click();
checks.distributed = await state();
await lesson.locator('[data-lesson-control="move-combine"]').click();
checks.combined = await state();
await lesson.locator('[data-lesson-control="undo"]').click();
checks.undo = await state();
await lesson.locator('[data-lesson-control="move-combine"]').click();
await lesson.locator('[data-lesson-control="move-constants"]').click();
checks.complete = await state();
await lesson.locator('[data-lesson-control="practice-combine"]').click();
await lesson.locator('[data-lesson-control="practice-check"]').click();
checks.practiceRejected = await state();
await lesson.locator('[data-lesson-control="practice-distribute"]').click();
await lesson.locator('[data-lesson-control="practice-check"]').click();
checks.practiceAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0354"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson
    .getByRole("link", { name: /Next/ })
    .getAttribute("href"),
};
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /* Some SVG properties are read-only. */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((key) => [
        key,
        Math.round(box[key]),
      ]),
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    shellHeader: rect(".lesson-shell-header"),
    hero: rect(".sa448-hero"),
    tabs: rect(".sa448-tabs"),
    workspace: rect(".sa448-workspace"),
    grid: rect(".sa448-grid"),
    bottom: rect(".sa448-bottom"),
    adjacent: rect(".sa448-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.step === "0" &&
  checks.initial.expression === "2(x + 3) + x - x + 4 - 2" &&
  checks.invalidFirst.step === "0" &&
  checks.invalidFirst.feedback === "incorrect" &&
  checks.distributed.step === "1" &&
  checks.distributed.expression === "(2x + 6) + x - x + 4 - 2" &&
  checks.combined.step === "2" &&
  checks.undo.step === "1" &&
  checks.complete.step === "3" &&
  checks.complete.expression === "2x + 8" &&
  checks.practiceRejected["practice-feedback"] === "incorrect" &&
  checks.practiceAccepted["practice-feedback"] === "correct" &&
  checks.reset.step === "0" &&
  checks.reset.actions === "0" &&
  navigation.previousHref ===
    "/lessons/symbolic-mathematics/447-exact-numeric-toggle" &&
  navigation.nextHref ===
    "/lessons/symbolic-mathematics/449-cas-to-graph-link" &&
  metrics.document.width === 1003 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 208 &&
  metrics.shellHeader?.height === 0 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0354",
  lessonId: 448,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0354-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0354-reference.png"));
await writeFile(
  path.join(evidence, "0354-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
