import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0047-interactive-foundational-intermediate-numbers-and-number-theory-factors-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/65-factors";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1060, height: 1484 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`);
  }
});
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0047");
await node.waitFor({ timeout: 600000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-number",
        "data-candidate",
        "data-quotient",
        "data-remainder",
        "data-is-factor",
        "data-rows",
        "data-columns",
        "data-grouped-count",
        "data-factor-pairs",
        "data-drag-pair",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const counterCounts = () =>
  page.evaluate(() => ({
    grouped: document.querySelectorAll(".factors65-counters .grouped").length,
    leftovers: document.querySelectorAll(".factors65-counters .leftover").length,
  }));
const checks = {
  initial: await state(),
  initialCounters: await counterCounts(),
};

await page.getByLabel("Candidate divisor").fill("5");
checks.nonFactor = await state();
checks.nonFactorCounters = await counterCounts();

await page.getByLabel("Number to factor").fill("36");
await page.getByLabel("Candidate divisor").fill("6");
checks.thirtySix = await state();

await node
  .getByRole("button", { name: /4 × 9/ })
  .dragTo(page.getByLabel("Factor pair array drop zone"));
checks.draggedPair = await state();
checks.draggedCounters = await counterCounts();

await node.getByRole("button", { name: /Try: Is 5 a factor/ }).click();
checks.practiceApplied = await state();
await node.getByRole("button", { name: /Examples/ }).click();
checks.tab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await node.getByRole("button", { name: "Reset", exact: true }).click();
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
    surface: region(".factors65-page"),
    regions: {
      hero: region(".factors65-hero"),
      tabs: region(".factors65-tabs"),
      main: region(".factors65-main"),
      grid: region(".factors65-grid"),
      array: region(".factors65-array-card"),
      pairs: region(".factors65-pairs"),
      side: region(".factors65-side"),
      navigation: region(".factors65-navigation"),
      footer: region(".factors65-footer"),
    },
  };
});
const passed =
  checks.initial.number === "42" &&
  checks.initial.candidate === "6" &&
  checks.initial.quotient === "7" &&
  checks.initial.remainder === "0" &&
  checks.initial["is-factor"] === "true" &&
  checks.initial.rows === "6" &&
  checks.initial.columns === "7" &&
  checks.initial["factor-pairs"] === "1x42,2x21,3x14,6x7" &&
  checks.initialCounters.grouped === 42 &&
  checks.initialCounters.leftovers === 0 &&
  checks.nonFactor.candidate === "5" &&
  checks.nonFactor.quotient === "8" &&
  checks.nonFactor.remainder === "2" &&
  checks.nonFactor["is-factor"] === "false" &&
  checks.nonFactorCounters.grouped === 40 &&
  checks.nonFactorCounters.leftovers === 2 &&
  checks.thirtySix.number === "36" &&
  checks.thirtySix.candidate === "6" &&
  checks.thirtySix["factor-pairs"] === "1x36,2x18,3x12,4x9,6x6" &&
  checks.draggedPair.candidate === "4" &&
  checks.draggedPair.quotient === "9" &&
  checks.draggedPair.remainder === "0" &&
  checks.draggedPair.rows === "4" &&
  checks.draggedPair.columns === "9" &&
  checks.draggedCounters.grouped === 36 &&
  checks.practiceApplied.candidate === "5" &&
  checks.practiceApplied.remainder === "1" &&
  checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.reset.number === "42" &&
  checks.reset.candidate === "6" &&
  checks.reset.remainder === "0" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0047-desktop.png") });
await copyFile(reference, path.join(out, "0047-reference.png"));
const report = {
  mockup: "0047",
  lessonId: 65,
  route: "/lessons/numbers-and-arithmetic/65-factors",
  objectModel:
    "editable-number-candidate-exact-divisibility-counter-array-factor-pairs-draggable-arrangement-remainder-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0047-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
