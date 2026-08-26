import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0060-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-fraction-operations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/78-fraction-operations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1049, height: 1500 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0060");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-first", "data-second", "data-operation", "data-common-denominator", "data-converted-first", "data-converted-second", "data-raw-result", "data-result", "data-dragging", "data-practice-loaded", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("First fraction denominator").fill("4");
await page.getByLabel("First fraction numerator").fill("3");
await page.getByLabel("Second fraction denominator").fill("4");
checks.sameUnits = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("First bar part 1").dragTo(page.getByLabel("First bar part 2"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByLabel("Operation Add; click to cycle").click();
checks.subtract = await state();
await page.getByLabel("Operation Subtract; click to cycle").click();
checks.multiply = await state();
await page.getByLabel("Operation Multiply; click to cycle").click();
checks.divide = await state();
await node.getByRole("button", { name: /Try: Add 2\/5/ }).click();
checks.practice = await state();
await node.getByRole("button", { name: "Reset model", exact: true }).click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".operations78-page"), regions: {
      lessonSurface: region(".operations78-surface"), hero: region(".operations78-hero"), layout: region(".operations78-layout"), proof: region(".operations78-proof"), side: region(".operations78-side"),
      start: region(".operations78-start"), convert: region(".operations78-convert"), result: region(".operations78-result"), navigation: region(".operations78-navigation"), footer: region(".operations78-footer"),
    },
  };
});
const passed =
  checks.initial.first === "1/2" && checks.initial.second === "1/3" && checks.initial.operation === "Add" && checks.initial["common-denominator"] === "6" && checks.initial["converted-first"] === "3" && checks.initial["converted-second"] === "2" && checks.initial["raw-result"] === "5/6" && checks.initial.result === "5/6" &&
  checks.sameUnits.first === "3/4" && checks.sameUnits.second === "1/4" && checks.sameUnits["common-denominator"] === "4" && checks.sameUnits["raw-result"] === "4/4" && checks.sameUnits.result === "1/1" &&
  checks.dragged.first === "2/4" && checks.dragged["raw-result"] === "3/4" && checks.dragged.result === "3/4" && checks.dragRecorded &&
  checks.subtract.operation === "Subtract" && checks.subtract["raw-result"] === "1/4" && checks.subtract.result === "1/4" &&
  checks.multiply.operation === "Multiply" && checks.multiply["raw-result"] === "2/16" && checks.multiply.result === "1/8" &&
  checks.divide.operation === "Divide" && checks.divide["raw-result"] === "8/4" && checks.divide.result === "2/1" &&
  checks.practice.first === "2/5" && checks.practice.second === "1/10" && checks.practice.operation === "Add" && checks.practice["common-denominator"] === "10" && checks.practice["converted-first"] === "4" && checks.practice["converted-second"] === "1" && checks.practice["raw-result"] === "5/10" && checks.practice.result === "1/2" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.first === "1/2" && checks.restored.second === "1/3" && checks.restored.operation === "Add" && checks.restored.result === "5/6" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0060-desktop.png") });
await copyFile(reference, path.join(out, "0060-reference.png"));
const report = { mockup: "0060", lessonId: 78, route: "/lessons/numbers-and-arithmetic/78-fraction-operations", objectModel: "dual-editable-draggable-fraction-bars-four-operation-engine-lcm-conversion-reciprocal-reduction-result-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0060-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
