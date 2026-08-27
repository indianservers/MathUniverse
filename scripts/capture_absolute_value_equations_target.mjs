import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0178-interactive-intermediate-advanced-equations-and-inequalities-absolute-value-equations-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2254/lessons/algebra/121-absolute-value-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1003, height: 1568 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0178");
await node.waitFor({ timeout: 600000 });
const names = ["problem", "solutions", "solvable", "practice-checked", "actions"];
const state = () => node.evaluate((element, attributes) => Object.fromEntries(attributes.map((name) => [name, element.getAttribute(`data-${name}`)])), names);
const checks = { initial: await state() };

const line = page.getByRole("img", { name: "Number line centered at 3 with solutions 1 and 5" });
const center = page.getByRole("slider", { name: "Drag absolute value center" });
const lineBox = await line.boundingBox();
const centerBox = await center.boundingBox();
if (lineBox && centerBox) {
  await page.mouse.move(centerBox.x + centerBox.width / 2, centerBox.y + centerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(centerBox.x + centerBox.width / 2 + (lineBox.width * 52) / 450, centerBox.y + centerBox.height / 2, { steps: 7 });
  await page.mouse.up();
}
checks.draggedCenter = await state();

const movedLine = page.getByRole("img", { name: "Number line centered at 4 with solutions 2 and 6" });
const right = page.getByRole("slider", { name: "Drag right absolute value solution" });
const movedLineBox = await movedLine.boundingBox();
const rightBox = await right.boundingBox();
if (movedLineBox && rightBox) {
  await page.mouse.move(rightBox.x + rightBox.width / 2, rightBox.y + rightBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(rightBox.x + rightBox.width / 2 + (movedLineBox.width * 52) / 450, rightBox.y + rightBox.height / 2, { steps: 7 });
  await page.mouse.up();
}
checks.draggedDistance = await state();
await page.getByLabel("Absolute-value distance").fill("-2");
checks.negativeDistance = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "Examples" }).click();
checks.example = await state();
await node.getByRole("button", { name: "Practice", exact: true }).click();
checks.practice = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    regions: {
      surface: region(".abs121-page"), intro: region(".abs121-intro"), tabs: region(".abs121-tabs"), lab: region(".abs121-lab"),
      body: region(".abs121-body"), numberLine: region(".abs121-number-card"), branches: region(".abs121-branches"),
      reasoning: region(".abs121-reasoning"), pitfall: region(".abs121-pitfall"), practice: region(".abs121-practice"),
      tags: region(".abs121-tags"), navigation: region(".abs121-adjacent"), footer: region(".abs121-footer"),
    },
  };
});
const passed =
  checks.initial.problem === "3,2" && checks.initial.solutions === "1,5" && checks.initial.solvable === "true" &&
  checks.draggedCenter.problem === "4,2" && checks.draggedCenter.solutions === "2,6" &&
  checks.draggedDistance.problem === "4,3" && checks.draggedDistance.solutions === "1,7" &&
  checks.negativeDistance.problem === "4,-2" && checks.negativeDistance.solutions === "none" && checks.negativeDistance.solvable === "false" &&
  checks.example.problem === "-4,3" && checks.example.solutions === "-7,-1" &&
  checks.practice["practice-checked"] === "true" && checks.reset.problem === "3,2" && checks.reset.solutions === "1,5" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0178-desktop.png") });
await copyFile(reference, path.join(out, "0178-reference.png"));
const report = { mockup: "0178", lessonId: 121, route: "/lessons/algebra/121-absolute-value-equations", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0178-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
