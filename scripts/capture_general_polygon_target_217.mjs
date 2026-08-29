import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0274-interactive-foundational-advanced-dynamic-geometry-constructions-general-polygon-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2255/lessons/geometry/217-general-polygon";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1022, height: 1538 } });
const consoleMessages = [];

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0274");
await lesson.waitFor({ timeout: 600000 });

const state = () => lesson.evaluate((node) => Object.fromEntries([
  "points", "area", "perimeter", "angle-sum", "tool", "snap", "grid",
  "selected-side", "stage", "copy-count", "feedback",
].map((key) => [key, node.getAttribute(`data-${key}`)])));

const drag = async (locator, dx, dy) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Could not resolve polygon drag target");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
};

const checks = { initial: await state() };

await drag(lesson.getByTestId("general-polygon-vertex-0"), 32, 20);
checks.vertexDragged = await state();

await lesson.getByRole("button", { name: "Polygon", exact: true }).click();
const canvas = lesson.getByRole("img", { name: /Editable general polygon/ });
const canvasBox = await canvas.boundingBox();
if (!canvasBox) throw new Error("Could not resolve polygon canvas");
await page.mouse.click(canvasBox.x + canvasBox.width * 0.82, canvasBox.y + canvasBox.height * 0.72);
checks.vertexAdded = await state();
await lesson.getByTestId("general-polygon-vertex-5").dblclick();
checks.vertexRemoved = await state();

await lesson.getByRole("button", { name: "Move", exact: true }).click();
const beforeMove = await state();
await drag(lesson.getByTestId("general-polygon-body"), 30, -22);
checks.polygonMoved = await state();

await lesson.getByRole("button", { name: "Measure", exact: true }).click();
await lesson.getByTestId("general-polygon-side-0").click();
checks.measured = await state();

await lesson.getByLabel("Snap").uncheck();
await lesson.getByLabel("Grid").uncheck();
checks.displayOff = await state();
await lesson.getByLabel("Snap").check();
await lesson.getByLabel("Grid").check();

await lesson.getByRole("button", { name: "Copy AB" }).click();
await page.waitForFunction(() => globalThis.document.querySelector('[data-testid="dynamic-geometry-mockup-0274"]')?.getAttribute("data-copy-count") === "1");
checks.copied = await state();

checks.stages = [];
for (const [index, name] of ["Explore", "Explain", "Examples", "Formulas", "Practice"].entries()) {
  await lesson.getByRole("button", { name: new RegExp(`^${name}`) }).click();
  checks.stages.push({ expected: String(index), actual: (await state()).stage });
}

await lesson.getByRole("button", { name: "Clear All" }).click();
checks.cleared = await state();
await lesson.getByRole("button", { name: "Point", exact: true }).click();
for (const [x, y] of [[0.3, 0.25], [0.48, 0.15], [0.62, 0.33]]) {
  await page.mouse.click(canvasBox.x + canvasBox.width * x, canvasBox.y + canvasBox.height * y);
}
checks.rebuilt = await state();

const practice = lesson.locator("#general-practice");
await practice.getByLabel("Hexagon interior sum").fill("700");
await practice.getByLabel("Hexagon exterior sum").fill("300");
await practice.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await practice.getByLabel("Hexagon interior sum").fill("720");
await practice.getByLabel("Hexagon exterior sum").fill("360");
await practice.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.waitForTimeout(200);

const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const element = globalThis.document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { top: box.top, left: box.left, width: box.width, height: box.height, bottom: box.bottom };
  };
  const lessonNode = globalThis.document.querySelector('[data-testid="dynamic-geometry-mockup-0274"]');
  return {
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    overflow: globalThis.document.documentElement.scrollWidth > globalThis.window.innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    header: rect('[data-testid="dynamic-geometry-mockup-0274"] > header'),
    tabs: rect('[data-testid="dynamic-geometry-mockup-0274"] > nav'),
    workspace: rect("#general-0"),
    cards: rect('[data-testid="dynamic-geometry-mockup-0274"] > section:nth-of-type(2)'),
    practice: rect("#general-practice"),
    adjacent: rect('[data-testid="dynamic-geometry-mockup-0274"] nav[aria-label="Adjacent lessons"]'),
    footer: rect('footer[aria-label="Site footer"]'),
    practiceButton: rect('#general-practice button'),
    surface: lessonNode ? { bottom: lessonNode.getBoundingClientRect().bottom } : null,
  };
});

const navigation = {
  previousHref: await lesson.getByRole("link", { name: /Previous/ }).getAttribute("href"),
  nextHref: await lesson.getByRole("link", { name: /Next/ }).getAttribute("href"),
};
const pointCount = (snapshot) => snapshot.points ? snapshot.points.split("|").filter(Boolean).length : 0;
const overlayOffsetPreserved = beforeMove.area === checks.polygonMoved.area && beforeMove.perimeter === checks.polygonMoved.perimeter;
const passed =
  checks.initial.area !== checks.vertexDragged.area &&
  pointCount(checks.vertexAdded) === 6 &&
  pointCount(checks.vertexRemoved) === 5 &&
  overlayOffsetPreserved &&
  checks.measured["selected-side"] === "0" &&
  checks.displayOff.snap === "false" && checks.displayOff.grid === "false" &&
  checks.copied["copy-count"] === "1" &&
  checks.stages.every((stage) => stage.expected === stage.actual) &&
  pointCount(checks.cleared) === 0 && pointCount(checks.rebuilt) === 3 &&
  checks.rejected.feedback === "incorrect" && checks.accepted.feedback === "correct" &&
  checks.reset.points === checks.initial.points && checks.reset.feedback === "idle" &&
  navigation.previousHref === "/lessons/geometry/216-rigid-polygon" &&
  navigation.nextHref === "/lessons/geometry/218-circle-centre-and-point" &&
  metrics.document.width === 1022 && metrics.document.height === 1538 &&
  metrics.sidebar?.width === 216 && !metrics.overflow &&
  metrics.practiceButton && metrics.practice && metrics.practiceButton.bottom <= metrics.practice.bottom &&
  consoleMessages.length === 0;

const report = {
  mockup: "0274",
  lessonId: 217,
  checks,
  invariants: { translationPreservedAreaAndPerimeter: overlayOffsetPreserved },
  navigation,
  metrics,
  consoleMessages,
  note: "The mockup's listed individual interior angles sum to 519.9 degrees while also claiming the correct pentagon total of 540 degrees. The lesson derives every angle and the total from the live vertices.",
  passed,
};

await page.screenshot({ path: path.join(output, "0274-desktop.png"), fullPage: true });
await copyFile(reference, path.join(output, "0274-reference.png"));
await writeFile(path.join(output, "0274-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
