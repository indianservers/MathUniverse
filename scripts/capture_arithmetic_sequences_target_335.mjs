/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0520-interactive-intermediate-advanced-sequences-and-series-arithmetic-sequences-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/335-arithmetic-sequences";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 944, height: 1665 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0520");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "first",
        "difference",
        "step",
        "playing",
        "terms",
        "differences",
        "tab",
        "solver-mode",
        "solver-result",
        "quick-result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Arithmetic first term").fill("-2");
await lesson.getByLabel("Arithmetic common difference").fill("4");
await lesson.getByTitle("Last term").click();
checks.controls = await state();
await lesson.getByTitle("Play").click();
await page.waitForTimeout(800);
await lesson.getByTitle("Pause").click();
checks.autoplay = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
const handle = lesson.locator('[data-drag="arithmetic-point-6"]'),
  hbox = await handle.boundingBox();
if (!hbox) throw new Error("Arithmetic graph handle missing");
await page.mouse.move(hbox.x + hbox.width / 2, hbox.y + hbox.height / 2);
await page.mouse.down();
await page.mouse.move(hbox.x, hbox.y - 24, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
await lesson.getByLabel("Arithmetic solver input").fill("25");
await lesson.getByRole("button", { name: "Calculate" }).click();
checks.findTerm = await state();
await lesson.getByRole("button", { name: "Find n" }).click();
await lesson.getByLabel("Arithmetic solver input").fill("17");
await lesson.getByRole("button", { name: "Calculate" }).click();
checks.findIndex = await state();
await lesson.getByRole("button", { name: /^A\s+34$/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /^C\s+38$/ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0520"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
    const bounds = await page.locator(selector).first().boundingBox();
    return bounds
      ? {
          top: Math.round(bounds.y),
          left: Math.round(bounds.x),
          width: Math.round(bounds.width),
          height: Math.round(bounds.height),
          bottom: Math.round(bounds.y + bounds.height),
        }
      : null;
  },
  documentSize = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  metrics = {
    document: documentSize,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    sidebar: await box('[data-testid="desktop-sidebar"]'),
    hero: await box(".seq335-hero"),
    tabs: await box(".seq335-tabs"),
    explorer: await box(".seq335-explorer"),
    terms: await box(".seq335-pair"),
    formulas: await box(".formulas-row"),
    practice: await box(".seq335-bottom"),
    adjacent: await box(".lesson-adjacent-nav"),
    footer: await box('footer[aria-label="Site footer"]'),
  };
const passed =
  checks.initial.terms === "5,8,11,14,17,20,23,26,29,32" &&
  checks.initial.differences === "3,3,3,3,3,3,3,3,3" &&
  checks.controls.terms === "-2,2,6,10,14,18,22,26,30,34" &&
  checks.controls.step === "10" &&
  checks.autoplay.step !== checks.controls.step &&
  checks.drag.difference !== "3" &&
  checks.findTerm["solver-result"] === "a25 = 77" &&
  checks.findIndex["solver-result"] === "n = 5" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.accepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0520-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0520-reference.png"));
await writeFile(
  path.join(evidence, "0520-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0520", lessonId: 335, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
