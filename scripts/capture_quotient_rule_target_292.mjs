/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0371-interactive-advanced-limits-and-differential-calculus-quotient-rule-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/292-quotient-rule",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1019, height: 1543 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0371");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "f",
        "g",
        "poles",
        "x0",
        "y",
        "model",
        "rule",
        "error",
        "derivative-visible",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Quotient point x0").fill("1");
checks.xOne = await state();
await lesson.getByRole("checkbox").uncheck();
checks.hidden = await state();
const handle = lesson.locator('[data-drag="quotient-point"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Quotient point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Quotient denominator").fill("x^2+1");
checks.noPole = await state();
await lesson.getByLabel("Quotient numerator").fill("-(1+x^2)");
await lesson.getByLabel("Quotient denominator").fill("2+x");
await lesson.getByLabel("Quotient rule practice answer").fill("3/(x^2+1)");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.rejected = await state();
await lesson
  .getByLabel("Quotient rule practice answer")
  .fill("(-3x^2+2x+3)/(x^2+1)^2");
await lesson.getByRole("button", { name: "Check Answer" }).click();
await lesson.getByRole("button", { name: /Show Solution/ }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0371"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
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
    hero: rect(".qtr292-hero"),
    tabs: rect(".qtr292-tabs"),
    flow: rect(".qtr292-flow"),
    lab: rect(".qtr292-lab"),
    derivation: rect(".qtr292-derivation"),
    bottom: rect(".qtr292-bottom"),
    adjacent: rect(".qtr292-adjacent"),
    footer: rect(".qtr292-footer"),
  };
});
const passed =
  checks.initial.f === "-(1+x^2)" &&
  checks.initial.g === "2+x" &&
  checks.initial.poles === "-2" &&
  checks.initial.x0 === "0" &&
  checks.initial.y === "-0.5" &&
  checks.initial.rule === "0.25" &&
  Number(checks.initial.error) < 0.001 &&
  checks.xOne.y === "-0.6667" &&
  checks.xOne.rule === "-0.4444" &&
  checks.hidden["derivative-visible"] === "false" &&
  checks.dragged.x0 !== "1" &&
  checks.noPole.poles === "" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x0 === "0" &&
  checks.reset.poles === "-2" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1019 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 220 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0371",
  lessonId: 292,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0371-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0371-reference.png"));
await writeFile(
  path.join(evidence, "0371-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
