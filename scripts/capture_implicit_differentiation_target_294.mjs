/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0373-interactive-advanced-limits-and-differential-calculus-implicit-differentiation-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/294-implicit-differentiation";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0373");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x",
        "y",
        "slope",
        "classification",
        "constraint",
        "result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );

const checks = { initial: await state() };
await lesson.getByLabel("Implicit x").fill("1");
checks.xDriven = await state();
await lesson.getByLabel("Implicit y").fill("2");
checks.yDriven = await state();
const handle = lesson.locator('[data-drag="implicit-point"]');
const box = await handle.boundingBox();
if (!box) throw new Error("Implicit curve point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Implicit practice answer").fill("1/2");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Implicit practice answer").fill("-1/2");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0373"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();

// Reload before visual capture so focus-driven scrolling from the interaction
// checks cannot alter the screenshot position.
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0373").waitFor({ timeout: 600000 });
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      // SVG elements do not expose scroll state.
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
    hero: rect(".imp294-hero"),
    tabs: rect(".imp294-tabs"),
    flow: rect(".imp294-flow"),
    lab: rect(".imp294-lab"),
    feedback: rect(".imp294-feedback"),
    info: rect(".imp294-info"),
    worked: rect(".imp294-worked"),
    practice: rect(".imp294-practice"),
    adjacent: rect(".imp294-adjacent"),
  };
});
const passed =
  checks.initial.x === "0" &&
  checks.initial.y === "3" &&
  checks.initial.slope === "0" &&
  checks.initial.classification === "Horizontal" &&
  checks.initial.constraint === "9" &&
  checks.xDriven.y === "2.828" &&
  checks.xDriven.slope === "-0.354" &&
  checks.yDriven.x === "2.236" &&
  checks.yDriven.constraint === "9" &&
  checks.dragged.x !== checks.yDriven.x &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "0" &&
  checks.reset.y === "3" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0373",
  lessonId: 294,
  checks,
  metrics,
  consoleMessages,
  passed,
};

await page.screenshot({
  path: path.join(evidence, "0373-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0373-reference.png"));
await writeFile(
  path.join(evidence, "0373-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
