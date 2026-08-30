/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0372-interactive-advanced-limits-and-differential-calculus-chain-rule-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/293-chain-rule",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1007, height: 1562 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0372");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x",
        "inner",
        "output",
        "inner-rate",
        "outer-rate",
        "total-rate",
        "result",
        "hint",
        "steps",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Chain input x").fill("1");
checks.xOne = await state();
await lesson.getByLabel("Chain output y").fill("0.25");
checks.outputDriven = await state();
const handle = lesson.locator('[data-drag="chain-point"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Chain graph point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 30, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
await lesson.getByRole("button", { name: /Steps/ }).click();
checks.disclosure = await state();
await lesson.getByLabel("Chain rule practice answer").fill("4(3x^2+1)^3");
await lesson.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await lesson.getByLabel("Chain rule practice answer").fill("24x(3x^2+1)^3");
await lesson.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0372"]')
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
    hero: rect(".chr293-hero"),
    tabs: rect(".chr293-tabs"),
    flow: rect(".chr293-flow"),
    model: rect(".chr293-model"),
    graph: rect(".chr293-graph"),
    work: rect(".chr293-work"),
    practice: rect(".chr293-practice"),
    adjacent: rect(".chr293-adjacent"),
  };
});
const passed =
  checks.initial.x === "0.05" &&
  checks.initial.inner === "0.05" &&
  checks.initial.output === "0.0025" &&
  checks.initial["inner-rate"] === "0.9988" &&
  checks.initial["outer-rate"] === "0.1" &&
  checks.initial["total-rate"] === "0.0998" &&
  checks.xOne.inner === "0.8415" &&
  checks.xOne.output === "0.7081" &&
  checks.outputDriven.x !== "1" &&
  checks.dragged.x !== checks.outputDriven.x &&
  checks.disclosure.hint === "false" &&
  checks.disclosure.steps === "true" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "0.05" &&
  checks.reset.hint === "true" &&
  checks.reset.steps === "false" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1007 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 205 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0372",
  lessonId: 293,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0372-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0372-reference.png"));
await writeFile(
  path.join(evidence, "0372-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
