/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0376-interactive-advanced-limits-and-differential-calculus-increasing-decreasing-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/297-increasing-decreasing";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 965, height: 1629 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0376");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["a", "b", "roots", "behaviors", "domain", "result", "actions"].map(
        (k) => [k, n.getAttribute(`data-${k}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Increasing coefficient a").fill("-2");
await lesson.getByLabel("Increasing coefficient b").fill("2");
checks.coefficients = await state();
await lesson.getByLabel("Increasing domain minimum").fill("-4");
await lesson.getByLabel("Increasing domain maximum").fill("4");
checks.domain = await state();
const point = lesson.locator('[data-drag="increasing-root"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Increasing critical marker missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Classification 2").selectOption("Increasing");
await lesson.getByRole("button", { name: /Check/ }).last().click();
checks.rejected = await state();
await lesson.getByLabel("Classification 2").selectOption("Decreasing");
await lesson.getByRole("button", { name: /Check/ }).last().click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0376"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0376").waitFor({ timeout: 600000 });
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
    hero: rect(".inc297-hero"),
    tabs: rect(".inc297-tabs"),
    main: rect(".inc297-main"),
    flow: rect(".inc297-flow"),
    lab: rect(".inc297-lab"),
    feedback: rect(".inc297-feedback"),
    info: rect(".inc297-info"),
    practice: rect(".inc297-practice"),
    adjacent: rect(".inc297-adjacent"),
  };
});
const passed =
  checks.initial.a === "-3" &&
  checks.initial.b === "1" &&
  checks.initial.roots === "-0.667,0.667" &&
  checks.initial.behaviors === "Increasing,Decreasing,Increasing" &&
  checks.coefficients.roots === "-1.155,1.155" &&
  checks.domain.domain === "-4,4" &&
  checks.dragged.b !== checks.coefficients.b &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.a === "-3" &&
  checks.reset.b === "1" &&
  checks.reset.domain === "-3,3" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 965 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0376",
  lessonId: 297,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0376-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0376-reference.png"));
await writeFile(
  path.join(evidence, "0376-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
