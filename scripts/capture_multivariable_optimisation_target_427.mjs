/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0612-interactive-advanced-3d-functions-and-surfaces-multivariable-optimisation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/427-multivariable-optimisation",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1030, height: 1527 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (
    ["error", "warning"].includes(m.type()) &&
    !m.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0612");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1300);
const keys = [
    "x",
    "y",
    "z",
    "gx",
    "gy",
    "magnitude",
    "det",
    "classification",
    "constraint",
    "graded",
    "correct",
    "solution",
    "complete",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() },
  canvas = lesson.locator(".mo427-surface canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.42);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.56, box.y + box.height * 0.3, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(180);
const after = await canvas.screenshot();
checks.orbitPixelsChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: "Reset view" }).click();
await page.waitForTimeout(250);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.15);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.64, box.y + box.height * 0.62, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(180);
checks.pointDrag = { before: dragBefore, after: await state() };
await lesson.getByLabel("x coordinate").fill("1");
await lesson.getByLabel("y coordinate").fill("1");
checks.stationary = await state();
await lesson.getByRole("button", { name: "Add Constraint" }).click();
checks.constraint = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge stationary set").selectOption("origin");
await lesson.getByLabel("Challenge classification").selectOption("saddle");
await lesson.getByRole("button", { name: "Check My Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge stationary set").selectOption("x=2y");
await lesson
  .getByLabel("Challenge classification")
  .selectOption("minimum-trough");
await lesson.getByRole("button", { name: "Check My Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show Solution" }).click();
checks.solutionVisible = await lesson.getByText(/f=\(x-2y\)²≥0/).isVisible();
await lesson.getByRole("button", { name: "Mark as Complete" }).click();
checks.complete = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(650);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
    const value = await lesson.locator(selector).boundingBox();
    return value
      ? {
          top: Math.round(value.y),
          left: Math.round(value.x),
          width: Math.round(value.width),
          height: Math.round(value.height),
          bottom: Math.round(value.y + value.height),
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
    hero: await rect(".mo427-hero"),
    tabs: await rect(".mo427-tabs"),
    lab: await rect(".mo427-lab"),
    surface: await rect(".mo427-surface"),
    stationary: await rect(".mo427-stationary"),
    pattern: await rect(".mo427-pattern"),
    rule: await rect(".mo427-rule"),
    challenge: await rect(".mo427-challenge"),
    adjacent: await rect(".mo427-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0612-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0612-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobileCanvas = await lesson.locator(".mo427-surface canvas").screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    nonblank: mobileCanvas.length > 2000,
  };
await page.screenshot({
  path: path.join(evidence, "0612-mobile.png"),
  fullPage: true,
});
const pointMoved =
    checks.pointDrag.before.x !== checks.pointDrag.after.x ||
    checks.pointDrag.before.y !== checks.pointDrag.after.y,
  passed =
    checks.initial.z === "4" &&
    checks.initial.gx === "4" &&
    checks.initial.gy === "-4" &&
    checks.initial.det === "0" &&
    checks.orbitPixelsChanged &&
    pointMoved &&
    checks.canvas.nonblank &&
    checks.stationary.x === "1" &&
    checks.stationary.y === "1" &&
    checks.stationary.z === "0" &&
    checks.stationary.gx === "0" &&
    checks.stationary.gy === "0" &&
    checks.stationary.classification === "Degenerate minimum trough" &&
    checks.constraint.constraint === "true" &&
    checks.formula.includes("active") &&
    checks.wrong.graded === "true" &&
    checks.wrong.correct === "false" &&
    checks.correct.correct === "true" &&
    checks.solutionVisible &&
    checks.complete.complete === "true" &&
    checks.final.z === "4" &&
    metrics.document.width === 1030 &&
    metrics.document.height === 1527 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth <= 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0612-reference.png"));
await writeFile(
  path.join(evidence, "0612-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
