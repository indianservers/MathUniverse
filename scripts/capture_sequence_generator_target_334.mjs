/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0519-interactive-intermediate-advanced-sequences-and-series-sequence-generator-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/334-sequence-generator";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 941, height: 1672 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0519");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "type",
        "a",
        "b",
        "c",
        "first",
        "last",
        "step",
        "terms",
        "first-difference",
        "second-difference",
        "classification",
        "chart",
        "differences",
        "ratios",
        "sums",
        "tab",
        "quick-result",
        "turn-result",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Sequence explicit formula").fill("2n² - n + 4");
await lesson.getByLabel("Sequence range from").fill("2");
await lesson.getByLabel("Sequence range to").fill("8");
await lesson.getByLabel("Sequence range step").fill("2");
await lesson.getByLabel("Show ratios (r)").check();
await lesson.getByLabel("Show cumulative sum (Sₙ)").check();
await lesson.getByRole("button", { name: "Points", exact: true }).click();
await lesson.getByRole("button", { name: "Explain", exact: true }).click();
checks.controls = await state();
const handle = lesson.locator('[data-drag="sequence-point-1"]'),
  hbox = await handle.boundingBox();
if (!hbox) throw new Error("Sequence point missing");
await page.mouse.move(hbox.x + hbox.width / 2, hbox.y + hbox.height / 2);
await page.mouse.down();
await page.mouse.move(hbox.x, hbox.y - 30, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "Recursive", exact: true }).click();
await lesson.getByLabel("Sequence recursive start").fill("5");
await lesson.getByLabel("Sequence recursive difference").fill("3");
checks.recursive = await state();
const download = page.waitForEvent("download");
await lesson.getByRole("button", { name: "Export", exact: true }).click();
const saved = await download;
checks.download = saved.suggestedFilename();
await lesson.getByRole("button", { name: "418", exact: true }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "457", exact: true }).click();
await lesson.getByLabel("Sequence practice a15").fill("706");
await lesson.getByLabel("Sequence practice a20").fill("1241");
await lesson
  .getByRole("button", { name: "Check my answer", exact: true })
  .click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0519"]')
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
await page.waitForTimeout(150);
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
    hero: rect(".seq334-hero"),
    tabs: rect(".seq334-tabs"),
    lab: rect(".seq334-lab"),
    checks: rect(".seq334-checks"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.type === "explicit" &&
  checks.initial.a === "3" &&
  checks.initial.b === "2" &&
  checks.initial.c === "1" &&
  checks.initial.terms === "6,17,34,57,86,121,162,209,262,321" &&
  checks.initial["first-difference"] === "11,17,23,29,35,41,47,53,59" &&
  checks.initial["second-difference"] === "6,6,6,6,6,6,6,6" &&
  checks.initial.classification === "Quadratic sequence" &&
  checks.controls.a === "2" &&
  checks.controls.b === "-1" &&
  checks.controls.c === "4" &&
  checks.controls.terms === "10,32,70,124" &&
  checks.controls.ratios === "true" &&
  checks.controls.sums === "true" &&
  checks.controls.chart === "points" &&
  checks.controls.tab === "Explain" &&
  checks.drag.c !== checks.controls.c &&
  checks.recursive.type === "recursive" &&
  checks.recursive.terms === "5,8,11,14" &&
  checks.recursive.classification === "Arithmetic sequence" &&
  checks.download === "sequence-generator.csv" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.accepted["turn-result"] === "correct" &&
  checks.shellReset.terms === "6,17,34,57,86,121,162,209,262,321" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 941 &&
  metrics.document.height === 1672 &&
  !metrics.overflow &&
  metrics.sidebar.width === 204 &&
  metrics.hero.top === 87 &&
  metrics.tabs.top === 273 &&
  metrics.lab.top === 324 &&
  metrics.checks.top === 1285 &&
  metrics.adjacent.top === 1463 &&
  metrics.footer.top === 1523 &&
  metrics.footer.bottom === 1672 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0519",
  lessonId: 334,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0519-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0519-reference.png"));
await writeFile(
  path.join(evidence, "0519-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
