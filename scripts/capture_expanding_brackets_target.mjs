import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0152-interactive-intermediate-expressions-and-manipulation-expanding-brackets-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/95-expanding-brackets";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 996, height: 1579 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0152");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-factor", "data-variable", "data-constant", "data-check-value", "data-expression", "data-expanded", "data-original-value", "data-expanded-value", "data-equivalent", "data-show-arrows", "data-show-area", "data-checked", "data-tab", "data-dragging", "data-drops", "data-practice", "data-practice-answer", "data-practice-correct", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Increase outside factor").click();
checks.factorFive = await state();
checks.factorFiveCells = await page.locator(".expand95-units > i").count();
await page.getByLabel("Constant term").fill("4");
checks.constantFour = await state();
checks.constantFourCells = await page.locator(".expand95-units > i").count();
await page.getByLabel("Variable term").fill("a");
await page.getByLabel("x check value").fill("7");
checks.editedModel = await state();
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Drag outside factor").dragTo(page.locator(".expand95-visual"));
checks.draggedFactor = await state();
await page.getByRole("switch", { name: "Show distribution arrows" }).click();
checks.arrowsHidden = await state();
await page.getByRole("switch", { name: "Show area model" }).click();
checks.areaHidden = await state();
await page.getByLabel("Practice answer").fill("3y + 12");
await page.getByLabel("Practice answer").press("Enter");
checks.wrongPractice = await state();
await page.getByLabel("Practice answer").fill("3y + 15");
await page.getByLabel("Practice answer").press("Enter");
checks.correctPractice = await state();
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
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".expand95-page"), regions: { header: region(".expand95-header"), tabs: region(".expand95-tabs"), layout: region(".expand95-layout"), area: region(".expand95-area"), visual: region(".expand95-visual"), grid: region(".expand95-grid"), controls: region(".expand95-controls"), result: region(".expand95-result"), guided: region(".expand95-guided"), cards: region(".expand95-cards"), practice: region(".expand95-practice"), navigation: region(".expand95-navigation"), footer: region(".expand95-footer") } };
});
const passed =
  checks.initial.factor === "4" && checks.initial.variable === "x" && checks.initial.constant === "3" && checks.initial.expression === "4(x + 3)" && checks.initial.expanded === "4x + 12" && checks.initial["original-value"] === "36" && checks.initial["expanded-value"] === "36" && checks.initial.equivalent === "true" &&
  checks.factorFive.expanded === "5x + 15" && checks.factorFive["original-value"] === "45" && checks.factorFiveCells === 15 &&
  checks.constantFour.expanded === "5x + 20" && checks.constantFour["original-value"] === "50" && checks.constantFourCells === 20 &&
  checks.editedModel.variable === "a" && checks.editedModel["check-value"] === "7" && checks.editedModel.expanded === "5a + 20" && checks.editedModel["original-value"] === "55" && checks.editedModel["expanded-value"] === "55" &&
  checks.draggedFactor.drops === "1" && checks.draggedFactor.checked === "true" && checks.arrowsHidden["show-arrows"] === "false" && checks.areaHidden["show-area"] === "false" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.nextPractice.practice === "1" && checks.nextPractice["practice-answer"] === "2a + 8" &&
  checks.practiceTab.tab === "Practice" && checks.restored.expression === "4(x + 3)" && checks.restored.expanded === "4x + 12" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0152-desktop.png") });
await copyFile(reference, path.join(out, "0152-reference.png"));
const report = { mockup: "0152", lessonId: 95, route: "/lessons/algebra/95-expanding-brackets", objectModel: "draggable-distributive-factor-dynamic-area-partition-symbolic-expansion-substitution-proof-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0152-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
