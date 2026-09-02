/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0607-interactive-advanced-3d-functions-and-surfaces-partial-derivatives-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/422-partial-derivatives",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1003, height: 1568 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0607");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1300);
const keys = ["x", "y", "z", "dx", "dy", "graded", "correct", "actions"],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() },
  canvas = lesson.locator(".pd422-canvas canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.32, box.y + box.height * 0.52);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.32, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(200);
const after = await canvas.screenshot();
checks.orbitPixelsChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: /Reset view/ }).click();
await page.waitForTimeout(250);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.692, box.y + box.height * 0.375);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.45, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(200);
checks.pointDrag = { before: dragBefore, after: await state() };
await lesson.getByRole("slider", { name: "x coordinate" }).fill("2");
await lesson.getByRole("slider", { name: "y coordinate" }).fill("1");
checks.positive = await state();
await lesson.getByRole("slider", { name: "x coordinate" }).fill("-2.5");
await lesson.getByRole("slider", { name: "y coordinate" }).fill("0.5");
checks.mixed = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge x").fill("0");
await lesson.getByLabel("Challenge y").fill("1");
await lesson.getByRole("button", { name: "Check answers" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge x").fill("-1");
await lesson.getByLabel("Challenge y").fill("0");
await lesson.getByRole("button", { name: "Check answers" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hintVisible = await lesson.getByText(/2x\+y/).isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(650);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
    const r = await lesson.locator(s).boundingBox();
    return r
      ? {
          top: Math.round(r.y),
          left: Math.round(r.x),
          width: Math.round(r.width),
          height: Math.round(r.height),
          bottom: Math.round(r.y + r.height),
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
    hero: await rect(".pd422-hero"),
    tabs: await rect(".pd422-tabs"),
    lab: await rect(".pd422-lab"),
    canvas: await rect(".pd422-canvas"),
    cross: await rect(".pd422-cross"),
    info: await rect(".pd422-info"),
    bottom: await rect(".pd422-bottom"),
    adjacent: await rect(".pd422-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0607-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0607-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobile = await lesson.locator(".pd422-canvas canvas").screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    nonblank: mobile.length > 2000,
  };
await page.screenshot({
  path: path.join(evidence, "0607-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.x === "1.5" &&
  checks.initial.y === "-1" &&
  checks.initial.z === "3.25" &&
  checks.initial.dx === "3" &&
  checks.initial.dy === "-2" &&
  checks.orbitPixelsChanged &&
  (checks.pointDrag.before.x !== checks.pointDrag.after.x || checks.pointDrag.before.y !== checks.pointDrag.after.y) &&
  checks.canvas.nonblank &&
  checks.positive.x === "2" &&
  checks.positive.y === "1" &&
  checks.positive.z === "5" &&
  checks.positive.dx === "4" &&
  checks.positive.dy === "2" &&
  checks.mixed.z === "6.5" &&
  checks.mixed.dx === "-5" &&
  checks.mixed.dy === "1" &&
  checks.formula.includes("active") &&
  checks.wrong.correct === "false" &&
  checks.wrong.graded === "true" &&
  checks.correct.correct === "true" &&
  checks.hintVisible &&
  checks.final.x === "1.5" &&
  metrics.document.width === 1003 &&
  metrics.document.height === 1568 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0607-reference.png"));
await writeFile(
  path.join(evidence, "0607-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
