/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0397-interactive-advanced-integral-calculus-and-differential-equations-disc-and-washer-methods-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/318-disc-and-washer-methods";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0397");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x",
        "dx",
        "axis",
        "outer",
        "inner",
        "area",
        "dv",
        "accumulated",
        "total",
        "progress",
        "outer-visible",
        "inner-visible",
        "washer-visible",
        "bounds-visible",
        "tab",
        "result",
        "hint",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Washer axis of rotation").selectOption("y=1");
await lesson.getByLabel("Washer slice position").fill("0.05");
await lesson.getByLabel("Washer slice thickness").fill("0.2");
checks.controls = await state();
await lesson.getByLabel("Show washer outer").uncheck();
await lesson.getByLabel("Show washer washer").uncheck();
await lesson.getByLabel("Show washer bounds").uncheck();
checks.layers = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
const handle = lesson.locator('[data-drag="washer-slice"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Washer slice handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 65, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Washer practice answer").fill("32pi/15");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Washer practice answer").fill("512pi/15");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "♧ Hint", exact: true }).click();
checks.hint = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0397"]')
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
    hero: rect(".dw318-hero"),
    flow: rect(".dw318-flow"),
    tabs: rect(".dw318-tabs"),
    lab: rect(".dw318-lab"),
    cards: rect(".dw318-cards"),
    practice: rect(".dw318-practice"),
    adjacent: rect(".dw318-adjacent"),
  };
});
const passed =
  checks.initial.x === "4" &&
  checks.initial.outer === "6" &&
  checks.initial.area === "113.09733553" &&
  checks.initial.dv === "11.30973355" &&
  checks.initial.accumulated === "226.19467106" &&
  checks.initial.total === "1145.11052223" &&
  checks.controls.axis === "y=1" &&
  checks.controls.x === "0.05" &&
  checks.controls.dx === "0.2" &&
  Number(checks.controls.inner) > 0 &&
  checks.layers["outer-visible"] === "false" &&
  checks.layers["washer-visible"] === "false" &&
  checks.layers["bounds-visible"] === "false" &&
  checks.tab.tab === "Formulas" &&
  checks.localReset.actions === "0" &&
  checks.drag.x !== "4" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.hint.hint === "true" &&
  checks.shellReset.x === "4" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.adjacent.bottom === 1524 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0397",
  lessonId: 318,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0397-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0397-reference.png"));
await writeFile(
  path.join(evidence, "0397-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
