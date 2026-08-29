import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0268-interactive-foundational-advanced-dynamic-geometry-constructions-angle-bisector-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/211-angle-bisector",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1059, height: 1485 } }),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0268");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) =>
      Object.fromEntries(
        [
          "a",
          "b",
          "c",
          "full-angle",
          "half-angle",
          "tool",
          "arcs",
          "steps",
          "pan",
          "practice-angle",
          "practice-count",
        ].map((k) => [k, n.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
const drag = async (locator, dx, dy) => {
  const b = await locator.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + dx, b.y + b.height / 2 + dy, {
    steps: 6,
  });
  await page.mouse.up();
};
await drag(lesson.getByTestId("angle-point-b"), -40, 35);
checks.bDrag = await state();
await drag(lesson.getByTestId("angle-point-c"), 25, -30);
checks.cDrag = await state();
await lesson.getByRole("switch", { name: "Show arcs" }).click();
checks.arcs = await state();
await lesson.getByRole("button", { name: "Pan construction", exact: true }).click();
const svg = lesson.getByRole("img", {
  name: /Interactive angle bisector construction/,
});
await drag(svg, 30, 20);
checks.pan = await state();
await lesson
  .getByRole("button", { name: "Show compass construction", exact: true })
  .click();
await lesson.getByRole("button", { name: /Show steps on canvas/ }).click();
checks.compass = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
  checks.share = await lesson
    .getByRole("status")
    .filter({ hasText: "The two angles are equal." })
    .textContent();
const practice = lesson.getByRole("img", { name: /Practice angle/ });
checks.practiceBefore = await practice.getAttribute("aria-label");
await drag(lesson.getByTestId("practice-angle-point-b"), -25, 30);
checks.practiceAfter = await practice.getAttribute("aria-label");
await lesson.getByRole("button", { name: "New Angle", exact: true }).click();
checks.newAngle = await state();
const previousHref = await lesson
    .locator('a[href="/lessons/geometry/210-perpendicular-bisector"]')
    .getAttribute("href"),
  nextHref = await lesson
    .locator('a[href="/lessons/geometry/212-tangent"]')
    .getAttribute("href");
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const r = (s) => {
    const b = globalThis.document.querySelector(s)?.getBoundingClientRect();
    return b
      ? {
          top: b.top,
          left: b.left,
          width: b.width,
          height: b.height,
          bottom: b.bottom,
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
    sidebar: r('[data-testid="desktop-sidebar"]'),
    header: r('[data-testid="dynamic-geometry-mockup-0268"] > header'),
    tabs: r('[data-testid="dynamic-geometry-mockup-0268"] > nav:first-of-type'),
    explore: r("#angle-explore"),
    construct: r("#angle-construct"),
    practice: r("#angle-practice"),
    footer: r('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.a === "105:205" &&
  Number(checks.initial["half-angle"]) > 0 &&
  checks.bDrag.b !== checks.initial.b &&
  checks.bDrag["full-angle"] !== checks.initial["full-angle"] &&
  checks.cDrag.c !== checks.initial.c &&
  checks.arcs.arcs === "false" &&
  checks.pan.pan !== "0:0" &&
  checks.compass.tool === "compass" &&
  checks.compass.steps === "true" &&
  checks.share?.length > 0 &&
  checks.practiceAfter !== checks.practiceBefore &&
  checks.newAngle["practice-count"] === "1" &&
  checks.newAngle["practice-angle"] === "64" &&
  previousHref === "/lessons/geometry/210-perpendicular-bisector" &&
  nextHref === "/lessons/geometry/212-tangent" &&
  metrics.sidebar?.width === 208 &&
  metrics.header?.top === 102 &&
  metrics.header?.left === 232 &&
  metrics.explore?.top === 320 &&
  metrics.construct?.top === 797 &&
  metrics.practice?.top === 1083 &&
  metrics.footer?.top === 1394 &&
  !metrics.overflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0268-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0268-reference.png"));
const report = {
  mockup: "0268",
  lessonId: 211,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  note: "The rendered half-angle is derived from draggable arm coordinates; the mockup's 55-degree labels do not match its drawn arm directions.",
  passed,
};
await writeFile(
  path.join(out, "0268-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
