/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0556-interactive-advanced-complex-numbers-polar-form-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/371-polar-form";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1003, height: 1568 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0556");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "z",
  "radius",
  "degrees",
  "radians",
  "unit",
  "quadrant",
  "triangle",
  "ring",
  "steps",
  "tab",
  "challenge",
  "checks",
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

await lesson.getByLabel("Real part (a) value").fill("-3");
checks.quadrant2 = await state();
await lesson.getByRole("button", { name: "Radians", exact: true }).click();
checks.radians = await state();
await lesson.getByLabel("Show conversion steps").uncheck();
checks.stepsHidden = await state();
await lesson.getByLabel("Show conversion steps").check();

const point = lesson.locator(".pf371-plane .point");
const box = await point.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 55, box.y - 38);
await page.mouse.up();
checks.dragged = await state();

await lesson.getByRole("button", { name: "Start Challenge" }).click();
checks.challenge = await state();
await lesson.locator(".pf371-understanding input").nth(1).check();
checks.understanding = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0556"]')
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
  hero: await rect(".pf371-hero"),
  tabs: await rect(".pf371-tabs"),
  work: await rect(".pf371-work"),
  converter: await rect(".pf371-converter"),
  side: await rect(".pf371-side"),
  learning: await rect(".pf371-learning"),
  lower: await rect(".pf371-lower"),
  navigation: await rect(".pf371-nav"),
};

const passed =
  checks.initial.z === "[3,4]" &&
  checks.initial.radius === "5" &&
  checks.initial.degrees === "53.13" &&
  checks.initial.radians === "0.927" &&
  checks.initial.quadrant === "I" &&
  checks.quadrant2.z === "[-3,4]" &&
  checks.quadrant2.radius === "5" &&
  checks.quadrant2.degrees === "126.87" &&
  checks.quadrant2.quadrant === "II" &&
  checks.radians.unit === "radians" &&
  checks.radians.radians === "2.214" &&
  checks.stepsHidden.steps === "false" &&
  checks.dragged.z !== checks.quadrant2.z &&
  checks.challenge.challenge === "true" &&
  checks.understanding.checks === "[true,true,true,true]" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.z === "[3,4]" &&
  checks.reset.unit === "degrees" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1003 &&
  metrics.document.height === 1568 &&
  !metrics.overflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(evidence, "0556-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0556-reference.png"));
await writeFile(
  path.join(evidence, "0556-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0556", lessonId: 371, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
