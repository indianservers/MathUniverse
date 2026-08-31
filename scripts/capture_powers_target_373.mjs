/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0558-interactive-advanced-complex-numbers-powers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/373-powers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 995, height: 1581 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0558");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "z",
  "exponent",
  "radius",
  "theta",
  "result-radius",
  "result-theta",
  "result",
  "trace",
  "growth",
  "angles",
  "grade",
  "hint",
  "reason",
  "tab",
  "dragging",
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
await lesson.getByLabel("Real a value").fill("2");
await lesson.getByRole("slider", { name: "Exponent n" }).fill("2");
checks.power = await state();
await lesson.getByLabel("Show radius growth").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show radius growth").check();
const point = lesson.locator(".pw373-plane .dot-0"),
  pointBox = await point.boundingBox();
await point.dispatchEvent("pointerdown", {
  pointerId: 1,
  isPrimary: true,
  clientX: pointBox.x + pointBox.width / 2,
  clientY: pointBox.y + pointBox.height / 2,
});
checks.pointerDown = await state();
await page.mouse.move(pointBox.x + 48, pointBox.y - 35);
await lesson
  .locator(".pw373-plane svg")
  .dispatchEvent("pointerup", { pointerId: 1, isPrimary: true });
checks.dragged = await state();
await lesson.getByRole("button", { name: "Reveal hint" }).click();
await lesson.getByLabel("Power challenge answer").fill("4i");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.incorrect = await state();
await lesson.getByLabel("Power challenge answer").fill("2 + 2sqrt3i");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "See why" }).click();
checks.explained = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0558"]')
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
  hero: await rect(".pw373-hero"),
  tabs: await rect(".pw373-tabs"),
  lab: await rect(".pw373-lab"),
  main: await rect(".pw373-main"),
  steps: await rect(".pw373-steps"),
  learning: await rect(".pw373-learning"),
  navigation: await rect(".pw373-nav"),
};
const passed =
  checks.initial.z === "[1,1]" &&
  checks.initial.exponent === "3" &&
  checks.initial.result === "[-2,2]" &&
  checks.initial["result-radius"] === "2.828" &&
  checks.initial["result-theta"] === "135" &&
  checks.power.z === "[2,1]" &&
  checks.power.exponent === "2" &&
  checks.power.result === "[3,4]" &&
  checks.power["result-radius"] === "5" &&
  checks.hidden.growth === "false" &&
  checks.pointerDown.dragging === "true" &&
  checks.dragged.z !== checks.power.z &&
  checks.incorrect.grade === "incorrect" &&
  checks.incorrect.hint === "true" &&
  checks.correct.grade === "correct" &&
  checks.explained.reason === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.z === "[1,1]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 995 &&
  metrics.document.height === 1581 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0558-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0558-reference.png"));
await writeFile(
  path.join(evidence, "0558-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0558", lessonId: 373, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
