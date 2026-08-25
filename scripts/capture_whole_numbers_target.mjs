import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0040-interactive-foundational-intermediate-numbers-and-number-theory-whole-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/58-whole-numbers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1484, height: 1059 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0040");
await node.waitFor({ timeout: 180000 });
await page.locator(".empty-count img").waitFor({ state: "visible" });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-selected",
        "data-comparison",
        "data-view",
        "data-practice-selected",
        "data-practice-correct",
        "data-practice-status",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Increase selected number").click();
checks.increment = await state();
await page.getByLabel("Decrease selected number").click();
checks.decrement = await state();
await page
  .locator(".whole-set-box")
  .getByRole("button", { name: "5", exact: true })
  .click();
checks.setFive = await state();
await page
  .locator(".whole-line nav")
  .getByRole("button", { name: "8", exact: true })
  .click();
checks.lineEight = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.examples = await state();
await page.getByRole("button", { name: "Formulas", exact: true }).click();
checks.formulas = await state();
await page.getByRole("button", { name: "Know more", exact: true }).click();
checks.knowMore = await state();
await page.getByRole("button", { name: "Explain", exact: true }).click();
for (const value of ["0", "2", "3"])
  await page
    .locator(".whole-practice nav")
    .getByRole("button", { name: value, exact: true })
    .click();
checks.practiceSelection = await state();
await page.getByRole("button", { name: "Check answer", exact: true }).click();
checks.practiceCheck = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
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
    assetLoaded: document.querySelector(".empty-count img")?.complete,
    surface: region(".whole-page"),
    regions: {
      shell: region(".whole-shell"),
      header: region(".whole-header"),
      layout: region(".whole-layout"),
      workspace: region(".whole-workspace"),
      set: region(".whole-set-section"),
      line: region(".whole-line-section"),
      examples: region(".whole-examples"),
      summary: region(".whole-summary"),
      side: region(".whole-side"),
      navigation: region(".whole-navigation"),
    },
  };
});
const passed =
  checks.initial.selected === "0" &&
  checks.initial.comparison === "<" &&
  checks.initial.view === "Explain" &&
  checks.increment.selected === "1" &&
  checks.decrement.selected === "0" &&
  checks.setFive.selected === "5" &&
  checks.lineEight.selected === "8" &&
  checks.lineEight.comparison === ">" &&
  checks.examples.view === "Examples" &&
  checks.formulas.view === "Formulas" &&
  checks.knowMore.view === "Know more" &&
  checks.practiceSelection["practice-selected"] === "0,2,3" &&
  checks.practiceSelection["practice-correct"] === "true" &&
  checks.practiceCheck["practice-status"].startsWith("Correct") &&
  checks.reset.selected === "0" &&
  checks.reset["practice-selected"] === "" &&
  metrics.assetLoaded &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0040-desktop.png") });
await copyFile(reference, path.join(out, "0040-reference.png"));
const report = {
  mockup: "0040",
  lessonId: 58,
  route: "/lessons/numbers-and-arithmetic/58-whole-numbers",
  objectModel:
    "zero-inclusive-whole-set-selector-number-line-exclusion-empty-count-staircase-comparison-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0040-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
