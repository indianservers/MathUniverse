/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0385-interactive-advanced-integral-calculus-and-differential-equations-area-by-rectangles-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/306-area-by-rectangles";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0385");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "a",
        "b",
        "n",
        "type",
        "dx",
        "signed",
        "positive",
        "negative",
        "rectangles",
        "curve",
        "axes",
        "grid",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Rectangle interval a").fill("-2");
await lesson.getByLabel("Rectangle interval b").fill("3");
await lesson.getByLabel("Rectangle count").fill("24");
await lesson.getByRole("button", { name: "midpoint" }).click();
checks.controls = await state();
const point = lesson.locator('[data-drag="rectangle-a"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Rectangle endpoint handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
const toggles = lesson.locator(".area306-lab .layers input");
for (let i = 0; i < 4; i++) await toggles.nth(i).uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Rectangle practice answer").fill("6");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Rectangle practice answer").fill("6.555718");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0385"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0385").waitFor();
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
    const e = document.querySelector(s),
      b = e?.getBoundingClientRect();
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
    hero: rect(".area306-hero"),
    tabs: rect(".area306-tabs"),
    lab: rect(".area306-lab"),
    flow: rect(".area306-flow"),
    info: rect(".area306-info"),
  };
});
const passed =
  checks.initial.a === "-1" &&
  checks.initial.b === "6" &&
  checks.initial.n === "12" &&
  checks.initial.type === "right" &&
  Math.abs(Number(checks.initial.signed) - 84.963108) < 1e-5 &&
  checks.controls.a === "-2" &&
  checks.controls.b === "3" &&
  checks.controls.n === "24" &&
  checks.controls.type === "midpoint" &&
  Math.abs(Number(checks.controls.signed) - 6.555718) < 1e-5 &&
  checks.dragged.a !== checks.controls.a &&
  checks.dragged.signed !== checks.controls.signed &&
  checks.layersOff.rectangles === "false" &&
  checks.layersOff.curve === "false" &&
  checks.layersOff.axes === "false" &&
  checks.layersOff.grid === "false" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.localReset.a === "-1" &&
  checks.localReset.type === "right" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0385",
  lessonId: 306,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0385-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0385-reference.png"));
await writeFile(
  path.join(evidence, "0385-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
