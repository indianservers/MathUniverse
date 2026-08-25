import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0057-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-fraction-models-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/75-fraction-models";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1492, height: 1054 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0057");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-numerator", "data-denominator", "data-value", "data-decimal", "data-percent", "data-set-selected", "data-set-total",
  "data-language", "data-share-state", "data-practice-loaded", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const setRange = (label, value) => page.getByLabel(label).evaluate((element, next) => {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
  setter?.call(element, String(next));
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}, value);
const checks = { initial: await state() };

await setRange("Drag to set denominator", 6);
checks.denominatorSix = await state();
await setRange("Drag to set numerator", 5);
checks.numeratorFive = await state();
await page.getByLabel("Area part 2 selected").click();
checks.areaSelection = await state();
await node.getByRole("button", { name: "4", exact: true }).first().click();
checks.denominatorFour = await state();
await node.getByRole("button", { name: "3", exact: true }).last().click();
checks.numeratorThree = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0057"]')?.getAttribute("data-share-state") !== "Share");
checks.shared = await state();
await node.getByRole("button", { name: /Try: Model 2\/5/ }).click();
checks.practice = await state();
await page.getByLabel("Set object 3 selected").click();
checks.setSelection = await state();
await node.getByRole("button", { name: /Reset/ }).click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".fraction75-page"), regions: {
      header: region(".fraction75-header"), summary: region(".fraction75-summary"), models: region(".fraction75-models"),
      area: region(".fraction75-area"), circle: region(".fraction75-circle"), set: region(".fraction75-set"), line: region(".fraction75-line"),
      controls: region(".fraction75-controls"), practice: region(".fraction75-practice"), linked: region(".fraction75-linked"),
    },
  };
});
const passed =
  checks.initial.numerator === "3" && checks.initial.denominator === "4" && checks.initial.decimal === "0.75" && checks.initial.percent === "75%" && checks.initial["set-selected"] === "9" && checks.initial["set-total"] === "12" &&
  checks.denominatorSix.denominator === "6" && checks.denominatorSix.numerator === "3" && checks.denominatorSix.decimal === "0.5" && checks.denominatorSix["set-total"] === "18" &&
  checks.numeratorFive.numerator === "5" && checks.numeratorFive.decimal === "0.833" && checks.numeratorFive.percent === "83.3%" && checks.numeratorFive["set-selected"] === "15" &&
  checks.areaSelection.numerator === "1" && checks.areaSelection.denominator === "6" && checks.denominatorFour.denominator === "4" && checks.numeratorThree.numerator === "3" &&
  checks.language.language.startsWith("Hindi") && ["Copied", "Ready"].includes(checks.shared["share-state"]) &&
  checks.practice.numerator === "2" && checks.practice.denominator === "5" && checks.practice.decimal === "0.4" && checks.practice.percent === "40%" && checks.practice["practice-loaded"] === "true" &&
  checks.setSelection.numerator === "1" && checks.setSelection.denominator === "5" && checks.restored.numerator === "3" && checks.restored.denominator === "4" && checks.restored.decimal === "0.75" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0057-desktop.png") });
await copyFile(reference, path.join(out, "0057-reference.png"));
const report = { mockup: "0057", lessonId: 75, route: "/lessons/numbers-and-arithmetic/75-fraction-models", objectModel: "linked-numerator-denominator-drag-ranges-clickable-area-circle-equivalent-set-number-line-decimal-percent-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0057-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
