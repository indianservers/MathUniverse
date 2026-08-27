import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0170-interactive-intermediate-advanced-equations-and-inequalities-three-variable-systems-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/113-three-variable-systems";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 983, height: 1600 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0170");
await node.waitFor({ timeout: 600000 });
const attributes = [
  "system-id",
  "determinant",
  "solution-x",
  "solution-y",
  "solution-z",
  "right-sides",
  "editing",
  "eliminate",
  "first-reduction",
  "second-reduction",
  "steps-ready",
  "dragging",
  "invalid-drop",
  "triple-checked",
  "rotation-step",
  "scene-moves",
  "active-tab",
  "language",
  "shared",
  "workspace-open",
  "practice-index",
  "practice-x",
  "practice-y",
  "practice-z",
  "practice-solution",
  "practice-correct",
  "practice-steps",
  "actions",
];
const state = () =>
  node.evaluate(
    (element, names) =>
      Object.fromEntries(
        names.map((name) => [name, element.getAttribute(`data-${name}`)]),
      ),
    attributes,
  );
const waitFor = (name, value) =>
  page.waitForFunction(
    ([attribute, expected]) =>
      document
        .querySelector('[data-testid="algebra-mockup-0170"]')
        ?.getAttribute(`data-${attribute}`) === expected,
    [name, value],
  );
const checks = { initial: await state() };

await page.getByRole("button", { name: "Edit", exact: true }).first().click();
const firstRightSide = page.getByLabel("Equation 1 right side");
await firstRightSide.fill("7");
checks.edited = await state();
await firstRightSide.fill("6");
await page.getByRole("button", { name: "Done", exact: true }).click();
checks.editRestored = await state();

const variable = page.getByLabel("Variable to eliminate");
await variable.selectOption("x");
checks.eliminateX = await state();
await variable.selectOption("z");
checks.eliminateZ = await state();
await variable.selectOption("y");
await page
  .getByRole("button", { name: "Drag eliminate y operation" })
  .dragTo(page.getByLabel("Three variable elimination drop target"), {
    targetPosition: { x: 30, y: 50 },
  });
checks.draggedY = await state();

await page
  .getByRole("button", { name: "Eliminate x", exact: true })
  .last()
  .click();
checks.quickX = await state();
await page.getByRole("button", { name: "Reset steps", exact: true }).click();
checks.stepsReset = await state();
await page.getByRole("button", { name: "Solve pair", exact: true }).click();
checks.pairSolved = await state();
await page
  .getByRole("button", { name: "Check triple", exact: true })
  .last()
  .click();
checks.tripleChecked = await state();

const canvas = page.locator(".three113-canvas canvas");
await canvas.waitFor({ state: "visible" });
await page.waitForTimeout(500);
checks.canvasPixels = await canvas.evaluate((element) => {
  const gl = element.getContext("webgl2") || element.getContext("webgl");
  if (!gl)
    return {
      width: element.width,
      height: element.height,
      colored: 0,
      nonTransparent: 0,
    };
  const pixels = new Uint8Array(element.width * element.height * 4);
  gl.finish();
  gl.readPixels(
    0,
    0,
    element.width,
    element.height,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );
  let colored = 0;
  let nonTransparent = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] > 0) nonTransparent += 1;
    if (
      pixels[index] < 245 ||
      pixels[index + 1] < 245 ||
      pixels[index + 2] < 245
    )
      colored += 1;
  }
  return {
    width: element.width,
    height: element.height,
    colored,
    nonTransparent,
  };
});
await page.getByRole("button", { name: "Rotate", exact: true }).click();
checks.rotated = await state();
const canvasBox = await canvas.boundingBox();
if (canvasBox) {
  await page.mouse.move(
    canvasBox.x + canvasBox.width * 0.65,
    canvasBox.y + canvasBox.height * 0.45,
  );
  await page.mouse.down();
  await page.mouse.move(
    canvasBox.x + canvasBox.width * 0.42,
    canvasBox.y + canvasBox.height * 0.58,
    { steps: 8 },
  );
  await page.mouse.up();
}
await page.waitForTimeout(100);
checks.orbited = await state();

const practice = page.locator(".three113-practice");
const answerX = page.getByLabel("Practice triple x");
const answerY = page.getByLabel("Practice triple y");
const answerZ = page.getByLabel("Practice triple z");
await answerX.fill("3");
await answerY.fill("2");
await answerZ.fill("3");
await practice.getByRole("button", { name: "Check Answer" }).click();
checks.practiceWrong = await state();
await answerX.fill("4");
await practice.getByRole("button", { name: "Check Answer" }).click();
checks.practiceCorrect = await state();
await practice.getByRole("button", { name: "Show Steps" }).click();
checks.practiceSteps = await state();
await practice.getByRole("button", { name: "Edit", exact: true }).click();
checks.practiceSecondStart = await state();
await answerX.fill("2");
await answerY.fill("3");
await answerZ.fill("1");
await practice.getByRole("button", { name: "Check Answer" }).click();
checks.practiceSecondCorrect = await state();

for (const tab of [
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
  "Interaction + visualization",
]) {
  await page.getByRole("button", { name: tab, exact: true }).click();
  await waitFor("active-tab", tab);
  checks[`tab${tab.replaceAll(" ", "").replaceAll("+", "")}`] = await state();
}
await page
  .getByLabel("Three variable systems language")
  .selectOption({ label: "Hindi (हिन्दी)" });
checks.language = await state();
await page.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await page.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspace = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".three113-page"),
    regions: {
      intro: region(".three113-intro"),
      tabs: region(".three113-tabs"),
      workspace: region(".three113-workspace"),
      elimination: region(".three113-elimination"),
      scene: region(".three113-scene-panel"),
      canvas: region(".three113-canvas"),
      verification: region(".three113-verification"),
      quick: region(".three113-quick"),
      insights: region(".three113-insights"),
      practice: region(".three113-practice"),
      navigation: region(".three113-navigation"),
      footer: region(".three113-footer"),
    },
  };
});
const passed =
  checks.initial["system-id"] === "target-2-1-3" &&
  checks.initial.determinant === "4" &&
  checks.initial["solution-x"] === "2" &&
  checks.initial["solution-y"] === "1" &&
  checks.initial["solution-z"] === "3" &&
  checks.initial["first-reduction"] === "2x + 2z = 10" &&
  checks.initial["second-reduction"] === "2z = 6" &&
  checks.edited["right-sides"] === "7,4,0" &&
  checks.edited["solution-x"] === "2" &&
  checks.edited["solution-y"] === "1.5" &&
  checks.edited["solution-z"] === "3.5" &&
  checks.editRestored.editing === "false" &&
  checks.editRestored["solution-y"] === "1" &&
  checks.eliminateX.eliminate === "x" &&
  checks.eliminateX["first-reduction"] === "2y = 2" &&
  checks.eliminateX["second-reduction"] === "2z = 6" &&
  checks.eliminateZ.eliminate === "z" &&
  checks.eliminateZ["first-reduction"] === "2y = 2" &&
  checks.eliminateZ["second-reduction"] === "2x + 2y = 6" &&
  checks.draggedY.eliminate === "y" &&
  checks.draggedY["steps-ready"] === "true" &&
  checks.draggedY.dragging === "false" &&
  checks.draggedY["invalid-drop"] === "false" &&
  checks.quickX.eliminate === "x" &&
  checks.quickX["steps-ready"] === "true" &&
  checks.stepsReset["steps-ready"] === "false" &&
  checks.stepsReset["triple-checked"] === "false" &&
  checks.pairSolved["steps-ready"] === "true" &&
  checks.tripleChecked["triple-checked"] === "true" &&
  checks.canvasPixels.width > 300 &&
  checks.canvasPixels.height > 200 &&
  checks.canvasPixels.nonTransparent > 50000 &&
  checks.canvasPixels.colored > 10000 &&
  checks.rotated["rotation-step"] === "1" &&
  checks.rotated["scene-moves"] === "1" &&
  Number(checks.orbited["scene-moves"]) >= 2 &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.practiceSteps["practice-steps"] === "true" &&
  checks.practiceSecondStart["practice-index"] === "1" &&
  checks.practiceSecondStart["practice-solution"] === "2,3,1" &&
  checks.practiceSecondCorrect["practice-correct"] === "true" &&
  checks.tabExplain["active-tab"] === "Explain" &&
  checks.tabExamples["active-tab"] === "Examples" &&
  checks.tabExamples["system-id"] === "example-2-1-4" &&
  checks.tabExamples["solution-x"] === "2" &&
  checks.tabExamples["solution-y"] === "1" &&
  checks.tabExamples["solution-z"] === "4" &&
  checks.tabFormulas["active-tab"] === "Formulas" &&
  checks.tabKnowmore["active-tab"] === "Know more" &&
  checks.tabInteractionvisualization["active-tab"] ===
    "Interaction + visualization" &&
  checks.language.language === "Hindi (हिन्दी)" &&
  checks.shared.shared === "true" &&
  checks.workspace["workspace-open"] === "true" &&
  checks.reset["system-id"] === "target-2-1-3" &&
  checks.reset.eliminate === "y" &&
  checks.reset["steps-ready"] === "true" &&
  checks.reset["triple-checked"] === "true" &&
  checks.reset["rotation-step"] === "0" &&
  checks.reset["practice-index"] === "0" &&
  checks.reset["practice-correct"] === "true" &&
  checks.reloaded["solution-x"] === "2" &&
  checks.reloaded["solution-y"] === "1" &&
  checks.reloaded["solution-z"] === "3" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  metrics.document.width === 983 &&
  metrics.document.height === 1600 &&
  metrics.surface?.left === 220 &&
  metrics.surface?.top === 97 &&
  metrics.surface?.right === 967 &&
  metrics.surface?.bottom === 1600 &&
  metrics.regions.intro?.bottom === 321 &&
  metrics.regions.tabs?.top === 330 &&
  metrics.regions.tabs?.bottom === 383 &&
  metrics.regions.workspace?.top === 392 &&
  metrics.regions.workspace?.bottom === 1097 &&
  metrics.regions.elimination?.right === 588 &&
  metrics.regions.scene?.left === 596 &&
  metrics.regions.scene?.bottom === 832 &&
  metrics.regions.canvas?.left === 609 &&
  metrics.regions.canvas?.right === 956 &&
  metrics.regions.verification?.top === 840 &&
  metrics.regions.verification?.bottom === 1097 &&
  metrics.regions.quick?.top === 1097 &&
  metrics.regions.quick?.bottom === 1152 &&
  metrics.regions.insights?.top === 1161 &&
  metrics.regions.insights?.bottom === 1259 &&
  metrics.regions.practice?.top === 1269 &&
  metrics.regions.practice?.bottom === 1443 &&
  metrics.regions.navigation?.top === 1449 &&
  metrics.regions.navigation?.bottom === 1498 &&
  metrics.regions.footer?.top === 1507 &&
  metrics.regions.footer?.bottom === 1600 &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0170-desktop.png") });
await copyFile(reference, path.join(out, "0170-reference.png"));
const report = {
  mockup: "0170",
  lessonId: 113,
  route: "/lessons/algebra/113-three-variable-systems",
  objectModel:
    "editable-three-equation-coefficient-matrix-cramers-rule-solver-native-variable-elimination-drag-generated-row-reduction-threejs-plane-intersection-all-equation-verification-ordered-triple-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0170-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await Promise.race([
  browser.close().catch(() => undefined),
  new Promise((resolve) => setTimeout(resolve, 3000)),
]);
process.exit(passed ? 0 : 1);
