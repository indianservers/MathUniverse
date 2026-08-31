/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0529-interactive-intermediate-advanced-sequences-and-series-taylor-and-maclaurin-series-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/344-taylor-and-maclaurin-series";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0529");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "function",
    "center",
    "order",
    "shown-order",
    "interval",
    "coefficients",
    "error",
    "valid",
    "playing",
    "tab",
    "question",
    "quick-result",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, attrs) =>
        Object.fromEntries(attrs.map((k) => [k, n.getAttribute(`data-${k}`)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Taylor function").selectOption("sin x");
await lesson.getByLabel("Expansion center number").fill("1");
await lesson.getByLabel("Taylor order number").fill("6");
checks.sine = await state();
await lesson.getByLabel("Taylor function").selectOption("cos x");
await lesson.getByLabel("Expansion center number").fill("0.5");
await lesson.getByLabel("Taylor order number").fill("8");
checks.cosine = await state();
await lesson.getByLabel("Taylor function").selectOption("ln(1+x)");
await lesson.getByLabel("Expansion center number").fill("0");
await lesson.getByLabel("Interval low").fill("-0.5");
await lesson.getByLabel("Interval high").fill("2");
await lesson.getByLabel("Taylor order number").fill("5");
checks.log = await state();
await lesson.getByLabel("Interval low").fill("-2");
checks.invalidLog = await state();
await lesson.getByRole("button", { name: "Reset All", exact: true }).click();
const handle = lesson.locator('[data-drag="taylor-center"]'),
  box = await handle.boundingBox();
if (!box) throw Error("Taylor center handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: /Play/ }).click();
await page.waitForTimeout(800);
checks.play = await state();
await lesson.getByRole("button", { name: /Pause/ }).click();
const beforeStep = await state();
await lesson.getByRole("button", { name: /Step/ }).click();
checks.step = await state();
checks.stepBefore = beforeStep;
await lesson.getByRole("button", { name: /B\)/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /A\)/ }).first().click();
checks.accepted = await state();
await lesson
  .getByRole("button", { name: "Next Question", exact: true })
  .click();
await lesson.getByRole("button", { name: /A\)/ }).first().click();
await lesson.getByRole("button", { name: "Key Insights", exact: true }).click();
checks.secondAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0529"]')
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
    hero: await rect(".seq344-hero"),
    tabs: await rect(".seq344-tabs"),
    lab: await rect(".seq344-lab"),
    insights: await rect(".seq344-insights"),
    check: await rect(".seq344-check"),
    adjacent: await rect(".lesson-adjacent-nav"),
    footer: await rect('footer[aria-label="Site footer"]'),
  };
const passed =
  checks.initial.function === "e^x" &&
  checks.initial.coefficients.startsWith("1,1,0.5,0.1666667,0.0416667") &&
  checks.sine.function === "sin x" &&
  checks.sine.center === "1" &&
  checks.sine.order === "6" &&
  checks.cosine.order === "8" &&
  checks.log.valid === "true" &&
  checks.log.coefficients.startsWith("0,1,-0.5,0.3333333") &&
  checks.invalidLog.valid === "false" &&
  checks.drag.center !== "0" &&
  checks.play.playing === "true" &&
  checks.step["shown-order"] !== checks.stepBefore["shown-order"] &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.secondAccepted.question === "1" &&
  checks.secondAccepted["quick-result"] === "correct" &&
  checks.secondAccepted.tab === "Key Insights" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1821 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0529-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0529-reference.png"));
await writeFile(
  path.join(evidence, "0529-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0529", lessonId: 344, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
