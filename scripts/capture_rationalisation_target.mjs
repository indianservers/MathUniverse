import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0158-interactive-intermediate-expressions-and-manipulation-rationalisation-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2251/lessons/algebra/101-rationalisation";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 919, height: 1711 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0158");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-expression", "data-numerator", "data-radicand", "data-denominator", "data-multiplier", "data-multiplier-label", "data-denominator-result", "data-result", "data-valid", "data-stage", "data-decimal-check", "data-original-decimal", "data-rational-decimal", "data-decimal-match", "data-tab", "data-practice-index", "data-practice-expected", "data-practice-correct", "data-show-practice-steps", "data-share-count", "data-bookmarked", "data-dragging", "data-multiplier-drops", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("switch", { name: "Decimal check" }).click();
checks.decimalOff = await state();
await page.getByRole("switch", { name: "Decimal check" }).click();
checks.decimalOn = await state();
await page.getByLabel("Expression to rationalise").selectOption("root3");
checks.root3 = await state();
await page.getByRole("button", { name: "Use other multiplier", exact: true }).click();
checks.invalidOther = await state();
checks.multiplyDisabled = await page.getByRole("button", { name: /Multiply top and bottom/ }).isDisabled();
await page.getByRole("button", { name: "Use matching multiplier", exact: true }).dragTo(page.getByRole("article", { name: "Multiplier drop target" }));
checks.matchingDrop = await state();
await page.getByRole("button", { name: /Multiply top and bottom/ }).click();
checks.stage2 = await state();
await page.getByRole("button", { name: /Simplify denominator/ }).click();
checks.stage3 = await state();
await page.getByLabel("Expression to rationalise").selectOption("conjugate");
checks.conjugatePreset = await state();
await page.getByRole("button", { name: "Use matching multiplier", exact: true }).click();
checks.invalidConjugateChoice = await state();
await page.getByRole("button", { name: "Use conjugate multiplier", exact: true }).dragTo(page.getByRole("article", { name: "Multiplier drop target" }));
checks.conjugateDrop = await state();
await page.getByRole("button", { name: /Multiply top and bottom/ }).click();
await page.getByRole("button", { name: /Simplify denominator/ }).click();
checks.conjugateComplete = await state();
await page.getByLabel("Practice answer denominator").fill("4");
await page.getByLabel("Practice answer denominator").press("Enter");
checks.wrongPractice = await state();
await page.getByLabel("Practice answer denominator").fill("5");
await page.getByLabel("Practice answer denominator").press("Enter");
checks.correctPractice = await state();
await page.getByRole("button", { name: "Show steps", exact: true }).click();
checks.practiceSteps = await state();
await page.getByRole("button", { name: "Try another", exact: true }).click();
checks.nextPractice = await state();
await page.getByLabel("Practice answer numerator").fill("2√7");
await page.getByLabel("Practice answer denominator").fill("7");
await page.getByLabel("Practice answer denominator").press("Enter");
checks.secondPractice = await state();
await node.getByRole("button", { name: "Formula & Rules", exact: true }).click();
checks.formulaTab = await state();
await node.locator(".rational101-intro").getByRole("button", { name: "Share", exact: true }).click();
await page.getByRole("button", { name: "Bookmark lesson", exact: true }).click();
checks.sharedBookmarked = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor({ timeout: 600000 });
checks.reloaded = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, surface: region(".rational101-page"), regions: { breadcrumb: region(".rational101-breadcrumb"), intro: region(".rational101-intro"), tabs: region(".rational101-tabs"), workspace: region(".rational101-workspace"), flow: region(".rational101-flow"), balance: region(".rational101-balance"), chooser: region(".rational101-chooser"), proof: region(".rational101-proof-row"), lower: region(".rational101-lower"), navigation: region(".rational101-navigation"), tags: region(".rational101-tags"), pro: region(".rational101-sidebar-extra section") } };
});
const passed =
  checks.initial.expression === "root2" && checks.initial.denominator === "√2" && checks.initial.multiplier === "matching" && checks.initial["multiplier-label"] === "√2" && checks.initial["denominator-result"] === "2" && checks.initial.result === "√2/2" && checks.initial.valid === "true" && checks.initial.stage === "3" && checks.initial["original-decimal"] === "0.7071" && checks.initial["rational-decimal"] === "0.7071" && checks.initial["decimal-match"] === "true" &&
  checks.decimalOff["decimal-check"] === "false" && checks.decimalOn["decimal-check"] === "true" && checks.root3.result === "2√3/3" && checks.root3.stage === "0" &&
  checks.invalidOther.valid === "false" && checks.invalidOther["denominator-result"] === "√6" && checks.multiplyDisabled && checks.matchingDrop.multiplier === "matching" && checks.matchingDrop["multiplier-drops"] === "matching" && checks.stage2.stage === "2" && checks.stage3.stage === "3" && checks.stage3.result === "2√3/3" &&
  checks.conjugatePreset.multiplier === "conjugate" && checks.conjugatePreset.result === "2 − √3" && checks.conjugatePreset["denominator-result"] === "1" && checks.invalidConjugateChoice.valid === "false" && checks.conjugateDrop.multiplier === "conjugate" && checks.conjugateDrop["multiplier-drops"] === "conjugate" && checks.conjugateComplete.result === "2 − √3" && checks.conjugateComplete.stage === "3" && checks.conjugateComplete["decimal-match"] === "true" &&
  checks.wrongPractice["practice-correct"] === "false" && checks.correctPractice["practice-correct"] === "true" && checks.practiceSteps["show-practice-steps"] === "true" && checks.nextPractice["practice-index"] === "1" && checks.nextPractice["practice-expected"] === "2√7/7" && checks.secondPractice["practice-correct"] === "true" &&
  checks.formulaTab.tab === "Formula & Rules" && checks.sharedBookmarked["share-count"] === "1" && checks.sharedBookmarked.bookmarked === "true" && checks.reloaded.expression === "root2" && checks.reloaded.result === "√2/2" && checks.reloaded.tab === "Interact" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && metrics.document.height === 1711 && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0158-desktop.png") });
await copyFile(reference, path.join(out, "0158-reference.png"));
const report = { mockup: "0158", lessonId: 101, route: "/lessons/algebra/101-rationalisation", objectModel: "selectable-radical-and-conjugate-denominator-draggable-unity-multiplier-rational-result-decimal-equivalence-graded-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0158-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);
