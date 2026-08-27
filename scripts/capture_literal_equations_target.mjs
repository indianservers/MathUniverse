import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0167-interactive-intermediate-advanced-equations-and-inequalities-literal-equations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2252/lessons/algebra/110-literal-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 973, height: 1617 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0167");
await node.waitFor({ timeout: 600000 });
const attributes = ["formula-id", "formula", "subject", "result", "divisor", "restriction", "numeric-result", "check-left", "check-right", "check-correct", "operation-applied", "dragging", "invalid-drop", "active-tab", "language", "shared", "workspace-open", "expanded", "practice-index", "practice-formula", "practice-result", "practice-numeric", "practice-hint", "actions"];
const state = () => node.evaluate((element, names) => Object.fromEntries(names.map((name) => [name, element.getAttribute(`data-${name}`)])), attributes);
const waitFor = (name, value) => page.waitForFunction(([attribute, expected]) => document.querySelector('[data-testid="algebra-mockup-0167"]')?.getAttribute(`data-${attribute}`) === expected, [name, value]);
const checks = { initial: await state() };

const formula = page.getByLabel("Literal formula");
const subject = page.getByLabel("Literal equation subject");
await formula.selectOption("distance-rate-time");
await waitFor("formula-id", "distance-rate-time");
checks.distance = await state();
await subject.selectOption("r");
await waitFor("subject", "r");
checks.distanceRate = await state();
await formula.selectOption("simple-interest");
await waitFor("formula-id", "simple-interest");
checks.interest = await state();
await formula.selectOption("circumference");
await waitFor("formula-id", "circumference");
checks.circumference = await state();
await formula.selectOption("rectangle-area");
await waitFor("formula-id", "rectangle-area");

await page.getByRole("button", { name: "Drag inverse operation Divide by l" }).dragTo(page.getByLabel("Inverse operation drop target"), { targetPosition: { x: 8, y: 100 } });
checks.operationDrop = await state();
await subject.selectOption("l");
await waitFor("subject", "l");
checks.areaLength = await state();
await subject.selectOption("A");
await waitFor("subject", "A");
checks.areaSubject = await state();
await subject.selectOption("w");
await waitFor("subject", "w");

await page.getByLabel("Check value A").fill("30");
await page.getByLabel("Check value l").fill("5");
await page.getByRole("button", { name: "Check with values", exact: true }).click();
checks.changedValues = await state();

for (const tab of ["Explain", "Examples", "Formulas", "Know more", "Interaction + visualization"]) {
  await page.getByRole("button", { name: tab, exact: true }).click();
  await waitFor("active-tab", tab);
  checks[`tab${tab.replaceAll(" ", "").replace("+", "Plus")}`] = await state();
}

await page.getByLabel("Literal equations language").selectOption({ label: "Hindi (हिन्दी)" });
checks.language = await state();
await page.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await page.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspace = await state();
await page.getByRole("button", { name: "Expand formula workspace", exact: true }).click();
checks.expanded = await state();

await page.getByRole("button", { name: "Hide hint", exact: true }).click();
checks.practiceHintClosed = await state();
await page.getByRole("button", { name: "Show hint", exact: true }).click();
checks.practiceHint = await state();
await page.getByRole("button", { name: "New practice", exact: true }).click();
checks.practiceNext = await state();
await page.getByRole("button", { name: "Show hint", exact: true }).click();
checks.practiceSecondHint = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".literal110-page"), regions: { intro: region(".literal110-intro"), tabs: region(".literal110-tabs"), lab: region(".literal110-lab"), grid: region(".literal110-workspace-grid"), steps: region(".literal110-steps"), controls: region(".literal110-controls"), results: region(".literal110-results"), practice: region(".literal110-practice"), navigation: region(".literal110-navigation"), footer: region(".literal110-footer") } };
});
const passed =
  checks.initial["formula-id"] === "rectangle-area" && checks.initial.formula === "A = l w" && checks.initial.subject === "w" && checks.initial.result === "w = A / l" && checks.initial.divisor === "l" && checks.initial.restriction === "l ≠ 0" && checks.initial["numeric-result"] === "4" && checks.initial["check-left"] === "24" && checks.initial["check-right"] === "24" && checks.initial["check-correct"] === "true" &&
  checks.distance.formula === "d = r t" && checks.distance.subject === "t" && checks.distance.result === "t = d / r" && checks.distance.restriction === "r ≠ 0" && checks.distance["numeric-result"] === "2" && checks.distanceRate.result === "r = d / t" && checks.distanceRate.restriction === "t ≠ 0" && checks.distanceRate["numeric-result"] === "60" && checks.interest.formula === "I = P r t" && checks.interest.result === "r = I / (P t)" && checks.interest["numeric-result"] === "0.6" && checks.circumference.formula === "C = 2π r" && checks.circumference.result === "r = C / (2π)" && checks.circumference["numeric-result"] === "5" &&
  checks.operationDrop["operation-applied"] === "true" && checks.operationDrop.dragging === "false" && checks.areaLength.result === "l = A / w" && checks.areaLength.restriction === "w ≠ 0" && checks.areaLength["numeric-result"] === "6" && checks.areaSubject.result === "A = l w" && checks.areaSubject.divisor === "none" && checks.areaSubject.restriction === "none" && checks.areaSubject["numeric-result"] === "24" &&
  checks.changedValues["numeric-result"] === "6" && checks.changedValues["check-left"] === "30" && checks.changedValues["check-right"] === "30" && checks.changedValues["check-correct"] === "true" &&
  checks.tabExplain["active-tab"] === "Explain" && checks.tabExamples["active-tab"] === "Examples" && checks.tabFormulas["active-tab"] === "Formulas" && checks.tabKnowmore["active-tab"] === "Know more" && checks.tabInteractionPlusvisualization["active-tab"] === "Interaction + visualization" && checks.language.language === "Hindi (हिन्दी)" && checks.shared.shared === "true" && checks.workspace["workspace-open"] === "true" && checks.expanded.expanded === "true" &&
  checks.practiceHintClosed["practice-hint"] === "false" && checks.practiceHint["practice-hint"] === "true" && checks.practiceNext["practice-index"] === "1" && checks.practiceNext["practice-formula"] === "V = l w h" && checks.practiceNext["practice-result"] === "h = V / (l w)" && checks.practiceNext["practice-numeric"] === "6" && checks.practiceSecondHint["practice-hint"] === "true" &&
  checks.reset["formula-id"] === "rectangle-area" && checks.reset.subject === "w" && checks.reset["numeric-result"] === "4" && checks.reset["operation-applied"] === "false" && checks.reset.language === "English (English)" && checks.reset.shared === "false" && checks.reset["practice-index"] === "0" && checks.reloaded.result === "w = A / l" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 973 && metrics.document.height === 1617 && metrics.surface?.left === 222 && metrics.surface?.top === 94 && metrics.surface?.right === 958 && metrics.surface?.bottom === 1614 && metrics.regions.intro?.bottom === 323 && metrics.regions.tabs?.top === 332 && metrics.regions.tabs?.bottom === 380 && metrics.regions.lab?.top === 389 && metrics.regions.lab?.bottom === 1085 && metrics.regions.practice?.top === 1094 && metrics.regions.practice?.bottom === 1437 && metrics.regions.navigation?.top === 1445 && metrics.regions.navigation?.bottom === 1488 && metrics.regions.footer?.top === 1504 && metrics.regions.footer?.bottom === 1614 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0167-desktop.png") });
await copyFile(reference, path.join(out, "0167-reference.png"));
const report = { mockup: "0167", lessonId: 110, route: "/lessons/algebra/110-literal-equations", objectModel: "selectable-literal-formula-target-subject-native-inverse-operation-drag-symbolic-isolation-restriction-tracking-numeric-substitution-generated-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0167-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
