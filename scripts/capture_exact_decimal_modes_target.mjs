import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0018-interactive-foundational-advanced-scientific-calculator-exact-and-decimal-modes-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/core-workspaces/18-exact-and-decimal-modes";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1068, height: 1472 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("calculator-mockup-0018");
await node.waitFor({ timeout: 180000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-mode", "data-precision", "data-decimal", "data-actions", "data-view",
  "data-practice-index", "data-practice-choice", "data-practice-correct", "data-expanded",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };
await page.getByRole("button", { name: "Decimal (Preview)" }).click(); checks.decimalMode = await state();
await page.getByLabel("Decimal precision drag control").fill("14"); checks.precision = await state();
await page.getByRole("button", { name: "Toggle expanded workspace" }).click(); checks.expanded = await state();
await page.getByRole("button", { name: /Examples/ }).click(); checks.view = await state();
await page.locator(".exact-practice nav button").nth(1).click(); checks.incorrect = await state();
await page.locator(".exact-practice nav button").nth(0).click(); checks.correct = await state();
await page.getByRole("button", { name: /New question/ }).click(); checks.next = await state();
await page.getByRole("button", { name: /Show explanation/ }).click(); checks.explanationVisible = await page.locator(".exact-explanation").isVisible();
await page.getByRole("button", { name: /Reset/ }).click(); checks.reset = await state();
const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},horizontalOverflow:document.documentElement.scrollWidth>innerWidth,surface:region(".target-exact-page"),regions:{header:region(".exact-header"),tabs:region(".exact-tabs"),lab:region(".exact-lab"),equation:region(".exact-equation"),columns:region(".exact-columns"),square:region(".exact-square-card"),decimal:region(".exact-decimal-card"),trace:region(".exact-trace"),controls:region(".exact-controls"),comparison:region(".exact-comparison"),practice:region(".exact-practice"),neighbors:region(".exact-neighbors"),footer:region(".exact-footer")}};
});
const passed = checks.initial.mode === "exact" && checks.initial.precision === "8" && checks.initial.decimal === "1.41421356"
  && checks.decimalMode.mode === "decimal" && checks.precision.precision === "14" && checks.precision.decimal === "1.41421356237310"
  && checks.expanded.expanded === "true" && checks.view.view === "2"
  && checks.incorrect["practice-correct"] === "false" && checks.correct["practice-correct"] === "true"
  && checks.next["practice-index"] === "1" && checks.next["practice-choice"] === "decimal"
  && checks.explanationVisible && checks.reset.mode === "exact" && checks.reset.precision === "8"
  && !metrics.horizontalOverflow && consoleMessages.length === 0;
await page.screenshot({ path:path.join(out,"0018-desktop.png") });
await copyFile(reference,path.join(out,"0018-reference.png"));
const report={mockup:"0018",lessonId:18,route:"/lessons/core-workspaces/18-exact-and-decimal-modes",objectModel:"linked-unit-square-radical-decimal-number-line-precision-mode-comparison-graded-context-practice-model",checks,metrics,consoleMessages,passed};
await writeFile(path.join(out,"0018-dedicated-target-validation.json"),`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));
await browser.close(); process.exit(passed?0:1);
