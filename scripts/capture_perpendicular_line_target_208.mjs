import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0265-interactive-foundational-advanced-dynamic-geometry-constructions-perpendicular-line-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/208-perpendicular-line";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 998, height: 1576 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0265");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "slope",
        "perpendicular-slope",
        "point",
        "tool",
        "visible",
        "zoom",
        "stage",
        "practice",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };

const point = lesson.getByTestId("perpendicular-point-p");
const pointBox = await point.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2 + 30,
  pointBox.y + pointBox.height / 2 - 30,
  { steps: 6 },
);
await page.mouse.up();
checks.drag = await state();

await lesson.getByLabel("Given line slope").fill("1");
checks.slope = await state();
await lesson.getByRole("button", { name: "Clear", exact: true }).click();
checks.clear = await state();
await lesson
  .getByRole("button", { name: "Perpendicular", exact: true })
  .click();
checks.selectOnly = await state();

const svg = lesson.locator('#perpendicular-plane svg[role="img"]');
const clickModelPoint = async (x, y) => {
  const box = await svg.boundingBox();
  const zoom = Number((await state()).zoom);
  const viewX = 235 + x * 30 * zoom;
  const viewY = 225 - y * 30 * zoom;
  await page.mouse.click(
    box.x + (viewX / 470) * box.width,
    box.y + (viewY / 450) * box.height,
  );
};
await point.click();
checks.construct = await state();
await lesson.getByRole("button", { name: "Zoom in", exact: true }).click();
checks.zoom = await state();

for (const name of ["Construct", "Pattern", "Rule", "Practice", "Explore"]) {
  await lesson.getByRole("button", { name: new RegExp(name) }).first().click();
}
checks.stages = await state();

await lesson
  .getByRole("button", { name: "Start construction", exact: true })
  .click();
checks.practiceStart = await state();
await clickModelPoint(0, 0);
checks.farClick = await state();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.rejected = await state();
await lesson.getByTestId("perpendicular-point-p").click();
checks.practiceConstruct = await state();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.accepted = await state();
checks.practiceMessage = await lesson.getByRole("status").last().textContent();

const previousHref = await lesson
  .locator('nav a[href="/lessons/geometry/209-parallel-line"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('nav a[href="/lessons/geometry/176-angle-between-lines"]')
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
    header: rect('[data-testid="dynamic-geometry-mockup-0265"] > header'),
    stages: rect(
      '[data-testid="dynamic-geometry-mockup-0265"] > nav:first-of-type',
    ),
    workspace: rect(
      '[data-testid="dynamic-geometry-mockup-0265"] > nav:first-of-type + section',
    ),
    plane: rect("#perpendicular-plane"),
    steps: rect(
      '[data-testid="dynamic-geometry-mockup-0265"] > nav:first-of-type + section + section',
    ),
    rule: rect("#perpendicular-rule"),
    practice: rect("#perpendicular-practice"),
  };
});

const passed =
  checks.initial.slope === "0.5000" &&
  checks.initial["perpendicular-slope"] === "-2.0000" &&
  checks.initial.point === "2:1" &&
  checks.drag.point !== checks.initial.point &&
  checks.slope.slope === "1.0000" &&
  checks.slope["perpendicular-slope"] === "-1.0000" &&
  checks.clear.visible === "false" &&
  checks.selectOnly.visible === "false" &&
  checks.construct.visible === "true" &&
  checks.zoom.zoom === "1.1" &&
  checks.stages.stage === "0" &&
  checks.practiceStart.slope === "-0.6667" &&
  checks.practiceStart.point === "3:-2" &&
  checks.practiceStart.visible === "false" &&
  checks.farClick.visible === "false" &&
  checks.rejected.practice === "incorrect" &&
  checks.practiceConstruct.visible === "true" &&
  checks.accepted.practice === "correct" &&
  checks.practiceMessage?.startsWith("Correct") &&
  previousHref === "/lessons/geometry/209-parallel-line" &&
  nextHref === "/lessons/geometry/176-angle-between-lines" &&
  metrics.sidebar?.width === 209 &&
  metrics.header?.left === 221 &&
  metrics.header?.top === 96 &&
  metrics.workspace?.top === 330 &&
  metrics.workspace?.height === 520 &&
  metrics.practice?.top === 1231 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({ path: path.join(out, "0265-desktop.png"), fullPage: true });
await copyFile(reference, path.join(out, "0265-reference.png"));
const report = {
  mockup: "0265",
  lessonId: 208,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  note:
    "The graph follows m_perpendicular = -1/m exactly; the mockup's vertical dashed line for m = 1/2 conflicts with its own displayed expected slope -2.",
  passed,
};
await writeFile(
  path.join(out, "0265-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
