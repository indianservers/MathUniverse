/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0404-interactive-advanced-integral-calculus-and-differential-equations-separable-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/325-separable-equations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 992, height: 1586 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0404");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x-placed",
        "y-placed",
        "separated",
        "integrated",
        "k",
        "tab",
        "hint",
        "practice",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
const xTerm = lesson.locator(".sep325-separate > .terms > button").first();
await xTerm.dragTo(lesson.locator(".sep325-separate > .drop.y"));
checks.misplaced = await state();
await xTerm.dragTo(lesson.locator(".sep325-separate > .drop.x"));
checks.reseparated = await state();
await lesson.getByRole("button", { name: "Integrate both sides" }).click();
await lesson.getByLabel("Separable solution K").fill("-1.5");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
await lesson.getByRole("button", { name: "Need a hint?" }).click();
await lesson.getByRole("button", { name: /Try another/ }).click();
checks.controls = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0404"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
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
    hero: rect(".sep325-hero"),
    tabs: rect(".sep325-tabs"),
    separate: rect(".sep325-separate"),
    integrate: rect(".sep325-integrate"),
    family: rect(".sep325-family"),
    practice: rect(".sep325-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.separated === "true" &&
  checks.initial.integrated === "true" &&
  checks.initial.k === "2.00" &&
  checks.misplaced["x-placed"] === "false" &&
  checks.misplaced.separated === "false" &&
  checks.reseparated.separated === "true" &&
  checks.reseparated.integrated === "false" &&
  checks.controls.integrated === "true" &&
  checks.controls.k === "-1.50" &&
  checks.controls.tab === "Formula" &&
  checks.controls.hint === "true" &&
  checks.controls.practice === "1" &&
  checks.shellReset.separated === "true" &&
  checks.shellReset.k === "2.00" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 992 &&
  metrics.document.height === 1586 &&
  !metrics.overflow &&
  metrics.sidebar.width === 198 &&
  metrics.hero.top === 100 &&
  metrics.separate.top === 327 &&
  metrics.adjacent.top === 1451 &&
  metrics.footer.bottom === 1586 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0404",
  lessonId: 325,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0404-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0404-reference.png"));
await writeFile(
  path.join(evidence, "0404-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
