/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0363-interactive-advanced-limits-and-differential-calculus-average-rate-of-change-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/284-average-rate-of-change",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0363");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x-a",
        "x-b",
        "y-a",
        "y-b",
        "rise",
        "run",
        "rate",
        "practice",
        "practice-result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Point A x-coordinate").fill("-2");
await lesson.getByLabel("Point B x-coordinate").fill("3");
checks.sliders = await state();
const handle = lesson.locator('[data-drag="point-b"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Point B drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 65, box.y, { steps: 7 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("radio", { name: /B 0.400/ }).check();
await lesson.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await lesson.getByRole("radio", { name: /C 0.500/ }).check();
await lesson.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0363"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson
    .getByRole("link", { name: /Next/ })
    .getAttribute("href"),
};
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /*SVG*/
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((key) => [
        key,
        Math.round(box[key]),
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
    hero: rect(".arc284-hero"),
    tabs: rect(".arc284-tabs"),
    lab: rect(".arc284-lab"),
    flow: rect(".arc284-flow"),
    learning: rect(".arc284-learning"),
    practice: rect(".arc284-practice"),
    adjacent: rect(".arc284-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial["x-a"] === "-3" &&
  checks.initial["x-b"] === "2" &&
  checks.initial["y-a"] === "2" &&
  checks.initial["y-b"] === "3" &&
  checks.initial.rise === "1" &&
  checks.initial.run === "5" &&
  checks.initial.rate === "0.2" &&
  checks.sliders["x-a"] === "-2" &&
  checks.sliders["x-b"] === "3" &&
  checks.dragged["x-b"] !== checks.sliders["x-b"] &&
  checks.rejected["practice-result"] === "incorrect" &&
  checks.accepted["practice-result"] === "correct" &&
  checks.reset["x-a"] === "-3" &&
  checks.reset["x-b"] === "2" &&
  checks.reset.actions === "0" &&
  navigation.previousHref === "/lessons/calculus/283-epsilondelta-visualiser" &&
  navigation.nextHref ===
    "/lessons/calculus/285-instantaneous-rate-of-change" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 204 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0363",
  lessonId: 284,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0363-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0363-reference.png"));
await writeFile(
  path.join(evidence, "0363-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
