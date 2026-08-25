import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0030-interactive-foundational-advanced-algebra-and-dynamic-variables-equation-input-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://localhost:2245/lessons/core-workspaces/30-equation-input";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1369, height: 1149 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0030");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-valid",
        "data-checked",
        "data-left",
        "data-right",
        "data-solution",
        "data-solved-y",
        "data-checks",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
const field = page.getByLabel("Equation input");
await field.fill("3x - 2 = 7");
checks.edited = await state();
await page.getByRole("button", { name: "Check Equation" }).click();
checks.checked = await state();
await field.fill("x + 5 = 2x - 1");
await page.getByRole("button", { name: "Check Equation" }).click();
checks.bothSides = await state();
await field.fill("2x + 3");
checks.invalid = await state();
checks.disabled = await page
  .getByRole("button", { name: "Check Equation" })
  .isDisabled();
await page.getByRole("button", { name: "Clear" }).click();
checks.clear = await state();
await page.getByRole("button", { name: "4y = y + 12" }).click();
checks.example = await state();
await page.getByRole("button", { name: "Check Equation" }).click();
checks.exampleChecked = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
checks.resetByReload = await state();
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
    surface: region(".equation-page"),
    regions: {
      card: region(".equation-surface"),
      header: region(".equation-header"),
      entry: region(".equation-entry"),
      main: region(".equation-main"),
      balance: region(".balance-card"),
      steps: region(".steps-card"),
      graph: region(".graph-card"),
      side: region(".equation-side"),
      checker: region(".solution-checker"),
      neighbors: region(".equation-neighbors"),
    },
  };
});
const passed =
  checks.initial.valid === "true" &&
  checks.initial.checked === "true" &&
  checks.initial.solution === "4" &&
  checks.initial["solved-y"] === "11" &&
  checks.edited.valid === "true" &&
  checks.edited.checked === "false" &&
  checks.edited.solution === "3" &&
  checks.checked.checked === "true" &&
  checks.checked["solved-y"] === "7" &&
  checks.bothSides.solution === "6" &&
  checks.bothSides["solved-y"] === "11" &&
  checks.invalid.valid === "false" &&
  checks.disabled &&
  checks.clear.valid === "false" &&
  checks.example.solution === "4" &&
  checks.example.checked === "false" &&
  checks.exampleChecked.checked === "true" &&
  checks.resetByReload.solution === "4" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0030-desktop.png") });
await copyFile(reference, path.join(out, "0030-reference.png"));
const report = {
  mockup: "0030",
  lessonId: 30,
  route: "/lessons/core-workspaces/30-equation-input",
  objectModel:
    "parsed-two-sided-linear-equation-balance-generated-steps-dual-line-intersection-substitution-proof-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0030-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
