/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0365-interactive-advanced-limits-and-differential-calculus-derivative-from-first-principles-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/286-derivative-from-first-principles";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0365");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      ["function", "x", "h", "quotient", "derivative", "result", "actions"].map(
        (key) => [key, node.getAttribute(`data-${key}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Difference h").fill("0.5");
checks.half = await state();
await lesson.getByLabel("Base x").selectOption("1");
checks.xOne = await state();
await lesson.getByLabel("Function").selectOption("1");
checks.square = await state();
const handle = lesson.locator('[data-drag="point-ph"]');
const box = await handle.boundingBox();
if (!box) throw new Error("Draggable P_h point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 25, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Practice derivative").fill("wrong");
await lesson.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await lesson.getByLabel("Practice derivative").fill("2x + 5");
await lesson.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0365"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /* SVG */
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
    hero: rect(".dfp286-hero"),
    tabs: rect(".dfp286-tabs"),
    flow: rect(".dfp286-flow"),
    lab: rect(".dfp286-lab"),
    bottom: rect(".dfp286-bottom"),
    adjacent: rect(".dfp286-adjacent"),
    footer: rect(".dfp286-footer"),
  };
});
const passed =
  checks.initial.function === "2x² + 2x" &&
  checks.initial.x === "0" &&
  checks.initial.h === "0.25" &&
  checks.initial.quotient === "2.5" &&
  checks.initial.derivative === "2" &&
  checks.half.quotient === "3" &&
  checks.xOne.derivative === "6" &&
  checks.square.derivative === "2" &&
  checks.dragged.h !== "0.5" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.h === "0.25" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 208 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0365",
  lessonId: 286,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0365-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0365-reference.png"));
await writeFile(
  path.join(evidence, "0365-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
