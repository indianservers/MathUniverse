import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0255-interactive-foundational-advanced-dynamic-geometry-constructions-free-point-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/198-free-point";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1024, height: 1536 },
});
const page = await context.newPage();
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0255");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      ["point", "tool", "snap", "exists", "practice", "tab"].map((key) => [
        key,
        node.getAttribute(`data-${key}`),
      ]),
    ),
  );
const checks = { initial: await state() };
const handle = await lesson.getByTestId("free-point-handle").boundingBox();
await page.mouse.move(handle.x, handle.y);
await page.mouse.down();
await page.mouse.move(handle.x + 62, handle.y - 62, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Point x coordinate").fill("-3");
await lesson.getByLabel("Point y coordinate").fill("4");
checks.coordinates = await state();
await lesson.getByRole("button", { name: "Pan", exact: true }).click();
const plane = lesson.locator(".fp198-plane");
const board = await plane.boundingBox();
await page.mouse.move(board.x + 200, board.y + 180);
await page.mouse.down();
await page.mouse.move(board.x + 230, board.y + 205, { steps: 4 });
await page.mouse.up();
await lesson.getByRole("button", { name: "Zoom in" }).click();
await lesson.getByRole("button", { name: "Reset view" }).click();
await lesson.getByRole("button", { name: "Delete", exact: true }).click();
await page.mouse.click(board.x + 300, board.y + 200);
checks.deleted = await state();
await lesson.getByRole("button", { name: "Point", exact: true }).click();
await page.mouse.click(board.x + 300, board.y + 200);
checks.recreated = await state();
await lesson.getByLabel("Point label").fill("A");
await lesson.getByLabel("Point color").fill("#db2777");
await lesson.getByLabel("Point line style").selectOption("dashed");
await lesson.getByRole("button", { name: "Increase point size" }).click();
await lesson.getByLabel("Practice Q x coordinate").fill("4");
await lesson.getByLabel("Practice Q y coordinate").fill("-2");
await lesson.getByText("Create point Q.").click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.practice = await state();
for (const name of [
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
  "Construction",
])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.actions = await state();
const previousHref = await lesson
  .locator(".fp198-nav a")
  .first()
  .getAttribute("href");
const nextHref = await lesson
  .locator(".fp198-nav a")
  .last()
  .getAttribute("href");
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return box
      ? { top: box.top, height: box.height, left: box.left, width: box.width }
      : null;
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    regions: {
      header: region(".fp198-header"),
      tabs: region(".fp198-tabs"),
      main: region(".fp198-main"),
      cards: region(".fp198-cards"),
      nav: region(".fp198-nav"),
      footer: region(".fp198-footer"),
    },
  };
});
const geometry =
  metrics.document.width === 1024 &&
  metrics.document.height <= 1536 &&
  Math.round(metrics.regions.header.top) === 107 &&
  Math.round(metrics.regions.header.left) === 233 &&
  Math.round(metrics.regions.header.width) === 775;
const passed =
  checks.initial.point === "2:1" &&
  checks.initial.exists === "true" &&
  checks.drag.point !== checks.initial.point &&
  checks.coordinates.point === "-3:4" &&
  checks.deleted.exists === "false" &&
  checks.recreated.exists === "true" &&
  checks.practice.practice === "correct" &&
  checks.actions.tab === "Construction" &&
  previousHref === "/lessons/geometry/197-force-vectors" &&
  nextHref === "/lessons/geometry/199-point-on-object" &&
  geometry &&
  !metrics.horizontalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0255-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0255-reference.png"));
const report = {
  mockup: "0255",
  lessonId: 198,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0255-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
