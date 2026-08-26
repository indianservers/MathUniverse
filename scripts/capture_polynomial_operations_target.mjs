import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0159-interactive-intermediate-expressions-and-manipulation-polynomial-operations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2251/lessons/algebra/102-polynomial-operations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 985, height: 1597 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0159");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-operation", "data-polynomial-a", "data-polynomial-b", "data-result", "data-degree", "data-align-powers", "data-combine-columns", "data-substitution-check", "data-check-value", "data-left-value", "data-result-value", "data-equal", "data-tab", "data-language", "data-selected-tile", "data-dragging", "data-tile-drops", "data-invalid-drop", "data-practice-index", "data-practice-answer", "data-practice-correct", "data-share-count", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("x check value", { exact: true }).fill("2");
checks.addAtTwo = await state();
await page.getByRole("button", { name: "Subtract", exact: true }).click();
checks.subtract = await state();
await page.getByRole("button", { name: "Multiply", exact: true }).click();
checks.multiply = await state();
await page.getByRole("switch", { name: "Align powers" }).click();
checks.unaligned = await state();
await page.getByRole("switch", { name: "Align powers" }).click();
await page.getByRole("switch", { name: "Combine columns" }).click();
checks.uncombined = await state();
await page.getByRole("switch", { name: "Combine columns" }).click();
await page.getByRole("switch", { name: "Check by substitution" }).click();
checks.substitutionOff = await state();
await page.getByRole("switch", { name: "Check by substitution" }).click();

await page.getByRole("button", { name: "Add", exact: true }).click();
const degreeTwoTile = page.getByRole("button", { name: "Drag A degree 2 term", exact: true });
await degreeTwoTile.dragTo(page.getByLabel("A degree 2 drop target").first());
checks.validDrop = await state();
await degreeTwoTile.dragTo(page.getByLabel("B degree 1 drop target").first());
checks.invalidDrop = await state();

await page.getByLabel("Practice coefficient constant", { exact: true }).fill("4");
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.wrongPractice = await state();
await page.getByLabel("Practice coefficient constant", { exact: true }).fill("3");
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.correctPractice = await state();
await page.getByRole("button", { name: "New practice", exact: true }).click();
checks.nextPractice = await state();
await page.getByLabel("Practice coefficient y squared", { exact: true }).fill("3");
await page.getByLabel("Practice coefficient y", { exact: true }).fill("2");
await page.getByLabel("Practice coefficient constant", { exact: true }).fill("4");
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.secondPractice = await state();
await node.getByRole("button", { name: "Rules", exact: true }).click();
await page.getByLabel("Lesson language").selectOption("hi");
await node.locator(".poly102-intro").getByRole("button", { name: "Share", exact: true }).click();
checks.rulesHindiShared = await state();
await node.locator(".poly102-intro").getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".poly102-page"), regions: { intro: region(".poly102-intro"), tabs: region(".poly102-tabs"), dashboard: region(".poly102-dashboard"), toolbar: region(".poly102-dashboard > header"), body: region(".poly102-body"), table: region(".poly102-table-card"), guided: region(".poly102-guided"), rail: region(".poly102-rail"), practice: region(".poly102-practice"), navigation: region(".poly102-navigation"), footer: region(".poly102-footer") } };
});
const passed =
  checks.initial.operation === "add" && checks.initial.result === "x² + 5x + 5" && checks.initial.degree === "2" && checks.initial["left-value"] === "11" && checks.initial["result-value"] === "11" && checks.initial.equal === "true" &&
  checks.addAtTwo["check-value"] === "2" && checks.addAtTwo["left-value"] === "19" && checks.addAtTwo["result-value"] === "19" &&
  checks.subtract.result === "x² + x − 1" && checks.subtract["left-value"] === "5" && checks.subtract["result-value"] === "5" &&
  checks.multiply.result === "2x³ + 9x² + 13x + 6" && checks.multiply.degree === "3" && checks.multiply["left-value"] === "84" && checks.multiply["result-value"] === "84" && checks.multiply.equal === "true" &&
  checks.unaligned["align-powers"] === "false" && checks.uncombined["combine-columns"] === "false" && checks.substitutionOff["substitution-check"] === "false" &&
  checks.validDrop["tile-drops"] === "A-2" && checks.invalidDrop["invalid-drop"] === "A-2->B-1" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.nextPractice["practice-index"] === "1" && checks.nextPractice["practice-answer"] === "0,0,0" && checks.secondPractice["practice-answer"] === "3,2,4" && checks.secondPractice["practice-correct"] === "true" &&
  checks.rulesHindiShared.tab === "Rules" && checks.rulesHindiShared.language === "hi" && checks.rulesHindiShared["share-count"] === "1" &&
  checks.reset.operation === "add" && checks.reset.result === "x² + 5x + 5" && checks.reset["practice-index"] === "0" && checks.reset["practice-correct"] === "true" && checks.reset["share-count"] === "0" && checks.reloaded.result === "x² + 5x + 5" && checks.reloaded.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 985 && metrics.document.height === 1597 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0159-desktop.png") });
await copyFile(reference, path.join(out, "0159-reference.png"));
const report = { mockup: "0159", lessonId: 102, route: "/lessons/algebra/102-polynomial-operations", objectModel: "coefficient-map-polynomial-add-subtract-convolution-draggable-degree-columns-substitution-equivalence-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0159-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
