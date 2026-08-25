import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const evidence = path.join(process.cwd(), "test-evidence", "lesson-ui-upgrade");
const referenceName =
  "0330-interactive-intermediate-advanced-trigonometry-bearings-redesigned.png";
await mkdir(evidence, { recursive: true });
await copyFile(
  path.join(
    "D:\\Math App Screenshots for UI Update\\Updated UI",
    referenceName,
  ),
  path.join(evidence, "0330-reference.png"),
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 990, height: 1589 },
  deviceScaleFactor: 1,
});
page.setDefaultTimeout(6000);
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
page.on("pageerror", (error) =>
  consoleMessages.push(`pageerror: ${error.message}`),
);
await page.addInitScript(() => {
  globalThis.localStorage.setItem("math-universe-sidebar-collapsed", "false");
  globalThis.localStorage.removeItem("lesson-progress-273");
});
await page.goto("http://localhost:2245/lessons/trigonometry/273-bearings", {
  waitUntil: "networkidle",
});

const surface = page.locator("[data-dedicated-lesson='273']");
await surface.waitFor({ state: "visible" });
const state = async () =>
  surface.evaluate((element) => ({
    bearing: Number(element.getAttribute("data-bearing")),
    formatted: element.getAttribute("data-bearing-three-digit"),
    reverse: Number(element.getAttribute("data-reverse-bearing")),
    distance: Number(element.getAttribute("data-distance")),
    dx: Number(element.getAttribute("data-delta-x")),
    dy: Number(element.getAttribute("data-delta-y")),
    quadrant: element.getAttribute("data-quadrant"),
    unit: element.getAttribute("data-unit"),
    activeView: element.getAttribute("data-active-view"),
    practiceResult: element.getAttribute("data-practice-result"),
    practiceChoice: element.getAttribute("data-practice-choice"),
  }));

const checks = {};
checks.initial = await state();
assertClose(checks.initial.bearing, bearingFromDelta(6, 4), "initial bearing");
assertClose(
  checks.initial.reverse,
  reverseBearing(checks.initial.bearing),
  "initial reverse",
);
assertClose(checks.initial.distance, Math.sqrt(52), "initial distance");
if (checks.initial.formatted !== "056" || checks.initial.quadrant !== "NE")
  throw new Error("initial bearing formatting or quadrant is wrong");

await dragBy(page.locator("[data-testid='bearing-vertex-a']"), 20, 24);
checks.dragA = await state();
assertChanged(checks.dragA.bearing, checks.initial.bearing, "vertex A drag");
assertBearing(checks.dragA, "route after A drag");
await dragBy(page.locator("[data-testid='bearing-vertex-b']"), -30, -22);
checks.dragB = await state();
assertChanged(checks.dragB.bearing, checks.dragA.bearing, "vertex B drag");
assertBearing(checks.dragB, "route after B drag");

await page.getByLabel("Bearing point A x").fill("0");
await page.getByLabel("Bearing point A y").fill("0");
await page.getByLabel("Bearing point B x").fill("0");
await page.getByLabel("Bearing point B y").fill("5");
checks.north = await state();
assertClose(checks.north.bearing, 0, "north bearing");
assertClose(checks.north.reverse, 180, "north reverse");
if (checks.north.formatted !== "000" || checks.north.quadrant !== "N")
  throw new Error("north route classification is wrong");

await page.getByRole("button", { name: "SE", exact: true }).click();
checks.southEast = await state();
assertClose(checks.southEast.bearing, bearingFromDelta(6, -4), "SE bearing");
if (checks.southEast.quadrant !== "SE")
  throw new Error("SE preset did not set the correct quadrant");
assertBearing(checks.southEast, "SE preset");
await page.getByRole("button", { name: "W", exact: true }).click();
checks.west = await state();
assertClose(checks.west.bearing, 270, "west bearing");
if (checks.west.formatted !== "270" || checks.west.quadrant !== "W")
  throw new Error("west preset is wrong");

await page.getByLabel("Bearing distance units").selectOption("km");
checks.km = await state();
if (checks.km.unit !== "km") throw new Error("distance unit did not change");
await page.getByRole("button", { name: /Examples/, exact: true }).click();
checks.examples = await state();
if (checks.examples.activeView !== "examples")
  throw new Error("Examples view did not activate");

await page
  .getByRole("button", { name: "Practice option B 042 degrees", exact: true })
  .click();
checks.practiceWrong = await state();
if (
  checks.practiceWrong.practiceResult !== "incorrect" ||
  checks.practiceWrong.practiceChoice !== "42"
)
  throw new Error("incorrect reverse bearing was not rejected");
await page
  .getByRole("button", { name: "Practice option A 138 degrees", exact: true })
  .click();
checks.practiceCorrect = await state();
if (
  checks.practiceCorrect.practiceResult !== "correct" ||
  checks.practiceCorrect.practiceChoice !== "138"
)
  throw new Error("correct reverse bearing was not accepted");

await page
  .locator(".target-bearings-header")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
checks.reset = await state();
assertClose(checks.reset.bearing, bearingFromDelta(6, 4), "reset bearing");
assertBearing(checks.reset, "reset route");
if (
  checks.reset.unit !== "grid" ||
  checks.reset.activeView !== "interaction" ||
  checks.reset.practiceResult !== "correct"
)
  throw new Error("reset did not restore lesson state");

const metrics = await page.evaluate(() => {
  const box = (selector) =>
    globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBox = box("[data-dedicated-lesson='273']");
  const names = [
    "header",
    "tabs",
    "map",
    "flow",
    "learning",
    "practice",
    "nav",
  ];
  const regions = Object.fromEntries(
    names.map((name) => {
      const value = box(`.target-bearings-${name}`);
      return [
        name,
        value
          ? { top: value.top, bottom: value.bottom, height: value.height }
          : null,
      ];
    }),
  );
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    horizontalOverflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surface: surfaceBox
      ? {
          top: surfaceBox.top,
          bottom: surfaceBox.bottom,
          height: surfaceBox.height,
        }
      : null,
    regions,
  };
});

await page.screenshot({
  path: path.join(evidence, "0330-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0330",
  lessonId: 273,
  route: "/lessons/trigonometry/273-bearings",
  reference: referenceName,
  objectModel:
    "draggable-north-grid-route-clockwise-bearing-reverse-quadrant-distance-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0330-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
if (!report.passed) throw new Error(JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

async function dragBy(locator, dx, dy) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("bearing handle has no bounding box");
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}
function bearingFromDelta(dx, dy) {
  return normalize((Math.atan2(dx, dy) * 180) / Math.PI);
}
function reverseBearing(value) {
  return normalize(value + 180);
}
function normalize(value) {
  return ((value % 360) + 360) % 360;
}
function assertClose(actual, expected, label, tolerance = 2e-5) {
  if (Math.abs(actual - expected) > tolerance)
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
}
function assertChanged(actual, before, label) {
  if (Math.abs(actual - before) < 0.25)
    throw new Error(`${label}: value did not change`);
}
function assertBearing(value, label) {
  assertClose(
    value.reverse,
    reverseBearing(value.bearing),
    `${label} reverse`,
    3e-5,
  );
  assertClose(
    value.distance,
    Math.hypot(value.dx, value.dy),
    `${label} distance`,
    3e-5,
  );
}
