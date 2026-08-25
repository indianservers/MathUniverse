import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0001-interactive-foundational-advanced-scientific-calculator-basic-calculator-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/1-basic-calculator";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1489, height: 1056 },
  deviceScaleFactor: 1,
});
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0001");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((element) =>
    Object.fromEntries(
      [
        "data-expression",
        "data-result",
        "data-auto-step",
        "data-active-view",
        "data-practice-state",
        "data-practice-index",
        "data-solution-open",
        "data-key-mode",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page
  .getByLabel("Calculator expression", { exact: true })
  .fill("7 + 4 × 6 − 3");
await page.getByLabel("Calculator expression", { exact: true }).press("Enter");
checks.expression = await state();
await page.getByLabel("Automatic expression trace").uncheck();
checks.autoOff = await state();
await page.locator(".target-basic-modes button").nth(1).click();
checks.functionsMode = await state();
await page.locator(".target-basic-modes button").first().click();
await page.getByLabel("Calculator key AC").click();
for (const key of ["9", "+", "3", "Evaluate"])
  await page.getByLabel(`Calculator key ${key}`, { exact: true }).click();
checks.keypad = await state();
await page.locator(".target-basic-display > button").click();
checks.historyRows = await page.locator(".target-basic-history button").count();
await page.getByLabel("Basic calculator practice answer").fill("27");
await page.getByRole("button", { name: "Check answer" }).click();
checks.practiceWrong = await state();
await page.getByLabel("Basic calculator practice answer").fill("28");
await page.getByRole("button", { name: "Check answer" }).click();
checks.practiceCorrect = await state();
await page.locator(".solution-toggle").click();
checks.solutionClosed = await state();
await page.getByRole("button", { name: "Try another" }).click();
checks.nextPractice = await state();
await page.locator(".target-basic-history button").last().click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = globalThis.document
      .querySelector(selector)
      ?.getBoundingClientRect();
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
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    horizontalOverflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surface: region(".target-basic-page"),
    regions: {
      header: region(".target-basic-header"),
      tabs: region(".target-basic-tabs"),
      workspace: region(".target-basic-workspace"),
      success: region(".target-basic-success"),
      rule: region(".target-basic-rule"),
      practice: region(".target-basic-practice"),
    },
  };
});
const passed =
  checks.initial.expression === "(12+8)/4" &&
  checks.initial.result === "5" &&
  checks.expression.result === "28" &&
  checks.autoOff["auto-step"] === "false" &&
  checks.functionsMode["key-mode"] === "functions" &&
  checks.keypad.result === "12" &&
  checks.historyRows >= 2 &&
  checks.practiceWrong["practice-state"] === "incorrect" &&
  checks.practiceCorrect["practice-state"] === "correct" &&
  checks.solutionClosed["solution-open"] === "false" &&
  checks.nextPractice["practice-index"] === "1" &&
  checks.reset.expression === "(12+8)/4" &&
  checks.reset.result === "5" &&
  metrics.viewport.width === 1489 &&
  metrics.viewport.height === 1056 &&
  metrics.document.width === 1489 &&
  metrics.document.height === 1056 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(out, "0001-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0001-reference.png"));
const report = {
  mockup: "0001",
  lessonId: 1,
  route: "/lessons/core-workspaces/1-basic-calculator",
  objectModel:
    "editable-arithmetic-expression-bodmas-parse-trace-history-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0001-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
void browser.close();
process.exit(passed ? 0 : 1);
