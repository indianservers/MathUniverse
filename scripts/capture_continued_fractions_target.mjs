import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0056-interactive-foundational-intermediate-numbers-and-number-theory-continued-fractions-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/numbers-and-arithmetic/74-continued-fractions";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1068, height: 1473 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0056");
await node.waitFor({ timeout: 600000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-terms", "data-selected-index", "data-drag-index", "data-inner", "data-middle", "data-convergents", "data-result",
  "data-decimal", "data-active-step", "data-tab", "data-practice-loaded", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByLabel("Edit partial quotient 2").fill("4");
checks.lastTermFour = await state();
await page.getByLabel("Partial quotient 0: 1").dragTo(page.getByLabel("Partial quotient 2: 4"));
checks.draggedTerms = await state();
await page.getByLabel("Edit partial quotient 2").fill("3");
checks.editedDragged = await state();
await node.getByRole("button", { name: /Middle Evaluate/ }).click();
checks.middleStep = await state();
await node.getByRole("button", { name: /Outer Evaluate/ }).click();
checks.outerStep = await state();
await node.getByRole("button", { name: "Number Line" }).click();
checks.numberLineTab = await state();
await node.getByRole("button", { name: /Try: Evaluate/ }).click();
checks.practice = await state();
await page.getByLabel("Edit partial quotient 0").fill("1");
await page.getByLabel("Edit partial quotient 1").fill("2");
await page.getByLabel("Edit partial quotient 2").fill("3");
await node.getByRole("button", { name: /Deepest Evaluate/ }).click();
await node.getByRole("button", { name: "Inside-Out Evaluation" }).click();
await page.locator(".continued74-proof > h2").click();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".continued74-page"), regions: {
      hero: region(".continued74-hero"), tabs: region(".continued74-tabs"), layout: region(".continued74-layout"), proof: region(".continued74-proof"),
      nested: region(".continued74-nested"), middle: region(".continued74-middle"), outer: region(".continued74-outer"), final: region(".continued74-final"),
      side: region(".continued74-side"), partials: region(".continued74-partials"), convergents: region(".continued74-convergents"),
      decimal: region(".continued74-decimal"), warning: region(".continued74-warning"), tryNext: region(".continued74-try"),
      numberLine: region(".continued74-number-line"), navigation: region(".continued74-navigation"), footer: region(".continued74-footer"),
    },
  };
});
const passed =
  checks.initial.terms === "1,2,3" && checks.initial.inner === "1/3" && checks.initial.middle === "7/3" && checks.initial.convergents === "1,3/2,10/7" && checks.initial.result === "10/7" && checks.initial.decimal === "1.429" &&
  checks.lastTermFour.terms === "1,2,4" && checks.lastTermFour.inner === "1/4" && checks.lastTermFour.middle === "9/4" && checks.lastTermFour.result === "13/9" &&
  checks.draggedTerms.terms === "4,2,1" && checks.draggedTerms.result === "13/3" && checks.draggedTerms["selected-index"] === "2" &&
  checks.editedDragged.terms === "4,2,3" && checks.editedDragged.result === "31/7" && checks.middleStep["active-step"] === "2" && checks.outerStep["active-step"] === "3" &&
  checks.numberLineTab.tab === "Number Line" && checks.practice.terms === "2,1,4" && checks.practice.convergents === "2,3,14/5" && checks.practice.result === "14/5" && checks.practice.decimal === "2.800" && checks.practice["practice-loaded"] === "true" &&
  checks.restored.terms === "1,2,3" && checks.restored.result === "10/7" && checks.restored["active-step"] === "1" && checks.restored.tab === "Inside-Out Evaluation" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0056-desktop.png") });
await copyFile(reference, path.join(out, "0056-reference.png"));
const report = { mockup: "0056", lessonId: 74, route: "/lessons/numbers-and-arithmetic/74-continued-fractions", objectModel: "editable-draggable-partial-quotients-exact-rational-inside-out-layers-convergents-decimal-number-line-practice-model", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0056-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
