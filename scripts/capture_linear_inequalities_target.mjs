import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0179-interactive-intermediate-advanced-equations-and-inequalities-linear-inequalities-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2254/lessons/algebra/122-linear-inequalities";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 930, height: 1691 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0179");
await node.waitFor({ timeout: 600000 });
const names = ["problem", "boundary", "solved-relation", "flipped", "interval", "actions"];
const state = () => node.evaluate((element, attributes) => Object.fromEntries(attributes.map((name) => [name, element.getAttribute(`data-${name}`)])), names);
const checks = { initial: await state() };

const line = page.getByRole("img", { name: "Draggable solution line at 3" });
const handle = page.getByRole("slider", { name: "Drag linear inequality boundary" });
const lineBox = await line.boundingBox();
const handleBox = await handle.boundingBox();
if (lineBox && handleBox) {
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + (lineBox.width * 28) / 430, handleBox.y + handleBox.height / 2, { steps: 6 });
  await page.mouse.up();
}
checks.draggedBoundary = await state();
await page.getByLabel("Linear inequality coefficient").fill("-2");
checks.negativeCoefficient = await state();
await page.getByLabel("Linear inequality relation").selectOption(">=");
checks.closedFlipped = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "Examples" }).click();
checks.example = await state();
await node.getByRole("button", { name: "Try similar" }).click();
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
      surface: region(".lin122-page"), intro: region(".lin122-intro"), tabs: region(".lin122-tabs"), lab: region(".lin122-lab"),
      body: region(".lin122-body"), equation: region(".lin122-equation"), algebra: region(".lin122-algebra"), graph: region(".lin122-graph"),
      checks: region(".lin122-checks"), summary: region(".lin122-summary"), warning: region(".lin122-warning"), practice: region(".lin122-practice"),
      tip: region(".lin122-tip"), navigation: region(".lin122-adjacent"), footer: region(".lin122-footer"),
    },
  };
});
const passed =
  checks.initial.problem === "2,3,>,9" && checks.initial.boundary === "3" && checks.initial["solved-relation"] === ">" && checks.initial.interval === "(3, ∞)" &&
  checks.draggedBoundary.problem === "2,3,>,11" && checks.draggedBoundary.boundary === "4" &&
  checks.negativeCoefficient.problem === "-2,3,>,11" && checks.negativeCoefficient.boundary === "-4" && checks.negativeCoefficient["solved-relation"] === "<" && checks.negativeCoefficient.flipped === "true" &&
  checks.closedFlipped["solved-relation"] === "<=" && checks.closedFlipped.interval === "(-∞, -4]" &&
  checks.example.problem === "-2,0,<,6" && checks.example.boundary === "-3" && checks.example["solved-relation"] === ">" &&
  checks.practice.problem === "5,-4,<=,11" && checks.practice.boundary === "3" && checks.practice.interval === "(-∞, 3]" &&
  checks.reset.problem === "2,3,>,9" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0179-desktop.png") });
await copyFile(reference, path.join(out, "0179-reference.png"));
const report = { mockup: "0179", lessonId: 122, route: "/lessons/algebra/122-linear-inequalities", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0179-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
