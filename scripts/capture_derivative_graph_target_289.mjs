/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0368-interactive-advanced-limits-and-differential-calculus-derivative-graph-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/289-derivative-graph",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1013, height: 1553 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0368");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x",
        "fx",
        "derivative",
        "sign",
        "f-scale",
        "d-scale",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Shared cursor").fill("1");
checks.xOne = await state();
await lesson.getByLabel("Function vertical scale").fill("5");
await lesson.getByLabel("Derivative vertical scale").fill("8");
checks.scales = await state();
const handle = lesson.locator('[data-drag="cursor-function"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Shared graph cursor missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 55, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("radio", { name: /A\./ }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByRole("radio", { name: /B\./ }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0368"]')
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
    hero: rect(".dgr289-hero"),
    flow: rect(".dgr289-flow"),
    tabs: rect(".dgr289-tabs"),
    lab: rect(".dgr289-lab"),
    learn: rect(".dgr289-learn"),
    adjacent: rect(".dgr289-adjacent"),
    footer: rect(".dgr289-footer"),
  };
});
const passed =
  checks.initial.x === "-0.64" &&
  checks.initial.fx === "0.7" &&
  checks.initial.derivative === "-0.87" &&
  checks.initial.sign === "Negative" &&
  checks.xOne.sign === "Positive" &&
  checks.scales["f-scale"] === "5" &&
  checks.scales["d-scale"] === "8" &&
  checks.dragged.x !== "1" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "-0.64" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1013 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 211 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0368",
  lessonId: 289,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0368-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0368-reference.png"));
await writeFile(
  path.join(evidence, "0368-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
