import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0177-interactive-intermediate-advanced-equations-and-inequalities-trigonometric-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/120-trigonometric-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 864, height: 1821 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0177");
await node.waitFor({ timeout: 600000 });

const names = ["problem", "solutions", "angle-mode", "custom", "practice-checked", "actions"];
const state = () =>
  node.evaluate(
    (element, attributes) =>
      Object.fromEntries(attributes.map((name) => [name, element.getAttribute(`data-${name}`)])),
    names,
  );
const checks = { initial: await state() };

await page.getByLabel("Trigonometric equation", { exact: true }).selectOption("1");
checks.cosinePreset = await state();
await page.getByLabel("Trigonometric angle mode").selectOption("Radians");
checks.radians = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();

const circle = page.getByRole("img", { name: "Unit circle solutions for sin theta equals 1/2" });
const handle = page.getByRole("slider", { name: "Drag reference angle on unit circle" });
const circleBox = await circle.boundingBox();
const handleBox = await handle.boundingBox();
if (circleBox && handleBox) {
  const targetX = circleBox.x + ((175 + 128 * 0.5) / 350) * circleBox.width;
  const targetY = circleBox.y + ((205 - 128 * Math.sin(Math.PI / 3)) / 430) * circleBox.height;
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 10 });
  await page.mouse.up();
}
checks.draggedAngle = await state();
await page.getByRole("button", { name: "Check on your own" }).click();
checks.practice = await state();
await page.getByRole("button", { name: "Examples" }).click();
checks.example = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    regions: {
      surface: region(".trig120-page"), intro: region(".trig120-intro"), tabs: region(".trig120-tabs"),
      lab: region(".trig120-lab"), body: region(".trig120-body"), circle: region(".trig120-circle-card"),
      wave: region(".trig120-wave-card"), worked: region(".trig120-worked"), practice: region(".trig120-practice"),
      navigation: region(".trig120-adjacent"), footer: region(".trig120-footer"),
    },
  };
});

const passed =
  checks.initial.problem === "sin,30,1/2" &&
  checks.initial.solutions === "30,150" &&
  checks.initial["angle-mode"] === "degrees" &&
  checks.cosinePreset.problem === "cos,60,1/2" &&
  checks.cosinePreset.solutions === "60,300" &&
  checks.radians["angle-mode"] === "radians" &&
  checks.draggedAngle.problem === "sin,60,0.866" &&
  checks.draggedAngle.solutions === "60,120" &&
  checks.draggedAngle.custom === "true" &&
  checks.practice["practice-checked"] === "true" &&
  checks.example.problem === "cos,60,1/2" &&
  checks.reset.problem === "sin,30,1/2" &&
  checks.reset.solutions === "30,150" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0177-desktop.png") });
await copyFile(reference, path.join(out, "0177-reference.png"));
const report = { mockup: "0177", lessonId: 120, route: "/lessons/algebra/120-trigonometric-equations", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0177-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
