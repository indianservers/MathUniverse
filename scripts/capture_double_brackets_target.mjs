import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0153-interactive-intermediate-expressions-and-manipulation-double-brackets-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/96-double-brackets";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 984, height: 1598 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0153");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-variable", "data-first", "data-second", "data-check-value", "data-expression", "data-uncombined", "data-expanded", "data-middle", "data-constant", "data-original-value", "data-expanded-value", "data-equivalent", "data-show-products", "data-combine-middle", "data-check-enabled", "data-checked", "data-tab", "data-dragging", "data-middle-drops", "data-challenge", "data-challenge-answer", "data-challenge-correct", "data-show-solution", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("First constant").selectOption("4");
checks.firstFour = await state();
await page.getByLabel("Second constant").selectOption("5");
checks.secondFive = await state();
await page.getByLabel("First variable").fill("a");
await page.getByLabel("Substitution value").fill("2");
checks.editedModel = await state();
await page.getByLabel("Reset expression").click();
await page.getByLabel("Drag second middle product").dragTo(page.locator(".double96-combine"));
checks.firstDrop = await state();
await page.getByLabel("Drag first middle product").dragTo(page.locator(".double96-combine"));
checks.secondDrop = await state();
await page.getByRole("switch", { name: "Show four products" }).click();
checks.productsHidden = await state();
await page.getByRole("switch", { name: "Combine middle terms" }).click();
checks.uncombined = await state();
await page.getByRole("switch", { name: "Check by substitution" }).click();
checks.checkHidden = await state();
await page.getByLabel("Reset expression").click();
await page.getByLabel("Challenge answer").fill("y² + 4y + 4");
await page.getByLabel("Challenge answer").press("Enter");
checks.wrongChallenge = await state();
await page.getByLabel("Challenge answer").fill("y² + 5y + 4");
await page.getByLabel("Challenge answer").press("Enter");
checks.correctChallenge = await state();
await page.getByRole("button", { name: "Show area tiles solution" }).click();
checks.solution = await state();
await page.getByRole("button", { name: "New challenge" }).click();
checks.nextChallenge = await state();
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
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".double96-page"), regions: { header: region(".double96-header"), tabs: region(".double96-tabs"), layout: region(".double96-layout"), area: region(".double96-area"), visual: region(".double96-visual"), grid: region(".double96-grid"), combine: region(".double96-combine"), builder: region(".double96-builder"), result: region(".double96-result"), steps: region(".double96-steps"), cards: region(".double96-cards"), practice: region(".double96-practice"), navigation: region(".double96-navigation"), footer: region(".double96-footer") } };
});
const passed =
  checks.initial.expression === "(x + 2)(x + 3)" && checks.initial.uncombined === "x² + 3x + 2x + 6" && checks.initial.expanded === "x² + 5x + 6" && checks.initial.middle === "5" && checks.initial.constant === "6" && checks.initial["original-value"] === "12" && checks.initial["expanded-value"] === "12" && checks.initial.equivalent === "true" &&
  checks.firstFour.expression === "(x + 4)(x + 3)" && checks.firstFour.expanded === "x² + 7x + 12" && checks.firstFour["original-value"] === "20" &&
  checks.secondFive.expression === "(x + 4)(x + 5)" && checks.secondFive.expanded === "x² + 9x + 20" && checks.secondFive["original-value"] === "30" &&
  checks.editedModel.variable === "a" && checks.editedModel["check-value"] === "2" && checks.editedModel.expanded === "a² + 9a + 20" && checks.editedModel["original-value"] === "42" && checks.editedModel["expanded-value"] === "42" &&
  checks.firstDrop["middle-drops"] === "second" && checks.secondDrop["middle-drops"] === "second,first" && checks.secondDrop["combine-middle"] === "true" &&
  checks.productsHidden["show-products"] === "false" && checks.uncombined["combine-middle"] === "false" && checks.uncombined.expanded === "x² + 5x + 6" && checks.checkHidden["check-enabled"] === "false" &&
  checks.wrongChallenge["challenge-correct"] === "false" && checks.correctChallenge["challenge-correct"] === "true" && checks.solution["show-solution"] === "true" &&
  checks.nextChallenge.challenge === "1" && checks.nextChallenge["challenge-answer"] === "a² + 7a + 10" && checks.practiceTab.tab === "Practice" &&
  checks.restored.expression === "(x + 2)(x + 3)" && checks.restored.expanded === "x² + 5x + 6" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0153-desktop.png") });
await copyFile(reference, path.join(out, "0153-reference.png"));
const report = { mockup: "0153", lessonId: 96, route: "/lessons/algebra/96-double-brackets", objectModel: "draggable-four-product-binomial-area-middle-term-combination-substitution-proof-graded-challenge-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0153-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
