/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0395-interactive-advanced-integral-calculus-and-differential-equations-numerical-integration-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/316-numerical-integration";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0395");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "function",
        "interval",
        "n",
        "dx",
        "midpoint",
        "trapezoid",
        "simpson",
        "exact",
        "midpoint-visible",
        "trapezoid-visible",
        "simpson-visible",
        "tab",
        "checked",
        "score",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson
  .getByLabel("Numerical integration function")
  .selectOption("quadratic");
await lesson
  .getByLabel("Numerical integration interval")
  .selectOption("zero-one");
await lesson.getByLabel("Numerical integration subintervals").fill("16");
checks.controls = await state();
await lesson.getByRole("button", { name: "Midpoint", exact: true }).click();
await lesson.getByRole("button", { name: "Simpson's", exact: true }).click();
checks.layers = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
const handle = lesson.locator('[data-drag="numerical-partition"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Numerical-integration partition handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 50, box.y, { steps: 7 });
await page.mouse.up();
checks.drag = await state();
for (const label of ["Midpoint", "Trapezoidal", "Simpson's"])
  await lesson.getByLabel(`Numerical practice ${label}`).fill("0");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Numerical practice Midpoint").fill("1.0028615");
await lesson.getByLabel("Numerical practice Trapezoidal").fill("0.9942819");
await lesson.getByLabel("Numerical practice Simpson's").fill("1.0000263");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0395"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return (
      box &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(box[key]),
        ]),
      )
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".ni316-hero"),
    tabs: rect(".ni316-tabs"),
    idea: rect(".ni316-idea"),
    lab: rect(".ni316-lab"),
    flow: rect(".ni316-flow"),
    formulas: rect(".ni316-formulas"),
    worked: rect(".ni316-worked"),
    practice: rect(".ni316-practice"),
    adjacent: rect(".ni316-adjacent"),
  };
});
const passed =
  checks.initial.n === "8" &&
  checks.initial.exact === "2" &&
  checks.initial.midpoint === "2.0129090856" &&
  checks.initial.trapezoid === "1.9742316019" &&
  checks.initial.simpson === "2.0002691699" &&
  checks.controls.function === "quadratic" &&
  checks.controls.interval === "zero-one" &&
  checks.controls.n === "16" &&
  checks.controls.simpson === "0.3333333333" &&
  checks.layers["midpoint-visible"] === "false" &&
  checks.layers["simpson-visible"] === "false" &&
  checks.tab.tab === "Formulas" &&
  checks.localReset.actions === "0" &&
  checks.drag.n !== "8" &&
  checks.rejected.score === "0" &&
  checks.accepted.score === "3" &&
  checks.shellReset.n === "8" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.adjacent.bottom === 1536 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0395",
  lessonId: 316,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0395-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0395-reference.png"));
await writeFile(
  path.join(evidence, "0395-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
