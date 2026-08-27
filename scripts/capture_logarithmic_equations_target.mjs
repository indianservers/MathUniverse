import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0176-interactive-intermediate-advanced-equations-and-inequalities-logarithmic-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/algebra/119-logarithmic-equations";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1024, height: 1536 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0176");
await node.waitFor({ timeout: 600000 });

const names = [
  "problem",
  "domain-pass",
  "log-value",
  "verified",
  "ladder-match",
  "example-index",
  "practice-index",
  "practice-checked",
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
await page.getByLabel("Logarithm candidate value").fill("0");
checks.zeroRejected = await state();
await page.getByLabel("Logarithm candidate value").fill("-2");
checks.negativeRejected = await state();
await page.getByRole("button", { name: "Reset", exact: true }).click();

const slider = page.getByLabel("Logarithm candidate slider");
const sliderBox = await slider.boundingBox();
if (sliderBox) {
  await page.mouse.move(sliderBox.x + sliderBox.width * 0.83, sliderBox.y + sliderBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(sliderBox.x + sliderBox.width * 0.5, sliderBox.y + sliderBox.height / 2, { steps: 8 });
  await page.mouse.up();
}
checks.draggedSlider = await state();
await page.getByRole("button", { name: "Set logarithm candidate to 2 to 4" }).click();
checks.ladderSelected = await state();
await page.getByLabel("Increase logarithm candidate").click();
checks.incremented = await state();
await page.getByRole("button", { name: "Examples" }).click();
checks.example = await state();
await page.getByRole("button", { name: "Try it" }).click();
checks.newPractice = await state();
await page.getByRole("button", { name: "Check solution" }).click();
checks.practiceChecked = await state();
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
      surface: region(".log119-page"),
      intro: region(".log119-intro"),
      tabs: region(".log119-tabs"),
      stage: region(".log119-stage"),
      solver: region(".log119-solver"),
      reasoning: region(".log119-reasoning"),
      warning: region(".log119-warning"),
      practice: region(".log119-practice"),
      navigation: region(".log119-adjacent"),
      footer: region(".log119-footer"),
    },
  };
});

const passed =
  checks.initial.problem === "2,5,32" &&
  checks.initial["domain-pass"] === "true" &&
  checks.initial["log-value"] === "5" &&
  checks.initial.verified === "true" &&
  checks.initial["ladder-match"] === "5" &&
  checks.zeroRejected["domain-pass"] === "false" &&
  checks.zeroRejected["log-value"] === "undefined" &&
  checks.negativeRejected["domain-pass"] === "false" &&
  checks.draggedSlider.problem !== "2,5,32" &&
  checks.ladderSelected.problem === "2,5,16" &&
  checks.ladderSelected["ladder-match"] === "4" &&
  checks.incremented.problem === "2,5,17" &&
  checks.example.problem === "10,3,1000" &&
  checks.example.verified === "true" &&
  checks.newPractice["practice-index"] === "1" &&
  checks.practiceChecked["practice-checked"] === "true" &&
  checks.reset.problem === "2,5,32" &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0176-desktop.png") });
await copyFile(reference, path.join(out, "0176-reference.png"));
const report = {
  mockup: "0176",
  lessonId: 119,
  route: "/lessons/algebra/119-logarithmic-equations",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(path.join(out, "0176-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
