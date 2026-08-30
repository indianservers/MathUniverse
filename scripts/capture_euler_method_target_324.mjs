/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0403-interactive-advanced-integral-calculus-and-differential-equations-euler-s-method-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/324-euler-s-method";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 941, height: 1672 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0403");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "equation",
        "x0",
        "y0",
        "h",
        "step",
        "steps",
        "current-x",
        "current-euler",
        "current-exact",
        "current-error",
        "max-error",
        "rms-error",
        "playing",
        "tab",
        "result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
const stepSize = lesson.getByLabel("Euler step size");
const stepBox = await stepSize.boundingBox();
if (!stepBox) throw new Error("Euler step slider missing");
await page.mouse.click(
  stepBox.x + stepBox.width * ((0.25 - 0.05) / 0.45),
  stepBox.y + stepBox.height / 2,
);
await lesson.getByLabel("Euler equation").selectOption("forced");
await lesson.getByLabel("Slope field").uncheck();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.controls = await state();
await lesson.getByLabel("Animate Euler steps").click();
await page.waitForTimeout(850);
checks.animation = await state();
await lesson.getByLabel("Pause Euler animation").click();
checks.paused = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0403"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
const handle = lesson.locator('[data-drag="euler-initial"]');
const handleBox = await handle.boundingBox();
if (!handleBox) throw new Error("Euler initial-condition handle missing");
await page.mouse.move(
  handleBox.x + handleBox.width / 2,
  handleBox.y + handleBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(handleBox.x + 42, handleBox.y - 38, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Euler practice answer").fill("2.7183");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Euler practice answer").fill("2.4414");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
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
    hero: rect(".eul324-hero"),
    tabs: rect(".eul324-tabs"),
    lab: rect(".eul324-lab"),
    learning: rect(".eul324-learning"),
    practice: rect(".eul324-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (value, expected, tolerance = 1e-6) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.equation === "growth" &&
  close(checks.initial.x0, 0) &&
  close(checks.initial.y0, 1) &&
  close(checks.initial.h, 0.2) &&
  checks.initial.step === "3" &&
  checks.initial.steps === "10" &&
  close(checks.initial["current-x"], 0.6) &&
  close(checks.initial["current-euler"], 1.728) &&
  close(checks.initial["current-exact"], Math.exp(0.6)) &&
  checks.controls.equation === "forced" &&
  close(checks.controls.h, 0.25, 0.03) &&
  checks.controls.tab === "Formula" &&
  checks.animation.playing === "true" &&
  Number(checks.animation.step) > 0 &&
  checks.paused.playing === "false" &&
  checks.shellReset.equation === "growth" &&
  checks.shellReset.actions === "0" &&
  checks.drag.x0 !== "0" &&
  checks.drag.y0 !== "1" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  metrics.document.width === 941 &&
  metrics.document.height === 1672 &&
  !metrics.overflow &&
  metrics.sidebar.width === 193 &&
  metrics.hero.top === 94 &&
  metrics.lab.top === 297 &&
  metrics.adjacent.top === 1474 &&
  metrics.footer.bottom === 1672 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0403",
  lessonId: 324,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0403-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0403-reference.png"));
await writeFile(
  path.join(evidence, "0403-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
