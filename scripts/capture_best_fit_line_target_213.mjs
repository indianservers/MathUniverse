import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0270-interactive-foundational-advanced-dynamic-geometry-constructions-best-fit-line-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/213-best-fit-line";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1534, height: 1025 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0270");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "points",
        "m",
        "b",
        "sse",
        "r2",
        "best-m",
        "best-b",
        "best-sse",
        "line",
        "residuals",
        "equation",
        "challenge",
        "feedback",
        "bookmarked",
        "stage",
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
      const input = element;
      const setter = Object.getOwnPropertyDescriptor(
        globalThis.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, String(next));
      input.dispatchEvent(new globalThis.Event("input", { bubbles: true }));
    }, value);
};

const checks = { initial: await state() };
await drag(lesson.getByTestId("best-fit-point-0"), 32, -24);
checks.pointDrag = await state();
await drag(lesson.getByTestId("best-fit-draggable-line"), 0, 28);
checks.lineDrag = await state();
await setRange("m (slope)", 1.17);
await setRange("b (y-intercept)", -0.45);
checks.sliders = await state();

for (const name of ["Best-fit line", "Residuals", "Equation"]) {
  await lesson.getByRole("checkbox", { name, exact: true }).click();
}
checks.hidden = await state();
for (const name of ["Best-fit line", "Residuals", "Equation"]) {
  await lesson.getByRole("checkbox", { name, exact: true }).click();
}

await lesson.getByRole("button", { name: "Check my line" }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "Fit least squares line" }).click();
checks.fitted = await state();
await lesson.getByRole("button", { name: "Check my line" }).click();
checks.accepted = await state();

await lesson.getByRole("button", { name: "Randomize" }).click();
checks.randomized = await state();
await lesson.getByRole("button", { name: "New challenge" }).click();
checks.newChallenge = await state();

await lesson.getByRole("button", { name: "Bookmark lesson" }).click();
checks.bookmark = await state();
checks.stages = [];
for (const [name, expected] of [
  [/2 Manipulate/, "manipulate"],
  [/3 Notice/, "notice"],
  [/4 Understand/, "understand"],
  [/5 Try/, "try"],
  [/1 Observe/, "observe"],
]) {
  await lesson.getByRole("button", { name }).click();
  checks.stages.push({ expected, actual: (await state()).stage });
}
await lesson.getByRole("button", { name: "Jump to section" }).click();

await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.share = await lesson.locator("header [role=status]").textContent();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const previousHref = await lesson
  .locator('a[href="/lessons/geometry/212-tangent"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('a[href="/lessons/geometry/214-triangle-constructor"]')
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
    breadcrumb: globalThis.document
      .querySelector('nav[aria-label="Breadcrumb"]')
      ?.textContent?.replace(/\s+/g, " ")
      .trim(),
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect('[data-testid="dynamic-geometry-mockup-0270"] > header'),
    stages: rect(
      '[data-testid="dynamic-geometry-mockup-0270"] > nav:first-of-type',
    ),
    observe: rect("#bestfit-observe"),
    explorer: rect("#bestfit-observe > article"),
    results: rect("#bestfit-notice"),
    understand: rect("#bestfit-understand"),
    adjacent: rect("#bestfit-understand + nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const close = (value, expected, tolerance = 0.01) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  close(checks.initial.m, 0.82) &&
  close(checks.initial.b, 0.32) &&
  close(checks.initial.sse, 5.86) &&
  close(checks.initial.r2, 0.953, 0.001) &&
  close(checks.initial["best-sse"], 1.72) &&
  checks.pointDrag.points !== checks.initial.points &&
  checks.pointDrag["best-sse"] !== checks.initial["best-sse"] &&
  checks.lineDrag.b !== checks.pointDrag.b &&
  checks.sliders.m === "1.17" &&
  checks.sliders.b === "-0.45" &&
  checks.hidden.line === "false" &&
  checks.hidden.residuals === "false" &&
  checks.hidden.equation === "false" &&
  checks.rejected.feedback === "improve" &&
  close(checks.fitted.sse, checks.fitted["best-sse"], 0.02) &&
  checks.accepted.feedback === "correct" &&
  checks.randomized.challenge === "1" &&
  checks.randomized.points !== checks.accepted.points &&
  checks.newChallenge.challenge === "2" &&
  checks.bookmark.bookmarked === "true" &&
  checks.stages.every(({ expected, actual }) => expected === actual) &&
  Boolean(checks.share) &&
  checks.reset.m === "0.82" &&
  checks.reset.b === "0.32" &&
  previousHref === "/lessons/geometry/212-tangent" &&
  nextHref === "/lessons/geometry/214-triangle-constructor" &&
  metrics.breadcrumb === "Home>Lessons>Coordinate Geometry>Best Fit Line" &&
  metrics.sidebar?.width === 270 &&
  metrics.header?.left === 296 &&
  metrics.header?.top === 107 &&
  metrics.stages?.top === 177 &&
  metrics.observe?.top === 259 &&
  metrics.observe?.left === 296 &&
  metrics.observe?.width === 1214 &&
  metrics.understand?.top === 741 &&
  metrics.adjacent?.top === 946 &&
  metrics.adjacent?.bottom === 1007 &&
  metrics.footer?.width === 0 &&
  metrics.footer?.height === 0 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(output, "0270-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(output, "0270-reference.png"));
const report = {
  mockup: "0270",
  lessonId: 213,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(output, "0270-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
