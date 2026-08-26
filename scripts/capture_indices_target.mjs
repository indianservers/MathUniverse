import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0156-interactive-intermediate-expressions-and-manipulation-indices-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/algebra/99-indices";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1023, height: 1537 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0156");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-base", "data-first-exponent", "data-second-exponent", "data-combined-exponent", "data-first-power", "data-second-power", "data-result-power", "data-left-value", "data-right-value", "data-equal", "data-check-value", "data-checked", "data-show-factors", "data-add-exponents", "data-tab", "data-dragging", "data-factor-drops", "data-practice-answer", "data-practice-correct", "data-share-count", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Increase First exponent").click();
checks.firstFour = await state();
await page.getByRole("spinbutton", { name: "Second exponent", exact: true }).fill("3");
checks.secondThree = await state();
await page.getByLabel("Base").selectOption("y");
checks.baseY = await state();
await page.getByRole("spinbutton", { name: "Check a value for y", exact: true }).fill("2");
await page.getByRole("button", { name: "Check value", exact: true }).click();
checks.checkTwo = await state();
await page.getByRole("switch", { name: "Show repeated factors" }).click();
checks.factorsHidden = await state();
await page.getByRole("switch", { name: "Add exponents" }).click();
checks.additionOff = await state();
await page.getByRole("switch", { name: "Add exponents" }).click();
checks.additionOn = await state();
await node.locator(".indices99-intro").getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.getByLabel("Drag first power factor 1").dragTo(page.locator(".indices99-combined"));
await page.getByLabel("Drag second power factor 1").dragTo(page.locator(".indices99-combined"));
checks.factorDrops = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practiceTab = await state();
await page.getByLabel("Practice answer").fill("y⁶");
await page.getByRole("button", { name: "Check answer" }).click();
checks.wrongPractice = await state();
await page.getByLabel("Practice answer").fill("y⁷");
await page.getByLabel("Practice answer").press("Enter");
checks.correctPractice = await state();
await page.getByRole("button", { name: "Share" }).click();
checks.shared = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".indices99-page"), regions: { intro: region(".indices99-intro"), tabs: region(".indices99-tabs"), main: region(".indices99-main"), lab: region(".indices99-lab"), powers: region(".indices99-powers"), combined: region(".indices99-combined"), controls: region(".indices99-controls"), notes: region(".indices99-notes"), practice: region(".indices99-practice"), navigation: region(".indices99-navigation") } };
});
const passed =
  checks.initial.base === "x" && checks.initial["first-exponent"] === "3" && checks.initial["second-exponent"] === "2" && checks.initial["combined-exponent"] === "5" && checks.initial["first-power"] === "x³" && checks.initial["second-power"] === "x²" && checks.initial["result-power"] === "x⁵" && checks.initial["left-value"] === "1024" && checks.initial["right-value"] === "1024" && checks.initial.equal === "true" &&
  checks.firstFour["first-exponent"] === "4" && checks.firstFour["combined-exponent"] === "6" && checks.firstFour["result-power"] === "x⁶" && checks.firstFour["left-value"] === "4096" &&
  checks.secondThree["second-exponent"] === "3" && checks.secondThree["combined-exponent"] === "7" && checks.secondThree["left-value"] === "16384" && checks.secondThree["right-value"] === "16384" &&
  checks.baseY.base === "y" && checks.baseY["result-power"] === "y⁷" && checks.checkTwo["check-value"] === "2" && checks.checkTwo["left-value"] === "128" && checks.checkTwo["right-value"] === "128" && checks.checkTwo.checked === "true" &&
  checks.factorsHidden["show-factors"] === "false" && checks.additionOff["add-exponents"] === "false" && checks.additionOff["combined-exponent"] === "4" && checks.additionOff["result-power"] === "y⁴" && checks.additionOn["combined-exponent"] === "7" &&
  checks.reset.base === "x" && checks.reset["combined-exponent"] === "5" && checks.factorDrops["factor-drops"] === "blue-1,purple-1" && checks.practiceTab.tab === "Practice" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.shared["share-count"] === "1" &&
  checks.restored.base === "x" && checks.restored["result-power"] === "x⁵" && checks.restored.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0156-desktop.png") });
await copyFile(reference, path.join(out, "0156-reference.png"));
const report = { mockup: "0156", lessonId: 99, route: "/lessons/algebra/99-indices", objectModel: "editable-same-base-repeated-factor-draggable-product-of-powers-numeric-equality-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0156-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
