/* global document, innerWidth */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0349-interactive-intermediate-advanced-cas-workspace-differential-equations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/symbolic-mathematics/443-differential-equations";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1496, height: 1051 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("symbolic-cas-mockup-0349");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      ["equation", "x0", "y0", "step", "visible", "error", "actions"].map(
        (key) => [key, node.getAttribute(`data-${key}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.locator('[data-lesson-control="ode-equation"]').selectOption("x+y");
await lesson.locator('[data-lesson-control="ode-x0"]').fill("1");
await lesson.locator('[data-lesson-control="ode-y0"]').fill("2");
await lesson.locator('[data-lesson-control="ode-step"]').focus();
await page.keyboard.press("ArrowRight");
checks.edited = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0349"]')
      ?.getAttribute("data-actions") === "0",
);
const point = lesson.locator('[data-lesson-control="ode-initial-point"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Initial-condition point was not rendered");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 55, box.y + box.height / 2 - 35, {
  steps: 5,
});
await page.mouse.up();
checks.dragged = await state();
await lesson.locator('[data-lesson-control="ode-clear"]').click();
checks.cleared = await state();
await lesson.locator('[data-lesson-control="ode-animate"]').click();
await page.waitForTimeout(700);
checks.animated = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="symbolic-cas-mockup-0349"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
const navigation = {
  previousHref: await lesson
    .getByRole("link", { name: /Previous/ })
    .getAttribute("href"),
  nextHref: await lesson.getByRole("link", { name: /Next/ }).getAttribute("href"),
};
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
    shellHeader: rect(".lesson-shell-header"),
    tabs: rect(".de443-tabs"),
    layout: rect(".de443-layout"),
    graph: rect(".de443-graph"),
    controls: rect(".de443-controls"),
    adjacent: rect(".de443-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.equation === "x-y" &&
  checks.initial.x0 === "0" &&
  checks.initial.y0 === "1" &&
  checks.initial.step === "0.2" &&
  checks.initial.visible === "16" &&
  checks.edited.equation === "x+y" &&
  checks.edited.x0 === "1" &&
  checks.edited.y0 === "2" &&
  checks.edited.step === "0.25" &&
  checks.dragged.x0 !== "0" &&
  checks.dragged.y0 !== "1" &&
  checks.cleared.visible === "0" &&
  Number(checks.animated.visible) > 1 &&
  checks.reset.equation === "x-y" &&
  checks.reset.x0 === "0" &&
  checks.reset.y0 === "1" &&
  checks.reset.actions === "0" &&
  navigation.previousHref ===
    "/lessons/symbolic-mathematics/442-series-expansions" &&
  navigation.nextHref ===
    "/lessons/symbolic-mathematics/444-matrix-operations" &&
  metrics.document.width === 1496 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 287 &&
  metrics.shellHeader?.height === 0 &&
  metrics.footer?.height === 0 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0349",
  lessonId: 443,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0349-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0349-reference.png"));
await writeFile(
  path.join(evidence, "0349-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
