/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0390-interactive-advanced-integral-calculus-and-differential-equations-area-between-curves-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/311-area-between-curves";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 959, height: 1639 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0390");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "top",
        "bottom",
        "a",
        "b",
        "slice",
        "slices",
        "area",
        "height",
        "tab",
        "result",
        "hint",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Area domain start").fill("-3");
await lesson.getByLabel("Area domain end").fill("3");
await lesson.getByLabel("Inspection slice x").fill("1");
await lesson.getByLabel("Area slice count").fill("40");
checks.controls = await state();
const handle = lesson.locator('[data-drag="area-slice"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Area slice handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 45, box.y, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Area top function").selectOption("tent");
await lesson.getByLabel("Area bottom function").selectOption("line");
await lesson.getByRole("button", { name: "Key Formula" }).click();
checks.curves = await state();
await lesson.getByLabel("Area practice top expression").fill("1+x^2/4");
await lesson.getByLabel("Area practice bottom expression").fill("0");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Area practice top expression").fill("1-x^2/4");
await lesson.getByRole("button", { name: "Check Answer" }).click();
await lesson.getByRole("button", { name: "Hint" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0390"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /*SVG*/
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const b = document.querySelector(s)?.getBoundingClientRect();
    return (
      b &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((k) => [
          k,
          Math.round(b[k]),
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
    hero: rect(".abc311-hero"),
    tabs: rect(".abc311-tabs"),
    flow: rect(".abc311-flow"),
    lab: rect(".abc311-lab"),
    concepts: rect(".abc311-concepts"),
    worked: rect(".abc311-worked"),
    practice: rect(".abc311-practice"),
    adjacent: rect(".abc311-adjacent"),
    footer: rect(".abc311-footer"),
  };
});
const passed =
  checks.initial.top === "parabola" &&
  checks.initial.bottom === "zero" &&
  Math.abs(Number(checks.initial.area) - (32 * Math.sqrt(3)) / 3) < 0.01 &&
  checks.controls.a === "-3" &&
  checks.controls.b === "3" &&
  checks.controls.slices === "40" &&
  checks.drag.slice !== checks.controls.slice &&
  checks.curves.top === "tent" &&
  checks.curves.bottom === "line" &&
  checks.curves.tab === "Key Formula" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.hint === "true" &&
  checks.localReset.slices === "100" &&
  checks.localReset.slice === "0" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 959 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0390",
  lessonId: 311,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0390-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0390-reference.png"));
await writeFile(
  path.join(evidence, "0390-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
