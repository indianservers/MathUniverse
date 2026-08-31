/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0530-interactive-intermediate-advanced-sequences-and-series-binomial-series-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/345-binomial-series";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0530");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "alpha",
    "x",
    "count",
    "selected-k",
    "coefficients",
    "partials",
    "target",
    "partial",
    "error",
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
await lesson.getByLabel("Binomial exponent number").fill("0.5");
await lesson.getByLabel("Binomial input number").fill("0.4");
await lesson.getByLabel("Binomial terms number").fill("6");
checks.squareRoot = await state();
await lesson.getByLabel("Coefficient index").selectOption("4");
checks.coefficient = await state();
await lesson.getByLabel("Binomial exponent number").fill("-1");
await lesson.getByLabel("Binomial input number").fill("0.3");
checks.geometric = await state();
await lesson.getByRole("button", { name: /Reset/, exact: true }).click();
const handle = lesson.locator('[data-drag="binomial-input"]'),
  box = await handle.boundingBox();
if (!box) throw Error("Binomial input handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Binomial terms number").fill("10");
checks.count = await state();
await lesson.getByRole("button", { name: /A\./ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /B\./ }).click();
checks.accepted = await state();
await lesson
  .getByRole("button", { name: "Next question", exact: true })
  .click();
await lesson.getByRole("button", { name: /A\./ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.secondAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0530"]')
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
    hero: await rect(".seq345-hero"),
    tabs: await rect(".seq345-tabs"),
    lab: await rect(".seq345-lab"),
    learn: await rect(".seq345-learn"),
    adjacent: await rect(".lesson-adjacent-nav"),
    footer: await rect('footer[aria-label="Site footer"]'),
  };
const passed =
  checks.initial.coefficients.startsWith("1,0.75,-0.09375,0.0390625") &&
  checks.squareRoot.coefficients.startsWith("1,0.5,-0.125,0.0625") &&
  checks.squareRoot.target === "1.183215957" &&
  checks.coefficient["selected-k"] === "4" &&
  checks.geometric.coefficients.startsWith("1,-1,1,-1") &&
  checks.drag.x !== "0.4" &&
  checks.count.count === "10" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.secondAccepted.question === "1" &&
  checks.secondAccepted["quick-result"] === "correct" &&
  checks.secondAccepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1821 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0530-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0530-reference.png"));
await writeFile(
  path.join(evidence, "0530-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0530", lessonId: 345, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
