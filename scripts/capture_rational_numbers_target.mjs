import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0042-interactive-foundational-intermediate-numbers-and-number-theory-rational-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/60-rational-numbers";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1059, height: 1481 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0042");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-numerator",
        "data-denominator",
        "data-reduced",
        "data-whole",
        "data-remainder",
        "data-decimal",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-practice",
        "data-practice-correct",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Numerator").fill("6");
await page.getByLabel("Denominator").fill("4");
checks.reduced = await state();
await page.getByLabel("Denominator").fill("0");
checks.zeroGuard = await state();
await page.getByLabel("Numerator").fill("-5");
await page.getByLabel("Denominator").fill("2");
checks.negative = await state();
await node.getByRole("button", { name: /Examples/ }).click();
checks.tab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await node
  .locator(".rational-practice")
  .getByRole("button", { name: /No/ })
  .click();
checks.wrong = await state();
await node
  .locator(".rational-practice")
  .getByRole("button", { name: /Yes/ })
  .click();
checks.correct = await state();
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
    surface: region(".rational-page"),
    regions: {
      hero: region(".rational-hero"),
      tabs: region(".rational-tabs"),
      layout: region(".rational-layout"),
      work: region(".rational-work"),
      strip: region(".fraction-strip"),
      line: region(".rational-line"),
      forms: region(".equivalent-forms"),
      included: region(".membership-included"),
      excluded: region(".membership-excluded"),
      side: region(".rational-side"),
      navigation: region(".rational-navigation"),
      footer: region(".rational-footer"),
    },
  };
});
const passed =
  checks.initial.numerator === "4" &&
  checks.initial.denominator === "3" &&
  checks.initial.reduced === "4/3" &&
  checks.initial.whole === "1" &&
  checks.initial.remainder === "1" &&
  checks.reduced.reduced === "3/2" &&
  checks.reduced.whole === "1" &&
  checks.reduced.remainder === "1" &&
  checks.zeroGuard.denominator !== "0" &&
  checks.negative.reduced === "-5/2" &&
  checks.negative.decimal === "-2.5" &&
  checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.wrong.practice === "no" &&
  checks.wrong["practice-correct"] === "false" &&
  checks.correct.practice === "yes" &&
  checks.correct["practice-correct"] === "true" &&
  checks.reset.numerator === "4" &&
  checks.reset.denominator === "3" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0042-desktop.png") });
await copyFile(reference, path.join(out, "0042-reference.png"));
const report = {
  mockup: "0042",
  lessonId: 60,
  route: "/lessons/numbers-and-arithmetic/60-rational-numbers",
  objectModel:
    "numerator-denominator-reduction-mixed-decimal-strip-number-line-membership-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0042-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
