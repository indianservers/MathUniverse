import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0155-interactive-intermediate-expressions-and-manipulation-algebraic-fractions-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/98-algebraic-fractions";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1024, height: 1536 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0155");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-preset", "data-numerator", "data-denominator", "data-common-factor", "data-simplified", "data-restriction", "data-check-value", "data-valid-check", "data-original-numerator-value", "data-denominator-value", "data-original-value", "data-simplified-value", "data-equivalent", "data-factor-enabled", "data-cancel-enabled", "data-restriction-enabled", "data-substitution-enabled", "data-tab", "data-dragging", "data-cancel-drops", "data-practice", "data-practice-answer", "data-practice-correct", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Choose expression").selectOption("difference-four");
checks.differenceFour = await state();
await page.getByLabel("Choose expression").selectOption("quadratic-six");
await page.getByLabel("Check value").fill("4");
checks.quadraticSix = await state();
await page.getByLabel("Check value").fill("-2");
checks.excludedValue = await state();
await page.getByRole("switch", { name: "Factor numerator" }).click();
await page.getByRole("switch", { name: "Cancel common factor" }).click();
await page.getByRole("switch", { name: "Show restriction" }).click();
await page.getByRole("switch", { name: "Check by substitution" }).click();
checks.stepsHidden = await state();
await page.getByRole("button", { name: "Reset all steps" }).click();
checks.reset = await state();
await page.getByLabel("Drag numerator common factor").dragTo(page.locator(".algfrac98-step-two"));
await page.getByLabel("Drag denominator factor").dragTo(page.locator(".algfrac98-step-two"));
checks.cancelDrops = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practiceTab = await state();
await page.getByLabel("Practice answer").fill("y + 2, y ≠ 3");
await page.getByLabel("Practice answer").press("Enter");
checks.wrongPractice = await state();
await page.getByLabel("Practice answer").fill("y + 3, y ≠ 3");
await page.getByLabel("Practice answer").press("Enter");
checks.correctPractice = await state();
await page.getByRole("button", { name: "New practice" }).click();
checks.nextPractice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".algfrac98-page"), regions: { intro: region(".algfrac98-intro"), tabs: region(".algfrac98-tabs"), layout: region(".algfrac98-layout"), left: region(".algfrac98-left"), expression: region(".algfrac98-expression"), stepOne: region(".algfrac98-step-one"), stepTwo: region(".algfrac98-step-two"), stepThree: region(".algfrac98-step-three"), proof: region(".algfrac98-proof"), warning: region(".algfrac98-warning"), controls: region(".algfrac98-controls"), result: region(".algfrac98-result"), practice: region(".algfrac98-practice"), navigation: region(".algfrac98-navigation"), footer: region(".algfrac98-footer") } };
});
const passed =
  checks.initial.numerator === "x² − 1" && checks.initial.denominator === "x − 1" && checks.initial.simplified === "x + 1" && checks.initial.restriction === "1" && checks.initial["original-numerator-value"] === "8" && checks.initial["denominator-value"] === "2" && checks.initial["original-value"] === "4" && checks.initial["simplified-value"] === "4" && checks.initial.equivalent === "true" &&
  checks.differenceFour.preset === "difference-four" && checks.differenceFour.numerator === "x² − 4" && checks.differenceFour.denominator === "x − 2" && checks.differenceFour.simplified === "x + 2" && checks.differenceFour.restriction === "2" && checks.differenceFour["original-value"] === "5" &&
  checks.quadraticSix.preset === "quadratic-six" && checks.quadraticSix.numerator === "x² + 5x + 6" && checks.quadraticSix.denominator === "x + 2" && checks.quadraticSix.simplified === "x + 3" && checks.quadraticSix.restriction === "-2" && checks.quadraticSix["check-value"] === "4" && checks.quadraticSix["original-value"] === "7" && checks.quadraticSix["simplified-value"] === "7" && checks.quadraticSix.equivalent === "true" &&
  checks.excludedValue["valid-check"] === "false" && checks.excludedValue["original-value"] === "undefined" && checks.excludedValue.equivalent === "false" &&
  checks.stepsHidden["factor-enabled"] === "false" && checks.stepsHidden["cancel-enabled"] === "false" && checks.stepsHidden["restriction-enabled"] === "false" && checks.stepsHidden["substitution-enabled"] === "false" &&
  checks.reset.preset === "difference-one" && checks.reset["factor-enabled"] === "true" && checks.reset["substitution-enabled"] === "true" &&
  checks.cancelDrops["cancel-drops"] === "numerator,denominator" && checks.cancelDrops["cancel-enabled"] === "true" && checks.practiceTab.tab === "Practice" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.nextPractice.practice === "1" && checks.nextPractice["practice-answer"] === "a + 2, a ≠ 2" && checks.nextPractice["practice-correct"] === "true" &&
  checks.restored.preset === "difference-one" && checks.restored.simplified === "x + 1" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0155-desktop.png") });
await copyFile(reference, path.join(out, "0155-reference.png"));
const report = { mockup: "0155", lessonId: 98, route: "/lessons/algebra/98-algebraic-fractions", objectModel: "selectable-rational-expression-draggable-common-factor-cancellation-domain-restriction-substitution-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0155-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
