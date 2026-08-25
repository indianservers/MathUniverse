import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const referenceName =
  "0325-interactive-intermediate-advanced-trigonometry-double-and-half-angle-formulae-redesigned.png";
const referenceSource = path.join(
  "D:\\Math App Screenshots for UI Update\\Updated UI",
  referenceName,
);
const route =
  "http://localhost:2245/lessons/trigonometry/268-double-and-half-angle-formulae";

await mkdir(evidence, { recursive: true });
await copyFile(referenceSource, path.join(evidence, "0325-reference.png"));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 991, height: 1587 },
  deviceScaleFactor: 1,
});
const consoleMessages = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
page.on("pageerror", (error) =>
  consoleMessages.push(`pageerror: ${error.message}`),
);

await page.addInitScript(() => {
  globalThis.localStorage.setItem("math-universe-sidebar-collapsed", "false");
  globalThis.localStorage.removeItem("lesson-progress-268");
});
await page.goto(route, { waitUntil: "networkidle" });
const surface = page.locator("[data-dedicated-lesson='268']");
await surface.waitFor({ state: "visible" });

const readState = async () =>
  surface.evaluate((element) => {
    const attributeNumber = (name) => {
      const raw = element.getAttribute(name);
      return raw === "undefined" || raw === null ? null : Number(raw);
    };
    return {
      theta: Number(element.getAttribute("data-theta")),
      doubleAngle: Number(element.getAttribute("data-double-angle")),
      halfAngle: Number(element.getAttribute("data-half-angle")),
      mode: element.getAttribute("data-mode"),
      stage: element.getAttribute("data-stage"),
      doubleDirect: attributeNumber("data-double-direct"),
      doubleExpanded: attributeNumber("data-double-expanded"),
      halfDirect: attributeNumber("data-half-direct"),
      halfExpanded: attributeNumber("data-half-expanded"),
      halfSign: element.getAttribute("data-half-sign"),
      doubleDefined: element.getAttribute("data-double-defined") === "true",
      halfDefined: element.getAttribute("data-half-defined") === "true",
      challengeIndex: Number(element.getAttribute("data-challenge-index")),
      choice: element.getAttribute("data-choice"),
      practiceResult: element.getAttribute("data-practice-result"),
    };
  });

const checks = {};
checks.initial = await readState();
assertClose(checks.initial.theta, 45, "initial theta");
assertClose(checks.initial.doubleAngle, 90, "initial double angle");
assertClose(checks.initial.halfAngle, 22.5, "initial half angle");
assertClose(checks.initial.doubleDirect, 1, "initial direct sine");
assertClose(checks.initial.doubleExpanded, 1, "initial expanded sine");

await dragBy(
  page.locator("[data-testid='double-half-theta-handle']"),
  -24,
  -18,
);
checks.thetaDrag = await readState();
assertChanged(
  checks.thetaDrag.theta,
  checks.initial.theta,
  "theta physical drag",
);
assertClose(
  checks.thetaDrag.doubleAngle,
  normalize(checks.thetaDrag.theta * 2),
  "theta drag linked double",
);
assertClose(
  checks.thetaDrag.halfAngle,
  checks.thetaDrag.theta / 2,
  "theta drag linked half",
);

await dragBy(
  page.locator("[data-testid='double-half-double-handle']"),
  -28,
  13,
);
checks.doubleDrag = await readState();
assertChanged(
  checks.doubleDrag.theta,
  checks.thetaDrag.theta,
  "double physical drag solves theta",
);
assertClose(
  checks.doubleDrag.doubleAngle,
  normalize(checks.doubleDrag.theta * 2),
  "double drag relationship",
);

await dragBy(page.locator("[data-testid='double-half-half-handle']"), 20, -24);
checks.halfDrag = await readState();
assertChanged(
  checks.halfDrag.theta,
  checks.doubleDrag.theta,
  "half physical drag solves theta",
);
assertClose(
  checks.halfDrag.halfAngle,
  checks.halfDrag.theta / 2,
  "half drag relationship",
);

const thetaInput = page.getByLabel("Theta degrees");
await thetaInput.fill("60");
await thetaInput.press("Enter");
checks.sixtySine = await readState();
assertClose(checks.sixtySine.doubleDirect, Math.sqrt(3) / 2, "sin 120 direct");
assertClose(
  checks.sixtySine.doubleExpanded,
  Math.sqrt(3) / 2,
  "sin 120 expanded",
);

await page.getByRole("button", { name: "Cos", exact: true }).click();
checks.cosine = await readState();
assertClose(checks.cosine.doubleDirect, -0.5, "cos 120 direct");
assertClose(checks.cosine.doubleExpanded, -0.5, "cos 120 expanded");
assertClose(checks.cosine.halfDirect, Math.sqrt(3) / 2, "cos 30 direct");
assertClose(checks.cosine.halfExpanded, Math.sqrt(3) / 2, "cos 30 expanded");

await page.getByRole("button", { name: "Tan", exact: true }).click();
await thetaInput.fill("45");
await thetaInput.press("Enter");
checks.tangentSingularity = await readState();
if (checks.tangentSingularity.doubleDefined) {
  throw new Error("tan 90 double-angle singularity was not guarded");
}
if (!checks.tangentSingularity.halfDefined) {
  throw new Error("tan 22.5 half-angle should remain defined");
}

await page.getByRole("button", { name: "Sin", exact: true }).click();
await thetaInput.fill("-150");
await thetaInput.press("Enter");
checks.negativeHalfSign = await readState();
if (checks.negativeHalfSign.halfSign !== "−") {
  throw new Error(
    "negative half-angle sign was not selected from its quadrant",
  );
}
assertClose(
  checks.negativeHalfSign.halfDirect,
  -Math.sin((75 * Math.PI) / 180),
  "negative half-angle direct value",
);
assertClose(
  checks.negativeHalfSign.halfExpanded,
  checks.negativeHalfSign.halfDirect,
  "negative half-angle expanded value",
);

await page.getByRole("button", { name: "Tan", exact: true }).click();
await thetaInput.fill("180");
await thetaInput.press("Enter");
checks.tangentHalfDomain = await readState();
if (checks.tangentHalfDomain.halfDefined) {
  throw new Error("tan 90 half-angle domain exclusion was not guarded");
}

await page.getByRole("button", { name: "Observe", exact: true }).click();
checks.observeStage = await readState();
if (checks.observeStage.stage !== "observe")
  throw new Error("Observe stage did not activate");

await page.getByRole("button", { name: "Sin", exact: true }).click();
const practiceChoices = page.locator(
  ".target-double-half-practice > div > article > section button",
);
await practiceChoices.nth(0).click();
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceWrong = await readState();
if (checks.practiceWrong.practiceResult !== "incorrect")
  throw new Error("wrong answer was not rejected");

await practiceChoices.nth(1).click();
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceCorrect = await readState();
if (checks.practiceCorrect.practiceResult !== "correct")
  throw new Error("correct answer was not accepted");

await page.getByRole("button", { name: "Show Hint", exact: true }).click();
if (!(await page.getByText(/15° is half of 30°/).isVisible()))
  throw new Error("practice hint did not open");
await page.getByRole("button", { name: "New Question", exact: true }).click();
checks.newQuestion = await readState();
if (
  checks.newQuestion.challengeIndex !== 1 ||
  checks.newQuestion.practiceResult !== "idle"
)
  throw new Error("new question state is incorrect");
await practiceChoices.nth(0).click();
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.secondCorrect = await readState();
if (checks.secondCorrect.practiceResult !== "correct")
  throw new Error("second challenge was not graded correctly");

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await readState();
assertClose(checks.reset.theta, 45, "reset theta");
if (
  checks.reset.mode !== "sin" ||
  checks.reset.stage !== "lab" ||
  checks.reset.practiceResult !== "correct"
) {
  throw new Error("reset did not restore the full lesson model");
}

await page.waitForTimeout(200);
const metrics = await page.evaluate(() => {
  const bounds = (selector) =>
    globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const pageBounds = bounds("[data-dedicated-lesson='268']"),
    header = bounds(".target-double-half-header"),
    tabs = bounds(".target-double-half-tabs"),
    lab = bounds(".target-double-half-lab"),
    formulas = bounds(".target-double-half-formulas"),
    flow = bounds(".target-double-half-flow"),
    learning = bounds(".target-double-half-learning"),
    practice = bounds(".target-double-half-practice");
  return {
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    horizontalOverflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surfaceTop: pageBounds?.top ?? null,
    surfaceBottom: pageBounds?.bottom ?? null,
    headerTop: header?.top ?? null,
    headerBottom: header?.bottom ?? null,
    tabsTop: tabs?.top ?? null,
    tabsBottom: tabs?.bottom ?? null,
    labTop: lab?.top ?? null,
    labBottom: lab?.bottom ?? null,
    formulasTop: formulas?.top ?? null,
    formulasBottom: formulas?.bottom ?? null,
    flowTop: flow?.top ?? null,
    flowBottom: flow?.bottom ?? null,
    learningTop: learning?.top ?? null,
    learningBottom: learning?.bottom ?? null,
    practiceTop: practice?.top ?? null,
    practiceBottom: practice?.bottom ?? null,
  };
});

await page.screenshot({
  path: path.join(evidence, "0325-desktop.png"),
  fullPage: true,
});
const report = {
  mockup: "0325",
  lessonId: 268,
  route: "/lessons/trigonometry/268-double-and-half-angle-formulae",
  reference: referenceName,
  objectModel: "linked-theta-double-half-unit-circle-sign-aware-identity-model",
  checks,
  metrics,
  consoleMessages,
  passed: !metrics.horizontalOverflow && consoleMessages.length === 0,
};
await writeFile(
  path.join(evidence, "0325-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
if (!report.passed) throw new Error(JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

async function dragBy(locator, dx, dy) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("draggable handle has no bounding box");
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}
function assertClose(actual, expected, label, tolerance = 2e-5) {
  if (actual === null || Math.abs(actual - expected) > tolerance)
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
}
function assertChanged(actual, before, label) {
  if (Math.abs(actual - before) < 0.5)
    throw new Error(`${label}: value remained ${actual}`);
}
function normalize(angle) {
  const result = ((((angle + 180) % 360) + 360) % 360) - 180;
  return Math.abs(result + 180) < 1e-8 && angle > 0 ? 180 : result;
}
