import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document, innerWidth, innerHeight */

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0235-interactive-intermediate-coordinate-geometry-coordinate-loci-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/geometry/178-coordinate-loci";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1060, height: 1484 },
});
const page = await context.newPage();
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0235");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "radius",
        "angle",
        "point",
        "distance",
        "equation",
        "trace-count",
        "grid",
        "axes",
        "zoom",
        "tab",
        "status",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Locus radius value").fill("4");
checks.radius = await state();
await lesson.getByTestId("coordinate-locus-point").press("ArrowUp");
checks.keyboard = await state();
const point = lesson.getByTestId("coordinate-locus-point");
const pointBox = await point.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(523, 510, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "Grid" }).click();
checks.grid = await state();
for (const name of ["Construct", "Rule", "Practice"])
  await lesson.getByRole("button", { name }).click();
checks.tabs = await state();
await lesson.getByRole("button", { name: "Zoom in" }).click();
checks.zoom = await state();
await lesson.getByLabel("Practice locus equation").fill("x+y=4");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice locus equation").fill("(x-1)^2+(y-1)^2=16");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Check my idea" }).click();
checks.idea = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
  .locator(".cl178-nav a")
  .first()
  .getAttribute("href");
const nextHref = await lesson
  .locator(".cl178-nav a")
  .last()
  .getAttribute("href");
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    regions: {
      page: region(".cl178-page"),
      header: region(".cl178-header"),
      tabs: region(".cl178-tabs"),
      lab: region(".cl178-lab"),
      graph: region(".cl178-graph-wrap"),
      learning: region(".cl178-learning"),
      navigation: region(".cl178-nav"),
      footer: region(".cl178-footer"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1060 &&
  metrics.viewport.height === 1484 &&
  metrics.document.width === 1060 &&
  metrics.document.height === 1484 &&
  Math.round(metrics.regions.page.left) === 211 &&
  Math.round(metrics.regions.header.left) === 228 &&
  Math.round(metrics.regions.header.top) === 103;
const passed =
  checks.initial.radius === "3.00" &&
  checks.initial.point === "3.00:0.00" &&
  checks.initial.distance === "3.000" &&
  checks.initial.equation === "x² + y² = 9" &&
  checks.radius.radius === "4.00" &&
  checks.radius.equation === "x² + y² = 16" &&
  checks.keyboard.angle !== checks.radius.angle &&
  checks.keyboard.distance === "4.000" &&
  checks.drag.angle !== checks.keyboard.angle &&
  checks.drag.distance === "4.000" &&
  Number(checks.drag["trace-count"]) > Number(checks.keyboard["trace-count"]) &&
  checks.grid.grid === "false" &&
  checks.tabs.tab === "3" &&
  checks.zoom.zoom === "1.1" &&
  checks.wrong.status === "Use centre (1, 1) and radius 4" &&
  checks.correct.status === "Correct locus equation" &&
  checks.idea.status === "The distance stays constant" &&
  checks.reset.radius === "3.00" &&
  checks.reset.equation === "x² + y² = 9" &&
  previousHref === "/lessons/geometry/177-point-to-line-distance" &&
  nextHref === "/lessons/geometry/179-coordinate-transformations" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0235-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0235-reference.png"));
const report = {
  mockup: "0235",
  lessonId: 178,
  route: "/lessons/geometry/178-coordinate-loci",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0235-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
