import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0157-interactive-intermediate-expressions-and-manipulation-surds-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2251/lessons/algebra/100-surds";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 862, height: 1824 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0157");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-radicand", "data-square-factor", "data-remaining-factor", "data-coefficient", "data-result", "data-original-decimal", "data-simplified-decimal", "data-decimal-match", "data-valid-square-factor", "data-stage", "data-tab", "data-language", "data-practice-choice", "data-practice-correct", "data-share-count", "data-dragging", "data-factor-drops", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Radicand", exact: true }).fill("72");
checks.entered72 = await state();
await page.getByRole("button", { name: "Find square factor", exact: true }).click();
checks.found36 = await state();
await page.getByRole("button", { name: "Pull root outside", exact: true }).click();
checks.extracted72 = await state();
await page.getByRole("button", { name: "Decimal check", exact: true }).click();
checks.decimal72 = await state();
await page.getByRole("button", { name: "Use factor 4", exact: true }).click();
checks.factor4 = await state();
await page.getByRole("button", { name: "Pull root outside", exact: true }).click();
checks.factor4Extracted = await state();
await page.getByRole("button", { name: "Use factor 2", exact: true }).click();
checks.invalidFactor2 = await state();
checks.invalidPullDisabled = await page.getByRole("button", { name: "Pull root outside", exact: true }).isDisabled();
await page.getByRole("button", { name: "Use factor 36", exact: true }).dragTo(page.getByRole("region", { name: "Square factor extraction drop target" }));
checks.factorDrop = await state();
await page.getByRole("button", { name: "Pull root outside", exact: true }).click();
await page.getByRole("button", { name: "Decimal check", exact: true }).click();
checks.restored72 = await state();
await page.getByLabel("Practice choice B 4√2", { exact: true }).check();
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.wrongPractice = await state();
await page.getByLabel("Practice choice C 6√2", { exact: true }).check();
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.correctPractice = await state();
await node.getByRole("button", { name: "Formulas", exact: true }).click();
checks.formulasTab = await state();
await page.getByLabel("Lesson language").selectOption("hi");
checks.hindi = await state();
await node.locator(".surds100-intro").getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await node.locator(".surds100-intro").getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".surds100-page"), regions: { breadcrumb: region(".surds100-breadcrumb"), intro: region(".surds100-intro"), tabs: region(".surds100-tabs"), main: region(".surds100-main"), lab: region(".surds100-lab"), controls: region(".surds100-controls"), notes: region(".surds100-notes"), examples: region(".surds100-examples"), navigation: region(".surds100-navigation"), footer: region(".surds100-footer") } };
});
const passed =
  checks.initial.radicand === "50" && checks.initial["square-factor"] === "25" && checks.initial["remaining-factor"] === "2" && checks.initial.coefficient === "5" && checks.initial.result === "5√2" && checks.initial["original-decimal"] === "7.071" && checks.initial["simplified-decimal"] === "7.071" && checks.initial["decimal-match"] === "true" && checks.initial.stage === "decimal" &&
  checks.entered72.radicand === "72" && checks.entered72["square-factor"] === "1" && checks.entered72.result === "√72" && checks.entered72.stage === "input" &&
  checks.found36["square-factor"] === "36" && checks.found36["remaining-factor"] === "2" && checks.found36.coefficient === "6" && checks.found36.result === "6√2" && checks.found36.stage === "factor" &&
  checks.extracted72.stage === "extracted" && checks.decimal72.stage === "decimal" && checks.decimal72["decimal-match"] === "true" &&
  checks.factor4.result === "2√18" && checks.factor4Extracted.stage === "extracted" && checks.invalidFactor2["valid-square-factor"] === "false" && checks.invalidPullDisabled &&
  checks.factorDrop["square-factor"] === "36" && checks.factorDrop["factor-drops"] === "36" && checks.restored72.result === "6√2" && checks.restored72.stage === "decimal" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.formulasTab.tab === "Formulas" && checks.hindi.language === "hi" && checks.shared["share-count"] === "1" &&
  checks.reset.radicand === "50" && checks.reset.result === "5√2" && checks.reset.tab === "Interact" && checks.reloaded.radicand === "50" && checks.reloaded.result === "5√2" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0157-desktop.png") });
await copyFile(reference, path.join(out, "0157-reference.png"));
const report = { mockup: "0157", lessonId: 100, route: "/lessons/algebra/100-surds", objectModel: "editable-radicand-perfect-square-divisor-search-draggable-factor-extraction-exact-decimal-equivalence-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0157-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
