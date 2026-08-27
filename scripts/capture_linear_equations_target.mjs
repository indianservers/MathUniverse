import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0168-interactive-intermediate-advanced-equations-and-inequalities-linear-equations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2252/lessons/algebra/111-linear-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 997, height: 1577 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0168");
await node.waitFor({ timeout: 600000 });
const attributes = ["problem", "problem-id", "a", "b", "c", "intermediate", "solution", "check-value", "show-algebra", "show-graph", "checked", "operation-drops", "all-operations-dropped", "dragging-operation", "invalid-drop", "probe-x", "probe-y", "probe-dragging", "probe-on-target", "active-tab", "language", "shared", "workspace-open", "practice-index", "practice-equation", "practice-answer", "practice-solution", "practice-correct", "actions"];
const state = () => node.evaluate((element, names) => Object.fromEntries(names.map((name) => [name, element.getAttribute(`data-${name}`)])), attributes);
const waitFor = (name, value) => page.waitForFunction(([attribute, expected]) => document.querySelector('[data-testid="algebra-mockup-0168"]')?.getAttribute(`data-${attribute}`) === expected, [name, value]);
const checks = { initial: await state() };

const equation = page.getByLabel("Linear equation", { exact: true });
await equation.selectOption("three-x-minus-two");
await waitFor("problem-id", "three-x-minus-two");
checks.threeX = await state();
await equation.selectOption("two-x-plus-five");
await waitFor("problem-id", "two-x-plus-five");
checks.twoX = await state();
await equation.selectOption("negative-two-x-plus-seven");
await waitFor("problem-id", "negative-two-x-plus-seven");
checks.negativeX = await state();
await equation.selectOption("four-x-plus-one");
await waitFor("problem-id", "four-x-plus-one");

await page.getByRole("button", { name: "Drag constant operation Subtract 1" }).dragTo(page.getByLabel("Constant operation drop target"), { targetPosition: { x: 5, y: 5 } });
checks.constantDrop = await state();
await page.getByRole("button", { name: "Drag coefficient operation Divide by 4" }).dragTo(page.getByLabel("Coefficient operation drop target"), { targetPosition: { x: 5, y: 5 } });
checks.coefficientDrop = await state();

await page.getByLabel("Show linear algebra").uncheck();
checks.algebraHidden = await state();
await page.getByLabel("Show linear algebra").check();
await page.getByLabel("Show linear graph").uncheck();
checks.graphHidden = await state();
await page.getByLabel("Show linear graph").check();

const probe = page.getByLabel("Drag x-value probe");
await probe.focus();
await probe.press("ArrowLeft");
await probe.press("ArrowLeft");
checks.probeKeyboard = await state();
const probeBox = await probe.boundingBox();
if (probeBox) {
  await page.mouse.move(probeBox.x + probeBox.width / 2, probeBox.y + probeBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(probeBox.x - 55, probeBox.y + probeBox.height / 2, { steps: 5 });
  await page.mouse.up();
}
checks.probeDrag = await state();
await page.getByRole("button", { name: "Check solution", exact: true }).click();
checks.solutionCheck = await state();

const answer = page.getByLabel("Linear practice answer");
await answer.fill("5");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceWrong = await state();
await answer.fill("7");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceCorrect = await state();

for (const tab of ["Explain", "Examples", "Practice", "Formulas", "Know more", "Interact"]) {
  await page.getByRole("button", { name: tab, exact: true }).click();
  await waitFor("active-tab", tab);
  checks[`tab${tab.replaceAll(" ", "")}`] = await state();
}
await answer.fill("5");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceSecond = await state();

await page.getByLabel("Linear equations language").selectOption({ label: "Hindi (हिन्दी)" });
checks.language = await state();
await page.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await page.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspace = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".linear111-page"), regions: { intro: region(".linear111-intro"), tabs: region(".linear111-tabs"), workspace: region(".linear111-workspace"), algebra: region(".linear111-algebra"), graph: region(".linear111-graph"), plot: region(".linear111-plot"), insights: region(".linear111-insights"), practice: region(".linear111-practice"), navigation: region(".linear111-navigation"), footer: region(".linear111-footer") } };
});
const passed =
  checks.initial.problem === "4x + 1 = 13" && checks.initial.a === "4" && checks.initial.b === "1" && checks.initial.c === "13" && checks.initial.intermediate === "12" && checks.initial.solution === "3" && checks.initial["check-value"] === "13" && checks.initial["probe-x"] === "3" && checks.initial["probe-y"] === "13" && checks.initial["probe-on-target"] === "true" &&
  checks.threeX.problem === "3x − 2 = 10" && checks.threeX.intermediate === "12" && checks.threeX.solution === "4" && checks.twoX.problem === "2x + 5 = 17" && checks.twoX.intermediate === "12" && checks.twoX.solution === "6" && checks.negativeX.problem === "-2x + 7 = 1" && checks.negativeX.intermediate === "-6" && checks.negativeX.solution === "3" &&
  checks.constantDrop["operation-drops"] === "constant" && checks.coefficientDrop["operation-drops"] === "constant,coefficient" && checks.coefficientDrop["all-operations-dropped"] === "true" && checks.coefficientDrop["dragging-operation"] === "" && checks.algebraHidden["show-algebra"] === "false" && checks.graphHidden["show-graph"] === "false" && Number(checks.probeKeyboard["probe-x"]) < 3 && checks.probeKeyboard["probe-on-target"] === "false" && checks.probeDrag["probe-dragging"] === "false" && Number(checks.probeDrag["probe-x"]) !== 3 && checks.solutionCheck["probe-x"] === "3" && checks.solutionCheck["probe-on-target"] === "true" && checks.solutionCheck.checked === "true" &&
  checks.practiceWrong["practice-correct"] === "false" && checks.practiceCorrect["practice-correct"] === "true" && checks.tabExplain["active-tab"] === "Explain" && checks.tabExamples["active-tab"] === "Examples" && checks.tabPractice["active-tab"] === "Practice" && checks.tabFormulas["active-tab"] === "Formulas" && checks.tabKnowmore["active-tab"] === "Know more" && checks.tabInteract["active-tab"] === "Interact" && checks.practiceSecond["practice-index"] === "1" && checks.practiceSecond["practice-equation"] === "3p + 4 = 19" && checks.practiceSecond["practice-solution"] === "5" && checks.practiceSecond["practice-correct"] === "true" && checks.language.language === "Hindi (हिन्दी)" && checks.shared.shared === "true" && checks.workspace["workspace-open"] === "true" &&
  checks.reset.problem === "4x + 1 = 13" && checks.reset["show-algebra"] === "true" && checks.reset["show-graph"] === "true" && checks.reset["operation-drops"] === "" && checks.reset["practice-index"] === "0" && checks.reset["practice-correct"] === "true" && checks.reloaded.solution === "3" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 997 && metrics.document.height === 1577 && metrics.surface?.left === 223 && metrics.surface?.top === 102 && metrics.surface?.right === 976 && metrics.surface?.bottom === 1577 && metrics.regions.intro?.bottom === 338 && metrics.regions.tabs?.top === 349 && metrics.regions.tabs?.bottom === 394 && metrics.regions.workspace?.top === 402 && metrics.regions.workspace?.bottom === 1043 && metrics.regions.insights?.top === 1050 && metrics.regions.insights?.bottom === 1187 && metrics.regions.practice?.top === 1194 && metrics.regions.practice?.bottom === 1415 && metrics.regions.navigation?.top === 1424 && metrics.regions.navigation?.bottom === 1471 && metrics.regions.footer?.top === 1480 && metrics.regions.footer?.bottom === 1577 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0168-desktop.png") });
await copyFile(reference, path.join(out, "0168-reference.png"));
const report = { mockup: "0168", lessonId: 111, route: "/lessons/algebra/111-linear-equations", objectModel: "selectable-first-degree-equation-inverse-operation-native-drag-balance-table-dynamic-line-target-intersection-pointer-probe-substitution-check-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0168-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
