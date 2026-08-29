import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0266-interactive-foundational-advanced-dynamic-geometry-constructions-parallel-line-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/209-parallel-line";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0266");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "slope",
        "intercept",
        "parallel-intercept",
        "point",
        "angle",
        "angle-visible",
        "slope-visible",
        "snap",
        "zoom",
        "stage",
        "practice",
        "practice-active",
        "checks",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };

const point = lesson.getByTestId("parallel-point-p");
const pointBox = await point.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  pointBox.x + pointBox.width / 2 + 45,
  pointBox.y + pointBox.height / 2 - 30,
  { steps: 6 },
);
await page.mouse.up();
checks.drag = await state();

await lesson.getByLabel("Slope m exact value").fill("2");
await lesson.getByLabel("y-intercept c exact value").fill("-3");
checks.lineEdit = await state();
await lesson.getByText("Show angle", { exact: true }).click();
await lesson.getByText("Show slope", { exact: true }).click();
checks.visibility = await state();
await lesson.getByText("Snap to grid", { exact: true }).click();
checks.snap = await state();
await lesson.getByRole("button", { name: "Zoom in", exact: true }).click();
checks.zoom = await state();
for (const name of ["Manipulate", "Pattern", "Rule", "Try", "Observe"]) {
  await lesson.getByRole("button", { name: new RegExp(name) }).first().click();
}
checks.stages = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

await lesson.getByRole("button", { name: "Start practice", exact: true }).click();
checks.practiceStart = await state();
await lesson.getByRole("button", { name: "Check my answer", exact: true }).click();
checks.rejected = await state();
for (const label of [
  "Slopes are equal",
  "Angles are equal",
  "Lines are parallel",
]) {
  await lesson.getByText(label, { exact: true }).click();
}
checks.checked = await state();
await lesson.getByRole("button", { name: "Check my answer", exact: true }).click();
checks.accepted = await state();
checks.practiceMessage = await lesson.getByRole("status").last().textContent();

const previousHref = await lesson
  .locator('nav a[href="/lessons/geometry/208-perpendicular-line"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('nav a[href="/lessons/geometry/210-perpendicular-bisector"]')
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
    header: rect('[data-testid="dynamic-geometry-mockup-0266"] > header'),
    stages: rect(
      '[data-testid="dynamic-geometry-mockup-0266"] > nav:first-of-type',
    ),
    workspace: rect(
      '[data-testid="dynamic-geometry-mockup-0266"] > nav:first-of-type + section',
    ),
    plane: rect("#parallel-plane"),
    result: rect(
      '[data-testid="dynamic-geometry-mockup-0266"] > nav:first-of-type + section > section',
    ),
    rule: rect("#parallel-rule"),
    practice: rect("#parallel-practice"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const passed =
  checks.initial.slope === "0.5000" &&
  checks.initial.intercept === "1.0000" &&
  checks.initial["parallel-intercept"] === "-2.5000" &&
  checks.initial.point === "0:-2.5" &&
  checks.drag.point !== checks.initial.point &&
  checks.drag["parallel-intercept"] !== checks.initial["parallel-intercept"] &&
  checks.lineEdit.slope === "2.0000" &&
  checks.lineEdit.intercept === "-3.0000" &&
  checks.visibility["angle-visible"] === "false" &&
  checks.visibility["slope-visible"] === "false" &&
  checks.snap.snap === "true" &&
  checks.zoom.zoom === "1.1" &&
  checks.stages.stage === "0" &&
  checks.reset.slope === "0.5000" &&
  checks.reset.point === "0:-2.5" &&
  checks.practiceStart.slope === "-3.0000" &&
  checks.practiceStart.point === "-1:3" &&
  checks.practiceStart["practice-active"] === "true" &&
  checks.rejected.practice === "incorrect" &&
  checks.checked.checks === "1:1:1" &&
  checks.accepted.practice === "correct" &&
  checks.practiceMessage?.startsWith("Correct") &&
  previousHref === "/lessons/geometry/208-perpendicular-line" &&
  nextHref === "/lessons/geometry/210-perpendicular-bisector" &&
  metrics.sidebar?.width === 208 &&
  metrics.header?.top === 97 &&
  metrics.header?.left === 223 &&
  metrics.workspace?.top === 257 &&
  metrics.workspace?.height === 693 &&
  metrics.practice?.top === 1218 &&
  metrics.footer?.top === 1466 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({ path: path.join(out, "0266-desktop.png"), fullPage: true });
await copyFile(reference, path.join(out, "0266-reference.png"));
const report = {
  mockup: "0266",
  lessonId: 209,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0266-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
