/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0531-interactive-intermediate-advanced-sequences-and-series-recurrence-modelling-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/346-recurrence-modelling";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 921, height: 1708 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0531");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "scenario",
    "r",
    "k",
    "initial",
    "units",
    "values",
    "changes",
    "selected-n",
    "recursive",
    "closed",
    "difference",
    "equilibrium",
    "stable",
    "tab",
    "question",
    "quick-result",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, a) =>
        Object.fromEntries(a.map((k) => [k, n.getAttribute(`data-${k}`)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson
  .getByLabel("Recurrence scenario")
  .selectOption("Savings with deposits");
checks.savings = await state();
await lesson.getByLabel("Recurrence scenario").selectOption("Medication decay");
checks.medication = await state();
await lesson.getByLabel("Growth factor number").fill("0.8");
await lesson.getByLabel("Additive input").fill("100");
await lesson.getByLabel("Initial value").fill("500");
await lesson.getByLabel("Compare index").selectOption("5");
checks.manual = await state();
await lesson.getByRole("button", { name: /Reset/, exact: true }).click();
const handle = lesson.locator('[data-drag="recurrence-point-10"]'),
  box = await handle.boundingBox();
if (!box) throw Error("Recurrence drag point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 25, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: /A\. 116432/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /B\. 117546/ }).click();
checks.accepted = await state();
await lesson
  .getByRole("button", { name: "Next question", exact: true })
  .click();
await lesson.getByRole("button", { name: /A\. \|r\|<1/ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.secondAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0531"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => {
  scrollTo(0, 0);
  document.querySelectorAll("*").forEach((n) => {
    if (n.scrollLeft) n.scrollLeft = 0;
  });
});
const rect = async (s) => {
    const b = await page.locator(s).first().boundingBox();
    return b
      ? {
          top: Math.round(b.y),
          left: Math.round(b.x),
          width: Math.round(b.width),
          height: Math.round(b.height),
          bottom: Math.round(b.y + b.height),
        }
      : null;
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await rect(".seq346-hero"),
    tabs: await rect(".seq346-tabs"),
    lab: await rect(".seq346-lab"),
    notes: await rect(".seq346-notes"),
    check: await rect(".seq346-check"),
    adjacent: await rect(".lesson-adjacent-nav"),
    footer: await rect('footer[aria-label="Site footer"]'),
  };
const passed =
  checks.initial.values.startsWith("50000,55000,60500") &&
  checks.initial.recursive === "129687.123005" &&
  checks.initial.difference === "0" &&
  checks.savings.values.startsWith("10000,11500,13075") &&
  checks.medication.stable === "true" &&
  checks.medication.equilibrium === "71.428571" &&
  checks.manual.r === "0.8" &&
  checks.manual.k === "100" &&
  checks.manual.initial === "500" &&
  checks.manual.stable === "true" &&
  checks.manual.equilibrium === "500" &&
  checks.manual.difference === "0" &&
  checks.drag.r !== "1.1" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.secondAccepted.question === "1" &&
  checks.secondAccepted["quick-result"] === "correct" &&
  checks.secondAccepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1708 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0531-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0531-reference.png"));
await writeFile(
  path.join(evidence, "0531-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0531", lessonId: 346, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
