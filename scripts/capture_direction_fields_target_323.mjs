/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0402-interactive-advanced-integral-calculus-and-differential-equations-direction-fields-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/323-direction-fields";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0402");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "density",
        "scale-x",
        "scale-y",
        "seeds",
        "selected",
        "selected-x",
        "selected-y",
        "slope",
        "axes",
        "curves",
        "triangle",
        "grid",
        "tab",
        "prediction",
        "behavior",
        "result",
        "hint",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
const density = lesson.getByLabel("Direction field Density");
const densityBox = await density.boundingBox();
if (!densityBox) throw new Error("Density slider missing");
await page.mouse.click(
  densityBox.x + densityBox.width * 0.8,
  densityBox.y + densityBox.height / 2,
);
await lesson.getByLabel("Show axes").uncheck();
await lesson.getByLabel("Grid").check();
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.controls = await state();
await lesson.getByRole("button", { name: "Add seed point" }).click();
checks.added = await state();
await lesson.getByRole("button", { name: "Clear curves" }).click();
checks.cleared = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0402"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
const handle = lesson.locator('[data-drag="direction-seed-1"]');
const handleBox = await handle.boundingBox();
if (!handleBox) throw new Error("Direction seed handle missing");
await page.mouse.move(
  handleBox.x + handleBox.width / 2,
  handleBox.y + handleBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(handleBox.x + 75, handleBox.y + 55, { steps: 9 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "Place seed here" }).click();
await lesson.getByLabel("Predicted slope").fill("3");
await lesson.getByRole("button", { name: "Rises", exact: true }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Predicted slope").fill("-3");
await lesson.getByRole("button", { name: "Falls", exact: true }).click();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
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
await page.waitForTimeout(150);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const bounds = document.querySelector(selector)?.getBoundingClientRect();
    return (
      bounds &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(bounds[key]),
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
    hero: rect(".dir323-hero"),
    tabs: rect(".dir323-tabs"),
    lab: rect(".dir323-lab"),
    learning: rect(".dir323-learning"),
    practice: rect(".dir323-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (value, expected, tolerance = 1e-6) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.density === "24" &&
  checks.initial.seeds === "2" &&
  checks.initial.selected === "1" &&
  close(checks.initial["selected-x"], 1) &&
  close(checks.initial["selected-y"], 1) &&
  close(checks.initial.slope, 0) &&
  checks.controls.density !== "24" &&
  checks.controls.axes === "false" &&
  checks.controls.grid === "true" &&
  checks.controls.tab === "Formula" &&
  checks.added.seeds === "3" &&
  checks.added["selected-x"] === "-1" &&
  checks.added["selected-y"] === "2" &&
  checks.cleared.seeds === "0" &&
  checks.shellReset.seeds === "2" &&
  checks.shellReset.actions === "0" &&
  checks.drag["selected-x"] !== "1" &&
  close(
    checks.drag.slope,
    Number(checks.drag["selected-x"]) - Number(checks.drag["selected-y"]),
  ) &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.prediction === "-3" &&
  checks.accepted.behavior === "Falls" &&
  checks.accepted.hint === "true" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar.width === 216 &&
  metrics.hero.top === 102 &&
  metrics.lab.top === 291 &&
  metrics.adjacent.top === 1353 &&
  metrics.adjacent.bottom === 1407 &&
  metrics.footer.bottom === 1536 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0402",
  lessonId: 323,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0402-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0402-reference.png"));
await writeFile(
  path.join(evidence, "0402-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
