import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0044-interactive-foundational-intermediate-numbers-and-number-theory-real-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/62-real-numbers";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1060, height: 1484 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0044");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-selected",
        "data-selected-id",
        "data-natural",
        "data-whole",
        "data-integer",
        "data-rational",
        "data-irrational",
        "data-real",
        "data-relation",
        "data-placement-correct",
        "data-placements",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() },
  cards = page.locator(".real-sort nav"),
  axis = page.locator(".real-axis");
await cards.getByRole("button", { name: /√2/ }).click();
checks.rootTwo = await state();
await cards.getByRole("button", { name: /11/ }).click();
checks.eleven = await state();
await cards
  .getByRole("button", { name: /-5/ })
  .dragTo(axis, { targetPosition: { x: 350, y: 65 } });
checks.negativeWrong = await state();
await cards
  .getByRole("button", { name: /-5/ })
  .dragTo(axis, { targetPosition: { x: 31, y: 65 } });
checks.negativeFixed = await state();
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
    surface: region(".real-page"),
    regions: {
      hero: region(".real-hero"),
      tabs: region(".real-tabs"),
      layout: region(".real-layout"),
      work: region(".real-work"),
      hierarchy: region(".number-hierarchy"),
      line: region(".real-number-line"),
      sort: region(".real-sort"),
      side: region(".real-side"),
      navigation: region(".real-navigation"),
      footer: region(".real-footer"),
    },
  };
});
const passed =
  checks.initial.selected === "-5" &&
  checks.initial.natural === "false" &&
  checks.initial.whole === "false" &&
  checks.initial.integer === "true" &&
  checks.initial.rational === "true" &&
  checks.initial.irrational === "false" &&
  checks.initial.real === "true" &&
  checks.initial.relation === "<" &&
  checks.rootTwo.selected === "√2" &&
  checks.rootTwo.integer === "false" &&
  checks.rootTwo.rational === "false" &&
  checks.rootTwo.irrational === "true" &&
  checks.eleven.natural === "true" &&
  checks.eleven.whole === "true" &&
  checks.eleven.integer === "true" &&
  checks.eleven.relation === "=" &&
  checks.negativeWrong["placement-correct"] === "false" &&
  checks.negativeFixed["placement-correct"] === "true" &&
  checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.reset.selected === "-5" &&
  checks.reset["placement-correct"] === "true" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0044-desktop.png") });
await copyFile(reference, path.join(out, "0044-reference.png"));
const report = {
  mockup: "0044",
  lessonId: 62,
  route: "/lessons/numbers-and-arithmetic/62-real-numbers",
  objectModel:
    "selected-real-number-hierarchy-classification-draggable-number-line-placement-comparison-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0044-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
