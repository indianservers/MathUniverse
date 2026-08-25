import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const evidence = path.join(process.cwd(), "test-evidence", "lesson-ui-upgrade");
const referenceName =
  "0329-interactive-intermediate-advanced-trigonometry-triangle-area-formula-redesigned.png";
await mkdir(evidence, { recursive: true });
await copyFile(
  path.join(
    "D:\\Math App Screenshots for UI Update\\Updated UI",
    referenceName,
  ),
  path.join(evidence, "0329-reference.png"),
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1006, height: 1563 },
  deviceScaleFactor: 1,
});
page.setDefaultTimeout(6000);
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
page.on("pageerror", (error) =>
  consoleMessages.push(`pageerror: ${error.message}`),
);
await page.addInitScript(() => {
  globalThis.localStorage.setItem("math-universe-sidebar-collapsed", "false");
  globalThis.localStorage.removeItem("lesson-progress-272");
});
await page.goto(
  "http://localhost:2245/lessons/trigonometry/272-triangle-area-formula",
  { waitUntil: "networkidle" },
);

const surface = page.locator("[data-dedicated-lesson='272']");
await surface.waitFor({ state: "visible" });
const state = async () =>
  surface.evaluate((element) => ({
    a: Number(element.getAttribute("data-side-a")),
    b: Number(element.getAttribute("data-side-b")),
    base: Number(element.getAttribute("data-base")),
    height: Number(element.getAttribute("data-height")),
    C: Number(element.getAttribute("data-angle-c")),
    formulaArea: Number(element.getAttribute("data-formula-area")),
    baseHeightArea: Number(element.getAttribute("data-base-height-area")),
    determinantArea: Number(element.getAttribute("data-determinant-area")),
    difference: Number(element.getAttribute("data-difference")),
    practiceAnswer: Number(element.getAttribute("data-practice-answer")),
    practiceResult: element.getAttribute("data-practice-result"),
    activeTab: element.getAttribute("data-active-tab"),
    controlMode: element.getAttribute("data-control-mode"),
  }));

const checks = {};
checks.initial = await state();
assertClose(checks.initial.a, Math.sqrt(13), "initial side a");
assertClose(checks.initial.b, Math.sqrt(13), "initial side b");
assertClose(checks.initial.base, 4, "initial base");
assertClose(checks.initial.height, 3, "initial height");
assertAreaIdentity(checks.initial, "initial triangle");

for (const [vertex, dx, dy] of [
  ["a", -20, 12],
  ["b", 24, -8],
  ["c", 18, -20],
]) {
  const before = await state();
  await dragBy(
    page.locator(`[data-testid='triangle-area-vertex-${vertex}']`),
    dx,
    dy,
  );
  const after = await state();
  checks[`drag${vertex.toUpperCase()}`] = after;
  assertChanged(
    after.determinantArea,
    before.determinantArea,
    `vertex ${vertex.toUpperCase()} drag`,
  );
  assertAreaIdentity(after, `triangle after ${vertex.toUpperCase()} drag`);
}

await page
  .locator(".target-triangle-area-header")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
await page.getByLabel("Triangle area side a", { exact: true }).fill("5");
await page.getByLabel("Triangle area side b", { exact: true }).fill("6");
await page
  .getByLabel("Triangle area included angle", { exact: true })
  .fill("90");
checks.sas = await state();
assertClose(checks.sas.a, 5, "SAS side a", 2e-3);
assertClose(checks.sas.b, 6, "SAS side b", 2e-3);
assertClose(checks.sas.C, 90, "SAS angle C", 2e-3);
assertClose(checks.sas.formulaArea, 15, "SAS area", 2e-3);
assertAreaIdentity(checks.sas, "SAS triangle");

await page.getByRole("button", { name: "Coordinates", exact: true }).click();
checks.coordinateMode = await state();
if (checks.coordinateMode.controlMode !== "coordinates") {
  throw new Error("coordinate editor did not open");
}
await page.getByLabel("Vertex A x coordinate").fill("0");
await page.getByLabel("Vertex A y coordinate").fill("0");
await page.getByLabel("Vertex B x coordinate").fill("5");
await page.getByLabel("Vertex B y coordinate").fill("0");
await page.getByLabel("Vertex C x coordinate").fill("2");
await page.getByLabel("Vertex C y coordinate").fill("4");
checks.coordinates = await state();
assertClose(checks.coordinates.determinantArea, 10, "coordinate area", 2e-3);
assertAreaIdentity(checks.coordinates, "coordinate triangle");

await page.getByRole("button", { name: /Practice/, exact: true }).click();
checks.practiceTab = await state();
if (checks.practiceTab.activeTab !== "practice") {
  throw new Error("practice lesson tab did not activate");
}
const answer = page.getByLabel("Triangle area practice answer");
await answer.fill("10");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceWrong = await state();
if (checks.practiceWrong.practiceResult !== "incorrect") {
  throw new Error("incorrect practice answer was not rejected");
}
await answer.fill("16.97");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceCorrect = await state();
if (checks.practiceCorrect.practiceResult !== "correct") {
  throw new Error("correct practice answer was not accepted");
}
await page.getByRole("button", { name: "New Question", exact: true }).click();
checks.nextQuestion = await state();
assertClose(
  checks.nextQuestion.practiceAnswer,
  sasArea(7, 9, 60),
  "next practice answer",
);
if (checks.nextQuestion.practiceResult !== "idle") {
  throw new Error("new question did not clear practice state");
}

await page
  .locator(".target-triangle-area-header")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
checks.reset = await state();
assertClose(checks.reset.determinantArea, 6, "reset area");
assertAreaIdentity(checks.reset, "reset triangle");
if (
  checks.reset.controlMode !== "sides" ||
  checks.reset.activeTab !== "interaction"
) {
  throw new Error("lesson reset did not restore tabs");
}

const metrics = await page.evaluate(() => {
  const box = (selector) =>
    globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBox = box("[data-dedicated-lesson='272']");
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
      const value = box(`.target-triangle-area-${name}`);
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
  path: path.join(evidence, "0329-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0329",
  lessonId: 272,
  route: "/lessons/trigonometry/272-triangle-area-formula",
  reference: referenceName,
  objectModel:
    "draggable-coordinate-triangle-sas-determinant-altitude-area-equivalence-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0329-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
if (!report.passed) throw new Error(JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

async function dragBy(locator, dx, dy) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("vertex handle has no bounding box");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}

function assertClose(actual, expected, label, tolerance = 2e-5) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function assertChanged(actual, before, label) {
  if (Math.abs(actual - before) < 0.15) {
    throw new Error(`${label}: value did not change`);
  }
}

function assertAreaIdentity(value, label) {
  assertClose(
    value.formulaArea,
    value.baseHeightArea,
    `${label} formula/base-height`,
    5e-4,
  );
  assertClose(
    value.baseHeightArea,
    value.determinantArea,
    `${label} base-height/determinant`,
    5e-4,
  );
  assertClose(value.difference, 0, `${label} difference`, 5e-4);
}

function sasArea(a, b, angle) {
  return 0.5 * a * b * Math.sin((angle * Math.PI) / 180);
}
