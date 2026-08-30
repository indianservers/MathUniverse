/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0379-interactive-advanced-limits-and-differential-calculus-inflection-points-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/300-inflection-points";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0379");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "c",
        "k",
        "m",
        "d",
        "x",
        "y",
        "left-sign",
        "right-sign",
        "changes",
        "steps",
        "result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );

const checks = { initial: await state() };
await lesson.getByLabel("c (x³ coefficient)").fill("2");
checks.cDriven = await state();
await lesson.getByLabel("m (x coefficient)").fill("2");
await lesson.getByLabel("d (constant)").fill("1");
checks.verticalDriven = await state();
const point = lesson.locator('[data-drag="inflection-point"]');
const box = await point.boundingBox();
if (!box) throw new Error("Inflection point drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("c (x³ coefficient)").fill("0");
checks.noInflection = await state();
await lesson.getByRole("button", { name: "Reset" }).click();
checks.localReset = await state();
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.rejected = await state();
for (const checkbox of await lesson.locator('input[type="checkbox"]').all()) {
  await checkbox.check();
}
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0379"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();

await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0379").waitFor({ timeout: 600000 });
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      // SVG elements do not expose writable scroll positions.
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);

const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const bounds = element.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((key) => [
        key,
        Math.round(bounds[key]),
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
    hero: rect(".inf300-hero"),
    tabs: rect(".inf300-tabs"),
    work: rect(".inf300-work"),
    info: rect(".inf300-info"),
    practice: rect(".inf300-practice"),
    adjacent: rect(".inf300-adjacent"),
  };
});

const passed =
  checks.initial.c === "1" &&
  checks.initial.k === "-3" &&
  checks.initial.x === "1" &&
  checks.initial.y === "1" &&
  checks.initial["left-sign"] === "-1" &&
  checks.initial["right-sign"] === "1" &&
  checks.initial.changes === "true" &&
  checks.cDriven.x === "0.5" &&
  checks.verticalDriven.x === checks.cDriven.x &&
  checks.verticalDriven.y !== checks.cDriven.y &&
  checks.dragged.x !== checks.verticalDriven.x &&
  checks.noInflection.x === "none" &&
  checks.noInflection.changes === "false" &&
  checks.localReset.x === "1" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.steps === "4" &&
  checks.accepted.result === "correct" &&
  checks.shellReset.x === "1" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;

const report = {
  mockup: "0379",
  lessonId: 300,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0379-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0379-reference.png"));
await writeFile(
  path.join(evidence, "0379-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
