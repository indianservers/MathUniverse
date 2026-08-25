import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0004-interactive-foundational-advanced-scientific-calculator-percentage-calculator-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/4-percentage-calculator";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1506, height: 1045 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0004");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((element) =>
    Object.fromEntries(
      [
        "data-percent",
        "data-base",
        "data-part",
        "data-view",
        "data-answer",
        "data-feedback",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Percent drag control").fill("25");
checks.percentDrag = await state();
await page.getByLabel("Base drag control").fill("320");
checks.baseDrag = await state();
await page.getByLabel("Percent numeric value").fill("15");
await page.getByLabel("Base numeric value").fill("240");
checks.numeric = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.view = await state();
await page.getByLabel("Percentage practice answer").fill("200");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await page.getByLabel("Percentage practice answer").fill("240");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
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
    surface: region(".target-percent-page"),
    regions: {
      header: region(".target-percent-header"),
      tabs: region(".target-percent-tabs"),
      visual: region(".target-percent-visual"),
      side: region(".target-percent-side"),
      practice: region(".target-percent-practice"),
      navigation: region(".target-percent-nav"),
    },
  };
});
const passed =
  checks.initial.percent === "15" &&
  checks.initial.base === "240" &&
  checks.initial.part === "36" &&
  checks.percentDrag.part === "60" &&
  checks.baseDrag.part === "80" &&
  checks.numeric.part === "36" &&
  checks.view.view === "2" &&
  checks.wrong.feedback === "incorrect" &&
  checks.correct.feedback === "correct" &&
  metrics.viewport.width === 1506 &&
  metrics.viewport.height === 1045 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0004-desktop.png") });
await copyFile(reference, path.join(out, "0004-reference.png"));
const report = {
  mockup: "0004",
  lessonId: 4,
  route: "/lessons/core-workspaces/4-percentage-calculator",
  objectModel:
    "draggable-percent-base-hundred-grid-part-equation-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0004-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
