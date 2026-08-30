/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0391-interactive-advanced-integral-calculus-and-differential-equations-substitution-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/312-substitution";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0391");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "u",
        "scale",
        "a",
        "b",
        "ua",
        "ub",
        "orientation",
        "integral",
        "tab",
        "answer",
        "solution",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Substitution lower bound").fill("0.2");
await lesson.getByLabel("Substitution upper bound").fill("1.5");
checks.bounds = await state();
const handle = lesson.locator('[data-drag="substitution-a"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Substitution bound handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Substitution u function").selectOption("linear");
await lesson.getByLabel("Substitution differential scale").selectOption("half");
await lesson.getByRole("button", { name: "Formulas" }).click();
checks.transform = await state();
await lesson.locator('input[name="sub312-answer"]').nth(1).check();
await lesson.getByRole("button", { name: "Try it" }).click();
checks.rejected = await state();
await lesson.locator('input[name="sub312-answer"]').nth(0).check();
await lesson.getByRole("button", { name: "Try it" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0391"]')
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
    hero: rect(".sub312-hero"),
    tabs: rect(".sub312-tabs"),
    flow: rect(".sub312-flow"),
    mapper: rect(".sub312-mapper"),
    cards: rect(".sub312-cards"),
    adjacent: rect(".sub312-adjacent"),
    footer: rect(".sub312-footer"),
  };
});
const passed =
  checks.initial.u === "square" &&
  checks.initial.scale === "exact" &&
  checks.initial.orientation === "split at x=0" &&
  Math.abs(Number(checks.initial.integral)) < 1e-5 &&
  checks.bounds.a === "0.2" &&
  checks.bounds.b === "1.5" &&
  checks.bounds.orientation === "preserved" &&
  checks.drag.a !== checks.bounds.a &&
  checks.transform.u === "linear" &&
  checks.transform.scale === "half" &&
  checks.transform.tab === "Formulas" &&
  checks.rejected.answer === "B" &&
  checks.rejected.solution === "true" &&
  checks.accepted.answer === "A" &&
  checks.accepted.solution === "true" &&
  checks.localReset.a === "-1" &&
  checks.localReset.b === "1" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0391",
  lessonId: 312,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0391-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0391-reference.png"));
await writeFile(
  path.join(evidence, "0391-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
