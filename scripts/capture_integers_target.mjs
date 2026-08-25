import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0041-interactive-foundational-intermediate-numbers-and-number-theory-integers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/59-integers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1055, height: 1479 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0041");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-selected",
        "data-compare",
        "data-opposite",
        "data-relation",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Selected integer drag control").fill("-7");
checks.slider = await state();
await page
  .locator(".integer-axis nav")
  .getByRole("button", { name: "3", exact: true })
  .click();
checks.line = await state();
await page.getByLabel("Compare integer").fill("-5");
checks.compare = await state();
await node.getByRole("button", { name: "Examples", exact: true }).click();
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
    surface: region(".integers-page"),
    regions: {
      hero: region(".integers-hero"),
      tabs: region(".integers-tabs"),
      layout: region(".integers-layout"),
      work: region(".integers-work"),
      line: region(".integer-line-card"),
      contexts: region(".integer-contexts"),
      warning: region(".integer-warning"),
      side: region(".integers-side"),
      navigation: region(".integer-navigation"),
      footer: region(".integer-footer"),
    },
  };
});
const passed =
  checks.initial.selected === "-4" &&
  checks.initial.compare === "8" &&
  checks.initial.opposite === "4" &&
  checks.initial.relation === "<" &&
  checks.slider.selected === "-7" &&
  checks.slider.opposite === "7" &&
  checks.line.selected === "3" &&
  checks.line.opposite === "-3" &&
  checks.compare.compare === "-5" &&
  checks.compare.relation === ">" &&
  checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.reset.selected === "-4" &&
  checks.reset.compare === "8" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0041-desktop.png") });
await copyFile(reference, path.join(out, "0041-reference.png"));
const report = {
  mockup: "0041",
  lessonId: 59,
  route: "/lessons/numbers-and-arithmetic/59-integers",
  objectModel:
    "signed-integer-number-line-opposite-temperature-ledger-order-comparison-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0041-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
