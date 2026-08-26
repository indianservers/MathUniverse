import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0064-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-recurring-decimals-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/82-recurring-decimals";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1049 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0064");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-numerator", "data-denominator", "data-decimal", "data-cycle", "data-repeat-start", "data-remainders", "data-recurring", "data-visible-repeats", "data-practice-loaded", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

const actionsBeforeDrag = Number(checks.initial.actions);
await page.getByLabel("Repeating digit tile 4").dragTo(page.getByLabel("Repeating digit tile 2"));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await page.getByRole("spinbutton", { name: "Recurring decimal numerator" }).fill("2");
checks.twoThirds = await state();
await page.getByRole("spinbutton", { name: "Recurring decimal denominator" }).fill("6");
await page.getByRole("spinbutton", { name: "Recurring decimal numerator" }).fill("1");
checks.oneSixth = await state();
await page.getByRole("spinbutton", { name: "Recurring decimal denominator" }).fill("2");
checks.terminating = await state();
await page.getByRole("spinbutton", { name: "Recurring decimal denominator" }).fill("3");
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
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".recurring82-page"), regions: { lesson: region(".recurring82-surface"), workspace: region(".recurring82-workspace"), main: region(".recurring82-main"), division: region(".recurring82-division"), loop: region(".recurring82-loop"), side: region(".recurring82-side"), fraction: region(".recurring82-fraction"), facts: region(".recurring82-facts"), exact: region(".recurring82-exact"), warning: region(".recurring82-warning"), info: region(".recurring82-info"), practice: region(".recurring82-practice"), navigation: region(".recurring82-navigation") },
  };
});
const passed =
  checks.initial.numerator === "1" && checks.initial.denominator === "3" && checks.initial.decimal === "0.333…" && checks.initial.cycle === "3" && checks.initial["repeat-start"] === "0" && checks.initial.remainders === "1" && checks.initial.recurring === "true" && checks.initial["visible-repeats"] === "4" &&
  checks.dragged["visible-repeats"] === "2" && checks.dragRecorded && checks.twoThirds.numerator === "2" && checks.twoThirds.decimal === "0.666…" && checks.twoThirds.cycle === "6" && checks.twoThirds.remainders === "2" &&
  checks.oneSixth.numerator === "1" && checks.oneSixth.denominator === "6" && checks.oneSixth.decimal === "0.1666…" && checks.oneSixth.cycle === "6" && checks.oneSixth["repeat-start"] === "1" && checks.oneSixth.remainders === "1,4" &&
  checks.terminating.denominator === "2" && checks.terminating.decimal === "0.5" && checks.terminating.recurring === "false" &&
  checks.practice.numerator === "2" && checks.practice.denominator === "3" && checks.practice.decimal === "0.666…" && checks.practice.cycle === "6" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.numerator === "1" && checks.restored.denominator === "3" && checks.restored.decimal === "0.333…" && checks.restored["visible-repeats"] === "4" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0064-desktop.png") });
await copyFile(reference, path.join(out, "0064-reference.png"));
const report = { mockup: "0064", lessonId: 82, route: "/lessons/numbers-and-arithmetic/82-recurring-decimals", objectModel: "editable-fraction-long-division-remainder-cycle-detection-draggable-repeat-tiles-exact-overbar-rounded-warning-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0064-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
