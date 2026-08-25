import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0005-interactive-foundational-advanced-scientific-calculator-ratio-calculator-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://localhost:2245/lessons/core-workspaces/5-ratio-calculator";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1536, height: 1024 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded" });
const rootNode = page.getByTestId("calculator-mockup-0005");
await rootNode.waitFor();
const state = () =>
  rootNode.evaluate((element) =>
    Object.fromEntries(
      [
        "data-a",
        "data-b",
        "data-gcf",
        "data-simple",
        "data-view",
        "data-actions",
        "data-example",
        "data-feedback",
      ].map((name) => [name.replace("data-", ""), element.getAttribute(name)]),
    ),
  );
const checks = { initial: await state() };
await page.getByLabel("Part A drag control").fill("30");
await page.getByLabel("Part B drag control").fill("45");
checks.dragged = await state();
await page.locator(".ratio-stepper").first().locator("button").last().click();
checks.stepped = await state();
await page.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.getByRole("button", { name: "Examples", exact: true }).click();
checks.view = await state();
await page.getByLabel("Ratio practice value 3").fill("4");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await page.getByLabel("Ratio practice value 3").fill("3");
await page.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await page.getByRole("button", { name: /New example/ }).click();
checks.example = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await rootNode.waitFor();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const r = globalThis.document
      .querySelector(selector)
      ?.getBoundingClientRect();
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
    surface: region(".target-ratio-page"),
    regions: {
      header: region(".target-ratio-header"),
      tabs: region(".target-ratio-tabs"),
      lab: region(".target-ratio-lab"),
      practice: region(".target-ratio-practice"),
      navigation: region(".target-ratio-nav"),
    },
  };
});
const passed =
  checks.initial.a === "24" &&
  checks.initial.b === "36" &&
  checks.initial.gcf === "12" &&
  checks.initial.simple === "2:3" &&
  checks.dragged.gcf === "15" &&
  checks.dragged.simple === "2:3" &&
  checks.stepped.a === "31" &&
  checks.reset.a === "24" &&
  checks.view.view === "2" &&
  checks.wrong.feedback === "incorrect" &&
  checks.correct.feedback === "correct" &&
  checks.example.example === "1" &&
  metrics.viewport.width === 1536 &&
  metrics.viewport.height === 1024 &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0005-desktop.png") });
await copyFile(reference, path.join(out, "0005-reference.png"));
const report = {
  mockup: "0005",
  lessonId: 5,
  route: "/lessons/core-workspaces/5-ratio-calculator",
  objectModel:
    "dual-draggable-ratio-gcf-equal-groups-tiles-double-number-line-practice-model",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0005-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
