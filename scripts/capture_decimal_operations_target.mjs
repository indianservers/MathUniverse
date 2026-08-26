import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0062-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-decimal-operations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/80-decimal-operations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1060, height: 1484 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0062");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-first", "data-second", "data-operation", "data-result", "data-first-digits", "data-second-digits", "data-result-digits", "data-misaligned", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("textbox", { name: "First decimal value" }).fill("4.10");
checks.firstEdited = await state();
await page.getByRole("textbox", { name: "Second decimal value" }).fill("0.75");
checks.secondEdited = await state();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByLabel("First decimal ones digit 4").dragTo(page.getByLabel("First decimal hundredths digit 0"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.locator(".decimal80-operation-title").click();
checks.subtracted = await state();
await page.getByRole("textbox", { name: "First decimal value" }).fill("5.50");
await page.getByRole("textbox", { name: "Second decimal value" }).fill("1.25");
checks.positiveDifference = await state();
await node.getByRole("button", { name: /Try:/ }).click();
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
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".decimal80-page"), regions: {
      lesson: region(".decimal80-surface"), workspace: region(".decimal80-workspace"), left: region(".decimal80-left"), algorithm: region(".decimal80-algorithm"), blocks: region(".decimal80-block-proof"), practice: region(".decimal80-practice"), right: region(".decimal80-right"), mistake: region(".decimal80-mistake"), navigation: region(".decimal80-navigation"), footer: region(".decimal80-footer"),
    },
  };
});
const passed =
  checks.initial.first === "3.40" && checks.initial.second === "1.25" && checks.initial.operation === "Add" && checks.initial.result === "4.65" && checks.initial["first-digits"] === "3,4,0" && checks.initial["second-digits"] === "1,2,5" && checks.initial["result-digits"] === "4,6,5" && checks.initial.misaligned === "3.65" &&
  checks.firstEdited.first === "4.10" && checks.firstEdited.result === "5.35" && checks.secondEdited.second === "0.75" && checks.secondEdited.result === "4.85" &&
  checks.dragged.first === "0.14" && checks.dragged["first-digits"] === "0,1,4" && checks.dragRecorded && checks.subtracted.operation === "Subtract" && checks.subtracted.result === "0.00" &&
  checks.positiveDifference.first === "5.50" && checks.positiveDifference.second === "1.25" && checks.positiveDifference.result === "4.25" &&
  checks.practice.first === "2.75" && checks.practice.second === "0.60" && checks.practice.operation === "Add" && checks.practice.result === "3.35" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.first === "3.40" && checks.restored.second === "1.25" && checks.restored.result === "4.65" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0062-desktop.png") });
await copyFile(reference, path.join(out, "0062-reference.png"));
const report = { mockup: "0062", lessonId: 80, route: "/lessons/numbers-and-arithmetic/80-decimal-operations", objectModel: "dual-editable-hundredths-aligned-place-columns-draggable-digits-base-ten-blocks-calculated-sum-misalignment-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0062-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
