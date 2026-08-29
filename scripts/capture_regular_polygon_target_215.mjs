import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0272-interactive-foundational-advanced-dynamic-geometry-constructions-regular-polygon-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/215-regular-polygon";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1027, height: 1532 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0272");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "n",
        "radius",
        "rotation",
        "center",
        "vertices",
        "central-angle",
        "side",
        "perimeter",
        "area",
        "tool",
        "visibility",
        "stage",
        "fullscreen-count",
        "feedback",
        "hint",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );

const drag = async (locator, dx, dy) => {
  const bounds = await locator.boundingBox();
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + dx,
    bounds.y + bounds.height / 2 + dy,
    { steps: 8 },
  );
  await page.mouse.up();
};

const setRange = async (name, value) => {
  await lesson
    .getByRole("slider", { name, exact: true })
    .evaluate((element, next) => {
      const setter = Object.getOwnPropertyDescriptor(
        globalThis.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(element, String(next));
      element.dispatchEvent(new globalThis.Event("input", { bubbles: true }));
    }, value);
};

const checks = { initial: await state() };
await drag(lesson.getByTestId("regular-polygon-center"), 30, 22);
checks.centerDrag = await state();
await drag(lesson.getByTestId("regular-polygon-vertex-0"), 34, -26);
checks.vertexDrag = await state();

await setRange("Sides (n)", 8);
await setRange("Radius (r)", 5);
checks.ranges = await state();
await lesson.getByRole("button", { name: "Rotate polygon 15 degrees" }).click();
checks.rotated = await state();

await lesson.getByRole("button", { name: "Place polygon centre" }).click();
const canvas = lesson.getByRole("img", {
  name: /Interactive regular polygon coordinate plane/,
});
const canvasBounds = await canvas.boundingBox();
await page.mouse.click(
  canvasBounds.x + canvasBounds.width * 0.58,
  canvasBounds.y + canvasBounds.height * 0.55,
);
checks.placedCenter = await state();

await lesson.getByRole("button", { name: "Hide radii" }).click();
await lesson.getByRole("button", { name: "Hide polygon grid" }).click();
for (const name of [
  "Show vertices",
  "Show circumcircle",
  "Show symmetry axes",
  "Labels",
]) {
  await lesson.getByRole("checkbox", { name, exact: true }).click();
}
checks.hidden = await state();

await lesson.getByRole("button", { name: "Enter polygon fullscreen" }).click();
checks.fullscreen = await state();
await page.keyboard.press("Escape");

checks.stages = [];
for (const [name, expected] of [
  ["Construct", "1"],
  ["Patterns", "2"],
  ["Rule", "3"],
  ["Try It", "4"],
  ["Explore", "0"],
]) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks.stages.push({ expected, actual: (await state()).stage });
}

await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Polygon practice side").fill("3.8268");
await lesson.getByLabel("Polygon practice perimeter").fill("30.6147");
await lesson.getByLabel("Polygon practice area").fill("70.7107");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await state();

const previousHref = await lesson
  .locator('a[href="/lessons/geometry/214-triangle-constructor"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('a[href="/lessons/geometry/216-rigid-polygon"]')
  .getAttribute("href");

await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const bounds = globalThis.document
      .querySelector(selector)
      ?.getBoundingClientRect();
    return bounds
      ? {
          top: bounds.top,
          left: bounds.left,
          width: bounds.width,
          height: bounds.height,
          bottom: bounds.bottom,
        }
      : null;
  };
  return {
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    overflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect('[data-testid="dynamic-geometry-mockup-0272"] > header'),
    workspace: rect("#polygon-0"),
    bands: rect("#polygon-2"),
    lower: rect("#polygon-1"),
    practice: rect("#polygon-4"),
    adjacent: rect(
      '[data-testid="dynamic-geometry-mockup-0272"] > nav:last-of-type',
    ),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const close = (value, expected, tolerance = 0.01) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.n === "6" &&
  close(checks.initial.radius, 6) &&
  close(checks.initial["central-angle"], 60) &&
  close(checks.initial.side, 6) &&
  close(checks.initial.perimeter, 36) &&
  close(checks.initial.area, 93.5307) &&
  checks.centerDrag.center !== checks.initial.center &&
  checks.centerDrag.vertices !== checks.initial.vertices &&
  checks.centerDrag.side === checks.initial.side &&
  checks.vertexDrag.center === checks.centerDrag.center &&
  checks.vertexDrag.radius !== checks.centerDrag.radius &&
  checks.vertexDrag.rotation !== checks.centerDrag.rotation &&
  checks.ranges.n === "8" &&
  checks.ranges.radius === "5" &&
  close(checks.ranges["central-angle"], 45) &&
  checks.rotated.rotation !== checks.ranges.rotation &&
  checks.placedCenter.center !== checks.rotated.center &&
  checks.placedCenter.tool === "select" &&
  checks.hidden.visibility.includes("vertices:false") &&
  checks.hidden.visibility.includes("circle:false") &&
  checks.hidden.visibility.includes("symmetry:false") &&
  checks.hidden.visibility.includes("labels:false") &&
  checks.hidden.visibility.includes("radii:false") &&
  checks.hidden.visibility.includes("grid:false") &&
  checks.fullscreen["fullscreen-count"] === "1" &&
  checks.stages.every(({ expected, actual }) => expected === actual) &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.hint.hint === "true" &&
  previousHref === "/lessons/geometry/214-triangle-constructor" &&
  nextHref === "/lessons/geometry/216-rigid-polygon" &&
  metrics.sidebar?.width === 210 &&
  metrics.header?.left === 223 &&
  metrics.header?.width === 791 &&
  metrics.header?.top === 108 &&
  metrics.workspace?.top === 287 &&
  metrics.workspace?.bottom === 804 &&
  metrics.bands?.top === 815 &&
  metrics.lower?.top === 954 &&
  metrics.adjacent?.top === 1322 &&
  metrics.adjacent?.bottom === 1390 &&
  metrics.footer?.top === 1390 &&
  metrics.footer?.bottom === 1532 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(output, "0272-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(output, "0272-reference.png"));
const report = {
  mockup: "0272",
  lessonId: 215,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(output, "0272-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
