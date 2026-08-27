import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0181-interactive-intermediate-advanced-equations-and-inequalities-quadratic-inequalities-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2254/lessons/algebra/124-quadratic-inequalities";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 972, height: 1617 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0181");
await node.waitFor({ timeout: 600000 });
const names = ["roots", "relation", "solution", "actions"];
const state = () => node.evaluate((element, attributes) => Object.fromEntries(attributes.map((name) => [name, element.getAttribute(`data-${name}`)])), names);
const checks = { initial: await state() };

const line = node.locator(".quad124-sign-line");
const first = node.getByRole("slider", { name: "Drag quadratic first root" });
const lineBox = await line.boundingBox(); const firstBox = await first.boundingBox();
if (lineBox && firstBox) {
  await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2); await page.mouse.down();
  await page.mouse.move(firstBox.x + firstBox.width / 2 - (lineBox.width * 68) / 692, firstBox.y + firstBox.height / 2, { steps: 7 }); await page.mouse.up();
}
checks.draggedFirst = await state();
const second = node.getByRole("slider", { name: "Drag quadratic second root" }); const secondBox = await second.boundingBox();
if (lineBox && secondBox) {
  await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2); await page.mouse.down();
  await page.mouse.move(secondBox.x + secondBox.width / 2 + (lineBox.width * 68) / 692, secondBox.y + secondBox.height / 2, { steps: 7 }); await page.mouse.up();
}
checks.draggedSecond = await state();
await node.locator(".quad124-summary button").nth(2).click(); checks.inclusive = await state();
await node.locator(".quad124-summary button").nth(0).click(); checks.downward = await state();
await page.getByRole("button", { name: "Examples" }).click(); checks.example = await state();
const exampleFirst = node.getByRole("slider", { name: "Drag quadratic first root" }); await exampleFirst.focus(); await exampleFirst.press("ArrowRight"); checks.keyboardRoot = await state();
await page.getByRole("button", { name: "Check solution" }).click(); checks.practice = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click(); checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null; };
  return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, regions: {
    surface: region(".quad124-page"), intro: region(".quad124-intro"), tabs: region(".quad124-tabs"), lab: region(".quad124-lab"), summary: region(".quad124-summary"), chart: region(".quad124-chart"), middle: region(".quad124-middle"), lower: region(".quad124-lower"), note: region(".quad124-note"), tags: region(".quad124-tags"), navigation: region(".quad124-adjacent"), footer: region(".quad124-footer"),
  } };
});
const passed = checks.initial.roots === "2,3" && checks.initial.relation === "1,>" && checks.initial.solution === "(−∞, 2) ∪ (3, ∞)" &&
  checks.draggedFirst.roots === "1,3" && checks.draggedFirst.solution === "(−∞, 1) ∪ (3, ∞)" &&
  checks.draggedSecond.roots === "1,4" && checks.draggedSecond.solution === "(−∞, 1) ∪ (4, ∞)" &&
  checks.inclusive.relation === "1,>=" && checks.inclusive.solution === "(−∞, 1] ∪ [4, ∞)" &&
  checks.downward.relation === "-1,>=" && checks.downward.solution === "[1, 4]" &&
  checks.example.roots === "-2,4" && checks.example.relation === "-1,>=" && checks.example.solution === "[-2, 4]" &&
  checks.keyboardRoot.roots === "-1,4" && checks.keyboardRoot.solution === "[-1, 4]" &&
  checks.reset.roots === "2,3" && checks.reset.relation === "1,>" && checks.reset.solution === "(−∞, 2) ∪ (3, ∞)" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0181-desktop.png") }); await copyFile(reference, path.join(out, "0181-reference.png"));
const report = { mockup: "0181", lessonId: 124, route: "/lessons/algebra/124-quadratic-inequalities", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0181-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2));
await browser.close(); process.exit(passed ? 0 : 1);
