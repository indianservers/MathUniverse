import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0175-interactive-intermediate-advanced-equations-and-inequalities-exponential-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/118-exponential-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 941, height: 1672 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0175");
await node.waitFor({ timeout: 600000 });
const names = [
  "problem",
  "exponent",
  "matchable",
  "ladder-built",
  "matched",
  "checked",
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

await page.getByLabel("Exponential base").selectOption("3");
checks.unmatchedBase = await state();
await page.getByLabel("Exponential target value").fill("27");
checks.matchedTarget = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();

const graph = page.getByRole("img", {
  name: "Graph of 2 to the x with target 32",
});
const graphBox = await graph.boundingBox();
const marker = page.getByRole("slider", {
  name: "Drag exponential solution exponent",
});
const markerBox = await marker.boundingBox();
if (graphBox && markerBox) {
  await page.mouse.move(
    markerBox.x + markerBox.width / 2,
    markerBox.y + markerBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    markerBox.x - graphBox.width / 9,
    markerBox.y + markerBox.height / 2,
    { steps: 6 },
  );
  await page.mouse.up();
}
checks.draggedExponent = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "Examples" }).click();
checks.example = await state();
await page.getByRole("button", { name: "① Build power ladder" }).click();
await page
  .getByRole("button", { name: "Drag matching power 3 to 3" })
  .dragTo(page.getByLabel("Matching power drop target"));
checks.rungDropped = await state();
await page.getByRole("button", { name: "③ Check value" }).click();
checks.valueChecked = await state();

await page.getByLabel("Exponential practice answer").fill("3");
await page.getByRole("button", { name: "▣ Check answer" }).click();
checks.practiceWrong = await state();
await page.getByLabel("Exponential practice answer").fill("4");
await page.getByRole("button", { name: "▣ Check answer" }).click();
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "New practice" }).click();
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
      surface: region(".exp118-page"),
      intro: region(".exp118-intro"),
      tabs: region(".exp118-tabs"),
      lab: region(".exp118-lab"),
      work: region(".exp118-work"),
      graph: region(".graph-card-exp"),
      warning: region(".exp118-warning"),
      practice: region(".exp118-practice"),
      navigation: region(".exp118-adjacent"),
      footer: region(".exp118-footer"),
    },
  };
});
const passed =
  checks.initial.problem === "2,32" &&
  checks.initial.exponent === "5" &&
  checks.initial.matchable === "true" &&
  checks.initial.matched === "true" &&
  checks.initial.checked === "true" &&
  checks.initial["practice-correct"] === "true" &&
  checks.unmatchedBase.problem === "3,32" &&
  checks.unmatchedBase.matchable === "false" &&
  checks.matchedTarget.problem === "3,27" &&
  checks.matchedTarget.exponent === "3" &&
  checks.matchedTarget.matchable === "true" &&
  checks.draggedExponent.problem !== "2,32" &&
  checks.example.problem === "3,27" &&
  checks.example["ladder-built"] === "false" &&
  checks.rungDropped.matched === "true" &&
  checks.rungDropped["invalid-drop"] === "false" &&
  checks.valueChecked.checked === "true" &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.newPractice["practice-index"] === "1" &&
  checks.reset.problem === "2,32" &&
  checks.reset.exponent === "5" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0175-desktop.png") });
await copyFile(reference, path.join(out, "0175-reference.png"));
const report = {
  mockup: "0175",
  lessonId: 118,
  route: "/lessons/algebra/118-exponential-equations",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0175-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
