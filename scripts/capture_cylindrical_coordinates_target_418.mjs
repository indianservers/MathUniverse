/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0603-interactive-advanced-3d-functions-and-surfaces-cylindrical-coordinates-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/418-cylindrical-coordinates";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 986, height: 1595 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0603");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1200);
const keys = [
    "r",
    "theta",
    "z",
    "x",
    "y",
    "mode",
    "graded",
    "correct",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
const canvas = lesson.locator(".cc418-canvas canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.45);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.3, {
  steps: 10,
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
await lesson.getByRole("button", { name: "Reset 3D view" }).click();
await page.waitForTimeout(250);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.57, box.y + box.height * 0.47);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.68, box.y + box.height * 0.58, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(200);
checks.pointDrag = { before: dragBefore, after: await state() };
await lesson.getByRole("slider", { name: "Radius r" }).fill("5");
await lesson.getByRole("slider", { name: "Angle theta" }).fill("90");
await lesson.getByRole("slider", { name: "Height z" }).fill("-2");
checks.adjusted = await state();
await lesson.getByRole("button", { name: /Cartesian/ }).click();
checks.cartesianMode = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge r").fill("4");
await lesson.getByLabel("Challenge theta").fill("90");
await lesson.getByLabel("Challenge z").fill("2");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge r").fill("5");
await lesson.getByLabel("Challenge theta").fill("126.87");
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Plot This Point/ }).click();
checks.plotted = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(700);
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
    hero: await rect(".cc418-hero"),
    tabs: await rect(".cc418-tabs"),
    lab: await rect(".cc418-lab"),
    canvas: await rect(".cc418-canvas"),
    steps: await rect(".cc418-steps"),
    middle: await rect(".cc418-middle"),
    bottom: await rect(".cc418-bottom"),
    adjacent: await rect(".cc418-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0603-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0603-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobile = await lesson.locator(".cc418-canvas canvas").screenshot(),
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
  path: path.join(evidence, "0603-mobile.png"),
  fullPage: true,
});
const near = (value, target, tolerance = 0.02) =>
    Math.abs(Number(value) - target) <= tolerance,
  passed =
    near(checks.initial.r, 3.61) &&
    near(checks.initial.theta, 40) &&
    near(checks.initial.x, 2.77) &&
    near(checks.initial.y, 2.32) &&
  checks.orbitPixelsChanged &&
  (checks.pointDrag.before.r !== checks.pointDrag.after.r || checks.pointDrag.before.theta !== checks.pointDrag.after.theta) &&
    checks.canvas.nonblank &&
    near(checks.adjusted.r, 5) &&
    near(checks.adjusted.theta, 90) &&
    near(checks.adjusted.z, -2) &&
    near(checks.adjusted.x, 0) &&
    near(checks.adjusted.y, 5) &&
    checks.cartesianMode.mode === "cartesian" &&
    checks.formulaClass.includes("active") &&
    checks.wrong.graded === "true" &&
    checks.wrong.correct === "false" &&
    checks.correct.correct === "true" &&
    near(checks.plotted.r, 5) &&
    near(checks.plotted.theta, 126.87, 0.05) &&
    near(checks.plotted.x, -3) &&
    near(checks.plotted.y, 4) &&
    near(checks.final.r, 3.61) &&
    metrics.document.width === 986 &&
    metrics.document.height === 1595 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth <= 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0603-reference.png"));
await writeFile(
  path.join(evidence, "0603-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
