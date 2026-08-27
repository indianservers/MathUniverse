import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0173-interactive-intermediate-advanced-equations-and-inequalities-rational-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/116-rational-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 995, height: 1581 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0173");
await node.waitFor({ timeout: 600000 });
const names = [
  "problem",
  "answer",
  "cleared",
  "candidate-checked",
  "dragging",
  "invalid-drop",
  "practice-index",
  "practice-answer",
  "practice-correct",
  "actions",
];
const state = () =>
  node.evaluate(
    (element, attributes) =>
      Object.fromEntries(
        attributes.map((name) => [name, element.getAttribute(`data-${name}`)]),
      ),
    names,
  );
const checks = { initial: await state() };

await page
  .locator(".restriction-top article")
  .first()
  .getByRole("button")
  .click();
await page.getByLabel("Rational restriction").fill("3");
checks.editedRestriction = await state();
await page
  .locator(".restriction-top article")
  .first()
  .getByRole("button")
  .click();
await page.getByRole("button", { name: "Reset", exact: true }).click();

const line = page.getByRole("img", {
  name: "Number line with forbidden value 2",
});
const lineBox = await line.boundingBox();
const marker = page.getByRole("slider", {
  name: "Drag forbidden denominator value",
});
const markerBox = await marker.boundingBox();
if (lineBox && markerBox) {
  await page.mouse.move(
    markerBox.x + markerBox.width / 2,
    markerBox.y + markerBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    markerBox.x - lineBox.width / 9,
    markerBox.y + markerBox.height / 2,
    { steps: 6 },
  );
  await page.mouse.up();
}
checks.draggedRestriction = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "New Problem" }).click();
checks.newProblem = await state();
await page
  .getByRole("button", { name: "Drag multiplier x − 1" })
  .dragTo(page.getByLabel("Apply rational multiplier to both sides"));
checks.multiplierDropped = await state();
await page.getByRole("button", { name: "Check candidate" }).click();
checks.candidateChecked = await state();

await page.getByLabel("Rational practice answer").fill("0");
await page.getByRole("button", { name: "Check All" }).click();
checks.practiceWrong = await state();
await page.getByLabel("Rational practice answer").fill("-1/2");
await page.getByRole("button", { name: "Check All" }).click();
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "New Practice" }).click();
checks.newPractice = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    regions: {
      surface: region(".rat116-page"),
      intro: region(".rat116-intro"),
      toolbar: region(".rat116-toolbar"),
      workspace: region(".rat116-workspace"),
      restriction: region(".rat116-step.restriction"),
      clearing: region(".rat116-step.clearing"),
      solving: region(".rat116-step.solving"),
      checking: region(".rat116-step.checking"),
      practice: region(".rat116-practice"),
      navigation: region(".rat116-adjacent"),
      footer: region(".rat116-footer"),
    },
  };
});
const passed =
  checks.initial.problem === "1,2,3" &&
  checks.initial.answer === "7/3" &&
  checks.initial.cleared === "true" &&
  checks.initial["candidate-checked"] === "true" &&
  checks.initial["practice-correct"] === "true" &&
  checks.editedRestriction.problem === "1,3,3" &&
  checks.editedRestriction.answer === "10/3" &&
  checks.draggedRestriction.problem !== "1,2,3" &&
  checks.newProblem.problem === "2,1,4" &&
  checks.newProblem.answer === "3/2" &&
  checks.newProblem.cleared === "false" &&
  checks.multiplierDropped.cleared === "true" &&
  checks.multiplierDropped["invalid-drop"] === "false" &&
  checks.candidateChecked["candidate-checked"] === "true" &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.newPractice["practice-index"] === "1" &&
  checks.reset.problem === "1,2,3" &&
  checks.reset.answer === "7/3" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0173-desktop.png") });
await copyFile(reference, path.join(out, "0173-reference.png"));
const report = {
  mockup: "0173",
  lessonId: 116,
  route: "/lessons/algebra/116-rational-equations",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0173-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
