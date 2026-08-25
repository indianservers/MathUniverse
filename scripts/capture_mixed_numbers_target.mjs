import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0003-interactive-foundational-advanced-scientific-calculator-mixed-numbers-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/3-mixed-numbers";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1503, height: 1047 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0003");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((element) =>
    Object.fromEntries(
      [
        "data-first",
        "data-second",
        "data-improper-first",
        "data-improper-second",
        "data-lcd",
        "data-exact",
        "data-mixed",
        "data-decimal",
        "data-active-field",
        "data-active-view",
        "data-key-mode",
        "data-practice-open",
        "data-evaluations",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("First mixed number whole part").fill("1");
await page.getByLabel("First mixed number numerator").fill("1");
await page.getByLabel("First mixed number denominator").fill("2");
await page.getByLabel("Second mixed number whole part").fill("2");
await page.getByLabel("Second mixed number numerator").fill("1");
await page.getByLabel("Second mixed number denominator").fill("4");
checks.edited = await state();
await page.getByLabel("Evaluate mixed numbers").click();
checks.evaluated = await state();
await page.getByRole("button", { name: "Fractions", exact: true }).click();
checks.fractionMode = await state();
await page.getByLabel("Mixed number key / 3").click();
checks.fieldNavigation = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.examples = await state();
await page.getByRole("button", { name: /Start practice/ }).click();
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
    surface: region(".target-mixed-page"),
    regions: {
      header: region(".target-mixed-header"),
      tabs: region(".target-mixed-tabs"),
      workspace: region(".target-mixed-workspace"),
      builders: region(".target-mixed-builders"),
      steps: region(".target-mixed-steps"),
      keyboard: region(".target-mixed-keyboard"),
      proof: region(".target-mixed-proof"),
      practice: region(".target-mixed-practice"),
      navigation: region(".target-mixed-nav"),
    },
  };
});
const passed =
  checks.initial.first === "2 1/3" &&
  checks.initial.second === "1 3/4" &&
  checks.initial["improper-first"] === "7/3" &&
  checks.initial["improper-second"] === "7/4" &&
  checks.initial.lcd === "12" &&
  checks.initial.exact === "49/12" &&
  checks.initial.mixed === "4 1/12" &&
  checks.edited.exact === "15/4" &&
  checks.edited.mixed === "3 3/4" &&
  checks.evaluated.evaluations === "1" &&
  checks.fractionMode["key-mode"] === "fractions" &&
  checks.fieldNavigation["active-field"] === "second-denominator" &&
  checks.examples["active-view"] === "examples" &&
  checks.practice["practice-open"] === "true" &&
  checks.cleared.second === "2 1/1" &&
  metrics.viewport.width === 1503 &&
  metrics.viewport.height === 1047 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0003-desktop.png") });
await copyFile(reference, path.join(out, "0003-reference.png"));
const report = {
  mockup: "0003",
  lessonId: 3,
  route: "/lessons/core-workspaces/3-mixed-numbers",
  objectModel:
    "dual-mixed-number-whole-block-fraction-strip-improper-lcd-exact-decimal-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0003-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
