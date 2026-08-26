import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0150-interactive-intermediate-expressions-and-manipulation-like-terms-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/93-like-terms";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1013, height: 1553 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0150");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-expression", "data-simplified", "data-coefficient", "data-check-value", "data-original-value", "data-simplified-value", "data-equivalent", "data-stage", "data-tab", "data-dragging", "data-problem", "data-practice-correct", "data-hint", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Add positive variable tile").click();
checks.addedPositive = await state();
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Add negative variable tile").dragTo(page.locator(".like93-drop"));
checks.draggedNegative = await state();
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Expression").selectOption("1");
checks.newExpression = await state();
await page.getByLabel("x value for check").fill("3");
checks.changedCheckValue = await state();
await node.getByRole("button", { name: /Combine coefficients/ }).click();
checks.stageTwo = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practiceTab = await state();
await page.getByLabel("Your answer").fill("a + 6");
await node.getByRole("button", { name: "Check", exact: true }).click();
checks.wrongPractice = await state();
await node.getByRole("button", { name: "Reveal" }).click();
checks.revealedPractice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".like93-page"), regions: { header: region(".like93-header"), layout: region(".like93-layout"), lab: region(".like93-lab"), workspace: region(".like93-workspace"), controls: region(".like93-controls"), notes: region(".like93-notes"), bottom: region(".like93-bottom"), navigation: region(".like93-navigation"), footer: region(".like93-footer") },
  };
});
const passed =
  checks.initial.expression === "7x − 2x + 4" && checks.initial.simplified === "5x + 4" && checks.initial.coefficient === "5" && checks.initial["original-value"] === "24" && checks.initial["simplified-value"] === "24" && checks.initial.equivalent === "true" &&
  checks.addedPositive.expression === "8x − 2x + 4" && checks.addedPositive.simplified === "6x + 4" && checks.addedPositive.stage === "1" &&
  checks.draggedNegative.expression === "7x − 3x + 4" && checks.draggedNegative.simplified === "4x + 4" &&
  checks.newExpression.expression === "4y − 1y − 3" && checks.newExpression.simplified === "3y − 3" &&
  checks.changedCheckValue["check-value"] === "3" && checks.changedCheckValue["original-value"] === "6" && checks.changedCheckValue["simplified-value"] === "6" &&
  checks.stageTwo.stage === "2" && checks.practiceTab.tab === "Practice" && checks.wrongPractice["practice-correct"] === "false" && checks.revealedPractice["practice-correct"] === "true" &&
  checks.restored.expression === "7x − 2x + 4" && checks.restored.simplified === "5x + 4" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0150-desktop.png") });
await copyFile(reference, path.join(out, "0150-reference.png"));
const report = { mockup: "0150", lessonId: 93, route: "/lessons/algebra/93-like-terms", objectModel: "draggable-like-term-coefficient-grouping-simplification-substitution-equivalence-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0150-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
