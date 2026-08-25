import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0055-interactive-foundational-intermediate-numbers-and-number-theory-base-systems-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/73-base-systems";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1068, height: 1472 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0055");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-number", "data-digits", "data-base", "data-place-values", "data-products", "data-decimal", "data-selected-index",
  "data-drag-index", "data-valid", "data-tab", "data-practice-loaded", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Digit 3: 0").click();
checks.cycledDigit = await state();
await page.getByLabel("Set selected digit to 0").click();
checks.allowedDigit = await state();
await page.getByLabel("Number base").fill("3");
checks.baseThree = await state();
await page.getByLabel("Base-system number").fill("212");
checks.ternary212 = await state();
await page.getByLabel("Digit 1: 2").dragTo(page.getByLabel("Digit 2: 1"));
checks.draggedDigits = await state();
await page.getByLabel("Set selected digit to 0").click();
checks.paletteApplied = await state();
await node.getByRole("button", { name: "Explain" }).click();
checks.explain = await state();
await node.getByRole("button", { name: /Start Practice/ }).click();
checks.practice = await state();
await page.getByLabel("Base-system number").fill("110");
await node.getByRole("button", { name: "Interactive Lab" }).click();
await page.locator(".base73-board > header").click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".base73-page"), regions: {
      hero: region(".base73-hero"), heroTabs: region(".base73-hero > nav"), main: region(".base73-main"), board: region(".base73-board"),
      placeGrid: region(".base73-place-grid"), sum: region(".base73-sum"), verified: region(".base73-verified"), side: region(".base73-side"),
      summary: region(".base73-summary"), allowed: region(".base73-allowed"), why: region(".base73-why"), numberLine: region(".base73-number-line"),
      practice: region(".base73-practice"), navigation: region(".base73-navigation"), footer: region(".base73-footer"),
    },
  };
});
const passed =
  checks.initial.number === "110" && checks.initial.base === "2" && checks.initial["place-values"] === "4,2,1" && checks.initial.products === "4,2,0" && checks.initial.decimal === "6" &&
  checks.cycledDigit.number === "111" && checks.cycledDigit.decimal === "7" && checks.cycledDigit["selected-index"] === "2" &&
  checks.allowedDigit.number === "110" && checks.allowedDigit.decimal === "6" &&
  checks.baseThree.base === "3" && checks.baseThree["place-values"] === "9,3,1" && checks.baseThree.products === "9,3,0" && checks.baseThree.decimal === "12" &&
  checks.ternary212.number === "212" && checks.ternary212.products === "18,3,2" && checks.ternary212.decimal === "23" &&
  checks.draggedDigits.number === "122" && checks.draggedDigits.decimal === "17" && checks.draggedDigits["selected-index"] === "1" &&
  checks.paletteApplied.number === "102" && checks.paletteApplied.decimal === "11" && checks.explain.tab === "Explain" &&
  checks.practice.number === "101" && checks.practice.base === "2" && checks.practice.decimal === "5" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.number === "110" && checks.restored.base === "2" && checks.restored.decimal === "6" && checks.restored.tab === "Interactive Lab" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0055-desktop.png") });
await copyFile(reference, path.join(out, "0055-reference.png"));
const report = { mockup: "0055", lessonId: 73, route: "/lessons/numbers-and-arithmetic/73-base-systems", objectModel: "editable-base-three-digit-place-value-board-draggable-digit-order-allowed-digit-palette-calculated-products-decimal-sum-number-line-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0055-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
