/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0399-interactive-advanced-integral-calculus-and-differential-equations-arc-length-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/calculus/320-arc-length";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0399");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "a",
        "b",
        "n",
        "x",
        "dx",
        "dy",
        "ds",
        "approx",
        "exact",
        "error",
        "tab",
        "result",
        "hint",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Arc lower bound").fill("-2");
await lesson.getByLabel("Arc upper bound").fill("3");
await lesson.getByLabel("Arc segments").fill("40");
await lesson.getByLabel("Arc triangle position").fill("0.5");
checks.controls = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tab = await state();
const handle = lesson.locator('[data-drag="arc-triangle"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Arc triangle handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 60, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Arc practice answer").fill("1");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Arc practice answer").fill("5.6526");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: /Show hint/ }).click();
checks.hint = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0399"]')
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
    hero: rect(".arc320-hero"),
    tabs: rect(".arc320-tabs"),
    lab: rect(".arc320-lab"),
    cards: rect(".arc320-cards"),
    practice: rect(".arc320-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
  };
});
const close = (v, n, t = 1e-7) => Math.abs(Number(v) - n) <= t;
const passed =
  checks.initial.a === "-5" &&
  checks.initial.b === "5" &&
  checks.initial.n === "20" &&
  close(checks.initial.exact, 27.80753591) &&
  close(checks.initial.approx, 27.78710689) &&
  close(checks.initial.ds, 0.88069575) &&
  checks.controls.a === "-2" &&
  checks.controls.b === "3" &&
  checks.controls.n === "40" &&
  checks.controls.x === "0.5" &&
  close(checks.controls.exact, 8.61052543) &&
  checks.tab.tab === "Formulas" &&
  checks.drag.x !== "0.5" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.hint.hint === "true" &&
  checks.shellReset.a === "-5" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.sidebar.width === 215 &&
  metrics.adjacent.bottom === 1536 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0399",
  lessonId: 320,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0399-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0399-reference.png"));
await writeFile(
  path.join(evidence, "0399-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
