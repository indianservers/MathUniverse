import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0273-interactive-foundational-advanced-dynamic-geometry-constructions-rigid-polygon-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/geometry/216-rigid-polygon";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1027, height: 1531 } });
const messages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0273");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "position",
        "rotation",
        "mode",
        "points",
        "overlay",
        "lengths",
        "angles",
        "visibility",
        "stage",
        "language",
        "notation",
        "share-count",
        "feedback",
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

const overlayOffsetIsExact = (current) => {
  const points = current.points
    .split("|")
    .map((entry) => entry.split(":").map(Number));
  const overlay = current.overlay
    .split("|")
    .map((entry) => entry.split(":").map(Number));
  return points.every(
    ([x, y], index) =>
      Math.abs(overlay[index][0] - x - 6) < 1e-8 &&
      Math.abs(overlay[index][1] - y + 2) < 1e-8,
  );
};

const checks = { initial: await state() };
await drag(lesson.getByTestId("rigid-original-polygon"), 34, 22);
checks.moved = await state();
await lesson.getByRole("button", { name: "Rotate", exact: true }).click();
await drag(lesson.getByTestId("rigid-vertex-b"), 38, -24);
checks.rotated = await state();

for (const name of [
  "Show labels",
  "Show lengths",
  "Show angles",
  "Show overlay",
]) {
  await lesson.getByRole("checkbox", { name, exact: true }).click();
}
checks.hidden = await state();
await lesson.getByRole("button", { name: "Overlay", exact: true }).click();
checks.overlayRestored = await state();

checks.stages = [];
for (const [name, expected] of [
  [/Understand/, "1"],
  [/Examples/, "2"],
  [/Practice/, "3"],
  [/Explore/, "0"],
]) {
  await lesson.getByRole("button", { name }).click();
  checks.stages.push({ expected, actual: (await state()).stage });
}

await lesson.getByLabel("Notation language").selectOption("Symbolic");
await lesson.getByLabel("Lesson language").selectOption("Hindi (हिन्दी)");
checks.languages = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
await page.waitForFunction(
  () =>
    globalThis.document
      .querySelector('[data-testid="dynamic-geometry-mockup-0273"]')
      ?.getAttribute("data-share-count") === "1",
);
checks.shared = await state();

const practice = lesson.locator("#rigid-3");
await practice.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
for (const [name, value] of [
  ["A rotated x", "-1"],
  ["A rotated y", "-3"],
  ["B rotated x", "-5"],
  ["B rotated y", "1"],
  ["C rotated x", "-1"],
  ["C rotated y", "4"],
]) {
  await lesson.getByLabel(name).fill(value);
}
await practice.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await practice.getByRole("button", { name: "Reset", exact: true }).click();
checks.practiceReset = await state();

await lesson.getByRole("button", { name: "Reset view" }).click();
checks.reset = await state();

const workspaceHref = await lesson
  .getByRole("link", { name: "Workspace", exact: true })
  .getAttribute("href");
const previousHref = await lesson
  .locator('a[href="/lessons/geometry/215-regular-polygon"]')
  .getAttribute("href");
const nextHref = await lesson
  .locator('a[href="/lessons/geometry/217-general-polygon"]')
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
  const practice = globalThis.document.getElementById("rigid-3");
  return {
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    overflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect('[data-testid="dynamic-geometry-mockup-0273"] > header'),
    tabs: rect(
      '[data-testid="dynamic-geometry-mockup-0273"] > nav:first-of-type',
    ),
    workspace: rect("#rigid-0"),
    cards: practice?.parentElement?.getBoundingClientRect().toJSON() ?? null,
    practice: rect("#rigid-3"),
    motions:
      practice?.parentElement?.nextElementSibling
        ?.getBoundingClientRect()
        .toJSON() ?? null,
    adjacent: rect('nav[aria-label="Adjacent lessons"]'),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});

const passed =
  checks.initial.position === "0:0" &&
  checks.initial.rotation === "0" &&
  checks.initial.lengths === "5.6569:5.0000:7.0000" &&
  checks.moved.position !== checks.initial.position &&
  checks.moved.rotation === checks.initial.rotation &&
  checks.moved.lengths === checks.initial.lengths &&
  checks.moved.angles === checks.initial.angles &&
  checks.rotated.rotation !== checks.moved.rotation &&
  checks.rotated.lengths === checks.initial.lengths &&
  checks.rotated.angles === checks.initial.angles &&
  overlayOffsetIsExact(checks.initial) &&
  overlayOffsetIsExact(checks.moved) &&
  overlayOffsetIsExact(checks.rotated) &&
  checks.hidden.visibility ===
    "labels:false|lengths:false|angles:false|overlay:false" &&
  checks.overlayRestored.visibility.endsWith("overlay:true") &&
  checks.stages.every(({ expected, actual }) => expected === actual) &&
  checks.languages.language === "Hindi (हिन्दी)" &&
  checks.languages.notation === "Symbolic" &&
  checks.shared["share-count"] === "1" &&
  checks.rejected.feedback === "incorrect" &&
  checks.accepted.feedback === "correct" &&
  checks.practiceReset.feedback === "idle" &&
  checks.reset.position === "0:0" &&
  checks.reset.rotation === "0" &&
  workspaceHref === "/workspace/geometry" &&
  previousHref === "/lessons/geometry/215-regular-polygon" &&
  nextHref === "/lessons/geometry/217-general-polygon" &&
  metrics.sidebar?.width === 211 &&
  metrics.header?.left === 225 &&
  metrics.header?.width === 784 &&
  metrics.header?.top === 96 &&
  metrics.tabs?.top === 261 &&
  metrics.workspace?.top === 328 &&
  metrics.workspace?.bottom === 908 &&
  metrics.cards?.top === 918 &&
  metrics.motions?.top === 1269.1875 &&
  metrics.adjacent?.top === 1356.6875 &&
  metrics.footer?.top === 1411 &&
  metrics.footer?.bottom === 1531 &&
  !metrics.overflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(output, "0273-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(output, "0273-reference.png"));
const report = {
  mockup: "0273",
  lessonId: 216,
  checks,
  navigation: { workspaceHref, previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  note: "The mockup's 4.47 side labels contradict A(-3,1), B(1,5), C(4,1). The lesson reports the correct coordinate-derived lengths sqrt(32), 5, and 7.",
  passed,
};
await writeFile(
  path.join(output, "0273-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
