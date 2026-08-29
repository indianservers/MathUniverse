import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0269-interactive-foundational-advanced-dynamic-geometry-constructions-tangent-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/212-tangent";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0269");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "center",
        "contact",
        "snap",
        "grid",
        "secant",
        "zoom",
        "stage",
        "position-index",
        "fullscreen-count",
        "practice-angle",
        "ot",
        "distance",
        "power",
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

const checks = { initial: await state() };
await drag(lesson.getByTestId("tangent-center-o"), 28, 18);
checks.centerDrag = await state();
await drag(lesson.getByTestId("tangent-point-t"), 65, 45);
checks.snappedDrag = await state();
await lesson.getByRole("switch", { name: "Snap to circle" }).click();
await drag(lesson.getByTestId("tangent-point-t"), -35, 70);
checks.freeDrag = await state();
await lesson.getByRole("switch", { name: "Show secant line" }).click();
await lesson.getByRole("switch", { name: "Show grid" }).click();
checks.overlays = await state();
await lesson.getByRole("button", { name: "Zoom in" }).click();
checks.zoomed = await state();
await lesson.getByRole("button", { name: "Reset view" }).click();
checks.viewReset = await state();

checks.stages = [];
for (const stage of ["Manipulate", "Notice", "Understand", "Try", "Observe"]) {
  await lesson.getByRole("button", { name: stage, exact: true }).click();
  checks.stages.push((await state()).stage);
}

await lesson.getByLabel("Lesson language").selectOption("Hindi (हिन्दी)");
checks.language = await lesson.getByLabel("Lesson language").inputValue();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.share = await lesson.locator("header [role=status]").textContent();

await lesson.getByRole("button", { name: "Workspace", exact: true }).click();
checks.fullscreen = await page.evaluate(
  () =>
    globalThis.document.fullscreenElement?.getAttribute("data-testid") ?? null,
);
checks.fullscreenState = await state();
await page.keyboard.press("Escape");

await lesson.getByRole("button", { name: "New Position", exact: true }).click();
checks.newPosition = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const previousHref = await lesson
  .locator('a[href="/lessons/geometry/211-angle-bisector"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('a[href="/lessons/geometry/213-best-fit-line"]')
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
    header: rect('[data-testid="dynamic-geometry-mockup-0269"] > header'),
    stages: rect(
      '[data-testid="dynamic-geometry-mockup-0269"] > nav:first-of-type',
    ),
    observe: rect("#tangent-observe"),
    understand: rect("#tangent-understand"),
    practice: rect("#tangent-try"),
    adjacent: rect("#tangent-try + nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const close = (value, expected, tolerance = 0.001) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.center === "300:315" &&
  checks.initial.contact === "300:155" &&
  close(checks.initial.ot, 5) &&
  close(checks.initial.power, 0) &&
  checks.centerDrag.center !== checks.initial.center &&
  checks.centerDrag.contact !== checks.initial.contact &&
  close(checks.centerDrag.ot, 5) &&
  checks.snappedDrag.contact !== checks.centerDrag.contact &&
  close(checks.snappedDrag.ot, 5) &&
  close(checks.snappedDrag.power, 0) &&
  checks.freeDrag.snap === "false" &&
  !close(checks.freeDrag.ot, 5, 0.01) &&
  !close(checks.freeDrag.power, 0, 0.01) &&
  checks.overlays.secant === "true" &&
  checks.overlays.grid === "false" &&
  Number(checks.zoomed.zoom) > 1 &&
  checks.viewReset.zoom === "1" &&
  checks.stages.join(",") === "manipulate,notice,understand,try,observe" &&
  checks.language === "Hindi (हिन्दी)" &&
  Boolean(checks.share) &&
  checks.fullscreenState["fullscreen-count"] === "1" &&
  checks.newPosition["position-index"] === "1" &&
  checks.newPosition["practice-angle"] === "-30" &&
  checks.newPosition.snap === "true" &&
  checks.reset.center === "300:315" &&
  checks.reset.contact === "300:155" &&
  previousHref === "/lessons/geometry/211-angle-bisector" &&
  nextHref === "/lessons/geometry/213-best-fit-line" &&
  metrics.sidebar?.width === 212 &&
  metrics.header?.top === 110 &&
  metrics.header?.left === 228 &&
  metrics.header?.height === 169 &&
  metrics.stages?.top === 291 &&
  metrics.observe?.top === 347 &&
  metrics.observe?.height === 570 &&
  metrics.understand?.top === 929 &&
  metrics.practice?.top === 1152 &&
  metrics.adjacent?.top === 1359 &&
  metrics.footer?.top === 1425 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(output, "0269-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(output, "0269-reference.png"));
const report = {
  mockup: "0269",
  lessonId: 212,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(output, "0269-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
