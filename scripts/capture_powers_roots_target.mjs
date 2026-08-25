import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0006-interactive-foundational-advanced-scientific-calculator-powers-and-roots-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/6-powers-and-roots",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1068, height: 1472 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0006");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((e) =>
    Object.fromEntries(
      [
        "data-radicand",
        "data-root",
        "data-base",
        "data-exponent",
        "data-power",
        "data-total",
        "data-view",
        "data-actions",
        "data-revealed",
      ].map((n) => [n.replace("data-", ""), e.getAttribute(n)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Increase Radicand (area)").click();
checks.radicand = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.getByLabel("Increase Base").click();
checks.base = await state();
await page.getByLabel("Decrease Exponent").click();
checks.exponent = await state();
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
    surface: region(".target-powers-page"),
    regions: {
      header: region(".target-powers-header"),
      tabs: region(".target-powers-tabs"),
      lab: region(".target-powers-lab"),
      models: region(".powers-models"),
      trace: region(".powers-trace"),
      practice: region(".powers-practice"),
      navigation: region(".target-powers-nav"),
    },
  };
});
const passed =
  checks.initial.radicand === "144" &&
  checks.initial.root === "12" &&
  checks.initial.power === "8" &&
  checks.initial.total === "20" &&
  checks.radicand.radicand === "145" &&
  checks.reset.radicand === "144" &&
  checks.base.power === "27" &&
  checks.base.total === "39" &&
  checks.exponent.power === "9" &&
  checks.exponent.total === "21" &&
  checks.view.view === "2" &&
  checks.hidden.revealed === "false" &&
  checks.revealed.revealed === "true" &&
  metrics.viewport.width === 1068 &&
  metrics.viewport.height === 1472 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0006-desktop.png") });
await copyFile(reference, path.join(out, "0006-reference.png"));
const report = {
  mockup: "0006",
  lessonId: 6,
  route: "/lessons/core-workspaces/6-powers-and-roots",
  objectModel:
    "linked-square-root-area-grid-repeated-power-cube-combined-expression-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0006-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
