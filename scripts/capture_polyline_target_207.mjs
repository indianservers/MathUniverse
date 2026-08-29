import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0264-interactive-foundational-advanced-dynamic-geometry-constructions-polyline-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/207-polyline";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0264");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "points",
        "closed",
        "tool",
        "zoom",
        "stage",
        "history",
        "total",
        "practice",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };

const firstPoint = lesson.getByTestId("polyline-point-0");
const pointBox = await firstPoint.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2 + 28,
  pointBox.y + pointBox.height / 2 - 18,
  { steps: 6 },
);
await page.mouse.up();
checks.drag = await state();

await lesson.getByRole("button", { name: "Closed", exact: true }).click();
checks.closed = await state();
await lesson
  .getByRole("button", { name: "Undo last point", exact: true })
  .click();
checks.topologyUndo = await state();
await lesson.getByRole("button", { name: "Clear", exact: true }).click();
checks.clear = await state();
await lesson
  .getByRole("button", { name: "Undo last point", exact: true })
  .click();
checks.clearUndo = await state();
await lesson.getByRole("button", { name: "Zoom in", exact: true }).click();
checks.zoom = await state();

for (const name of ["Pattern", "Rule", "Practice", "Observe", "Manipulate"]) {
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
}
checks.stages = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.share = await lesson.getByRole("status").first().textContent();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();

await lesson
  .getByRole("button", { name: "Start constructing", exact: true })
  .click();
checks.practiceStart = await state();
const svg = lesson.locator('#polyline-plane svg[role="img"]');
const svgBox = await svg.boundingBox();
const practicePoints = [
  [-6, -2],
  [-2, 3],
  [3, 2],
  [6, -3],
  [-1, -4],
];
for (const [x, y] of practicePoints) {
  const viewX = 235 + x * 29;
  const viewY = 220 - y * 29;
  await page.mouse.click(
    svgBox.x + (viewX / 470) * svgBox.width,
    svgBox.y + (viewY / 440) * svgBox.height,
  );
}
checks.practiceBuilt = await state();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.practiceChecked = await state();
checks.practiceMessage = await lesson.getByRole("status").last().textContent();

const previousHref = await lesson
  .locator('nav a[href="/lessons/geometry/206-ray"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('nav a[href="/lessons/geometry/208-perpendicular-line"]')
  .getAttribute("href");

await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const box = globalThis.document
      .querySelector(selector)
      ?.getBoundingClientRect();
    return box
      ? {
          top: box.top,
          left: box.left,
          width: box.width,
          height: box.height,
          bottom: box.bottom,
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
    header: rect('[data-testid="dynamic-geometry-mockup-0264"] > header'),
    stages: rect('[aria-label="Polyline lesson stages"]'),
    workspace: rect(
      '[aria-label="Polyline lesson stages"] + section',
    ),
    plane: rect("#polyline-plane"),
    insight: rect("#polyline-insight"),
    practice: rect("#polyline-practice"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const passed =
  checks.initial.points === "-4:1|-1:4|2:2|5:-1|1:-3" &&
  checks.initial.closed === "false" &&
  checks.initial.tool === "select" &&
  checks.drag.points !== checks.initial.points &&
  checks.drag.total !== checks.initial.total &&
  checks.closed.closed === "true" &&
  checks.topologyUndo.closed === "false" &&
  checks.clear.points === "" &&
  checks.clearUndo.points === checks.drag.points &&
  checks.zoom.zoom === "1.1" &&
  checks.stages.stage === "1" &&
  checks.share?.length > 0 &&
  checks.practiceStart.points === "" &&
  checks.practiceStart.tool === "point" &&
  checks.practiceBuilt.points === "-6:-2|-2:3|3:2|6:-3|-1:-4" &&
  checks.practiceChecked.practice === "correct" &&
  checks.practiceMessage?.startsWith("Correct") &&
  previousHref === "/lessons/geometry/206-ray" &&
  nextHref === "/lessons/geometry/208-perpendicular-line" &&
  metrics.sidebar?.width === 222 &&
  metrics.header?.left === 240 &&
  metrics.header?.top === 104 &&
  metrics.workspace?.height === 541 &&
  metrics.practice?.height === 211 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({ path: path.join(out, "0264-desktop.png"), fullPage: true });
await copyFile(reference, path.join(out, "0264-reference.png"));
const report = {
  mockup: "0264",
  lessonId: 207,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  note:
    "The mockup total-length labels are arithmetically inconsistent with its displayed coordinates; the lesson reports Euclidean totals from the actual vertex model.",
  passed,
};
await writeFile(
  path.join(out, "0264-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
