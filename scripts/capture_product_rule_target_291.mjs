/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0370-interactive-advanced-limits-and-differential-calculus-product-rule-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/291-product-rule",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0370");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "u",
        "v",
        "x",
        "step",
        "domain",
        "u-value",
        "v-value",
        "product",
        "model",
        "rule",
        "error",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Product derivative step").fill("0.01");
await lesson.getByLabel("Product domain maximum").fill("5");
await lesson.getByLabel("Factor u").fill("x");
await lesson.getByLabel("Factor v").fill("exp(x)");
checks.edited = await state();
await lesson.getByLabel("Factor u").fill("sin(x)");
await lesson.getByLabel("Factor v").fill("x^2 - 2");
await lesson.getByLabel("Product derivative step").fill("0.05");
const handle = lesson.locator('[data-drag="product-cursor"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Product graph cursor missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
const toggles = lesson.getByRole("checkbox");
await toggles.nth(1).uncheck();
await toggles.nth(2).uncheck();
checks.toggles = await state();
await lesson.getByLabel("Product rule practice answer").fill("exp(x)");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Product rule practice answer").fill("exp(x)*(x+1)");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0370"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /*SVG*/
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((k) => [
        k,
        Math.round(b[k]),
      ]),
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".prd291-hero"),
    tabs: rect(".prd291-tabs"),
    flow: rect(".prd291-flow"),
    lab: rect(".prd291-lab"),
    learn: rect(".prd291-learn"),
    practice: rect(".prd291-practice"),
    adjacent: rect(".prd291-adjacent"),
  };
});
const passed =
  checks.initial.u === "sin(x)" &&
  checks.initial.v === "x^2-2" &&
  checks.initial.x === "1.2" &&
  checks.initial["u-value"] === "0.932" &&
  checks.initial["v-value"] === "-0.56" &&
  checks.initial.product === "-0.5219" &&
  Number(checks.initial.error) < 0.01 &&
  checks.edited.u === "x" &&
  checks.edited.v === "exp(x)" &&
  checks.edited.step === "0.01" &&
  checks.edited.domain === "5" &&
  checks.dragged.x !== "1.2" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.u === "sin(x)" &&
  checks.reset.v === "x^2-2" &&
  checks.reset.x === "1.2" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 216 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0370",
  lessonId: 291,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0370-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0370-reference.png"));
await writeFile(
  path.join(evidence, "0370-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
