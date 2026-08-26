import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0063-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-fraction-decimal-conversion-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/81-fractiondecimal-conversion";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1508, height: 1043 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0063");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-numerator", "data-denominator", "data-reduced", "data-decimal", "data-percent", "data-selected-cells", "data-terminating", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Fraction numerator" }).fill("1");
checks.oneQuarter = await state();
await page.getByRole("spinbutton", { name: "Fraction denominator" }).fill("8");
await page.getByRole("spinbutton", { name: "Fraction numerator" }).fill("7");
checks.sevenEighthsEdited = await state();
await page.getByRole("spinbutton", { name: "Fraction denominator" }).fill("4");
await page.getByRole("spinbutton", { name: "Fraction numerator" }).fill("3");
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("Fraction strip part 3").dragTo(page.getByLabel("Fraction strip part 2"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByLabel("Percent grid cell 25").click();
checks.gridSelected = await state();
await page.getByLabel("Conversion number line 0.75").click();
checks.numberLine = await state();
await page.getByRole("spinbutton", { name: "Fraction denominator" }).fill("3");
await page.getByRole("spinbutton", { name: "Fraction numerator" }).fill("1");
checks.recurring = await state();
await node.getByRole("button", { name: /Start Practice/ }).click();
checks.practice = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor({ timeout: 600000 });
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".conversion81-page"), regions: { lesson: region(".conversion81-surface"), workspace: region(".conversion81-workspace"), proof: region(".conversion81-proof"), fraction: region(".conversion81-fraction"), division: region(".conversion81-division"), percent: region(".conversion81-percent"), equation: region(".conversion81-equation"), line: region(".conversion81-line"), side: region(".conversion81-side"), forms: region(".conversion81-forms"), misconception: region(".conversion81-misconception"), practice: region(".conversion81-practice"), navigation: region(".conversion81-navigation") },
  };
});
const passed =
  checks.initial.numerator === "3" && checks.initial.denominator === "4" && checks.initial.reduced === "3/4" && checks.initial.decimal === "0.75" && checks.initial.percent === "75%" && checks.initial["selected-cells"] === "75" && checks.initial.terminating === "true" &&
  checks.oneQuarter.numerator === "1" && checks.oneQuarter.decimal === "0.25" && checks.oneQuarter.percent === "25%" && checks.sevenEighthsEdited.denominator === "8" && checks.sevenEighthsEdited.numerator === "7" && checks.sevenEighthsEdited.decimal === "0.875" && checks.sevenEighthsEdited.percent === "87.5%" &&
  checks.dragged.numerator === "2" && checks.dragged.denominator === "4" && checks.dragged.reduced === "1/2" && checks.dragged.decimal === "0.5" && checks.dragRecorded &&
  checks.gridSelected.numerator === "1" && checks.gridSelected.percent === "25%" && checks.numberLine.numerator === "3" && checks.numberLine.decimal === "0.75" &&
  checks.recurring.numerator === "1" && checks.recurring.denominator === "3" && checks.recurring.decimal === "0.333…" && checks.recurring.terminating === "false" &&
  checks.practice.numerator === "7" && checks.practice.denominator === "8" && checks.practice.decimal === "0.875" && checks.practice.percent === "87.5%" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.numerator === "3" && checks.restored.denominator === "4" && checks.restored.decimal === "0.75" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0063-desktop.png") });
await copyFile(reference, path.join(out, "0063-reference.png"));
const report = { mockup: "0063", lessonId: 81, route: "/lessons/numbers-and-arithmetic/81-fractiondecimal-conversion", objectModel: "editable-reduced-fraction-division-trace-clickable-draggable-strip-hundred-grid-decimal-percent-number-line-terminating-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0063-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
