import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0043-interactive-foundational-intermediate-numbers-and-number-theory-irrational-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/numbers-and-arithmetic/61-irrational-numbers";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1044, height: 1507 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("number-mockup-0043");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-radicand",
        "data-root",
        "data-lower",
        "data-upper",
        "data-lower-square",
        "data-upper-square",
        "data-sort-correct",
        "data-rational",
        "data-irrational",
        "data-tab",
        "data-language",
        "data-workspace",
        "data-practice",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Select radicand").selectOption("5");
checks.five = await state();
await page.getByLabel("Select radicand").selectOption("9");
checks.perfect = await state();
await page.getByLabel("Select radicand").selectOption("3");
checks.three = await state();
const rational = page.locator(".rational-sort-zone"),
  irrational = page.locator(".irrational-sort-zone");
await irrational
  .getByRole("button", { name: "π", exact: true })
  .dragTo(rational);
checks.piWrong = await state();
await rational
  .getByRole("button", { name: "π", exact: true })
  .dragTo(irrational);
checks.piFixed = await state();
await node.getByRole("button", { name: /Examples/ }).click();
checks.tab = await state();
await node.getByRole("button", { name: /English/ }).click();
checks.language = await state();
await node.getByRole("button", { name: /Workspace/ }).click();
checks.workspace = await state();
await page
  .locator(".root-practice")
  .getByRole("button", { name: "Yes", exact: true })
  .click();
checks.practiceWrong = await state();
await page
  .locator(".root-practice")
  .getByRole("button", { name: "No.", exact: true })
  .click();
checks.practiceCorrect = await state();
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
    surface: region(".irrational-page"),
    regions: {
      hero: region(".irrational-hero"),
      tabs: region(".irrational-tabs"),
      shell: region(".irrational-shell"),
      layout: region(".irrational-layout"),
      work: region(".irrational-work"),
      top: region(".irrational-top"),
      decimal: region(".decimal-zoom"),
      compare: region(".root-compare"),
      sort: region(".root-sort"),
      side: region(".irrational-side"),
      navigation: region(".irrational-navigation"),
      footer: region(".irrational-footer"),
    },
  };
});
const passed =
  checks.initial.radicand === "2" &&
  Math.abs(Number(checks.initial.root) - Math.sqrt(2)) < 1e-12 &&
  checks.initial["lower-square"] === "1" &&
  checks.initial["upper-square"] === "4" &&
  checks.five.lower === "2" &&
  checks.five.upper === "3" &&
  checks.five["lower-square"] === "4" &&
  checks.five["upper-square"] === "9" &&
  checks.perfect.rational.includes("√9") &&
  !checks.perfect.irrational.includes("√9") &&
  checks.three.irrational.includes("√3") &&
  checks.piWrong["sort-correct"] === "false" &&
  checks.piWrong.rational.includes("π") &&
  checks.piFixed["sort-correct"] === "true" &&
  checks.piFixed.irrational.includes("π") &&
  checks.tab.tab === "Examples" &&
  checks.language.language.startsWith("Hindi") &&
  checks.workspace.workspace === "true" &&
  checks.practiceWrong.practice === "yes" &&
  checks.practiceCorrect.practice === "no" &&
  checks.reset.radicand === "2" &&
  checks.reset["sort-correct"] === "true" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0043-desktop.png") });
await copyFile(reference, path.join(out, "0043-reference.png"));
const report = {
  mockup: "0043",
  lessonId: 61,
  route: "/lessons/numbers-and-arithmetic/61-irrational-numbers",
  objectModel:
    "radicand-perfect-square-bounds-geometric-diagonal-number-line-decimal-sort-comparison-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0043-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
