import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0160-interactive-intermediate-expressions-and-manipulation-synthetic-division-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2251/lessons/algebra/103-synthetic-division";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 989, height: 1591 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0160");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-polynomial", "data-polynomial-valid", "data-divisor", "data-divisor-valid", "data-synthetic-number", "data-coefficients", "data-products", "data-sums", "data-quotient", "data-remainder", "data-expansion-verified", "data-show-coefficients", "data-show-arrows", "data-check-expansion", "data-stage", "data-tab", "data-dragging", "data-synthetic-drops", "data-invalid-drop", "data-practice-index", "data-practice-products", "data-practice-sums", "data-practice-quotient", "data-practice-remainder", "data-practice-correct", "data-show-solution", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Polynomial P of x", { exact: true }).fill("x³ − 4x + 3");
await page.getByLabel("Linear divisor", { exact: true }).fill("x − 1");
checks.missingPower = await state();
await page.getByLabel("Linear divisor", { exact: true }).fill("x² + 1");
checks.invalidDivisor = await state();
await page.getByLabel("Linear divisor", { exact: true }).fill("x − 1");
await page.getByRole("switch", { name: "Show coefficient row" }).click();
checks.coefficientsHidden = await state();
await page.getByRole("switch", { name: "Show coefficient row" }).click();
await page.getByRole("switch", { name: "Show multiply/add arrows" }).click();
checks.arrowsHidden = await state();
await page.getByRole("switch", { name: "Show multiply/add arrows" }).click();
await page.getByRole("switch", { name: "Check by expansion" }).click();
checks.expansionHidden = await state();
await page.getByRole("switch", { name: "Check by expansion" }).click();
await page.getByRole("button", { name: "Animate steps", exact: true }).click();
checks.animationStarted = await state();
await page.waitForFunction(() => document.querySelector('[data-testid="algebra-mockup-0160"]')?.getAttribute("data-stage") === "5");
checks.animationComplete = await state();

await page.getByLabel("Polynomial P of x", { exact: true }).fill("x² + 5x + 6");
await page.getByLabel("Linear divisor", { exact: true }).fill("x + 2");
await page.getByRole("button", { name: "Drag synthetic number", exact: true }).dragTo(page.getByLabel("Synthetic number drop target", { exact: true }));
checks.syntheticDrop = await state();

const fill = async (label, value) => page.getByLabel(label, { exact: true }).fill(String(value));
await fill("Practice product 1", -3);
await fill("Practice product 2", -12);
await fill("Practice sum 0", 1);
await fill("Practice sum 1", 4);
await fill("Practice sum 2", 1);
await fill("Practice quotient coefficient 0", 1);
await fill("Practice quotient coefficient 1", 4);
await fill("Practice remainder", 1);
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.wrongPractice = await state();
await fill("Practice sum 2", 0);
await fill("Practice remainder", 0);
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.correctPractice = await state();
await page.getByRole("button", { name: "New problem", exact: true }).click();
checks.nextPractice = await state();
await page.getByRole("button", { name: "Show solution", exact: true }).click();
checks.secondSolution = await state();
await node.getByRole("button", { name: "Formulas", exact: true }).click();
checks.formulas = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".synthetic103-page"), regions: { intro: region(".synthetic103-intro"), tabs: region(".synthetic103-tabs"), controls: region(".synthetic103-controls"), workspace: region(".synthetic103-workspace"), method: region(".synthetic103-method"), table: region(".synthetic103-table"), answer: region(".synthetic103-answer"), result: region(".synthetic103-result-line"), proof: region(".synthetic103-proof"), practice: region(".synthetic103-practice"), practiceTable: region(".synthetic103-practice-table"), navigation: region(".synthetic103-navigation"), footer: region(".synthetic103-footer") } };
});
const passed =
  checks.initial.polynomial === "x² + 5x + 6" && checks.initial["polynomial-valid"] === "true" && checks.initial.divisor === "x + 2" && checks.initial["synthetic-number"] === "-2" && checks.initial.coefficients === "1,5,6" && checks.initial.products === "0,-2,-6" && checks.initial.sums === "1,3,0" && checks.initial.quotient === "x + 3" && checks.initial.remainder === "0" && checks.initial["expansion-verified"] === "true" &&
  checks.missingPower.coefficients === "1,0,-4,3" && checks.missingPower["synthetic-number"] === "1" && checks.missingPower.products === "0,1,1,-3" && checks.missingPower.sums === "1,1,-3,0" && checks.missingPower.quotient === "x² + x − 3" && checks.missingPower.remainder === "0" && checks.missingPower["expansion-verified"] === "true" &&
  checks.invalidDivisor["divisor-valid"] === "false" && checks.invalidDivisor["expansion-verified"] === "false" && checks.coefficientsHidden["show-coefficients"] === "false" && checks.arrowsHidden["show-arrows"] === "false" && checks.expansionHidden["check-expansion"] === "false" && checks.animationStarted.stage === "0" && checks.animationComplete.stage === "5" &&
  checks.syntheticDrop["synthetic-drops"] === "1" && checks.syntheticDrop.dragging === "" && checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.correctPractice["practice-products"] === "-3,-12" && checks.correctPractice["practice-sums"] === "1,4,0" && checks.correctPractice["practice-quotient"] === "1,4" && checks.correctPractice["practice-remainder"] === "0" &&
  checks.nextPractice["practice-index"] === "1" && checks.nextPractice["practice-products"] === "NaN,NaN,NaN" && checks.secondSolution["practice-products"] === "1,-1,-6" && checks.secondSolution["practice-sums"] === "1,-1,-6,0" && checks.secondSolution["practice-quotient"] === "1,-1,-6" && checks.secondSolution["practice-remainder"] === "0" && checks.secondSolution["practice-correct"] === "true" && checks.secondSolution["show-solution"] === "true" &&
  checks.formulas.tab === "Formulas" && checks.reset.polynomial === "x² + 5x + 6" && checks.reset.divisor === "x + 2" && checks.reset["practice-index"] === "0" && checks.reset["practice-correct"] === "false" && checks.reloaded.quotient === "x + 3" && checks.reloaded.remainder === "0" && checks.reloaded.tab === "Interaction + Visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 989 && metrics.document.height === 1591 && metrics.surface?.left === 226 && metrics.surface?.top === 99 && metrics.surface?.right === 973 && metrics.surface?.bottom === 1591 && metrics.regions.table?.left === 396 && metrics.regions.table?.top === 576 && metrics.regions.table?.right === 821 && metrics.regions.table?.bottom === 852 && metrics.regions.proof?.top === 941 && metrics.regions.practice?.top === 1121 && metrics.regions.practice?.bottom === 1438 && metrics.regions.footer?.bottom === 1591 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0160-desktop.png") });
await copyFile(reference, path.join(out, "0160-reference.png"));
const report = { mockup: "0160", lessonId: 103, route: "/lessons/algebra/103-synthetic-division", objectModel: "editable-polynomial-coefficient-horner-synthetic-number-draggable-table-quotient-remainder-expansion-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0160-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
