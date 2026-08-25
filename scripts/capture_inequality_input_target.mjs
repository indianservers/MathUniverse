import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0031-interactive-foundational-advanced-algebra-and-dynamic-variables-inequality-input-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/31-inequality-input";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1506, height: 1044 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0031");
await node.waitFor({ timeout: 180000 });
const state = () =>
  node.evaluate((element) =>
    Object.fromEntries(
      [
        "data-valid",
        "data-input-operator",
        "data-solution-operator",
        "data-boundary",
        "data-inclusive",
        "data-flipped",
        "data-actions",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() },
  field = page.getByRole("textbox", { name: "Inequality input" });
await field.fill("-2x < 6");
checks.negative = await state();
await page.locator(".operators button").nth(1).click();
checks.inclusiveNegative = await state();
await field.fill("3x - 2 >= 7");
checks.inclusivePositive = await state();
await page.locator(".operators button").nth(0).click();
checks.strictPositive = await state();
await page.getByLabel("Clear inequality input").click();
checks.clear = await state();
await page.getByRole("button", { name: /2x \+ 1 < 5/ }).click();
checks.example = await state();
await page.getByRole("button", { name: /Share/ }).click();
await page.waitForTimeout(100);
checks.shared = await state();
await page.getByRole("button", { name: "Reset" }).click();
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
    surface: region(".inequality-page"),
    regions: {
      layout: region(".inequality-layout"),
      card: region(".inequality-surface"),
      header: region(".inequality-header"),
      entry: region(".inequality-entry"),
      main: region(".inequality-main"),
      solve: region(".solve-panel"),
      number: region(".number-panel"),
      comparison: region(".comparison-panel"),
      tests: region(".test-points"),
      side: region(".inequality-side"),
      neighbors: region(".inequality-neighbors"),
    },
  };
});
const passed =
  checks.initial.valid === "true" &&
  checks.initial["input-operator"] === "<" &&
  checks.initial["solution-operator"] === "<" &&
  checks.initial.boundary === "4" &&
  checks.initial.inclusive === "false" &&
  checks.negative["solution-operator"] === ">" &&
  checks.negative.boundary === "-3" &&
  checks.negative.flipped === "true" &&
  checks.inclusiveNegative["solution-operator"] === ">=" &&
  checks.inclusiveNegative.inclusive === "true" &&
  checks.inclusivePositive["solution-operator"] === ">=" &&
  checks.inclusivePositive.boundary === "3" &&
  checks.inclusivePositive.flipped === "false" &&
  checks.strictPositive["solution-operator"] === "<" &&
  checks.clear.valid === "false" &&
  checks.example.boundary === "2" &&
  Number(checks.shared.actions) >= 7 &&
  checks.reset.boundary === "4" &&
  checks.reset["solution-operator"] === "<" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0031-desktop.png") });
await copyFile(reference, path.join(out, "0031-reference.png"));
const report = {
  mockup: "0031",
  lessonId: 31,
  route: "/lessons/core-workspaces/31-inequality-input",
  objectModel:
    "parsed-affine-inequality-sign-reversal-open-closed-boundary-number-line-graph-region-test-point-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0031-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
