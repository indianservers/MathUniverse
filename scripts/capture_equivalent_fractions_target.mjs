import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0058-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-equivalent-fractions-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/76-equivalent-fractions";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1054, height: 1492 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0058");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-numerator", "data-denominator", "data-factor", "data-scaled-numerator", "data-scaled-denominator", "data-value", "data-decimal", "data-simplified", "data-tab", "data-dragging", "data-practice-loaded", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Set scale factor 3").click();
checks.factorThree = await state();
await page.getByLabel("Original denominator").fill("5");
await page.getByLabel("Original numerator").fill("2");
checks.twoFifths = await state();
await page.getByLabel("cyan bar part 4").click();
checks.barSelection = await state();
await page.getByLabel("purple bar part 6").click();
checks.scaledBarSelection = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("Scale factor 3; click to cycle or drag").dragTo(page.locator(".equivalent76-bar-label.equivalent"));
checks.factorDrop = await state();
checks.factorDropRecorded = Number(checks.factorDrop.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: "Explain", exact: true }).click();
checks.explain = await state();
await node.getByRole("button", { name: /Try: Make an equivalent fraction/ }).click();
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
    surface: region(".equivalent76-page"), regions: {
      hero: region(".equivalent76-hero"), tabs: region(".equivalent76-tabs"), layout: region(".equivalent76-layout"), proof: region(".equivalent76-proof"), side: region(".equivalent76-side"),
      originalBar: region(".equivalent76-bar.cyan"), originalLine: region(".equivalent76-line.cyan"), arithmetic: region(".equivalent76-arithmetic"), equivalentBar: region(".equivalent76-bar.purple"), equivalentLine: region(".equivalent76-line.purple"), result: region(".equivalent76-result"),
      navigation: region(".equivalent76-navigation"), footer: region(".equivalent76-footer"),
    },
  };
});
const passed =
  checks.initial.numerator === "3" && checks.initial.denominator === "4" && checks.initial.factor === "2" && checks.initial["scaled-numerator"] === "6" && checks.initial["scaled-denominator"] === "8" && checks.initial.decimal === "0.75" &&
  checks.factorThree.factor === "3" && checks.factorThree["scaled-numerator"] === "9" && checks.factorThree["scaled-denominator"] === "12" &&
  checks.twoFifths.numerator === "2" && checks.twoFifths.denominator === "5" && checks.twoFifths["scaled-numerator"] === "6" && checks.twoFifths["scaled-denominator"] === "15" && checks.twoFifths.decimal === "0.4" &&
  checks.barSelection.numerator === "4" && checks.barSelection["scaled-numerator"] === "12" && checks.scaledBarSelection.numerator === "2" && checks.scaledBarSelection["scaled-numerator"] === "6" &&
  checks.factorDrop.factor === "3" && checks.factorDropRecorded && checks.explain.tab === "Explain" &&
  checks.practice.numerator === "2" && checks.practice.denominator === "5" && checks.practice.factor === "2" && checks.practice["scaled-numerator"] === "4" && checks.practice["scaled-denominator"] === "10" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.numerator === "3" && checks.restored.denominator === "4" && checks.restored.factor === "2" && checks.restored.decimal === "0.75" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0058-desktop.png") });
await copyFile(reference, path.join(out, "0058-reference.png"));
const report = { mockup: "0058", lessonId: 76, route: "/lessons/numbers-and-arithmetic/76-equivalent-fractions", objectModel: "editable-original-fraction-shared-draggable-scale-factor-linked-segmented-bars-number-lines-products-equivalence-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0058-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
