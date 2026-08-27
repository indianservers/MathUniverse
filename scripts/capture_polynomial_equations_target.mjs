import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0172-interactive-intermediate-advanced-equations-and-inequalities-polynomial-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/115-polynomial-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1003, height: 1569 },
});
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0172");
await node.waitFor({ timeout: 600000 });
const names = [
  "roots",
  "coefficients",
  "factor-enabled",
  "test-value",
  "test-result",
  "all-checked",
  "practice-index",
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

await page.getByRole("button", { name: "Expanded form" }).click();
checks.expanded = await state();
await page
  .getByRole("spinbutton", { name: "Polynomial root 2", exact: true })
  .fill("4");
checks.editedRoot = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.locator(".poly115-stack .factor-2 .poly115-toggle").click();
checks.factorDropped = await state();
await page.getByRole("button", { name: "Check all" }).click();
checks.checkedMissing = await state();
await page.locator(".poly115-stack .factor-2 .poly115-toggle").click();
await page.getByRole("button", { name: "Check all" }).click();
checks.checkedAll = await state();

const graph = page.getByRole("img", { name: "Cubic graph with roots 1, 2, 3" });
const graphBox = await graph.boundingBox();
const marker = page.getByRole("slider", { name: "Drag polynomial root 1" });
const markerBox = await marker.boundingBox();
if (graphBox && markerBox) {
  await page.mouse.move(
    markerBox.x + markerBox.width / 2,
    markerBox.y + markerBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    markerBox.x - graphBox.width / 7.5,
    markerBox.y + markerBox.height / 2,
    { steps: 6 },
  );
  await page.mouse.up();
}
checks.draggedRoot = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByLabel("Polynomial root test value").fill("4");
checks.testWrong = await state();
await page.getByLabel("Polynomial root test value").fill("3");
checks.testRoot = await state();
await page.getByLabel("Polynomial practice root 1").fill("0");
await page.getByRole("button", { name: "Check answer" }).click();
checks.practiceWrong = await state();
await page.getByLabel("Polynomial practice root 1").fill("-1");
await page
  .locator(".poly115-practice article")
  .nth(1)
  .getByRole("button")
  .click();
checks.practiceCorrect = await state();
await page.getByRole("button", { name: "New practice" }).click();
checks.newPractice = await state();
await page.getByRole("button", { name: "Examples" }).click();
checks.example = await state();
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
      surface: region(".poly115-page"),
      intro: region(".poly115-intro"),
      tabs: region(".poly115-tabs"),
      lab: region(".poly115-lab"),
      graph: region(".poly115-graph-card"),
      practice: region(".poly115-practice"),
      navigation: region(".poly115-adjacent"),
      footer: region(".poly115-footer"),
    },
  };
});
const passed =
  checks.initial.roots === "1,2,3" &&
  checks.initial.coefficients === "1,-6,11,-6" &&
  checks.initial["test-result"] === "0" &&
  checks.initial["all-checked"] === "true" &&
  checks.editedRoot.roots === "1,4,3" &&
  checks.editedRoot.coefficients === "1,-8,19,-12" &&
  checks.factorDropped["factor-enabled"] === "true,false,true" &&
  checks.factorDropped["all-checked"] === "false" &&
  checks.checkedMissing["all-checked"] === "false" &&
  checks.checkedAll["all-checked"] === "true" &&
  checks.draggedRoot.roots !== "1,2,3" &&
  checks.testWrong["test-result"] === "6" &&
  checks.testRoot["test-result"] === "0" &&
  checks.practiceWrong["practice-correct"] === "false" &&
  checks.practiceCorrect["practice-correct"] === "true" &&
  checks.newPractice["practice-index"] === "1" &&
  checks.example.roots === "-2,1,3" &&
  checks.reset.roots === "1,2,3" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0172-desktop.png") });
await copyFile(reference, path.join(out, "0172-reference.png"));
const report = {
  mockup: "0172",
  lessonId: 115,
  route: "/lessons/algebra/115-polynomial-equations",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0172-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
