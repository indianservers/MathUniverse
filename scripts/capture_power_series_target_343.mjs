/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0528-interactive-intermediate-advanced-sequences-and-series-power-series-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/343-power-series";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 918, height: 1714 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0528");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "center",
  "target",
  "mode",
  "degree",
  "range",
  "coefficients",
  "radius",
  "interval",
  "error",
  "recognized",
  "tab",
  "question",
  "quick-result",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attrs) =>
      Object.fromEntries(
        attrs.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };
await lesson.getByRole("button", { name: "Preset", exact: true }).click();
await lesson
  .getByLabel("Target function", { exact: true })
  .selectOption("sin x");
await lesson.getByLabel("Power series center", { exact: true }).fill("1");
await lesson.getByLabel("Truncation degree number", { exact: true }).fill("6");
checks.sinPreset = await state();
await lesson
  .getByLabel("Target function", { exact: true })
  .selectOption("1 / (1 - x)");
await lesson.getByLabel("Power series center", { exact: true }).fill("0.25");
checks.geometricPreset = await state();
await lesson.getByRole("button", { name: "Manual", exact: true }).click();
for (let index = 0; index < 5; index += 1)
  await lesson.getByLabel(`Coefficient a${index}`, { exact: true }).fill("1");
checks.manual = await state();
await lesson.getByLabel("Truncation degree number", { exact: true }).fill("4");
const handle = lesson.locator('[data-drag="power-series-coefficient"]'),
  box = await handle.boundingBox();
if (!box) throw Error("Power-series drag handle missing");
const beforeDrag = await state();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 28, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
checks.dragBefore = beforeDrag;
await lesson.getByLabel("Power series x range", { exact: true }).fill("3.1");
checks.range = await state();
await lesson
  .getByRole("button", { name: /B\s+1/, exact: false })
  .first()
  .click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /C\s+∞/, exact: false }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Try another", exact: true }).click();
await lesson
  .getByRole("button", { name: /B\s+1/, exact: false })
  .first()
  .click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.secondAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0528"]')
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
  hero: await rect(".seq343-hero"),
  tabs: await rect(".seq343-tabs"),
  lab: await rect(".seq343-lab"),
  insights: await rect(".seq343-insights"),
  guide: await rect(".seq343-guide"),
  check: await rect(".seq343-check"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.mode === "Manual" &&
  checks.initial.recognized === "cos x" &&
  checks.initial.radius === "infinity" &&
  checks.sinPreset.target === "sin x" &&
  checks.sinPreset.center === "1" &&
  checks.sinPreset.degree === "6" &&
  checks.sinPreset.radius === "infinity" &&
  checks.geometricPreset.radius === "0.75" &&
  checks.geometricPreset.interval === "(-0.5, 1)" &&
  checks.manual.mode === "Manual" &&
  checks.drag.coefficients !== checks.dragBefore.coefficients &&
  checks.range.range === "3.1" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.secondAccepted.question === "1" &&
  checks.secondAccepted["quick-result"] === "correct" &&
  checks.secondAccepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1714 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0528-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0528-reference.png"));
await writeFile(
  path.join(evidence, "0528-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0528", lessonId: 343, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
