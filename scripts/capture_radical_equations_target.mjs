import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0174-interactive-intermediate-advanced-equations-and-inequalities-radical-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/117-radical-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 911, height: 1726 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0174");
await node.waitFor({ timeout: 600000 });
const names = [
  "problem",
  "domain",
  "solution",
  "squared",
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

await page.locator(".rad117-equation").getByRole("button").click();
await page.getByLabel("Radical offset").fill("4");
checks.editedOffset = await state();
await page.locator(".rad117-equation").getByRole("button").click();
await page.getByRole("button", { name: "Reset", exact: true }).click();

const line = page.getByRole("img", { name: "Domain begins at -1" });
const lineBox = await line.boundingBox();
const marker = page.getByRole("slider", {
  name: "Drag radical domain boundary",
});
const markerBox = await marker.boundingBox();
if (lineBox && markerBox) {
  await page.mouse.move(
    markerBox.x + markerBox.width / 2,
    markerBox.y + markerBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    markerBox.x + lineBox.width / 10,
    markerBox.y + markerBox.height / 2,
    { steps: 6 },
  );
  await page.mouse.up();
}
checks.draggedDomain = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "New Example" }).click();
checks.newExample = await state();
await page
  .getByRole("button", { name: "Drag square both sides for x + 4" })
  .dragTo(page.getByLabel("Square both sides drop target"));
checks.squareDropped = await state();
await page.getByRole("button", { name: "Check candidate" }).click();
checks.candidateChecked = await state();

await page.getByLabel("Radical practice answer").fill("26");
await page.getByRole("button", { name: "Check answer" }).click();
checks.practiceWrong = await state();
await page.getByLabel("Radical practice answer").fill("27");
await page.locator(".rad117-practice article").last().getByRole("button").click();
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
      surface: region(".rad117-page"),
      intro: region(".rad117-intro"),
      main: region(".rad117-main"),
      lab: region(".rad117-lab"),
      rail: region(".rad117-rail"),
      isolate: region(".rad117-step.isolate"),
      square: region(".rad117-step.square"),
      solve: region(".rad117-step.solve"),
      check: region(".rad117-step.check"),
      practice: region(".rad117-practice"),
      navigation: region(".rad117-adjacent"),
      footer: region(".rad117-footer"),
    },
  };
});
const passed =
  checks.initial.problem === "1,4" &&
  checks.initial.domain === "-1" &&
  checks.initial.solution === "15" &&
  checks.initial.squared === "true" &&
  checks.initial["candidate-checked"] === "true" &&
  checks.initial["practice-correct"] === "true" &&
  checks.editedOffset.problem === "4,4" &&
  checks.editedOffset.domain === "-4" &&
  checks.editedOffset.solution === "12" &&
  checks.draggedDomain.problem !== "1,4" &&
  checks.newExample.problem === "4,5" &&
  checks.newExample.solution === "21" &&
  checks.newExample.squared === "false" &&
  checks.squareDropped.squared === "true" &&
  checks.squareDropped["invalid-drop"] === "false" &&
  checks.candidateChecked["candidate-checked"] === "true" &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.newPractice["practice-index"] === "1" &&
  checks.reset.problem === "1,4" &&
  checks.reset.solution === "15" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0174-desktop.png") });
await copyFile(reference, path.join(out, "0174-reference.png"));
const report = {
  mockup: "0174",
  lessonId: 117,
  route: "/lessons/algebra/117-radical-equations",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0174-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
