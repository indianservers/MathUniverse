import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const evidence = path.join(process.cwd(), "test-evidence", "lesson-ui-upgrade");
const referenceName =
  "0328-interactive-intermediate-advanced-trigonometry-cosine-rule-redesigned.png";
await mkdir(evidence, { recursive: true });
await copyFile(
  path.join(
    "D:\\Math App Screenshots for UI Update\\Updated UI",
    referenceName,
  ),
  path.join(evidence, "0328-reference.png"),
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1013, height: 1553 },
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
  globalThis.localStorage.removeItem("lesson-progress-271");
});
await page.goto("http://localhost:2245/lessons/trigonometry/271-cosine-rule", {
  waitUntil: "networkidle",
});

const surface = page.locator("[data-dedicated-lesson='271']");
await surface.waitFor({ state: "visible" });
const state = async () =>
  surface.evaluate((element) => ({
    a: Number(element.getAttribute("data-side-a")),
    b: Number(element.getAttribute("data-side-b")),
    c: Number(element.getAttribute("data-side-c")),
    C: Number(element.getAttribute("data-angle-c")),
    lhs: Number(element.getAttribute("data-lhs")),
    rhs: Number(element.getAttribute("data-rhs")),
    difference: Number(element.getAttribute("data-difference")),
    workedAnswer: Number(element.getAttribute("data-worked-answer")),
    practiceAnswer: Number(element.getAttribute("data-practice-answer")),
    practiceResult: element.getAttribute("data-practice-result"),
  }));

const checks = {};
checks.initial = await state();
assertClose(checks.initial.a, Math.sqrt(29), "initial a");
assertClose(checks.initial.b, 4, "initial b");
assertClose(checks.initial.c, Math.sqrt(61), "initial c");
assertIdentity(checks.initial, "initial triangle");

await dragBy(page.locator("[data-testid='cosine-rule-vertex-a']"), 28, -20);
checks.dragA = await state();
assertChanged(checks.dragA.b, checks.initial.b, "vertex A drag");
assertIdentity(checks.dragA, "triangle after A drag");
await dragBy(page.locator("[data-testid='cosine-rule-vertex-b']"), -24, 18);
checks.dragB = await state();
assertChanged(checks.dragB.a, checks.dragA.a, "vertex B drag");
assertIdentity(checks.dragB, "triangle after B drag");

await page.getByLabel("Worked side 1").fill("5");
await page.getByLabel("Worked side 2").fill("5");
await page.getByLabel("Worked included angle").fill("120");
checks.worked = await state();
assertClose(checks.worked.workedAnswer, Math.sqrt(75), "worked SAS result");

await page.getByLabel("Practice side 1").fill("3");
await page.getByLabel("Practice side 2").fill("4");
await page.getByLabel("Practice included angle").fill("90");
checks.practiceEdited = await state();
assertClose(checks.practiceEdited.practiceAnswer, 5, "practice 3-4-5 result");
if (checks.practiceEdited.practiceResult !== "idle") {
  throw new Error("editing practice values should clear the checked state");
}
await page.getByRole("button", { name: /Check Answer/ }).click();
checks.practiceChecked = await state();
if (checks.practiceChecked.practiceResult !== "correct") {
  throw new Error("practice check did not validate the computed side");
}

await page
  .locator(".target-cosine-rule-header")
  .getByRole("button", { name: "Reset", exact: true })
  .click();
checks.reset = await state();
assertClose(checks.reset.a, Math.sqrt(29), "reset a");
assertClose(checks.reset.b, 4, "reset b");
assertClose(checks.reset.c, Math.sqrt(61), "reset c");
assertClose(checks.reset.workedAnswer, Math.sqrt(52), "reset worked answer");
assertIdentity(checks.reset, "reset triangle");

const metrics = await page.evaluate(() => {
  const box = (selector) =>
    globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBox = box("[data-dedicated-lesson='271']");
  const names = [
    "header",
    "flow",
    "lab",
    "rule",
    "worked",
    "misconception",
    "practice",
    "nav",
  ];
  const regions = Object.fromEntries(
    names.map((name) => {
      const value = box(`.target-cosine-rule-${name}`);
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
  path: path.join(evidence, "0328-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0328",
  lessonId: 271,
  route: "/lessons/trigonometry/271-cosine-rule",
  reference: referenceName,
  objectModel:
    "draggable-coordinate-triangle-cosine-square-decomposition-sas-solver-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0328-dedicated-target-validation.json"),
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
  if (Math.abs(actual - before) < 0.2) {
    throw new Error(`${label}: value did not change`);
  }
}

function assertIdentity(value, label) {
  assertClose(value.lhs, value.rhs, `${label} identity`, 3e-5);
  assertClose(value.difference, 0, `${label} difference`, 3e-5);
}
