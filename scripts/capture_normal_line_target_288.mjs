/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0367-interactive-advanced-limits-and-differential-calculus-normal-line-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/288-normal-line",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0367");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["x", "y", "h", "tangent", "normal", "vertical", "result", "actions"].map(
        (k) => [k, n.getAttribute(`data-${k}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Point x").fill("1");
checks.xOne = await state();
await lesson.getByLabel("Step size h").fill("0.12");
checks.step = await state();
const handle = lesson.locator('[data-drag="normal-point"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Normal point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Normal slope answer").fill("-1");
await lesson.getByRole("button", { name: /Check Answer/ }).click();
checks.rejected = await state();
await lesson.getByLabel("Normal slope answer").fill("1");
await lesson.getByLabel("Normal intercept answer").fill("-0.5");
await lesson.getByRole("button", { name: /Check Answer/ }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0367"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /* SVG */
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
    hero: rect(".nln288-hero"),
    tabs: rect(".nln288-tabs"),
    flow: rect(".nln288-flow"),
    lab: rect(".nln288-lab"),
    rule: rect(".nln288-rule"),
    bottom: rect(".nln288-bottom"),
    adjacent: rect(".nln288-adjacent"),
    footer: rect(".nln288-footer"),
  };
});
const passed =
  checks.initial.x === "0.25" &&
  checks.initial.y === "0.125" &&
  checks.initial.tangent === "0" &&
  checks.initial.normal === "-2500" &&
  checks.initial.vertical === "true" &&
  checks.xOne.y === "-1" &&
  checks.xOne.tangent === "-3" &&
  checks.xOne.normal === "0.3333" &&
  checks.step.h === "0.12" &&
  checks.dragged.x !== "1" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "0.25" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.sidebar?.width === 218 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0367",
  lessonId: 288,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0367-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0367-reference.png"));
await writeFile(
  path.join(evidence, "0367-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
