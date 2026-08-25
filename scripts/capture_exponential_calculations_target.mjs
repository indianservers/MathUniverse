import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0009-interactive-foundational-advanced-scientific-calculator-exponential-calculations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/9-exponential-calculations",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1472, height: 1069 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0009");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((e) =>
    Object.fromEntries(
      [
        "data-base",
        "data-exponent",
        "data-output",
        "data-view",
        "data-animation-step",
        "data-animating",
        "data-problem",
        "data-feedback",
      ].map((n) => [n.replace("data-", ""), e.getAttribute(n)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Increase Base").click();
checks.base = await state();
await page.getByLabel("Exponent drag control").fill("4");
checks.drag = await state();
await page.locator(".exponential-drag button").nth(2).click();
checks.step = await state();
await page.getByRole("button", { name: /Animate growth/ }).click();
await page.waitForTimeout(900);
checks.animation = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.view = await state();
await page.getByLabel("Exponential practice answer").fill("80");
await page.locator(".exponential-practice aside button").click();
checks.wrong = await state();
await page.getByLabel("Exponential practice answer").fill("81");
await page.locator(".exponential-practice aside button").click();
checks.correct = await state();
await page.getByRole("button", { name: /New problem/ }).click();
checks.problem = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await rootNode.waitFor();
const metrics = await page.evaluate(() => {
  const region = (s) => {
    const r = globalThis.document.querySelector(s)?.getBoundingClientRect();
    return r
      ? {
          top: r.top,
          bottom: r.bottom,
          height: r.height,
          left: r.left,
          right: r.right,
          width: r.width,
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
    surface: region(".target-exponential-page"),
    regions: {
      header: region(".target-exponential-header"),
      tabs: region(".target-exponential-tabs"),
      lab: region(".exponential-lab"),
      practice: region(".exponential-practice"),
      trace: region(".exponential-trace"),
    },
  };
});
const passed =
  checks.initial.base === "2" &&
  checks.initial.exponent === "8" &&
  checks.initial.output === "256" &&
  checks.base.output === "6561" &&
  checks.drag.output === "81" &&
  checks.step.exponent === "2" &&
  checks.step.output === "9" &&
  checks.animation["animation-step"] === "2" &&
  checks.reset.output === "256" &&
  checks.view.view === "2" &&
  checks.wrong.feedback === "incorrect" &&
  checks.correct.feedback === "correct" &&
  checks.problem.problem === "1" &&
  metrics.viewport.width === 1472 &&
  metrics.viewport.height === 1069 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0009-desktop.png") });
await copyFile(reference, path.join(out, "0009-reference.png"));
const report = {
  mockup: "0009",
  lessonId: 9,
  route: "/lessons/core-workspaces/9-exponential-calculations",
  objectModel:
    "base-exponent-factor-chain-draggable-staircase-growth-chart-animation-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0009-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
