/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0400-interactive-advanced-integral-calculus-and-differential-equations-surface-area-of-revolution-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/calculus/321-surface-area-of-revolution";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0400");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "axis",
        "curve",
        "a",
        "b",
        "x",
        "radius",
        "slope",
        "ds",
        "element",
        "area",
        "progress",
        "playing",
        "speed",
        "tab",
        "editor",
        "result",
        "hint",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Surface axis").selectOption("y");
await lesson.getByLabel("Edit generating curve").click();
await lesson.getByRole("button", { name: "y = ln(x+1)", exact: true }).click();
await lesson.getByLabel("Surface lower bound").fill("2");
await lesson.getByLabel("Surface upper bound").fill("5");
await lesson.getByLabel("Surface animation speed").fill("80");
checks.controls = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Play", exact: true }).click();
await page.waitForTimeout(350);
checks.playing = await state();
await lesson.getByRole("button", { name: "Pause", exact: true }).click();
checks.paused = await state();
const handle = lesson.locator('[data-drag="surface-ring-3d"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Surface ring handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 65, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.animationReset = await state();
await lesson.getByLabel("Surface practice answer").fill("1");
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Surface practice answer").fill("217.0319");
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0400"]')
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
      /* SVG */
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
    title: rect(".sar321-title"),
    lab: rect(".sar321-lab"),
    formulas: rect(".sar321-formulas"),
    learn: rect(".sar321-learn"),
    practice: rect(".sar321-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (v, n, t = 1e-7) => Math.abs(Number(v) - n) <= t;
const passed =
  checks.initial.axis === "x" &&
  checks.initial.curve === "sqrt" &&
  checks.initial.a === "1" &&
  checks.initial.b === "6" &&
  checks.initial.x === "3.7" &&
  close(checks.initial.area, 59.59583467) &&
  close(checks.initial.element, 12.48758382) &&
  checks.controls.axis === "y" &&
  checks.controls.curve === "log" &&
  checks.controls.a === "2" &&
  checks.controls.b === "5" &&
  checks.controls.speed === "80" &&
  close(checks.controls.area, 67.60397835) &&
  checks.tab.tab === "Formula" &&
  checks.playing.playing === "true" &&
  checks.playing.x !== "3.7" &&
  checks.paused.playing === "false" &&
  checks.drag.x !== checks.paused.x &&
  checks.animationReset.x === "2" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.hint.hint === "true" &&
  checks.shellReset.axis === "x" &&
  checks.shellReset.curve === "sqrt" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar.width === 224 &&
  metrics.lab.top === 208 &&
  metrics.lab.bottom === 795 &&
  metrics.footer.bottom === 1536 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0400",
  lessonId: 321,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0400-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0400-reference.png"));
await writeFile(
  path.join(evidence, "0400-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
