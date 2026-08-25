import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0007-interactive-foundational-advanced-scientific-calculator-scientific-notation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/7-scientific-notation",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1508, height: 1043 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0007");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((e) =>
    Object.fromEntries(
      [
        "data-coefficient",
        "data-exponent",
        "data-standard",
        "data-direction",
        "data-view",
        "data-instructions",
        "data-feedback",
      ].map((n) => [n.replace("data-", ""), e.getAttribute(n)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Increase Coefficient").click();
checks.coefficient = await state();
await page.getByLabel("Decrease Exponent").click();
checks.exponent = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.getByRole("button", { name: /Instructions/ }).click();
checks.instructions = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.view = await state();
await page.getByRole("button", { name: /Check Answer/ }).click();
checks.practice = await state();
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
    surface: region(".target-notation-page"),
    regions: {
      header: region(".target-notation-header"),
      tabs: region(".target-notation-tabs"),
      columns: region(".target-notation-columns"),
      lab: region(".notation-lab"),
      side: region(".notation-side"),
      practice: region(".notation-practice"),
    },
  };
});
const passed =
  checks.initial.coefficient === "6.02" &&
  checks.initial.exponent === "5" &&
  checks.initial.standard === "602,000" &&
  checks.coefficient.standard === "603,000" &&
  checks.exponent.standard === "60,300" &&
  checks.reset.standard === "602,000" &&
  checks.instructions.instructions === "true" &&
  checks.view.view === "2" &&
  checks.practice.feedback === "correct" &&
  metrics.viewport.width === 1508 &&
  metrics.viewport.height === 1043 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0007-desktop.png") });
await copyFile(reference, path.join(out, "0007-reference.png"));
const report = {
  mockup: "0007",
  lessonId: 7,
  route: "/lessons/core-workspaces/7-scientific-notation",
  objectModel:
    "coefficient-power-ten-number-line-decimal-shift-standard-form-ladder-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0007-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
