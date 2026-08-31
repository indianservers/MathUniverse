/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0527-interactive-intermediate-advanced-sequences-and-series-convergence-and-divergence-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/342-convergence-and-divergence";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 786, height: 2001 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0527");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "series-type",
        "terms",
        "partials",
        "converges",
        "absolute",
        "nth-limit",
        "ratio-limit",
        "sum",
        "tolerance",
        "tab",
        "question",
        "quick-result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Common ratio", { exact: true }).fill("1.2");
checks.geometricDivergent = await state();
await lesson.getByRole("button", { name: "p-Series", exact: true }).click();
checks.pSeries = await state();
await lesson.getByLabel("Power", { exact: true }).fill("0.8");
checks.pDivergent = await state();
await lesson.getByRole("button", { name: "Alternating", exact: true }).click();
checks.alternating = await state();
await lesson.getByRole("button", { name: "Factorial", exact: true }).click();
checks.factorial = await state();
await lesson.getByRole("button", { name: "Custom", exact: true }).click();
await lesson.getByLabel("Scale", { exact: true }).fill("2");
await lesson.getByLabel("Shift", { exact: true }).fill("1");
await lesson.getByLabel("Power", { exact: true }).fill("2");
checks.custom = await state();
await lesson.getByRole("button", { name: "Geometric", exact: true }).click();
await lesson.getByLabel("Common ratio", { exact: true }).fill("0.5");
const handle = lesson.locator(".seq342-plot .point").last();
const box = await handle.boundingBox();
if (!box) throw Error("Analysis drag point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 25, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Tolerance", { exact: true }).fill("0.1");
await lesson
  .getByLabel("Counterexample", { exact: true })
  .selectOption("Divergent geometric, r = 1.2");
checks.analysisControls = await state();
await lesson.getByRole("button", { name: "B. Divergent", exact: true }).click();
checks.rejected = await state();
await lesson
  .getByRole("button", { name: "A. Convergent", exact: true })
  .click();
checks.accepted = await state();
await lesson.getByRole("button", { name: /Next Question/ }).click();
await lesson.getByRole("button", { name: "B. Divergent", exact: true }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.secondAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0527"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => {
  scrollTo(0, 0);
  document.querySelectorAll("*").forEach((node) => {
    if (node.scrollLeft) node.scrollLeft = 0;
  });
});
const rect = async (selector) => {
  const box = await page.locator(selector).first().boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        left: Math.round(box.x),
        width: Math.round(box.width),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".seq342-hero"),
  tabs: await rect(".seq342-tabs"),
  objective: await rect(".seq342-objective"),
  define: await rect(".seq342-define"),
  plot: await rect(".seq342-plot"),
  tests: await rect(".seq342-tests"),
  classify: await rect(".seq342-classify"),
  worked: await rect(".seq342-worked"),
  check: await rect(".seq342-check"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial["series-type"] === "Geometric" &&
  checks.initial.sum === "8" &&
  checks.initial.converges === "true" &&
  checks.geometricDivergent.converges === "false" &&
  checks.geometricDivergent["ratio-limit"] === "1.2" &&
  checks.pSeries.converges === "true" &&
  checks.pSeries["ratio-limit"] === "1" &&
  checks.pDivergent.converges === "false" &&
  checks.alternating.converges === "true" &&
  checks.alternating.absolute === "false" &&
  checks.factorial.sum === "1.718282" &&
  checks.factorial["ratio-limit"] === "0" &&
  checks.custom.converges === "true" &&
  checks.drag["ratio-limit"] !== "0.5" &&
  checks.analysisControls.tolerance === "0.1" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.secondAccepted.question === "1" &&
  checks.secondAccepted["quick-result"] === "correct" &&
  checks.secondAccepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 2001 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0527-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0527-reference.png"));
await writeFile(
  path.join(evidence, "0527-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0527", lessonId: 342, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
