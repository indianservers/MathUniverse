import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const evidence = path.join(process.cwd(), "test-evidence", "lesson-ui-upgrade");
const referenceName =
  "0326-interactive-intermediate-advanced-trigonometry-trig-equations-redesigned.png";
await mkdir(evidence, { recursive: true });
await copyFile(
  path.join(
    "D:\\Math App Screenshots for UI Update\\Updated UI",
    referenceName,
  ),
  path.join(evidence, "0326-reference.png"),
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1003, height: 1568 },
  deviceScaleFactor: 1,
});
page.setDefaultTimeout(5000);
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
  globalThis.localStorage.removeItem("lesson-progress-269");
});
await page.goto(
  "http://localhost:2245/lessons/trigonometry/269-trig-equations",
  { waitUntil: "networkidle" },
);
const surface = page.locator("[data-dedicated-lesson='269']");
await surface.waitFor({ state: "visible" });

const state = async () =>
  surface.evaluate((element) => ({
    k: Number(element.getAttribute("data-k")),
    intervalMin: Number(element.getAttribute("data-interval-min")),
    intervalMax: Number(element.getAttribute("data-interval-max")),
    solutionCount: Number(element.getAttribute("data-solution-count")),
    solutions: (element.getAttribute("data-solutions") ?? "")
      .split(",")
      .filter(Boolean)
      .map(Number),
    unit: element.getAttribute("data-unit"),
    stage: element.getAttribute("data-stage"),
    challengeIndex: Number(element.getAttribute("data-challenge-index")),
    practiceResult: element.getAttribute("data-practice-result"),
  }));
const checks = {};
checks.initial = await state();
assertClose(checks.initial.k, 0.5, "initial k");
assertClose(
  checks.initial.intervalMin,
  -2 * Math.PI,
  "initial interval minimum",
);
assertClose(
  checks.initial.intervalMax,
  2 * Math.PI,
  "initial interval maximum",
);
if (checks.initial.solutionCount !== 4)
  throw new Error(
    `expected four initial intersections, received ${checks.initial.solutionCount}`,
  );
assertSolutions(
  checks.initial.solutions,
  [(-5 * Math.PI) / 3, -Math.PI / 3, Math.PI / 3, (5 * Math.PI) / 3],
  "initial intersections",
);

await dragBy(page.locator("[data-testid='trig-equation-level-handle']"), 0, 34);
checks.levelDrag = await state();
if (Math.abs(checks.levelDrag.k - 0.5) < 0.1)
  throw new Error("physical y=k line drag did not update k");

const levelInput = page.getByLabel("Equation level value");
await levelInput.fill("1");
await levelInput.press("Enter");
checks.kOne = await state();
if (checks.kOne.solutionCount !== 3)
  throw new Error("cos x = 1 should include -2π, 0, and 2π");
assertSolutions(
  checks.kOne.solutions,
  [-2 * Math.PI, 0, 2 * Math.PI],
  "k=1 boundary solutions",
);

await levelInput.fill("-1");
await levelInput.press("Enter");
checks.kNegativeOne = await state();
assertSolutions(
  checks.kNegativeOne.solutions,
  [-Math.PI, Math.PI],
  "k=-1 solutions",
);

await levelInput.fill("0.5");
await levelInput.press("Enter");
const minimum = page.getByLabel("Interval minimum"),
  maximum = page.getByLabel("Interval maximum");
await setRange(minimum, -Math.PI);
await setRange(maximum, Math.PI);
checks.restrictedInterval = await state();
assertSolutions(
  checks.restrictedInterval.solutions,
  [-Math.PI / 3, Math.PI / 3],
  "restricted interval solutions",
);

await page.getByRole("button", { name: "Degree", exact: true }).click();
checks.degreeMode = await state();
if (checks.degreeMode.unit !== "degree")
  throw new Error("degree mode did not activate");
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.examplesStage = await state();
if (checks.examplesStage.stage !== "examples")
  throw new Error("examples stage did not activate");

const answer = page.getByLabel("Trig equation solutions");
await answer.fill("pi/6, 5pi/6");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceWrong = await state();
if (checks.practiceWrong.practiceResult !== "incorrect")
  throw new Error("incomplete periodic answer was not rejected");

await answer.fill("-11pi/6, -7pi/6, pi/6, 5pi/6");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceCorrect = await state();
if (checks.practiceCorrect.practiceResult !== "correct")
  throw new Error("complete symbolic answer was not accepted");

await page.getByRole("button", { name: /Hint$/ }).click();
if (!(await page.getByText(/reference angle π\/6/).isVisible()))
  throw new Error("hint did not open");
await page.getByRole("button", { name: "Show Solution", exact: true }).click();
if (!(await page.getByText(/x = π\/6 \+ 2πn/).isVisible()))
  throw new Error("solution derivation did not open");
await page.getByRole("button", { name: "New Challenge", exact: true }).click();
checks.newChallenge = await state();
if (
  checks.newChallenge.challengeIndex !== 1 ||
  checks.newChallenge.practiceResult !== "idle"
)
  throw new Error("new challenge did not clear grading state");
await answer.fill("-4pi/3, -2pi/3, 2pi/3, 4pi/3");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.secondCorrect = await state();
if (checks.secondCorrect.practiceResult !== "correct")
  throw new Error("second exact solution family was not accepted");

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
assertClose(checks.reset.k, 0.5, "reset k");
if (
  checks.reset.solutionCount !== 4 ||
  checks.reset.unit !== "radian" ||
  checks.reset.stage !== "interaction" ||
  checks.reset.practiceResult !== "idle"
)
  throw new Error("reset did not restore the complete equation model");

await page.waitForTimeout(200);
const metrics = await page.evaluate(() => {
  const bounds = (selector) =>
    globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surface = bounds("[data-dedicated-lesson='269']"),
    header = bounds(".target-trig-equations-header"),
    tabs = bounds(".target-trig-equations-tabs"),
    flow = bounds(".target-trig-equations-flow"),
    solver = bounds(".target-trig-equations-solver"),
    connect = bounds(".target-trig-equations-connect"),
    learning = bounds(".target-trig-equations-learning"),
    practice = bounds(".target-trig-equations-practice"),
    nav = bounds(".target-trig-equations-nav"),
    footer = bounds("footer[aria-label='Site footer']");
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
    tabsTop: tabs?.top ?? null,
    tabsBottom: tabs?.bottom ?? null,
    flowTop: flow?.top ?? null,
    flowBottom: flow?.bottom ?? null,
    solverTop: solver?.top ?? null,
    solverBottom: solver?.bottom ?? null,
    connectTop: connect?.top ?? null,
    connectBottom: connect?.bottom ?? null,
    learningTop: learning?.top ?? null,
    learningBottom: learning?.bottom ?? null,
    practiceTop: practice?.top ?? null,
    practiceBottom: practice?.bottom ?? null,
    navTop: nav?.top ?? null,
    navBottom: nav?.bottom ?? null,
    footerTop: footer?.top ?? null,
    footerBottom: footer?.bottom ?? null,
  };
});
await page.screenshot({
  path: path.join(evidence, "0326-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0326",
  lessonId: 269,
  route: "/lessons/trigonometry/269-trig-equations",
  reference: referenceName,
  objectModel:
    "cosine-horizontal-level-periodic-interval-intersection-solution-family-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0326-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
if (!report.passed) throw new Error(JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

async function dragBy(locator, dx, dy) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("drag handle has no box");
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}
async function setRange(locator, value) {
  await locator.evaluate((element, next) => {
    const input = element;
    input.value = String(next);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}
function assertClose(actual, expected, label, tolerance = 2e-5) {
  if (Math.abs(actual - expected) > tolerance)
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
}
function assertSolutions(actual, expected, label) {
  if (
    actual.length !== expected.length ||
    actual.some((value, index) => Math.abs(value - expected[index]) > 2e-5)
  )
    throw new Error(
      `${label}: expected ${expected.join(",")}, got ${actual.join(",")}`,
    );
}
