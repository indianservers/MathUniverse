import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0151-interactive-intermediate-expressions-and-manipulation-substitution-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/94-substitution";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 992, height: 1586 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0151");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-expression", "data-variable", "data-value", "data-result", "data-substituted", "data-show-slots", "data-use-brackets", "data-checked", "data-tab", "data-dragging", "data-drops", "data-practice", "data-practice-answer", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Increase value").click();
checks.increased = await state();
await page.getByLabel("Substitution value slider").fill("-2");
checks.negative = await state();
await page.getByRole("switch", { name: "Use brackets for negatives" }).click();
checks.withoutBrackets = await state();
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Drag chosen value").dragTo(page.locator(".sub94-expression"));
checks.dragged = await state();
await page.getByLabel("Expression").selectOption("1");
checks.quadratic = await state();
await page.getByRole("button", { name: "Check value" }).click();
checks.quadraticChecked = await state();
await page.getByRole("switch", { name: "Show substitution slots" }).click();
checks.slotsHidden = await state();
await page.getByRole("button", { name: "Try another" }).click();
checks.nextPractice = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practiceTab = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".sub94-page"), regions: { header: region(".sub94-header"), layout: region(".sub94-layout"), machine: region(".sub94-machine"), controls: region(".sub94-controls"), expression: region(".sub94-expression"), steps: region(".sub94-steps"), rule: region(".sub94-rule"), brackets: region(".sub94-brackets"), worked: region(".sub94-worked"), practice: region(".sub94-practice"), tips: region(".sub94-tips"), navigation: region(".sub94-navigation"), footer: region(".sub94-footer") } };
});
const passed =
  checks.initial.expression === "3x + 2" && checks.initial.value === "5" && checks.initial.result === "17" && checks.initial.substituted === "3(5) + 2" && checks.initial.checked === "true" &&
  checks.increased.value === "6" && checks.increased.result === "20" && checks.increased.checked === "false" &&
  checks.negative.value === "-2" && checks.negative.result === "-4" && checks.negative.substituted === "3(−2) + 2" &&
  checks.withoutBrackets["use-brackets"] === "false" && checks.withoutBrackets.substituted === "3-2 + 2" &&
  checks.dragged.drops === "1" && checks.dragged.checked === "true" &&
  checks.quadratic.expression === "x² + 3" && checks.quadratic.value === "-2" && checks.quadratic.result === "7" && checks.quadratic.substituted === "(−2)² + 3" &&
  checks.quadraticChecked.checked === "true" && checks.slotsHidden["show-slots"] === "false" && checks.nextPractice.practice === "1" && checks.nextPractice["practice-answer"] === "13" &&
  checks.practiceTab.tab === "Practice" && checks.restored.expression === "3x + 2" && checks.restored.value === "5" && checks.restored.result === "17" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0151-desktop.png") });
await copyFile(reference, path.join(out, "0151-reference.png"));
const report = { mockup: "0151", lessonId: 94, route: "/lessons/algebra/94-substitution", objectModel: "draggable-substitution-slot-expression-value-step-evaluation-negative-brackets-equivalence-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0151-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
