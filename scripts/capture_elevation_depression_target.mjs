import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const evidence = path.join(process.cwd(), "test-evidence", "lesson-ui-upgrade");
const referenceName =
  "0331-interactive-intermediate-advanced-trigonometry-elevation-and-depression-redesigned.png";
await mkdir(evidence, { recursive: true });
await copyFile(
  path.join(
    "D:\\Math App Screenshots for UI Update\\Updated UI",
    referenceName,
  ),
  path.join(evidence, "0331-reference.png"),
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1023, height: 1537 },
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
  globalThis.localStorage.removeItem("lesson-progress-274");
});
await page.goto(
  "http://localhost:2245/lessons/trigonometry/274-elevation-and-depression",
  { waitUntil: "networkidle" },
);

const surface = page.locator("[data-dedicated-lesson='274']");
await surface.waitFor({ state: "visible" });
const state = async () =>
  surface.evaluate((element) => ({
    mode: element.getAttribute("data-mode"),
    angle: Number(element.getAttribute("data-angle")),
    opposite: Number(element.getAttribute("data-opposite")),
    adjacent: Number(element.getAttribute("data-adjacent")),
    hypotenuse: Number(element.getAttribute("data-hypotenuse")),
    tangent: Number(element.getAttribute("data-tangent")),
    difference: Number(element.getAttribute("data-identity-difference")),
    activeView: element.getAttribute("data-active-view"),
    practiceAnswer: Number(element.getAttribute("data-practice-answer")),
    practiceResult: element.getAttribute("data-practice-result"),
    solutionOpen: element.getAttribute("data-solution-open"),
  }));

const checks = {};
checks.initial = await state();
assertClose(checks.initial.angle, 45, "initial angle");
assertClose(checks.initial.opposite, 90, "initial height");
assertClose(checks.initial.adjacent, 90, "initial distance");
assertClose(
  checks.initial.hypotenuse,
  Math.hypot(90, 90),
  "initial sight line",
);
assertTriangle(checks.initial, "initial model");

await dragBy(page.locator("[data-testid='sight-target-handle']"), -42, 24);
checks.dragTarget = await state();
assertChanged(checks.dragTarget.angle, checks.initial.angle, "target drag");
assertTriangle(checks.dragTarget, "model after target drag");
await dragBy(page.locator("[data-testid='sight-observer-handle']"), 28, -18);
checks.dragObserver = await state();
assertChanged(
  checks.dragObserver.angle,
  checks.dragTarget.angle,
  "observer drag",
);
assertTriangle(checks.dragObserver, "model after observer drag");

await page.getByRole("button", { name: "Depression ▼", exact: true }).click();
checks.depression = await state();
if (checks.depression.mode !== "depression")
  throw new Error("depression mode did not activate");
assertTriangle(checks.depression, "depression model");
await page.getByRole("button", { name: "Elevation ▲", exact: true }).click();

await page.getByLabel("Sight angle", { exact: true }).fill("30");
checks.angle30 = await state();
assertClose(checks.angle30.angle, 30, "30-degree reconstruction", 2e-3);
assertTriangle(checks.angle30, "30-degree model");
await page.getByLabel("Sight height", { exact: true }).fill("100");
checks.height100 = await state();
assertClose(checks.height100.opposite, 100, "height reconstruction", 2e-3);
assertTriangle(checks.height100, "height model");
await page.getByLabel("Sight distance", { exact: true }).fill("200");
checks.distance200 = await state();
assertClose(checks.distance200.adjacent, 200, "distance reconstruction", 2e-3);
assertTriangle(checks.distance200, "distance model");

await page.getByRole("button", { name: /Formulas/, exact: true }).click();
checks.formulas = await state();
if (checks.formulas.activeView !== "formulas")
  throw new Error("formula view did not activate");
const answer = page.getByLabel("Elevation practice height");
await answer.fill("50");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceWrong = await state();
if (checks.practiceWrong.practiceResult !== "incorrect")
  throw new Error("incorrect practice height was not rejected");
await answer.fill(checks.initial.practiceAnswer.toFixed(2));
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceCorrect = await state();
if (checks.practiceCorrect.practiceResult !== "correct")
  throw new Error("correct practice height was not accepted");
await page.getByRole("button", { name: /Show Solution/ }).click();
checks.solutionClosed = await state();
if (checks.solutionClosed.solutionOpen !== "false")
  throw new Error("solution did not collapse");
await page.getByRole("button", { name: /Show Solution/ }).click();

await page
  .locator(".target-elevation-header")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
checks.reset = await state();
assertClose(checks.reset.angle, 45, "reset angle");
assertTriangle(checks.reset, "reset model");
if (
  checks.reset.mode !== "elevation" ||
  checks.reset.activeView !== "interaction" ||
  checks.reset.practiceResult !== "idle" ||
  checks.reset.solutionOpen !== "true"
)
  throw new Error("reset did not restore the complete lesson state");

const metrics = await page.evaluate(() => {
  const box = (selector) =>
    globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBox = box("[data-dedicated-lesson='274']");
  const names = [
    "header",
    "tabs",
    "flow",
    "lab",
    "learning",
    "practice",
    "nav",
  ];
  const regions = Object.fromEntries(
    names.map((name) => {
      const value = box(`.target-elevation-${name}`);
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
  path: path.join(evidence, "0331-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0331",
  lessonId: 274,
  route: "/lessons/trigonometry/274-elevation-and-depression",
  reference: referenceName,
  objectModel:
    "draggable-observer-target-horizontal-sightline-elevation-depression-right-triangle-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0331-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
if (!report.passed) throw new Error(JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

async function dragBy(locator, dx, dy) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("sight handle has no bounding box");
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}
function assertClose(actual, expected, label, tolerance = 2e-5) {
  if (Math.abs(actual - expected) > tolerance)
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
}
function assertChanged(actual, before, label) {
  if (Math.abs(actual - before) < 0.25)
    throw new Error(`${label}: value did not change`);
}
function assertTriangle(value, label) {
  assertClose(
    value.tangent,
    value.opposite / value.adjacent,
    `${label} tangent`,
    3e-5,
  );
  assertClose(
    value.hypotenuse,
    Math.hypot(value.opposite, value.adjacent),
    `${label} hypotenuse`,
    3e-5,
  );
  assertClose(value.difference, 0, `${label} identity`, 3e-5);
}
