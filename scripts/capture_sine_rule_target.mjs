import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const evidence = path.join(process.cwd(), "test-evidence", "lesson-ui-upgrade"),
  referenceName =
    "0327-interactive-intermediate-advanced-trigonometry-sine-rule-redesigned.png";
await mkdir(evidence, { recursive: true });
await copyFile(
  path.join(
    "D:\\Math App Screenshots for UI Update\\Updated UI",
    referenceName,
  ),
  path.join(evidence, "0327-reference.png"),
);
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({
    viewport: { width: 1024, height: 1536 },
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
  globalThis.localStorage.removeItem("lesson-progress-270");
});
await page.goto("http://localhost:2245/lessons/trigonometry/270-sine-rule", {
  waitUntil: "networkidle",
});
const surface = page.locator("[data-dedicated-lesson='270']");
await surface.waitFor({ state: "visible" });
const state = async () =>
  surface.evaluate((element) => ({
    a: Number(element.getAttribute("data-side-a")),
    b: Number(element.getAttribute("data-side-b")),
    c: Number(element.getAttribute("data-side-c")),
    A: Number(element.getAttribute("data-angle-a")),
    B: Number(element.getAttribute("data-angle-b")),
    C: Number(element.getAttribute("data-angle-c")),
    ratioA: Number(element.getAttribute("data-ratio-a")),
    ratioB: Number(element.getAttribute("data-ratio-b")),
    ratioC: Number(element.getAttribute("data-ratio-c")),
    ssaCase: element.getAttribute("data-ssa-case"),
    ssaCount: Number(element.getAttribute("data-ssa-count")),
    practiceResult: element.getAttribute("data-practice-result"),
  }));
const checks = {};
checks.initial = await state();
assertClose(checks.initial.a, 7.84, "initial side a");
assertTriangle(checks.initial, "initial triangle");
if (checks.initial.ssaCase !== "two" || checks.initial.ssaCount !== 2)
  throw new Error("initial SSA model should have two solutions");
await dragBy(page.locator("[data-testid='sine-rule-vertex-a']"), 24, -18);
checks.dragA = await state();
assertChanged(checks.dragA.A, checks.initial.A, "vertex A drag");
assertTriangle(checks.dragA, "triangle after A drag");
await dragBy(page.locator("[data-testid='sine-rule-vertex-b']"), 18, -13);
checks.dragB = await state();
assertChanged(checks.dragB.B, checks.dragA.B, "vertex B drag");
assertTriangle(checks.dragB, "triangle after B drag");
await dragBy(page.locator("[data-testid='sine-rule-vertex-c']"), -22, -10);
checks.dragC = await state();
assertChanged(checks.dragC.C, checks.dragB.C, "vertex C drag");
assertTriangle(checks.dragC, "triangle after C drag");

const cInput = page.getByLabel("SSA side c", { exact: true });
await cInput.fill("2");
await cInput.press("Enter");
checks.ssaNone = await state();
assertSsa(checks.ssaNone, "none", 0, "c below altitude");
await cInput.fill("4");
await cInput.press("Enter");
checks.ssaTangent = await state();
assertSsa(checks.ssaTangent, "one", 1, "c equal altitude");
await cInput.fill("6");
await cInput.press("Enter");
checks.ssaTwo = await state();
assertSsa(checks.ssaTwo, "two", 2, "ambiguous interval");
await cInput.fill("9");
await cInput.press("Enter");
checks.ssaOne = await state();
assertSsa(checks.ssaOne, "one", 1, "c at least b");

const B = page.getByLabel("Practice angle B"),
  C = page.getByLabel("Practice angle C"),
  c = page.getByLabel("Practice side c");
await B.fill("30");
await C.fill("110");
await c.fill("16");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceWrong = await state();
if (checks.practiceWrong.practiceResult !== "incorrect")
  throw new Error("incorrect practice values were not rejected");
await B.fill("25.4");
await C.fill("114.6");
await c.fill("17.0");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceCorrect = await state();
if (checks.practiceCorrect.practiceResult !== "correct")
  throw new Error("correct Sine Rule solution was not accepted");
await page
  .getByRole("button", { name: "Hint: Use the Sine Rule", exact: true })
  .click();
if (!(await page.getByText(/First calculate B/).isVisible()))
  throw new Error("practice hint did not open");
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
assertClose(checks.reset.a, 7.84, "reset side a");
assertTriangle(checks.reset, "reset triangle");
if (checks.reset.ssaCase !== "two" || checks.reset.practiceResult !== "idle")
  throw new Error("reset did not restore the full lesson state");

await page.waitForTimeout(200);
const metrics = await page.evaluate(() => {
  const b = (s) =>
      globalThis.document.querySelector(s)?.getBoundingClientRect(),
    surface = b("[data-dedicated-lesson='270']"),
    header = b(".target-sine-rule-header"),
    flow = b(".target-sine-rule-flow"),
    model = b(".target-sine-rule-model"),
    concepts = b(".target-sine-rule-concepts"),
    worked = b(".target-sine-rule-worked"),
    practice = b(".target-sine-rule-practice"),
    nav = b(".target-sine-rule-nav");
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    horizontalOverflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surfaceTop: surface?.top ?? null,
    surfaceBottom: surface?.bottom ?? null,
    headerTop: header?.top ?? null,
    headerBottom: header?.bottom ?? null,
    flowTop: flow?.top ?? null,
    flowBottom: flow?.bottom ?? null,
    modelTop: model?.top ?? null,
    modelBottom: model?.bottom ?? null,
    conceptsTop: concepts?.top ?? null,
    conceptsBottom: concepts?.bottom ?? null,
    workedTop: worked?.top ?? null,
    workedBottom: worked?.bottom ?? null,
    practiceTop: practice?.top ?? null,
    practiceBottom: practice?.bottom ?? null,
    navTop: nav?.top ?? null,
    navBottom: nav?.bottom ?? null,
  };
});
await page.screenshot({
  path: path.join(evidence, "0327-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0327",
  lessonId: 270,
  route: "/lessons/trigonometry/270-sine-rule",
  reference: referenceName,
  objectModel:
    "draggable-triangle-opposite-side-angle-sine-ratio-ssa-ambiguity-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0327-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
if (!report.passed) throw new Error(JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
async function dragBy(locator, dx, dy) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("vertex handle has no bounding box");
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
  if (Math.abs(actual - before) < 0.3)
    throw new Error(`${label}: value did not change`);
}
function assertTriangle(value, label) {
  assertClose(value.A + value.B + value.C, 180, `${label} angle sum`, 3e-4);
  assertClose(value.ratioA, value.ratioB, `${label} ratio a/b`, 3e-4);
  assertClose(value.ratioB, value.ratioC, `${label} ratio b/c`, 3e-4);
}
function assertSsa(value, kind, count, label) {
  if (value.ssaCase !== kind || value.ssaCount !== count)
    throw new Error(
      `${label}: expected ${kind}/${count}, got ${value.ssaCase}/${value.ssaCount}`,
    );
}
