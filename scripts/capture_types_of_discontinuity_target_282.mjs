/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0361-interactive-advanced-limits-and-differential-calculus-types-of-discontinuity-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/282-types-of-discontinuity";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180_000 });
const lesson = page.getByTestId("calculus-mockup-0361");
await lesson.waitFor({ timeout: 600_000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "selected",
        "classification",
        "classification-correct",
        "left-marker",
        "right-marker",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };

const removableLeft = lesson.locator('[data-drag="removable-left"]');
const markerBox = await removableLeft.boundingBox();
if (!markerBox) throw new Error("Removable left marker is missing");
await page.mouse.move(
  markerBox.x + markerBox.width / 2,
  markerBox.y + markerBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(markerBox.x + 45, markerBox.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();

await lesson.getByRole("heading", { name: "Jump discontinuity" }).click();
checks.jump = await state();
await lesson.getByRole("radio", { name: "Removable" }).check();
checks.misclassified = await state();
await lesson.getByRole("radio", { name: "Jump" }).check();
checks.classified = await state();
await lesson.getByRole("heading", { name: "Infinite discontinuity" }).click();
checks.infinite = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0361"]')
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
      /* SVG */
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
    title: rect(".td282-title"),
    tabs: rect(".td282-tabs"),
    lab: rect(".td282-lab"),
    graphs: rect(".td282-graphs"),
    analysis: rect(".td282-analysis"),
    rules: rect(".td282-rules"),
    adjacent: rect(".td282-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.selected === "removable" &&
  checks.initial.classification === "removable" &&
  checks.initial["classification-correct"] === "true" &&
  checks.dragged["left-marker"] !== checks.initial["left-marker"] &&
  checks.jump.selected === "jump" &&
  checks.misclassified["classification-correct"] === "false" &&
  checks.classified["classification-correct"] === "true" &&
  checks.infinite.selected === "infinite" &&
  checks.reset.selected === "removable" &&
  checks.reset.actions === "0" &&
  navigation.previousHref === "/lessons/calculus/281-continuity-at-a-point" &&
  navigation.nextHref === "/lessons/calculus/283-epsilondelta-visualiser" &&
  metrics.document.width === 1536 &&
  metrics.document.height === 1024 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 273 &&
  metrics.footer?.height === 0 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0361",
  lessonId: 282,
  checks,
  navigation,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0361-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0361-reference.png"));
await writeFile(
  path.join(evidence, "0361-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
