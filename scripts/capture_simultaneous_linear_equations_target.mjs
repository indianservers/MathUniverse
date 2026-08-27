import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0169-interactive-intermediate-advanced-equations-and-inequalities-simultaneous-linear-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2253/lessons/algebra/112-simultaneous-linear-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 982, height: 1601 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0169");
await node.waitFor({ timeout: 600000 });
const attributes = [
  "system-id",
  "equation-one",
  "equation-two",
  "determinant",
  "solution-x",
  "solution-y",
  "combined-a",
  "combined-b",
  "combined-c",
  "method",
  "combined",
  "dragging",
  "invalid-drop",
  "show-intersection",
  "check-both",
  "grid",
  "step-view",
  "theme",
  "active-tab",
  "favorite",
  "practice-index",
  "practice-x",
  "practice-y",
  "practice-solution-x",
  "practice-solution-y",
  "practice-correct",
  "practice-solution-visible",
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
        .querySelector('[data-testid="algebra-mockup-0169"]')
        ?.getAttribute(`data-${attribute}`) === expected,
    [name, value],
  );
const checks = { initial: await state() };

const selector = page.getByLabel("Simultaneous equation system");
await selector.selectOption("two-x-plus-y");
await waitFor("system-id", "two-x-plus-y");
checks.secondSystem = await state();
await selector.selectOption("subtract-parallel-y");
await waitFor("system-id", "subtract-parallel-y");
checks.thirdSystem = await state();
await selector.selectOption("double-second");
await waitFor("system-id", "double-second");
checks.fourthSystem = await state();
await selector.selectOption("sum-difference-seven-one");
await waitFor("system-id", "sum-difference-seven-one");

await page
  .getByRole("button", { name: "Drag elimination operation Add equations" })
  .dragTo(page.getByLabel("Elimination combination drop target"), {
    targetPosition: { x: 40, y: 40 },
  });
checks.dragged = await state();
await page.getByRole("button", { name: "Substitution", exact: true }).click();
checks.substitution = await state();
checks.substitutionContent = await page
  .getByLabel("Elimination combination drop target")
  .innerText();
await page.getByRole("button", { name: "Elimination", exact: true }).click();

await page.getByLabel("Show system intersection").uncheck({ force: true });
checks.intersectionHidden = await state();
checks.intersectionHiddenCount = await page
  .locator(".sim112-plot .intersection")
  .count();
await page.getByLabel("Show system intersection").check({ force: true });
await page.getByLabel("Check both equations").uncheck({ force: true });
checks.bothUnchecked = await state();
await page.getByLabel("Check both equations").check({ force: true });
await page.getByLabel("Show simultaneous graph grid").uncheck({ force: true });
checks.gridHidden = await state();
checks.gridHiddenCount = await page.locator(".sim112-plot .grid").count();
await page.getByLabel("Show simultaneous graph grid").check({ force: true });
await page
  .getByLabel("Simultaneous equation steps")
  .selectOption("Result only");
checks.resultOnly = await state();
checks.resultOnlyContent = await page
  .getByLabel("Elimination combination drop target")
  .innerText();
await page.getByRole("button", { name: "Use green graph theme" }).click();
checks.greenTheme = await state();
checks.greenThemeClass = await page
  .locator(".sim112-plot")
  .getAttribute("class");
await page.getByRole("button", { name: "Add to favorites" }).click();
checks.favorite = await state();

const xAnswer = page.getByLabel("Practice x value");
const yAnswer = page.getByLabel("Practice y value");
await xAnswer.fill("2");
await yAnswer.fill("2");
await page.getByRole("button", { name: "Check answer" }).click();
checks.practiceWrong = await state();
await xAnswer.fill("3");
await yAnswer.fill("2");
await page.getByRole("button", { name: "Check answer" }).click();
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "Show solution" }).click();
checks.practiceShown = await state();
await page.getByRole("button", { name: "Try another" }).click();
checks.practiceSecondStart = await state();
await xAnswer.fill("5");
await yAnswer.fill("3");
await page.getByRole("button", { name: "Check answer" }).click();
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

await page.getByRole("button", { name: "Reset all", exact: true }).click();
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
    surface: region(".sim112-page"),
    regions: {
      intro: region(".sim112-intro"),
      tabs: region(".sim112-tabs"),
      callouts: region(".sim112-callouts"),
      workspace: region(".sim112-workspace"),
      elimination: region(".sim112-elimination"),
      graph: region(".sim112-graph"),
      plot: region(".sim112-plot"),
      controls: region(".sim112-view-controls"),
      practice: region(".sim112-practice"),
      navigation: region(".sim112-navigation"),
      footer: region(".sim112-footer"),
    },
  };
});
const passed =
  checks.initial["equation-one"] === "x + y = 7" &&
  checks.initial["equation-two"] === "x − y = 1" &&
  checks.initial.determinant === "-2" &&
  checks.initial["solution-x"] === "4" &&
  checks.initial["solution-y"] === "3" &&
  checks.initial["combined-a"] === "2" &&
  checks.initial["combined-b"] === "0" &&
  checks.initial["combined-c"] === "8" &&
  checks.secondSystem["solution-x"] === "4" &&
  checks.secondSystem["solution-y"] === "1" &&
  checks.secondSystem["combined-a"] === "3" &&
  checks.secondSystem["combined-c"] === "12" &&
  checks.thirdSystem["solution-x"] === "2" &&
  checks.thirdSystem["solution-y"] === "5" &&
  checks.thirdSystem["combined-a"] === "2" &&
  checks.thirdSystem["combined-c"] === "4" &&
  checks.fourthSystem["solution-x"] === "4" &&
  checks.fourthSystem["solution-y"] === "2" &&
  checks.fourthSystem["combined-a"] === "3" &&
  checks.fourthSystem["combined-c"] === "12" &&
  checks.dragged.combined === "true" &&
  checks.dragged.dragging === "false" &&
  checks.dragged["invalid-drop"] === "false" &&
  checks.substitution.method === "Substitution" &&
  checks.substitutionContent.includes("Replace y in equation 2") &&
  checks.intersectionHidden["show-intersection"] === "false" &&
  checks.intersectionHiddenCount === 0 &&
  checks.bothUnchecked["check-both"] === "false" &&
  checks.gridHidden.grid === "false" &&
  checks.gridHiddenCount === 0 &&
  checks.resultOnly["step-view"] === "Result only" &&
  checks.resultOnlyContent.trim() === "x = 4" &&
  checks.greenTheme.theme === "green" &&
  checks.greenThemeClass.includes("green") &&
  checks.favorite.favorite === "true" &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.practiceShown["practice-solution-visible"] === "true" &&
  checks.practiceSecondStart["practice-index"] === "1" &&
  checks.practiceSecondStart["practice-solution-x"] === "5" &&
  checks.practiceSecondStart["practice-solution-y"] === "3" &&
  checks.practiceSecondCorrect["practice-correct"] === "true" &&
  checks.tabExplain["active-tab"] === "Explain" &&
  checks.tabExamples["active-tab"] === "Examples" &&
  checks.tabFormulas["active-tab"] === "Formulas" &&
  checks.tabKnowmore["active-tab"] === "Know more" &&
  checks.tabInteractionvisualization["active-tab"] ===
    "Interaction + visualization" &&
  checks.reset["system-id"] === "sum-difference-seven-one" &&
  checks.reset.method === "Elimination" &&
  checks.reset.combined === "true" &&
  checks.reset["show-intersection"] === "true" &&
  checks.reset["check-both"] === "true" &&
  checks.reset.grid === "true" &&
  checks.reset.theme === "violet" &&
  checks.reset["practice-index"] === "0" &&
  checks.reset["practice-correct"] === "true" &&
  checks.reloaded["solution-x"] === "4" &&
  checks.reloaded["solution-y"] === "3" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  metrics.document.width === 982 &&
  metrics.document.height === 1601 &&
  metrics.surface?.left === 217 &&
  metrics.surface?.top === 94 &&
  metrics.surface?.right === 967 &&
  metrics.surface?.bottom === 1601 &&
  metrics.regions.intro?.bottom === 298 &&
  metrics.regions.tabs?.top === 309 &&
  metrics.regions.tabs?.bottom === 354 &&
  metrics.regions.callouts?.top === 365 &&
  metrics.regions.callouts?.bottom === 451 &&
  metrics.regions.workspace?.top === 464 &&
  metrics.regions.workspace?.bottom === 1133 &&
  metrics.regions.elimination?.right === 523 &&
  metrics.regions.graph?.left === 531 &&
  metrics.regions.controls?.top === 1143 &&
  metrics.regions.controls?.bottom === 1185 &&
  metrics.regions.practice?.top === 1195 &&
  metrics.regions.practice?.bottom === 1410 &&
  metrics.regions.navigation?.top === 1420 &&
  metrics.regions.navigation?.bottom === 1475 &&
  metrics.regions.footer?.top === 1488 &&
  metrics.regions.footer?.bottom === 1601 &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0169-desktop.png") });
await copyFile(reference, path.join(out, "0169-reference.png"));
const report = {
  mockup: "0169",
  lessonId: 112,
  route: "/lessons/algebra/112-simultaneous-linear-equations",
  objectModel:
    "selectable-two-equation-coefficient-system-determinant-solver-native-elimination-drag-generated-symbolic-steps-dynamic-dual-line-intersection-both-equation-verification-ordered-pair-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0169-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await Promise.race([
  browser.close().catch(() => undefined),
  new Promise((resolve) => setTimeout(resolve, 3000)),
]);
process.exit(passed ? 0 : 1);
