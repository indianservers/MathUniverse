/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0360-interactive-advanced-limits-and-differential-calculus-continuity-at-a-point-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/281-continuity-at-a-point";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180_000 });
const lesson = page.getByTestId("calculus-mockup-0360");
await lesson.waitFor({ timeout: 600_000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      ["a", "limit", "point-value", "continuous", "feedback", "actions"].map(
        (key) => [key, node.getAttribute(`data-${key}`)],
      ),
    ),
  );

const checks = { initial: await state() };
await lesson.getByLabel("Continuity point a").fill("0.5");
checks.movedPoint = await state();
await lesson.getByLabel("Function value at a").fill("0.5");
checks.repaired = await state();

const orangePoint = lesson.locator('[data-lesson-control="drag-function-value"]');
const pointBox = await orangePoint.boundingBox();
if (!pointBox) throw new Error("Function-value drag point is missing");
await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y + pointBox.height / 2);
await page.mouse.down();
await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y - 35, { steps: 5 });
await page.mouse.up();
checks.dragged = await state();

await lesson.getByLabel("A -1").check();
await lesson.locator('[data-lesson-control="practice-check"]').click();
checks.rejected = await state();
await lesson.getByLabel("B 0").check();
await lesson.locator('[data-lesson-control="practice-check"]').click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0360"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();

const navigation = {
  previousHref: await lesson.getByRole("link", { name: /Previous/ }).getAttribute("href"),
  nextHref: await lesson.getByRole("link", { name: /Next/ }).getAttribute("href"),
};
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      // SVG elements do not expose writable scroll positions.
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
    shellHeader: rect(".lesson-shell-header"),
    hero: rect(".cap281-hero"),
    tabs: rect(".cap281-tabs"),
    flow: rect(".cap281-flow"),
    lab: rect(".cap281-lab"),
    concept: rect(".cap281-concept"),
    learning: rect(".cap281-learning"),
    adjacent: rect(".cap281-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const passed =
  checks.initial.a === "0" &&
  checks.initial.limit === "0" &&
  checks.initial["point-value"] === "-1" &&
  checks.initial.continuous === "false" &&
  checks.movedPoint.a === "0.5" &&
  checks.movedPoint.limit === "0.5" &&
  checks.repaired.continuous === "true" &&
  checks.dragged["point-value"] !== checks.repaired["point-value"] &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.reset.a === "0" &&
  checks.reset["point-value"] === "-1" &&
  checks.reset.actions === "0" &&
  navigation.previousHref === "/lessons/calculus/280-limits-at-infinity" &&
  navigation.nextHref === "/lessons/calculus/282-types-of-discontinuity" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 255 &&
  metrics.shellHeader?.height === 0 &&
  metrics.footer?.height === 83 &&
  consoleMessages.length === 0;

const report = {
  mockup: "0360",
  lessonId: 281,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({ path: path.join(evidence, "0360-desktop.png"), fullPage: true });
await copyFile(reference, path.join(evidence, "0360-reference.png"));
await writeFile(
  path.join(evidence, "0360-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
