import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0180-interactive-intermediate-advanced-equations-and-inequalities-compound-inequalities-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2254/lessons/algebra/123-compound-inequalities";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 911, height: 1726 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0180");
await node.waitFor({ timeout: 600000 });
const names = ["problem", "interval", "empty", "actions"];
const state = () => node.evaluate((element, attributes) => Object.fromEntries(attributes.map((name) => [name, element.getAttribute(`data-${name}`)])), names);
const checks = { initial: await state() };

const combined = node.locator(".comp123-lines").getByRole("img", { name: "combined compound inequality number line" });
const lowerHandle = node.getByRole("slider", { name: "Drag compound lower boundary" });
const combinedBox = await combined.boundingBox();
const lowerBox = await lowerHandle.boundingBox();
if (combinedBox && lowerBox) {
  await page.mouse.move(lowerBox.x + lowerBox.width / 2, lowerBox.y + lowerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(lowerBox.x + lowerBox.width / 2 + (combinedBox.width * 44) / 390, lowerBox.y + lowerBox.height / 2, { steps: 6 });
  await page.mouse.up();
}
checks.draggedLower = await state();

const upperHandle = node.getByRole("slider", { name: "Drag compound upper boundary" });
const upperBox = await upperHandle.boundingBox();
if (combinedBox && upperBox) {
  await page.mouse.move(upperBox.x + upperBox.width / 2, upperBox.y + upperBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(upperBox.x + upperBox.width / 2 + (combinedBox.width * 44) / 390, upperBox.y + upperBox.height / 2, { steps: 6 });
  await page.mouse.up();
}
checks.draggedUpper = await state();
await lowerHandle.focus();
await lowerHandle.press("Enter");
checks.closedLower = await state();
for (let index = 0; index < 5; index += 1) await lowerHandle.press("ArrowRight");
checks.emptyIntersection = await state();

await page.getByRole("button", { name: "Reset", exact: true }).click();
await page.getByRole("button", { name: "Examples" }).click();
checks.unionExample = await state();
const unionUpper = node.getByRole("slider", { name: "Drag compound upper boundary" });
await unionUpper.focus();
await unionUpper.press("Enter");
checks.openUnionEndpoint = await state();
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
      surface: region(".comp123-page"), intro: region(".comp123-intro"), tabs: region(".comp123-tabs"), lab: region(".comp123-lab"),
      top: region(".comp123-top"), lines: region(".comp123-lines"), rail: region(".comp123-rail"), lower: region(".comp123-lower"),
      warning: region(".comp123-lower .warning"), practice: region(".comp123-lower .practice"), trace: region(".comp123-lower .trace"),
      note: region(".comp123-note"), tags: region(".comp123-tags"), navigation: region(".comp123-adjacent"), footer: region(".comp123-footer"),
    },
  };
});
const passed =
  checks.initial.problem === "AND,2,6,false,true" && checks.initial.interval === "(2, 6]" && checks.initial.empty === "false" &&
  checks.draggedLower.problem === "AND,3,6,false,true" && checks.draggedLower.interval === "(3, 6]" &&
  checks.draggedUpper.problem === "AND,3,7,false,true" && checks.draggedUpper.interval === "(3, 7]" &&
  checks.closedLower.problem === "AND,3,7,true,true" && checks.closedLower.interval === "[3, 7]" &&
  checks.emptyIntersection.problem === "AND,8,7,true,true" && checks.emptyIntersection.interval === "∅" && checks.emptyIntersection.empty === "true" &&
  checks.unionExample.problem === "OR,-1,3,false,true" && checks.unionExample.interval === "(-∞, -1) ∪ [3, ∞)" &&
  checks.openUnionEndpoint.problem === "OR,-1,3,false,false" && checks.openUnionEndpoint.interval === "(-∞, -1) ∪ (3, ∞)" &&
  checks.reset.problem === "AND,2,6,false,true" && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0180-desktop.png") });
await copyFile(reference, path.join(out, "0180-reference.png"));
const report = { mockup: "0180", lessonId: 123, route: "/lessons/algebra/123-compound-inequalities", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0180-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
