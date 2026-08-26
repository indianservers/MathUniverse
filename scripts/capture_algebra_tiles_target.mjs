import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0149-interactive-intermediate-expressions-and-manipulation-algebra-tiles-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/92-algebra-tiles";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1110, height: 1417 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0149");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-expression", "data-x-coefficient", "data-constant", "data-x-squared", "data-zero-x", "data-zero-units", "data-combined", "data-area-calculation", "data-tab", "data-dragging", "data-problem", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.locator(".tiles92-bank > p").nth(0).locator("button").last().click();
checks.addedX = await state();
await page.locator(".tiles92-bank > p").nth(1).locator("button").last().click();
checks.addedUnit = await state();
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Add x tile", { exact: true }).dragTo(page.locator(".tiles92-before"));
checks.bankDrag = await state();
await page.getByLabel("2x tile 1", { exact: true }).dragTo(page.locator(".tiles92-after"));
checks.expressionDrag = await state();
await node.getByRole("button", { name: "Reset" }).click();
await page.getByRole("button", { name: "Add x zero pair" }).click();
await page.getByRole("button", { name: "Add unit zero pair" }).click();
checks.zeroPairs = await state();
await page.getByRole("button", { name: "Clear zero pairs" }).click();
checks.zeroPairsCleared = await state();
await page.getByRole("button", { name: "Show calculation" }).click();
checks.areaCalculation = await state();
await page.getByRole("button", { name: "New Problem" }).click();
checks.newProblem = await state();
await node.getByRole("button", { name: "Explain" }).click();
checks.explain = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".tiles92-page"),
    regions: {
      header: region(".tiles92-header"), tabs: region(".tiles92-tabs"), layout: region(".tiles92-layout"), builder: region(".tiles92-builder"), before: region(".tiles92-before"), after: region(".tiles92-after"), zeroPairs: region(".tiles92-zero"), rail: region(".tiles92-rail"), bank: region(".tiles92-bank"), count: region(".tiles92-count"), checklist: region(".tiles92-checklist"), valid: region(".tiles92-valid"), area: region(".tiles92-area"), trace: region(".tiles92-trace"),
    },
  };
});
const passed =
  checks.initial.expression === "5x − 1" && checks.initial["x-coefficient"] === "5" && checks.initial.constant === "-1" && checks.initial.combined === "true" &&
  checks.addedX.expression === "6x − 1" && checks.addedX.combined === "false" && checks.addedUnit.expression === "6x" &&
  checks.bankDrag.expression === "6x − 1" && checks.expressionDrag.combined === "true" &&
  checks.zeroPairs["zero-x"] === "1" && checks.zeroPairs["zero-units"] === "1" && checks.zeroPairs.expression === "5x − 1" &&
  checks.zeroPairsCleared["zero-x"] === "0" && checks.zeroPairsCleared["zero-units"] === "0" &&
  checks.areaCalculation["area-calculation"] === "true" && checks.newProblem.problem === "1" && checks.newProblem.expression === "5x + 1" &&
  checks.explain.tab === "Explain" && checks.restored.expression === "5x − 1" && checks.restored.tab === "Workspace" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0149-desktop.png") });
await copyFile(reference, path.join(out, "0149-reference.png"));
const report = { mockup: "0149", lessonId: 92, route: "/lessons/algebra/92-algebra-tiles", objectModel: "editable-positive-negative-algebra-tiles-draggable-bank-zero-pairs-linked-area-model-symbolic-trace-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0149-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
