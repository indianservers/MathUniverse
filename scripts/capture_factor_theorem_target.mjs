import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0162-interactive-intermediate-expressions-and-manipulation-factor-theorem-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2251/lessons/algebra/105-factor-theorem";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1024, height: 1536 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0162");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-polynomial", "data-polynomial-valid", "data-factor", "data-factor-valid", "data-factor-root", "data-test-value", "data-evaluated", "data-products", "data-sums", "data-quotient", "data-remainder", "data-is-factor", "data-other-root", "data-meter", "data-substitute", "data-check-zero", "data-reveal-pair", "data-tab", "data-dragging", "data-factor-drops", "data-value-drops", "data-invalid-drop", "data-practice-selected", "data-practice-value", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Candidate factor", { exact: true }).fill("x − 2");
checks.secondFactor = await state();
await page.getByLabel("Factor test value", { exact: true }).fill("0");
checks.mismatchedValue = await state();
await page.getByLabel("Candidate factor", { exact: true }).fill("x² − 1");
checks.invalidFactor = await state();
await page.getByLabel("Candidate factor", { exact: true }).fill("x − 1");
await page.getByRole("button", { name: "Drag candidate factor", exact: true }).dragTo(page.getByLabel("Factor extraction drop target", { exact: true }), { targetPosition: { x: 3, y: 3 } });
checks.factorDrop = await state();
await page.getByRole("button", { name: "Drag extracted a", exact: true }).dragTo(page.getByLabel("Substitution value drop target", { exact: true }), { targetPosition: { x: 3, y: 3 } });
checks.valueDrop = await state();
await page.getByLabel("Factor theorem polynomial", { exact: true }).fill("x³ − 4x");
await page.getByLabel("Candidate factor", { exact: true }).fill("x − 2");
checks.missingPowerCubic = await state();
await page.getByRole("switch", { name: "Substitute" }).click();
checks.substituteOff = await state();
await page.getByRole("switch", { name: "Substitute" }).click();
await page.getByRole("switch", { name: "Check zero" }).click();
checks.zeroOff = await state();
await page.getByRole("switch", { name: "Check zero" }).click();
await page.getByRole("switch", { name: "Reveal factor pair" }).click();
checks.pairOff = await state();
await page.getByRole("switch", { name: "Reveal factor pair" }).click();

await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "New problem", exact: true }).click();
checks.nextProblem = await state();
await page.getByRole("button", { name: "New problem", exact: true }).click();
checks.thirdProblem = await state();
await page.getByRole("button", { name: /Test x − 4/ }).click();
checks.nonFactorPractice = await state();
await page.getByRole("button", { name: /Test x − 3/ }).click();
checks.factorPractice = await state();
await node.getByRole("button", { name: /^Formulas/ }).click();
checks.formulas = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".factor105-page"), regions: { intro: region(".factor105-intro"), tabs: region(".factor105-tabs"), station: region(".factor105-station"), inputs: region(".factor105-inputs"), pipeline: region(".factor105-pipeline"), test: region(".factor105-test"), controls: region(".factor105-controls"), synthetic: region(".factor105-synthetic"), practice: region(".factor105-practice"), warning: region(".factor105-warning"), navigation: region(".factor105-navigation"), footer: region(".factor105-footer") } };
});
const passed =
  checks.initial.polynomial === "x² − 3x + 2" && checks.initial.factor === "x − 1" && checks.initial["factor-root"] === "1" && checks.initial["test-value"] === "1" && checks.initial.evaluated === "0" && checks.initial.products === "0,1,-2" && checks.initial.sums === "1,-2,0" && checks.initial.quotient === "x − 2" && checks.initial.remainder === "0" && checks.initial["is-factor"] === "true" && checks.initial["other-root"] === "2" && checks.initial.meter === "50" &&
  checks.secondFactor["factor-root"] === "2" && checks.secondFactor["test-value"] === "2" && checks.secondFactor.evaluated === "0" && checks.secondFactor.quotient === "x − 1" && checks.secondFactor["other-root"] === "1" && checks.secondFactor["is-factor"] === "true" &&
  checks.mismatchedValue.evaluated === "2" && checks.mismatchedValue.remainder === "0" && checks.mismatchedValue["is-factor"] === "false" && checks.mismatchedValue.meter === "60" && checks.invalidFactor["factor-valid"] === "false" && checks.invalidFactor["is-factor"] === "false" &&
  checks.factorDrop["factor-drops"] === "1" && checks.valueDrop["value-drops"] === "1" && checks.valueDrop.dragging === "" &&
  checks.missingPowerCubic.polynomial === "x³ − 4x" && checks.missingPowerCubic.products === "0,2,4,0" && checks.missingPowerCubic.sums === "1,2,0,0" && checks.missingPowerCubic.quotient === "x² + 2x" && checks.missingPowerCubic.remainder === "0" && checks.missingPowerCubic["is-factor"] === "true" &&
  checks.substituteOff.substitute === "false" && checks.zeroOff["check-zero"] === "false" && checks.pairOff["reveal-pair"] === "false" &&
  checks.nextProblem.polynomial === "x² − 5x + 6" && checks.nextProblem.factor === "x − 2" && checks.nextProblem["factor-root"] === "2" && checks.nextProblem.quotient === "x − 3" && checks.nextProblem["other-root"] === "3" && checks.nextProblem["is-factor"] === "true" && checks.thirdProblem.polynomial === "x² + x − 6" && checks.thirdProblem.factor === "x + 3" && checks.thirdProblem["factor-root"] === "-3" && checks.thirdProblem.quotient === "x − 2" && checks.thirdProblem["other-root"] === "2" && checks.thirdProblem["is-factor"] === "true" &&
  checks.nonFactorPractice["practice-selected"] === "4" && checks.nonFactorPractice["practice-value"] === "2" && checks.factorPractice["practice-selected"] === "3" && checks.factorPractice["practice-value"] === "0" && checks.formulas.tab === "Formulas" &&
  checks.reset.polynomial === "x² − 3x + 2" && checks.reset.factor === "x − 1" && checks.reset["is-factor"] === "true" && checks.reset["factor-drops"] === "0" && checks.reset["value-drops"] === "0" && checks.reloaded.quotient === "x − 2" && checks.reloaded.remainder === "0" && checks.reloaded.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 1024 && metrics.document.height === 1536 && metrics.surface?.left === 225 && metrics.surface?.top === 101 && metrics.surface?.right === 1009 && metrics.surface?.bottom === 1536 && metrics.regions.station?.top === 344 && metrics.regions.station?.bottom === 1364 && metrics.regions.synthetic?.top === 890 && metrics.regions.practice?.top === 1098 && metrics.regions.practice?.bottom === 1306 && metrics.regions.footer?.bottom === 1534 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0162-desktop.png") });
await copyFile(reference, path.join(out, "0162-reference.png"));
const report = { mockup: "0162", lessonId: 105, route: "/lessons/algebra/105-factor-theorem", objectModel: "editable-polynomial-candidate-factor-root-extraction-draggable-substitution-zero-meter-synthetic-remainder-factor-pair-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0162-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
