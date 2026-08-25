import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0002-interactive-foundational-advanced-scientific-calculator-fraction-calculator-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/2-fraction-calculator";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
});
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0002");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((element) =>
    Object.fromEntries(
      [
        "data-a",
        "data-b",
        "data-lcd",
        "data-result",
        "data-mixed",
        "data-decimal",
        "data-active-field",
        "data-key-mode",
        "data-active-view",
        "data-problem-index",
        "data-evaluations",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };

await page.getByLabel("a numerator").fill("2");
await page.getByLabel("a denominator").fill("3");
await page.getByLabel("b numerator").fill("1");
await page.getByLabel("b denominator").fill("6");
checks.edited = await state();
await page.getByRole("button", { name: "Evaluate", exact: true }).click();
checks.evaluated = await state();
await page.getByRole("button", { name: "↔ Swap" }).click();
checks.swapped = await state();
await page.locator(".fraction-key-modes button").first().click();
checks.numberMode = await state();
await page.getByLabel("Fraction key /").click();
checks.slashNavigation = await state();
await page.locator(".fraction-key-modes button").last().click();
checks.signMode = await state();
await page.getByRole("button", { name: /Examples/ }).click();
checks.examplesView = await state();
await page.getByRole("button", { name: "New problem" }).click();
checks.newProblem = await state();
await page.getByRole("button", { name: "Solve it" }).click();
checks.practice = await state();
await page.getByRole("button", { name: "Clear", exact: true }).click();
checks.cleared = await state();

await page.reload({ waitUntil: "domcontentloaded" });
await rootNode.waitFor();
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
    surface: region(".target-fraction-page"),
    regions: {
      header: region(".target-fraction-header"),
      tabs: region(".target-fraction-tabs"),
      workspace: region(".target-fraction-workspace"),
      entry: region(".target-fraction-entry"),
      visual: region(".target-fraction-visual"),
      output: region(".target-fraction-output"),
      practice: region(".target-fraction-practice"),
      navigation: region(".target-fraction-nav"),
    },
  };
});
const passed =
  checks.initial.a === "1/2" &&
  checks.initial.b === "3/4" &&
  checks.initial.lcd === "4" &&
  checks.initial.result === "5/4" &&
  checks.initial.mixed === "1 1/4" &&
  checks.edited.result === "5/6" &&
  checks.evaluated.evaluations === "1" &&
  checks.swapped.a === "1/6" &&
  checks.swapped.b === "2/3" &&
  checks.numberMode["key-mode"] === "numbers" &&
  checks.slashNavigation["active-field"] === "bDenominator" &&
  checks.signMode["key-mode"] === "sign" &&
  checks.examplesView["active-view"] === "examples" &&
  checks.newProblem["problem-index"] === "1" &&
  checks.practice.a === "2/3" &&
  checks.practice.b === "1/6" &&
  checks.cleared.a === "0/1" &&
  checks.cleared.b === "0/1" &&
  metrics.viewport.width === 1536 &&
  metrics.viewport.height === 1024 &&
  metrics.document.width === 1536 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0002-desktop.png") });
await copyFile(reference, path.join(out, "0002-reference.png"));
const report = {
  mockup: "0002",
  lessonId: 2,
  route: "/lessons/core-workspaces/2-fraction-calculator",
  objectModel:
    "linked-two-fraction-lcd-equivalent-bars-exact-mixed-decimal-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0002-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
