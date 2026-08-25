import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0008-interactive-foundational-advanced-scientific-calculator-logarithms-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/8-logarithms",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1508, height: 1043 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0008");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((e) =>
    Object.fromEntries(
      [
        "data-base",
        "data-exponent",
        "data-target",
        "data-view",
        "data-help",
        "data-revealed",
      ].map((n) => [n.replace("data-", ""), e.getAttribute(n)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Base drag control").fill("2");
checks.base = await state();
await page.getByLabel("Target (power) drag control").fill("4");
checks.target = await state();
await page.getByLabel("Increase Exponent (result)").click();
checks.exponent = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.getByRole("button", { name: /How to interact/ }).click();
checks.help = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.view = await state();
await page.getByRole("button", { name: /Hide answer/ }).click();
checks.hidden = await state();
await page.getByRole("button", { name: /Reveal answer/ }).click();
checks.revealed = await state();
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
    surface: region(".target-log-page"),
    regions: {
      header: region(".target-log-header"),
      tabs: region(".target-log-tabs"),
      lab: region(".target-log-lab"),
      main: region(".target-log-main"),
      trace: region(".target-log-trace"),
      practice: region(".target-log-practice"),
    },
  };
});
const passed =
  checks.initial.base === "10" &&
  checks.initial.exponent === "3" &&
  checks.initial.target === "1000" &&
  checks.base.target === "8" &&
  checks.target.exponent === "4" &&
  checks.target.target === "16" &&
  checks.exponent.exponent === "5" &&
  checks.exponent.target === "32" &&
  checks.reset.target === "1000" &&
  checks.help.help === "true" &&
  checks.view.view === "2" &&
  checks.hidden.revealed === "false" &&
  checks.revealed.revealed === "true" &&
  metrics.viewport.width === 1508 &&
  metrics.viewport.height === 1043 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0008-desktop.png") });
await copyFile(reference, path.join(out, "0008-reference.png"));
const report = {
  mockup: "0008",
  lessonId: 8,
  route: "/lessons/core-workspaces/8-logarithms",
  objectModel:
    "bidirectional-base-exponent-power-logarithm-ladder-drag-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0008-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
