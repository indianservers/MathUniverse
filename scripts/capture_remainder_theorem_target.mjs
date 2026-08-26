import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0161-interactive-intermediate-expressions-and-manipulation-remainder-theorem-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2251/lessons/algebra/104-remainder-theorem";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 995, height: 1580 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0161");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-polynomial", "data-polynomial-valid", "data-divisor", "data-divisor-valid", "data-divisor-root", "data-value-a", "data-evaluated", "data-products", "data-sums", "data-quotient", "data-remainder", "data-agree", "data-identity-verified", "data-substitute-a", "data-show-division", "data-check-reconstruction", "data-tab", "data-dragging", "data-value-drops", "data-invalid-drop", "data-practice-index", "data-practice-evaluated", "data-practice-products", "data-practice-sums", "data-practice-quotient", "data-practice-remainder", "data-practice-answer", "data-practice-correct", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Value a", { exact: true }).fill("-1");
checks.wrongA = await state();
await page.getByLabel("Value a", { exact: true }).fill("1");
await page.getByRole("button", { name: "Drag value a", exact: true }).dragTo(page.getByLabel("Evaluation value drop target", { exact: true }), { targetPosition: { x: 3, y: 3 } });
checks.valueDrop = await state();
await page.getByLabel("Polynomial f of x", { exact: true }).fill("x³ − 4x + 3");
checks.missingPower = await state();
await page.getByLabel("Remainder divisor", { exact: true }).fill("x² + 1");
checks.invalidDivisor = await state();
await page.getByLabel("Remainder divisor", { exact: true }).fill("x − 1");
await page.getByRole("switch", { name: "Substitute a" }).click();
checks.substitutionHidden = await state();
await page.getByRole("switch", { name: "Substitute a" }).click();
await page.getByRole("switch", { name: "Show division row" }).click();
checks.divisionHidden = await state();
await page.getByRole("switch", { name: "Show division row" }).click();
await page.getByRole("switch", { name: "Check reconstruction" }).click();
checks.reconstructionHidden = await state();
await page.getByRole("switch", { name: "Check reconstruction" }).click();

await page.getByLabel("Practice remainder answer", { exact: true }).fill("-2");
await page.getByRole("button", { name: "Check my work", exact: true }).click();
checks.wrongPractice = await state();
await page.getByLabel("Practice remainder answer", { exact: true }).fill("-3");
await page.getByRole("button", { name: "Check my work", exact: true }).click();
checks.correctPractice = await state();
await page.getByLabel("Practice a", { exact: true }).fill("-2");
await page.getByRole("button", { name: "Check my work", exact: true }).click();
checks.practiceWrongA = await state();
await page.getByRole("button", { name: "New problem", exact: true }).click();
checks.nextPractice = await state();
await page.getByLabel("Practice remainder answer", { exact: true }).fill("0");
await page.getByRole("button", { name: "Check my work", exact: true }).click();
checks.secondPractice = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practiceTab = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".remainder104-page"), regions: { intro: region(".remainder104-intro"), tabs: region(".remainder104-tabs"), workspace: region(".remainder104-workspace"), methods: region(".remainder104-methods"), evaluate: region(".remainder104-evaluate"), division: region(".remainder104-division"), agreement: region(".remainder104-agreement"), reconstruction: region(".remainder104-reconstruction"), warning: region(".remainder104-warning"), practice: region(".remainder104-practice"), navigation: region(".remainder104-navigation"), footer: region(".remainder104-footer") } };
});
const passed =
  checks.initial.polynomial === "x² + 3x + 2" && checks.initial["polynomial-valid"] === "true" && checks.initial.divisor === "x − 1" && checks.initial["divisor-root"] === "1" && checks.initial["value-a"] === "1" && checks.initial.evaluated === "6" && checks.initial.products === "0,1,4" && checks.initial.sums === "1,4,6" && checks.initial.quotient === "x + 4" && checks.initial.remainder === "6" && checks.initial.agree === "true" && checks.initial["identity-verified"] === "true" &&
  checks.wrongA.evaluated === "0" && checks.wrongA.remainder === "6" && checks.wrongA.agree === "false" && checks.valueDrop["value-drops"] === "1" && checks.valueDrop.dragging === "" &&
  checks.missingPower.polynomial === "x³ − 4x + 3" && checks.missingPower.evaluated === "0" && checks.missingPower.products === "0,1,1,-3" && checks.missingPower.sums === "1,1,-3,0" && checks.missingPower.quotient === "x² + x − 3" && checks.missingPower.remainder === "0" && checks.missingPower.agree === "true" && checks.missingPower["identity-verified"] === "true" &&
  checks.invalidDivisor["divisor-valid"] === "false" && checks.invalidDivisor.agree === "false" && checks.invalidDivisor["identity-verified"] === "false" && checks.substitutionHidden["substitute-a"] === "false" && checks.divisionHidden["show-division"] === "false" && checks.reconstructionHidden["check-reconstruction"] === "false" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.correctPractice["practice-evaluated"] === "-3" && checks.correctPractice["practice-quotient"] === "x − 2" && checks.correctPractice["practice-remainder"] === "-3" && checks.practiceWrongA["practice-evaluated"] === "13" && checks.practiceWrongA["practice-correct"] === "false" &&
  checks.nextPractice["practice-index"] === "1" && checks.nextPractice["practice-evaluated"] === "0" && checks.nextPractice["practice-products"] === "0,-1,0,4" && checks.nextPractice["practice-sums"] === "1,0,-4,0" && checks.nextPractice["practice-quotient"] === "x² − 4" && checks.nextPractice["practice-remainder"] === "0" && checks.nextPractice["practice-answer"] === "1" && checks.secondPractice["practice-answer"] === "0" && checks.secondPractice["practice-correct"] === "true" &&
  checks.practiceTab.tab === "Practice" && checks.reset.polynomial === "x² + 3x + 2" && checks.reset.divisor === "x − 1" && checks.reset.evaluated === "6" && checks.reset["practice-index"] === "0" && checks.reset["practice-correct"] === "true" && checks.reloaded.quotient === "x + 4" && checks.reloaded.remainder === "6" && checks.reloaded.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 995 && metrics.document.height === 1580 && metrics.surface?.left === 229 && metrics.surface?.top === 99 && metrics.surface?.right === 975 && metrics.surface?.bottom === 1580 && metrics.regions.workspace?.top === 344 && metrics.regions.workspace?.bottom === 1384 && metrics.regions.practice?.top === 1099 && metrics.regions.practice?.bottom === 1385 && metrics.regions.footer?.bottom === 1580 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0161-desktop.png") });
await copyFile(reference, path.join(out, "0161-reference.png"));
const report = { mockup: "0161", lessonId: 104, route: "/lessons/algebra/104-remainder-theorem", objectModel: "editable-polynomial-independent-evaluation-synthetic-division-draggable-a-remainder-agreement-reconstruction-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0161-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
