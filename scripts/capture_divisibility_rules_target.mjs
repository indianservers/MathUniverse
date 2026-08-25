import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0053-interactive-foundational-intermediate-numbers-and-number-theory-divisibility-rules-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/71-divisibility-rules";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1462, height: 1076 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0053");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-number", "data-digits", "data-divisor", "data-digit-sum", "data-divisible", "data-quotient",
  "data-remainder", "data-drag-digit", "data-machine-runs", "data-practice-checked", "data-practice-result", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await node.getByRole("button", { name: /2\s*Even/ }).click();
checks.ruleTwo = await state();
await node.getByRole("button", { name: /5\s*Ends in 0 or 5/ }).click();
checks.ruleFive = await state();
await page.getByLabel("Number to test").fill("235");
checks.twoThirtyFive = await state();
await page.getByLabel("Digit 1: 2").dragTo(page.getByLabel("Digit 3: 5"));
checks.draggedDigits = await state();
await node.getByRole("button", { name: /3\s*Digit sum/ }).click();
checks.ruleThree = await state();
await page.getByLabel("Run divisibility machine").click();
checks.machine = await state();
await node.getByRole("button", { name: /Check your answer/ }).click();
checks.practice = await state();
await page.getByLabel("Number to test").fill("234");
await node.getByRole("button", { name: /9\s*Digit sum/ }).click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".divisibility71-page"), regions: {
      panel: region(".divisibility71-surface"), title: region(".divisibility71-title"), rules: region(".divisibility71-rules"),
      lab: region(".divisibility71-lab"), stepOne: region(".divisibility71-step-one"), machine: region(".divisibility71-machine"),
      stepTwo: region(".divisibility71-step-two"), stepThree: region(".divisibility71-step-three"), side: region(".divisibility71-side"),
      summary: region(".divisibility71-summary"), misconception: region(".divisibility71-misconception"),
      practice: region(".divisibility71-practice"), navigation: region(".divisibility71-navigation"),
    },
  };
});
const passed =
  checks.initial.number === "234" && checks.initial.digits === "2,3,4" && checks.initial.divisor === "9" &&
  checks.initial["digit-sum"] === "9" && checks.initial.divisible === "true" && checks.initial.remainder === "0" &&
  checks.ruleTwo.divisor === "2" && checks.ruleTwo.divisible === "true" && checks.ruleFive.divisor === "5" &&
  checks.ruleFive.divisible === "false" && checks.ruleFive.remainder === "4" && checks.twoThirtyFive.number === "235" &&
  checks.twoThirtyFive.divisible === "true" && checks.draggedDigits.number === "532" && checks.draggedDigits.digits === "5,3,2" &&
  checks.draggedDigits.divisible === "false" && checks.ruleThree.divisor === "3" && checks.ruleThree["digit-sum"] === "10" &&
  checks.ruleThree.divisible === "false" && checks.ruleThree.remainder === "1" && checks.machine["machine-runs"] === "1" &&
  checks.practice["practice-checked"] === "true" && checks.practice["practice-result"] === "true" &&
  checks.restored.number === "234" && checks.restored.divisor === "9" && checks.restored.divisible === "true" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0053-desktop.png") });
await copyFile(reference, path.join(out, "0053-reference.png"));
const report = {
  mockup: "0053", lessonId: 71, route: "/lessons/numbers-and-arithmetic/71-divisibility-rules",
  objectModel: "editable-three-digit-number-rule-selector-draggable-digit-reorder-rule-specific-evidence-machine-exact-division-misconception-practice-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0053-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
