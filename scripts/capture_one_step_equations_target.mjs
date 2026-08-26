import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0164-interactive-intermediate-advanced-equations-and-inequalities-one-step-equations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2252/lessons/algebra/107-one-step-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 994, height: 1582 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0164");
await node.waitFor({ timeout: 600000 });
const attributes = ["equation", "equation-id", "inverse", "solution", "check-value", "check-left", "check-right", "check-correct", "show-balance", "apply-both", "tab", "dragging", "operation-drops", "both-dropped", "invalid-drop", "guided-open", "notes-open", "practice-index", "practice-equation", "practice-answer", "practice-correct", "actions"];
const state = () => node.evaluate((element, names) => Object.fromEntries(names.map((name) => [name, element.getAttribute(`data-${name}`)])), attributes);
const checks = { initial: await state() };

const initialEquation = page.getByLabel("Initial one-step equation");
await initialEquation.selectOption("subtract-four");
checks.subtractFour = await state();
const checkValue = page.getByLabel("Check value for x");
await checkValue.fill("12");
await page.getByRole("button", { name: "Check solution", exact: true }).click();
checks.wrongCheck = await state();
await checkValue.fill("13");
await page.getByRole("button", { name: "Check solution", exact: true }).click();
checks.correctCheck = await state();
await initialEquation.selectOption("triple");
checks.triple = await state();
await initialEquation.selectOption("quarter");
checks.quarter = await state();
await initialEquation.selectOption("add-five");

await page.getByRole("switch", { name: "Show balance" }).click();
checks.balanceOff = await state();
await page.getByRole("switch", { name: "Show balance" }).click();
await page.getByRole("switch", { name: "Apply to both sides" }).click();
checks.applyOff = await state();
await page.getByRole("switch", { name: "Apply to both sides" }).click();

const operation = page.getByRole("button", { name: "Drag inverse operation Subtract 5" });
await operation.dragTo(page.getByLabel("Apply inverse operation to left side").first(), { targetPosition: { x: 3, y: 3 } });
checks.leftDrop = await state();
await operation.dragTo(page.getByLabel("Apply inverse operation to right side").first(), { targetPosition: { x: 3, y: 3 } });
checks.bothDrops = await state();

await page.getByRole("button", { name: "Guided Practice", exact: true }).click();
await page.getByRole("button", { name: "Notes", exact: true }).click();
await node.getByRole("button", { name: "Formulas", exact: true }).click();
checks.headerControls = await state();

const practiceAnswer = page.getByLabel("Practice one-step answer");
await practiceAnswer.fill("12");
await practiceAnswer.press("Tab");
checks.practiceWrong = await state();
await practiceAnswer.fill("13");
await practiceAnswer.press("Tab");
checks.practiceCorrect = await state();
await page.getByLabel("Practice equation").selectOption("1");
checks.practiceNext = await state();
await practiceAnswer.fill("9");
await practiceAnswer.press("Tab");
checks.practiceSecond = await state();

await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".oneStep107-page"), regions: { intro: region(".oneStep107-intro"), tabs: region(".oneStep107-tabs"), workspace: region(".oneStep107-workspace"), workspaceBody: region(".oneStep107-workspace-body"), balance: region(".oneStep107-balance-card"), steps: region(".oneStep107-steps"), controls: region(".oneStep107-controls"), info: region(".oneStep107-info"), practice: region(".oneStep107-practice"), navigation: region(".oneStep107-navigation"), footer: region(".oneStep107-footer") } };
});
const passed =
  checks.initial.equation === "x + 5 = 12" && checks.initial.inverse === "Subtract 5" && checks.initial.solution === "7" && checks.initial["check-left"] === "12" && checks.initial["check-right"] === "12" && checks.initial["check-correct"] === "true" &&
  checks.subtractFour.equation === "x − 4 = 9" && checks.subtractFour.inverse === "Add 4" && checks.subtractFour.solution === "13" && checks.subtractFour["check-left"] === "9" && checks.wrongCheck["check-left"] === "8" && checks.wrongCheck["check-right"] === "9" && checks.wrongCheck["check-correct"] === "false" && checks.correctCheck["check-correct"] === "true" &&
  checks.triple.equation === "3x = 18" && checks.triple.inverse === "Divide by 3" && checks.triple.solution === "6" && checks.triple["check-left"] === "18" && checks.quarter.equation === "x ÷ 4 = 5" && checks.quarter.inverse === "Multiply by 4" && checks.quarter.solution === "20" && checks.quarter["check-left"] === "5" &&
  checks.balanceOff["show-balance"] === "false" && checks.applyOff["apply-both"] === "false" && checks.leftDrop["operation-drops"] === "left" && checks.leftDrop["both-dropped"] === "false" && checks.bothDrops["operation-drops"] === "left,right" && checks.bothDrops["both-dropped"] === "true" && checks.bothDrops.dragging === "" &&
  checks.headerControls["guided-open"] === "true" && checks.headerControls["notes-open"] === "true" && checks.headerControls.tab === "Formulas" && checks.practiceWrong["practice-correct"] === "false" && checks.practiceCorrect["practice-correct"] === "true" && checks.practiceNext["practice-index"] === "1" && checks.practiceNext["practice-equation"] === "p + 6 = 15" && checks.practiceSecond["practice-answer"] === "9" && checks.practiceSecond["practice-correct"] === "true" &&
  checks.reloaded.equation === "x + 5 = 12" && checks.reloaded.solution === "7" && checks.reloaded["operation-drops"] === "" && checks.reloaded.tab === "Interact" && checks.reloaded["practice-index"] === "0" && checks.reloaded["practice-correct"] === "true" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 994 && metrics.document.height === 1582 && metrics.surface?.left === 224 && metrics.surface?.top === 100 && metrics.surface?.right === 979 && metrics.surface?.bottom === 1582 && metrics.regions.intro?.bottom === 253 && metrics.regions.tabs?.top === 265 && metrics.regions.tabs?.bottom === 319 && metrics.regions.workspace?.top === 332 && metrics.regions.workspace?.bottom === 863 && metrics.regions.controls?.top === 879 && metrics.regions.controls?.bottom === 969 && metrics.regions.info?.top === 986 && metrics.regions.info?.bottom === 1183 && metrics.regions.practice?.top === 1198 && metrics.regions.practice?.bottom === 1412 && metrics.regions.navigation?.top === 1428 && metrics.regions.navigation?.bottom === 1484 && metrics.regions.footer?.top === 1498 && metrics.regions.footer?.bottom === 1582 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0164-desktop.png") });
await copyFile(reference, path.join(out, "0164-reference.png"));
const report = { mockup: "0164", lessonId: 107, route: "/lessons/algebra/107-one-step-equations", objectModel: "selectable-one-step-equation-dynamic-balance-draggable-inverse-operation-both-sides-substitution-check-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0164-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
