import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0163-interactive-intermediate-expressions-and-manipulation-identities-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2252/lessons/algebra/106-identities";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 992, height: 1586 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0163");
await node.waitFor({ timeout: 600000 });
const attributes = ["x-value", "side", "area-x2", "area-2x", "area-four", "area-total", "uncombined", "combined", "samples", "samples-match", "show-parts", "combine-terms", "test-samples", "tab", "language", "share-count", "why-open", "dragging", "part-drops", "invalid-drop", "practice-index", "practice-expected", "practice-answer", "practice-correct", "practice-area", "actions"];
const state = () => node.evaluate((element, names) => Object.fromEntries(names.map((name) => [name, element.getAttribute(`data-${name}`)])), attributes);
const checks = { initial: await state() };

await page.getByLabel("Direct area x value").fill("7");
checks.xSeven = await state();
await page.getByRole("switch", { name: "Show area parts" }).click();
checks.partsOff = await state();
await page.getByRole("switch", { name: "Show area parts" }).click();
await page.getByRole("switch", { name: "Combine like terms" }).click();
checks.combineOff = await state();
await page.getByRole("switch", { name: "Combine like terms" }).click();
await page.getByRole("switch", { name: "Test sample values" }).click();
checks.samplesOff = await state();
await page.getByRole("switch", { name: "Test sample values" }).click();

const dropTarget = page.getByLabel("Area parts drop target");
for (const id of ["x2", "top-2x", "left-2x", "four"]) {
  await page.getByRole("button", { name: `Drag area tile ${id}` }).dragTo(dropTarget, { targetPosition: { x: 3, y: 3 } });
}
checks.areaDrops = await state();
await page.getByRole("button", { name: /Why this works/ }).click();
checks.why = await state();
await page.getByLabel("Lesson language").selectOption("hi");
await page.getByRole("button", { name: "Share", exact: true }).click();
await node.getByRole("button", { name: "Formulas", exact: true }).click();
checks.headerControls = await state();

const practiceAnswer = page.getByLabel("Identity practice answer");
await practiceAnswer.fill("y² + 5y + 9");
await practiceAnswer.press("Tab");
checks.practiceWrong = await state();
await practiceAnswer.fill("y^2 + 6y + 9");
await practiceAnswer.press("Tab");
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "Next practice" }).click();
checks.practiceNext = await state();
await practiceAnswer.fill("a^2 + 8a + 16");
await practiceAnswer.press("Tab");
await page.getByRole("button", { name: "Show area model" }).click();
checks.practiceSecond = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "networkidle" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".identity106-page"), regions: { intro: region(".identity106-intro"), tabs: region(".identity106-tabs"), lab: region(".identity106-lab"), columns: region(".identity106-columns"), area: region(".identity106-area"), transform: region(".identity106-transform"), evidence: region(".identity106-evidence"), practice: region(".identity106-practice"), navigation: region(".identity106-navigation"), footer: region(".identity106-footer") } };
});
const passed =
  checks.initial["x-value"] === "5" && checks.initial.side === "7" && checks.initial["area-x2"] === "25" && checks.initial["area-2x"] === "10" && checks.initial["area-total"] === "49" && checks.initial.samples === "0:4:4,3:25:25,5:49:49" && checks.initial["samples-match"] === "true" &&
  checks.xSeven.side === "9" && checks.xSeven["area-x2"] === "49" && checks.xSeven["area-2x"] === "14" && checks.xSeven["area-total"] === "81" && checks.xSeven.samples === "0:4:4,3:25:25,7:81:81" &&
  checks.partsOff["show-parts"] === "false" && checks.combineOff["combine-terms"] === "false" && checks.samplesOff["test-samples"] === "false" && checks.areaDrops["part-drops"] === "x2,top-2x,left-2x,four" && checks.areaDrops.dragging === "" && checks.why["why-open"] === "true" &&
  checks.headerControls.language === "hi" && checks.headerControls["share-count"] === "1" && checks.headerControls.tab === "Formulas" && checks.practiceWrong["practice-correct"] === "false" && checks.practiceCorrect["practice-correct"] === "true" && checks.practiceNext["practice-index"] === "1" && checks.practiceNext["practice-expected"] === "a² + 8a + 16" && checks.practiceSecond["practice-correct"] === "true" && checks.practiceSecond["practice-area"] === "true" &&
  checks.reset["x-value"] === "5" && checks.reset["part-drops"] === "" && checks.reset.language === "en" && checks.reset.tab === "Interaction + visualization" && checks.reset["practice-index"] === "0" && checks.reset["practice-correct"] === "true" && checks.reloaded["area-total"] === "49" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.width === 992 && metrics.document.height === 1586 && metrics.surface?.left === 226 && metrics.surface?.top === 99 && metrics.surface?.right === 976 && metrics.surface?.bottom === 1586 && metrics.regions.intro?.height === 253 && metrics.regions.tabs?.top === 364 && metrics.regions.lab?.top === 429 && metrics.regions.lab?.bottom === 1082 && metrics.regions.practice?.top === 1093 && metrics.regions.practice?.bottom === 1348 && metrics.regions.footer?.bottom === 1586 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0163-desktop.png") });
await copyFile(reference, path.join(out, "0163-reference.png"));
const report = { mockup: "0163", lessonId: 106, route: "/lessons/algebra/106-identities", objectModel: "dynamic-square-area-partition-draggable-region-symbolic-combination-sample-equivalence-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0163-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
