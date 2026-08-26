import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0070-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-percentages-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/88-percentages";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1090, height: 1443 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0070");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-percent", "data-decimal", "data-numerator", "data-denominator", "data-whole", "data-part", "data-tab", "data-share-state", "data-workspace-state", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const counts = () => page.evaluate(() => ({
  cells: document.querySelectorAll(".percent88-grid button").length,
  selectedCells: document.querySelectorAll(".percent88-grid button.selected").length,
  dots: document.querySelectorAll(".percent88-quantity button").length,
  selectedDots: document.querySelectorAll(".percent88-quantity button.selected").length,
}));
const checks = { initial: await state(), initialCounts: await counts() };

await page.getByRole("slider", { name: "Percentage value" }).fill("40");
checks.slider = await state();
await node.getByRole("button", { name: "Reset" }).click();
checks.reset = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("Hundred grid cell 25", { exact: true }).dragTo(page.getByLabel("Hundred grid cell 40", { exact: true }));
checks.dragged = await state();
checks.draggedCounts = await counts();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByLabel("Percent number line 50", { exact: true }).click();
checks.numberLine = await state();
await page.getByLabel("Quantity dot 20", { exact: true }).click();
checks.quantityDot = await state();
await node.getByRole("button", { name: "Reset" }).click();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: "Share" }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0070"]')?.getAttribute("data-share-state") !== "Share");
checks.share = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /^Try:/ }).click();
checks.practice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".percent88-page"), regions: { header: region(".percent88-header"), tabs: region(".percent88-tabs"), workspace: region(".percent88-workspace"), left: region(".percent88-left"), model: region(".percent88-model"), grid: region(".percent88-grid"), equivalents: region(".percent88-equivalents"), line: region(".percent88-line"), quantity: region(".percent88-quantity"), side: region(".percent88-side"), control: region(".percent88-control"), facts: region(".percent88-facts"), practice: region(".percent88-try"), navigation: region(".percent88-navigation"), footer: region(".percent88-footer") },
  };
});
const passed =
  checks.initial.percent === "25" && checks.initial.decimal === "0.25" && checks.initial.numerator === "1" && checks.initial.denominator === "4" && checks.initial.whole === "80" && checks.initial.part === "20" &&
  checks.initialCounts.cells === 100 && checks.initialCounts.selectedCells === 25 && checks.initialCounts.dots === 80 && checks.initialCounts.selectedDots === 20 &&
  checks.slider.percent === "40" && checks.slider.decimal === "0.4" && checks.slider.numerator === "2" && checks.slider.denominator === "5" && checks.slider.part === "32" &&
  checks.reset.percent === "25" && checks.dragged.percent === "40" && checks.draggedCounts.selectedCells === 40 && checks.dragRecorded &&
  checks.numberLine.percent === "50" && checks.numberLine.numerator === "1" && checks.numberLine.denominator === "2" && checks.numberLine.part === "40" &&
  checks.quantityDot.percent === "25" && checks.explain.tab === "Explain" && checks.share["share-state"] !== "Share" && checks.workspace["workspace-state"] === "open" &&
  checks.practice.percent === "40" && checks.practice.whole === "60" && checks.practice.part === "24" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.percent === "25" && checks.restored.whole === "80" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0070-desktop.png") });
await copyFile(reference, path.join(out, "0070-reference.png"));
const report = { mockup: "0070", lessonId: 88, route: "/lessons/numbers-and-arithmetic/88-percentages", objectModel: "editable-percent-draggable-hundred-grid-equivalent-fraction-decimal-slider-number-line-part-of-quantity-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0070-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
