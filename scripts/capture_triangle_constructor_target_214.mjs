import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0271-interactive-foundational-advanced-dynamic-geometry-constructions-triangle-constructor-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/214-triangle-constructor";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1029, height: 1528 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0271");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "vertices",
        "inputs",
        "mode",
        "feasible",
        "ab",
        "ac",
        "bc",
        "angle-a",
        "perimeter",
        "area",
        "side-class",
        "angle-class",
        "tool",
        "pan",
        "stage",
        "fullscreen-count",
        "practice-index",
        "practice-feedback",
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
await drag(lesson.getByTestId("triangle-point-c"), 34, -28);
checks.vertexDrag = await state();

await lesson.getByRole("button", { name: "Pan triangle plane" }).click();
await drag(lesson.getByTestId("triangle-pan-layer"), 38, 24);
checks.panned = await state();
await lesson.getByRole("button", { name: "Fit triangle to view" }).click();
checks.fittedView = await state();
await lesson.getByRole("button", { name: "Enter triangle fullscreen" }).click();
checks.fullscreen = await state();
await page.keyboard.press("Escape");

await lesson.getByRole("button", { name: "SSS", exact: true }).click();
await setRange("BC", 12);
checks.invalidSss = await state();
await setRange("BC", 8);
checks.validSss = await state();
await lesson.getByRole("button", { name: "ASA", exact: true }).click();
checks.asa = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await setRange("AB (base)", 8);
await setRange("∠A", 45);
await setRange("AC", 7);
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "New values", exact: true }).click();
checks.newValues = await state();

checks.stages = [];
for (const [name, expected] of [
  ["Manipulate", "1"],
  ["Pattern", "2"],
  ["Rule", "3"],
  ["Try it", "4"],
  ["Observe", "0"],
]) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks.stages.push({ expected, actual: (await state()).stage });
}

await lesson.getByLabel("Lesson language").selectOption("Hindi (हिन्दी)");
checks.language = await lesson.getByLabel("Lesson language").inputValue();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.share = await lesson.locator("header [role=status]").textContent();

const previousHref = await lesson
  .locator('a[href="/lessons/geometry/213-best-fit-line"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('a[href="/lessons/geometry/215-regular-polygon"]')
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
    header: rect('[data-testid="dynamic-geometry-mockup-0271"] > header'),
    stages: rect(
      '[data-testid="dynamic-geometry-mockup-0271"] > nav:first-of-type',
    ),
    interactive: rect("#triangle-0"),
    worked: rect("#triangle-1"),
    practice: rect("#triangle-4"),
    adjacent: rect("#triangle-4 + nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const close = (value, expected, tolerance = 0.01) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.mode === "SAS" &&
  close(checks.initial.ab, 6) &&
  close(checks.initial.ac, 5) &&
  close(checks.initial.bc, Math.sqrt(31)) &&
  close(checks.initial["angle-a"], 60) &&
  close(checks.initial.area, 12.9904) &&
  close(checks.initial.perimeter, 16.5678) &&
  checks.vertexDrag.vertices !== checks.initial.vertices &&
  checks.vertexDrag.bc !== checks.initial.bc &&
  checks.panned.tool === "pan" &&
  checks.panned.pan !== "0:0" &&
  checks.fittedView.pan === "0:0" &&
  checks.fullscreen["fullscreen-count"] === "1" &&
  checks.invalidSss.mode === "SSS" &&
  checks.invalidSss.feasible === "false" &&
  checks.validSss.feasible === "true" &&
  checks.validSss.vertices !== checks.invalidSss.vertices &&
  checks.asa.mode === "ASA" &&
  checks.rejected["practice-feedback"] === "incorrect" &&
  checks.accepted["practice-feedback"] === "correct" &&
  close(checks.accepted.ab, 8) &&
  close(checks.accepted.ac, 7) &&
  close(checks.accepted["angle-a"], 45) &&
  checks.newValues["practice-index"] === "1" &&
  checks.stages.every(({ expected, actual }) => expected === actual) &&
  checks.language === "Hindi (हिन्दी)" &&
  Boolean(checks.share) &&
  previousHref === "/lessons/geometry/213-best-fit-line" &&
  nextHref === "/lessons/geometry/215-regular-polygon" &&
  metrics.sidebar?.width === 219 &&
  metrics.header?.left === 239 &&
  metrics.header?.width === 774 &&
  metrics.header?.top === 106 &&
  metrics.interactive?.top === 338.5 &&
  metrics.interactive?.bottom === 1053 &&
  metrics.worked?.top === 1054 &&
  metrics.practice?.top === 1233 &&
  metrics.adjacent?.bottom === 1391 &&
  metrics.footer?.top === 1402 &&
  metrics.footer?.bottom === 1528 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(output, "0271-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(output, "0271-reference.png"));
const report = {
  mockup: "0271",
  lessonId: 214,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  note: "The mockup mixes an SAS 6-5-60 model and area 12.99 with incompatible BC=5, perimeter=16, and C=(0,4) labels. The lesson reports the mathematically consistent derived values.",
  passed,
};
await writeFile(
  path.join(output, "0271-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
