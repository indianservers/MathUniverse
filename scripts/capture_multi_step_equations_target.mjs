import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0165-interactive-intermediate-advanced-equations-and-inequalities-multi-step-equations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2252/lessons/algebra/108-multi-step-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1029, height: 1529 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0165");
await node.waitFor({ timeout: 600000 });
const attributes = ["problem", "problem-id", "coefficient", "constant", "rhs", "intermediate", "solution", "check-value", "step", "inverse", "dragging", "operation-drops", "both-operations-dropped", "invalid-drop", "practice-index", "practice-equation", "practice-answer", "practice-solution", "practice-correct", "step-guide", "nudge-open", "actions"];
const state = () => node.evaluate((element, names) => Object.fromEntries(names.map((name) => [name, element.getAttribute(`data-${name}`)])), attributes);
const checks = { initial: await state() };

const problem = page.getByLabel("Multi-step equation");
await problem.selectOption("three-x-plus-two");
checks.threeX = await state();
await problem.selectOption("four-x-minus-five");
checks.minusFive = await state();
await problem.selectOption("five-x-plus-four");
checks.fiveX = await state();
await problem.selectOption("two-x-plus-three");

const stepNav = page.locator(".multi108-workspace>header nav");
await stepNav.getByRole("button", { name: "Start", exact: true }).click();
checks.start = await state();
await stepNav.getByRole("button", { name: "1", exact: true }).click();
checks.stepOne = await state();
await stepNav.getByRole("button", { name: "2", exact: true }).click();
checks.stepTwo = await state();
await stepNav.getByRole("button", { name: "3", exact: true }).click();
checks.stepThree = await state();
await stepNav.getByRole("button", { name: "Result", exact: true }).click();
checks.result = await state();

await page.getByRole("button", { name: "Drag remove constant Subtract 3" }).dragTo(page.getByLabel("Remove constant drop target"), { targetPosition: { x: 3, y: 3 } });
checks.constantDrop = await state();
await page.getByRole("button", { name: "Drag split into 2 equal groups" }).dragTo(page.getByLabel("Equal groups drop target"), { targetPosition: { x: 3, y: 3 } });
checks.groupDrop = await state();
await page.getByRole("button", { name: /Check answer/ }).first().click();
checks.checkAction = await state();

const practiceAnswer = page.getByLabel("Multi-step practice answer");
await practiceAnswer.fill("5");
await page.getByRole("button", { name: "Check answer", exact: true }).last().click();
checks.practiceWrong = await state();
await practiceAnswer.fill("4");
await page.getByRole("button", { name: "Check answer", exact: true }).last().click();
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "Step guide", exact: true }).click();
checks.guideOff = await state();
await page.getByRole("button", { name: "Step guide", exact: true }).click();
await page.getByRole("button", { name: "Hide the steps", exact: true }).click();
checks.nudgeOff = await state();
await page.getByRole("button", { name: "Show me the steps", exact: true }).click();
await page.getByLabel("Multi-step practice equation").selectOption("1");
checks.practiceNext = await state();
await practiceAnswer.fill("9");
await page.getByRole("button", { name: "Check answer", exact: true }).last().click();
checks.practiceSecond = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".multi108-page"), regions: { intro: region(".multi108-intro"), workspace: region(".multi108-workspace"), grid: region(".multi108-workspace-grid"), model: region(".multi108-model"), side: region(".multi108-side"), practice: region(".multi108-practice"), navigation: region(".multi108-navigation") } };
});
const passed =
  checks.initial.problem === "2x + 3 = 11" && checks.initial.coefficient === "2" && checks.initial.constant === "3" && checks.initial.rhs === "11" && checks.initial.intermediate === "8" && checks.initial.solution === "4" && checks.initial["check-value"] === "11" && checks.initial.step === "3" && checks.initial.inverse === "Subtract 3" &&
  checks.threeX.problem === "3x + 2 = 14" && checks.threeX.intermediate === "12" && checks.threeX.solution === "4" && checks.minusFive.problem === "4x − 5 = 15" && checks.minusFive.intermediate === "20" && checks.minusFive.solution === "5" && checks.minusFive.inverse === "Add 5" && checks.fiveX.problem === "5x + 4 = 29" && checks.fiveX.intermediate === "25" && checks.fiveX.solution === "5" &&
  checks.start.step === "0" && checks.stepOne.step === "1" && checks.stepTwo.step === "2" && checks.stepThree.step === "3" && checks.result.step === "4" && checks.constantDrop["operation-drops"] === "constant" && checks.constantDrop.step === "1" && checks.groupDrop["operation-drops"] === "constant,groups" && checks.groupDrop["both-operations-dropped"] === "true" && checks.groupDrop.step === "2" && checks.groupDrop.dragging === "" && checks.checkAction.step === "3" &&
  checks.practiceWrong["practice-correct"] === "false" && checks.practiceCorrect["practice-correct"] === "true" && checks.guideOff["step-guide"] === "false" && checks.nudgeOff["nudge-open"] === "false" && checks.practiceNext["practice-index"] === "1" && checks.practiceNext["practice-equation"] === "2p − 6 = 12" && checks.practiceNext["practice-solution"] === "9" && checks.practiceSecond["practice-answer"] === "9" && checks.practiceSecond["practice-correct"] === "true" &&
  checks.reset.problem === "2x + 3 = 11" && checks.reset.step === "3" && checks.reset["operation-drops"] === "" && checks.reset["practice-index"] === "0" && checks.reset["practice-correct"] === "true" && checks.reloaded.solution === "4" && checks.reloaded.step === "3" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 1029 && metrics.document.height === 1529 && metrics.surface?.left === 230 && metrics.surface?.top === 110 && metrics.surface?.right === 1013 && metrics.surface?.bottom === 1514 && metrics.regions.intro?.bottom === 285 && metrics.regions.workspace?.top === 305 && metrics.regions.workspace?.bottom === 1092 && metrics.regions.practice?.top === 1105 && metrics.regions.practice?.bottom === 1454 && metrics.regions.navigation?.top === 1467 && metrics.regions.navigation?.bottom === 1514 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0165-desktop.png") });
await copyFile(reference, path.join(out, "0165-reference.png"));
const report = { mockup: "0165", lessonId: 108, route: "/lessons/algebra/108-multi-step-equations", objectModel: "selectable-linear-expression-balance-sequence-draggable-constant-removal-equal-group-division-ordered-inverse-operations-substitution-check-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0165-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
