/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0398-interactive-advanced-integral-calculus-and-differential-equations-shell-method-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/319-shell-method";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 941, height: 1672 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0398");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x",
        "dx",
        "radius",
        "height",
        "area",
        "dv",
        "accumulated",
        "total",
        "progress",
        "tab",
        "result",
        "solution",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Shell position").fill("2");
await lesson.getByLabel("Shell thickness").fill("0.2");
checks.controls = await state();
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Restore shell model" }).click();
checks.localReset = await state();
const handle = lesson.locator('[data-drag="shell-position"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Shell position handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 70, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Shell practice lower bound").fill("1");
await lesson.getByLabel("Shell practice upper bound").fill("2");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Shell practice lower bound").fill("0");
await lesson.getByLabel("Shell practice upper bound").fill("3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: /Show solution/ }).click();
checks.solution = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0398"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
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
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return (
      box &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(box[key]),
        ]),
      )
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".sh319-hero"),
    tabs: rect(".sh319-tabs"),
    flow: rect(".sh319-flow"),
    model: rect(".sh319-model"),
    worked: rect(".sh319-worked"),
    warning: rect(".sh319-warning"),
    practice: rect(".sh319-practice"),
  };
});
const close = (actual, expected, tolerance = 1e-7) =>
  Math.abs(Number(actual) - expected) <= tolerance;
const passed =
  checks.initial.x === "1.2" &&
  checks.initial.dx === "0.1" &&
  close(checks.initial.area, 21.11150263) &&
  close(checks.initial.accumulated, 14.47645895) &&
  close(checks.initial.total, 67.02064328) &&
  checks.controls.x === "2" &&
  checks.controls.dx === "0.2" &&
  close(checks.controls.height, 2) &&
  close(checks.controls.area, 25.13274123) &&
  close(checks.controls.dv, 5.02654825) &&
  checks.tab.tab === "Formula" &&
  checks.localReset.x === "1.2" &&
  checks.localReset.dx === "0.1" &&
  checks.drag.x !== "1.2" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.solution.solution === "true" &&
  checks.shellReset.x === "1.2" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 941 &&
  !metrics.overflow &&
  metrics.sidebar.width === 202 &&
  metrics.practice.bottom === 1655 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0398",
  lessonId: 319,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0398-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0398-reference.png"));
await writeFile(
  path.join(evidence, "0398-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
