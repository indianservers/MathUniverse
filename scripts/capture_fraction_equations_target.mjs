import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0166-interactive-intermediate-advanced-equations-and-inequalities-equations-with-fractions-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2252/lessons/algebra/109-equations-with-fractions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 995, height: 1581 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0166");
await node.waitFor({ timeout: 600000 });
const attributes = ["problem", "problem-id", "denominator", "lcd", "cleared-coefficient", "cleared-constant", "cleared-rhs", "solution", "check-fraction", "step", "multiplied-terms", "all-terms-multiplied", "dragging", "invalid-drop", "active-tab", "practice-index", "practice-equation", "practice-lcd", "practice-answer", "practice-solution", "practice-correct", "show-steps", "hint-open", "actions"];
const state = () => node.evaluate((element, names) => Object.fromEntries(names.map((name) => [name, element.getAttribute(`data-${name}`)])), attributes);
const checks = { initial: await state() };

const example = page.getByLabel("Fraction equation example");
await example.selectOption({ value: "1" });
await page.waitForFunction(() => document.querySelector('[data-testid="algebra-mockup-0166"]')?.getAttribute("data-problem-id") === "two-x-over-five-minus-one");
checks.twoX = await state();
await example.selectOption({ value: "2" });
await page.waitForFunction(() => document.querySelector('[data-testid="algebra-mockup-0166"]')?.getAttribute("data-problem-id") === "y-over-four-minus-one");
checks.yOverFour = await state();
await example.selectOption({ value: "3" });
await page.waitForFunction(() => document.querySelector('[data-testid="algebra-mockup-0166"]')?.getAttribute("data-problem-id") === "three-z-over-two-plus-four");
checks.threeZ = await state();
await example.selectOption({ value: "0" });
await page.waitForFunction(() => document.querySelector('[data-testid="algebra-mockup-0166"]')?.getAttribute("data-problem-id") === "x-over-three-plus-two");

const multiplier = page.getByRole("button", { name: "Drag LCD multiplier 3" });
await multiplier.dragTo(page.getByLabel("Fraction term multiplier target"), { targetPosition: { x: 4, y: 4 } });
checks.fractionDrop = await state();
await multiplier.dragTo(page.getByLabel("Constant term multiplier target"), { targetPosition: { x: 4, y: 4 } });
checks.constantDrop = await state();
await multiplier.dragTo(page.getByLabel("Right side multiplier target"), { targetPosition: { x: 4, y: 4 } });
checks.rhsDrop = await state();

await page.getByRole("button", { name: "Next Step", exact: true }).click();
checks.stepThree = await state();
await page.getByRole("button", { name: "Next Step", exact: true }).click();
checks.stepFour = await state();
await page.getByRole("button", { name: "Previous Step", exact: true }).click();
checks.previousStep = await state();

for (const tab of ["Learn", "Examples", "Practice", "Formula", "Know more", "Interact"]) {
  await page.getByRole("button", { name: tab, exact: true }).click();
  checks[`tab${tab.replace(" ", "")}`] = await state();
}

const practiceAnswer = page.getByLabel("Fraction practice answer");
await page.getByRole("button", { name: "2", exact: true }).last().click();
await practiceAnswer.fill("12");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceWrongLcd = await state();
await page.getByRole("button", { name: "4", exact: true }).last().click();
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceCorrect = await state();
await page.getByLabel("Show practice steps").check();
checks.stepsShown = await state();
await page.getByRole("button", { name: "Show Hint", exact: true }).click();
checks.hintShown = await state();
await page.getByRole("button", { name: "Try next", exact: true }).click();
checks.practiceNext = await state();
await practiceAnswer.fill("9");
await page.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceSecond = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".fraction109-page"), regions: { intro: region(".fraction109-intro"), tabs: region(".fraction109-tabs"), lab: region(".fraction109-lab"), original: region(".fraction109-stage.original"), cleared: region(".fraction109-stage.cleared"), solve: region(".fraction109-stage.solve"), verify: region(".fraction109-stage.verify"), practice: region(".fraction109-practice"), process: region(".fraction109-process"), navigation: region(".fraction109-navigation"), footer: region(".fraction109-footer") } };
});
const passed =
  checks.initial.problem === "x/3 + 2 = 5" && checks.initial.denominator === "3" && checks.initial.lcd === "3" && checks.initial["cleared-coefficient"] === "1" && checks.initial["cleared-constant"] === "6" && checks.initial["cleared-rhs"] === "15" && checks.initial.solution === "9" && checks.initial["check-fraction"] === "3" &&
  checks.twoX.problem === "2x/5 − 1 = 3" && checks.twoX["cleared-constant"] === "-5" && checks.twoX["cleared-rhs"] === "15" && checks.twoX.solution === "10" && checks.yOverFour.problem === "y/4 − 1 = 2" && checks.yOverFour.solution === "12" && checks.threeZ.problem === "3z/2 + 4 = 10" && checks.threeZ["cleared-constant"] === "8" && checks.threeZ["cleared-rhs"] === "20" && checks.threeZ.solution === "4" &&
  checks.fractionDrop["multiplied-terms"] === "fraction" && checks.constantDrop["multiplied-terms"] === "fraction,constant" && checks.rhsDrop["multiplied-terms"] === "fraction,constant,rhs" && checks.rhsDrop["all-terms-multiplied"] === "true" && checks.rhsDrop.dragging === "false" && checks.stepThree.step === "3" && checks.stepFour.step === "4" && checks.previousStep.step === "3" &&
  checks.tabLearn["active-tab"] === "Learn" && checks.tabExamples["active-tab"] === "Examples" && checks.tabPractice["active-tab"] === "Practice" && checks.tabFormula["active-tab"] === "Formula" && checks.tabKnowmore["active-tab"] === "Know more" && checks.tabInteract["active-tab"] === "Interact" &&
  checks.practiceWrongLcd["practice-correct"] === "false" && checks.practiceCorrect["practice-correct"] === "true" && checks.stepsShown["show-steps"] === "true" && checks.hintShown["hint-open"] === "true" && checks.practiceNext["practice-index"] === "1" && checks.practiceNext["practice-equation"] === "2p/3 + 1 = 7" && checks.practiceNext["practice-lcd"] === "3" && checks.practiceNext["practice-solution"] === "9" && checks.practiceSecond["practice-correct"] === "true" &&
  checks.reset.problem === "x/3 + 2 = 5" && checks.reset.step === "1" && checks.reset["multiplied-terms"] === "" && checks.reset["practice-answer"] === "" && checks.reloaded.problem === "x/3 + 2 = 5" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 995 && metrics.document.height === 1581 && metrics.surface?.left === 225 && metrics.surface?.top === 111 && metrics.surface?.right === 981 && metrics.surface?.bottom === 1574 && metrics.regions.intro?.bottom === 237 && metrics.regions.tabs?.top === 247 && metrics.regions.tabs?.bottom === 285 && metrics.regions.lab?.top === 295 && metrics.regions.lab?.bottom === 1084 && metrics.regions.original?.top === 356 && metrics.regions.original?.bottom === 636 && metrics.regions.cleared?.top === 641 && metrics.regions.cleared?.bottom === 755 && metrics.regions.solve?.top === 760 && metrics.regions.solve?.bottom === 901 && metrics.regions.verify?.top === 906 && metrics.regions.verify?.bottom === 1032 && metrics.regions.practice?.top === 1094 && metrics.regions.practice?.bottom === 1339 && metrics.regions.process?.top === 1349 && metrics.regions.process?.bottom === 1432 && metrics.regions.navigation?.top === 1441 && metrics.regions.navigation?.bottom === 1484 && metrics.regions.footer?.top === 1494 && metrics.regions.footer?.bottom === 1574 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0166-desktop.png") });
await copyFile(reference, path.join(out, "0166-reference.png"));
const report = { mockup: "0166", lessonId: 109, route: "/lessons/algebra/109-equations-with-fractions", objectModel: "selectable-fraction-equation-lcd-three-term-native-drag-clearing-simplification-original-substitution-check-lcd-and-answer-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0166-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
