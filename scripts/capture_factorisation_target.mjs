import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0154-interactive-intermediate-expressions-and-manipulation-factorisation-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/97-factorisation";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1001, height: 1570 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0154");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-sum", "data-product", "data-correct-pair", "data-selected-pair", "data-pair-correct", "data-expression", "data-split", "data-factors", "data-check-value", "data-original-value", "data-factor-value", "data-equivalent", "data-stage", "data-tab", "data-dragging", "data-area-drops", "data-challenge", "data-challenge-pair", "data-challenge-answer", "data-challenge-correct", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Choose pair 1 and 6").click();
checks.wrongPair = await state();
await page.getByLabel("Choose pair 2 and 3").click();
checks.correctPair = await state();
await page.getByLabel("Product target").fill("12");
await page.getByLabel("Sum target").fill("7");
checks.editedQuadratic = await state();
await page.getByLabel("Check value").fill("3");
checks.editedCheck = await state();
await node.getByRole("button", { name: /Write factor form/ }).click();
checks.stageFour = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
await page.getByLabel("Drag squared term").dragTo(page.getByLabel("Drop square term"));
await page.getByLabel("Drag first split term").dragTo(page.getByLabel("Drop first-middle term"));
await page.getByLabel("Drag second split term").dragTo(page.getByLabel("Drop second-middle term"));
await page.getByLabel("Drag constant term").dragTo(page.getByLabel("Drop constant term"));
checks.areaBuilt = await state();
await node.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaTab = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practiceTab = await state();
await page.getByLabel("Practice factor pair").selectOption("1,10");
await page.getByLabel("Practice factor form").press("Enter");
checks.wrongPracticePair = await state();
await page.getByLabel("Practice factor pair").selectOption("5,2");
await page.getByLabel("Practice factor form").fill("(y + 4)(y + 3)");
await page.getByLabel("Practice factor form").press("Enter");
checks.wrongPracticeAnswer = await state();
await page.getByLabel("Practice factor form").fill("(y + 5)(y + 2)");
await page.getByLabel("Practice factor form").press("Enter");
checks.correctPractice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".factor97-page"), regions: { header: region(".factor97-header"), tabs: region(".factor97-tabs"), workspace: region(".factor97-workspace"), stages: region(".factor97-stages"), primary: region(".factor97-primary"), model: region(".factor97-model"), pairs: region(".factor97-pairs"), rectangle: region(".factor97-area-grid"), proof: region(".factor97-proof"), practice: region(".factor97-practice"), navigation: region(".factor97-navigation"), footer: region(".factor97-footer") } };
});
const passed =
  checks.initial.expression === "x² + 5x + 6" && checks.initial["correct-pair"] === "2,3" && checks.initial["selected-pair"] === "2,3" && checks.initial["pair-correct"] === "true" && checks.initial.factors === "(x + 2)(x + 3)" && checks.initial["original-value"] === "20" && checks.initial["factor-value"] === "20" && checks.initial.equivalent === "true" &&
  checks.wrongPair["selected-pair"] === "1,6" && checks.wrongPair["pair-correct"] === "false" && checks.wrongPair["factor-value"] === "24" && checks.wrongPair.equivalent === "false" &&
  checks.correctPair["selected-pair"] === "2,3" && checks.correctPair["pair-correct"] === "true" &&
  checks.editedQuadratic.product === "12" && checks.editedQuadratic.sum === "7" && checks.editedQuadratic["correct-pair"] === "3,4" && checks.editedQuadratic.expression === "x² + 7x + 12" && checks.editedQuadratic.factors === "(x + 3)(x + 4)" &&
  checks.editedCheck["check-value"] === "3" && checks.editedCheck["original-value"] === "42" && checks.editedCheck["factor-value"] === "42" && checks.editedCheck.equivalent === "true" && checks.stageFour.stage === "4" &&
  checks.areaBuilt["area-drops"] === "square:square|first-middle:first-middle|second-middle:second-middle|constant:constant" && checks.areaBuilt.stage === "3" &&
  checks.formulaTab.tab === "Formula" && checks.practiceTab.tab === "Practice" &&
  checks.wrongPracticePair["challenge-correct"] === "false" && checks.wrongPracticeAnswer["challenge-correct"] === "false" && checks.correctPractice["challenge-correct"] === "true" &&
  checks.restored.expression === "x² + 5x + 6" && checks.restored.factors === "(x + 2)(x + 3)" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0154-desktop.png") });
await copyFile(reference, path.join(out, "0154-reference.png"));
const report = { mockup: "0154", lessonId: 97, route: "/lessons/algebra/97-factorisation", objectModel: "editable-quadratic-factor-pair-search-draggable-reverse-area-expansion-substitution-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0154-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
