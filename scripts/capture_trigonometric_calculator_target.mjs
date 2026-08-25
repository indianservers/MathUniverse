import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0010-interactive-foundational-advanced-scientific-calculator-trigonometric-calculator-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/10-trigonometric-calculator";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1068, height: 1472 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const node = page.getByTestId("calculator-mockup-0010");
await node.waitFor();
const state = () =>
  node.evaluate((e) =>
    Object.fromEntries(
      [
        "data-sin-angle",
        "data-cos-angle",
        "data-mode",
        "data-output",
        "data-actions",
        "data-view",
        "data-feedback",
      ].map((n) => [n.replace("data-", ""), e.getAttribute(n)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Sine angle drag control", { exact: true }).fill("45");
checks.sinDrag = await state();
await page.getByLabel("Cosine angle drag control", { exact: true }).fill("30");
checks.cosDrag = await state();
await page.getByRole("button", { name: "RAD", exact: true }).click();
checks.radians = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.view = await state();
await page.getByLabel("Trigonometric practice answer").fill("1");
await page.locator(".trigcalc-check").click();
checks.wrong = await state();
await page.getByLabel("Trigonometric practice answer").fill("1.414");
await page.locator(".trigcalc-check").click();
checks.correct = await state();
await page.getByLabel("Next trigonometry problem").click();
checks.problem = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
const metrics = await page.evaluate(() => {
  const region = (s) => {
    const r = document.querySelector(s)?.getBoundingClientRect();
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
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    surface: region(".target-trigcalc-page"),
    regions: {
      header: region(".trigcalc-header"),
      tabs: region(".trigcalc-tabs"),
      lab: region(".trigcalc-lab"),
      work: region(".trigcalc-work"),
      bottom: region(".trigcalc-bottom"),
      neighbors: region(".trigcalc-neighbors"),
      footer: region(".trigcalc-footer"),
    },
  };
});
const passed =
  checks.initial.output === "1" &&
  checks.sinDrag["sin-angle"] === "45" &&
  checks.cosDrag["cos-angle"] === "30" &&
  checks.radians.mode === "RAD" &&
  checks.reset.output === "1" &&
  checks.view.view === "2" &&
  checks.wrong.feedback === "incorrect" &&
  checks.correct.feedback === "correct" &&
  Number(checks.problem.actions) > 0 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0010-desktop.png") });
await copyFile(reference, path.join(out, "0010-reference.png"));
const report = {
  mockup: "0010",
  lessonId: 10,
  route: "/lessons/core-workspaces/10-trigonometric-calculator",
  objectModel:
    "dual-draggable-unit-circle-special-angle-triangle-mode-trace-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0010-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
