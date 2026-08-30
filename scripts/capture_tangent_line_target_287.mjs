/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0366-interactive-advanced-limits-and-differential-calculus-tangent-line-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/287-tangent-line";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1029, height: 1528 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0366");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["x", "y", "slope", "intercept", "result", "actions"].map((k) => [
        k,
        n.getAttribute(`data-${k}`),
      ]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Point x").fill("2");
checks.xTwo = await state();
const handle = lesson.locator('[data-drag="tangent-point"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Tangent drag point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 45, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Practice slope").fill("8");
await lesson.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await lesson.getByLabel("Practice slope").fill("9");
await lesson.getByLabel("Practice intercept").fill("-15");
await lesson.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0366"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
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
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((k) => [
        k,
        Math.round(b[k]),
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
    hero: rect(".tln287-hero"),
    tabs: rect(".tln287-tabs"),
    work: rect(".tln287-work"),
    learn: rect(".tln287-learn"),
    practice: rect(".tln287-practice"),
    adjacent: rect(".tln287-adjacent"),
  };
});
const passed =
  checks.initial.x === "-1" &&
  checks.initial.y === "-1" &&
  checks.initial.slope === "-2" &&
  checks.initial.intercept === "-3" &&
  checks.xTwo.y === "2" &&
  checks.xTwo.slope === "4" &&
  checks.xTwo.intercept === "-6" &&
  checks.dragged.x !== "2" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "-1" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1029 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 219 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0366",
  lessonId: 287,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0366-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0366-reference.png"));
await writeFile(
  path.join(evidence, "0366-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
