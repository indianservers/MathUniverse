/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0560-interactive-advanced-complex-numbers-polynomial-roots-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/375-polynomial-roots";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 976, height: 1612 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0560");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "coefficients",
  "discriminant",
  "roots",
  "vertex",
  "classification",
  "mirror",
  "show-discriminant",
  "show-factors",
  "answer",
  "grade",
  "dragging",
  "tab",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attributes) =>
      Object.fromEntries(
        attributes.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };
await lesson.getByLabel("c value").fill("1");
checks.repeated = await state();
await lesson.getByLabel("b value").fill("0");
await lesson.getByLabel("c value").fill("-4");
checks.real = await state();
await lesson.getByRole("button", { name: "Reset all" }).click();
await lesson.getByLabel("Show conjugate mirror").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show conjugate mirror").check();
const rootPoint = lesson.locator(".pr375-root-plane .root").first(),
  pointBox = await rootPoint.boundingBox();
await rootPoint.dispatchEvent("pointerdown", {
  pointerId: 1,
  isPrimary: true,
  clientX: pointBox.x + pointBox.width / 2,
  clientY: pointBox.y + pointBox.height / 2,
});
checks.pointerDown = await state();
await page.mouse.move(pointBox.x + 42, pointBox.y - 28);
await lesson
  .locator(".pr375-root-plane svg")
  .dispatchEvent("pointerup", { pointerId: 1, isPrimary: true });
checks.dragged = await state();
await lesson.locator(".pr375-challenge label").nth(1).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.incorrect = await state();
await lesson.locator(".pr375-challenge label").nth(0).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0560"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
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
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".pr375-hero"),
  tabs: await rect(".pr375-tabs"),
  explorer: await rect(".pr375-explorer"),
  main: await rect(".pr375-main"),
  results: await rect(".pr375-results"),
  learning: await rect(".pr375-learning"),
  challenge: await rect(".pr375-challenge"),
  navigation: await rect(".pr375-nav"),
};
const passed =
  checks.initial.coefficients === "[1,-2,5]" &&
  checks.initial.discriminant === "-16" &&
  checks.initial.roots === "[[1,2],[1,-2]]" &&
  checks.initial.vertex === "[1,4]" &&
  checks.repeated.discriminant === "0" &&
  checks.repeated.classification === "One repeated real root" &&
  checks.real.discriminant === "16" &&
  checks.real.roots === "[[2,0],[-2,0]]" &&
  checks.real.classification === "Two real roots" &&
  checks.hidden.mirror === "false" &&
  checks.pointerDown.dragging === "true" &&
  checks.dragged.coefficients !== checks.initial.coefficients &&
  checks.dragged.roots !== checks.initial.roots &&
  checks.incorrect.answer === "B" &&
  checks.incorrect.grade === "incorrect" &&
  checks.correct.answer === "A" &&
  checks.correct.grade === "correct" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.coefficients === "[1,-2,5]" &&
  checks.reset.grade === "idle" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 976 &&
  metrics.document.height === 1612 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0560-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0560-reference.png"));
await writeFile(
  path.join(evidence, "0560-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0560", lessonId: 375, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
