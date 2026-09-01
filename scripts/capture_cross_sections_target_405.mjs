/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0590-interactive-intermediate-advanced-3d-geometry-and-solids-cross-sections-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/405-cross-sections";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0590");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1200);
const keys = [
    "solid",
    "tilt",
    "position",
    "shape",
    "vertices",
    "perimeter",
    "area",
    "trace",
    "playing",
    "prediction",
    "checked",
    "correct",
    "fullscreen",
    "tab",
    "shared",
    "actions",
    "challenge-done",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(
          names.map((name) => [
            name,
            node.dataset[
              name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
            ],
          ]),
        ),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Plane tilt").fill("0");
checks.horizontalCube = await state();
await lesson.getByLabel("Plane position").fill("1");
checks.movedSquare = await state();
await lesson.getByLabel("Plane position").fill("0");
await lesson.getByLabel("Plane tilt").fill("-45");
checks.challenge = await state();
await lesson.getByTitle("Cone").click();
checks.cone = await state();
await lesson.getByTitle("Cylinder").click();
checks.cylinder = await state();
await lesson.getByTitle("Cube").click();
checks.cubeAgain = await state();
await lesson.getByRole("button", { name: "Triangle", exact: true }).click();
await lesson
  .getByRole("button", { name: "Check prediction", exact: true })
  .click();
checks.wrongPrediction = await state();
await lesson.getByRole("button", { name: /Other/, exact: false }).click();
await lesson
  .getByRole("button", { name: "Check prediction", exact: true })
  .click();
checks.correctPrediction = await state();
await lesson.getByLabel("Trace section").uncheck();
checks.traceOff = await state();
await lesson.getByLabel("Trace section").check();
await lesson.getByTitle("Play trace").click();
checks.animationStart = await state();
await page.waitForTimeout(360);
checks.animationAdvanced = await state();
await lesson.getByTitle("Pause trace").click();
checks.animationStop = await state();
await lesson.getByRole("button", { name: /Show calculations/ }).click();
await lesson.getByTitle("Full screen").click();
checks.fullscreen = await state();
await lesson.getByTitle("Exit full screen").click();
checks.fullscreenExit = await state();
const canvas = lesson
    .getByTestId("geometry3d-cross-section-canvas")
    .locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.4, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(250);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: /Share/ }).click();
checks.shared = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(900);
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const b = await lesson.locator(selector).boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        left: Math.round(b.x),
        width: Math.round(b.width),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".cross405-hero"),
  tabs: await rect(".cross405-tabs"),
  lab: await rect(".cross405-lab"),
  scene: await rect(".cross405-scene"),
  result: await rect(".cross405-result"),
  predict: await rect(".cross405-predict"),
  examples: await rect(".cross405-examples"),
  tip: await rect(".cross405-tip"),
};
await page.screenshot({
  path: path.join(evidence, "0590-desktop.png"),
  fullPage: false,
});
await lesson
  .getByTestId("geometry3d-cross-section-canvas")
  .locator("canvas")
  .screenshot({ path: path.join(evidence, "0590-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = lesson
    .getByTestId("geometry3d-cross-section-canvas")
    .locator("canvas"),
  mobileImage = await mobileCanvas.screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    canvas: await mobileCanvas.boundingBox(),
    nonblank: mobileImage.length > 2000,
  };
await page.screenshot({
  path: path.join(evidence, "0590-mobile.png"),
  fullPage: true,
});
const near = (value, expected, tolerance = 0.05) =>
    Math.abs(Number(value) - expected) <= tolerance,
  passed =
    checks.initial.solid === "cube" &&
    checks.initial.tilt === "-45" &&
    checks.initial.shape === "Hexagon" &&
    checks.initial.vertices === "6" &&
    checks.initial.perimeter === "24" &&
    near(checks.initial.area, 24 * Math.sqrt(3)) &&
    checks.initial.correct === "true" &&
    checks.initial["challenge-done"] === "false" &&
    checks.horizontalCube.shape === "Square" &&
    checks.horizontalCube.vertices === "4" &&
    near(checks.horizontalCube.area, 32) &&
    checks.movedSquare.position === "1" &&
    checks.challenge["challenge-done"] === "true" &&
    checks.cone.solid === "cone" &&
    checks.cone.shape === "Circle" &&
    checks.cylinder.solid === "cylinder" &&
    checks.cylinder.shape === "Ellipse" &&
    checks.cubeAgain.shape === "Hexagon" &&
    checks.wrongPrediction.correct === "false" &&
    checks.correctPrediction.correct === "true" &&
    checks.traceOff.trace === "false" &&
    checks.animationStart.playing === "true" &&
    Number(checks.animationAdvanced.position) !==
      Number(checks.animationStart.position) &&
    checks.animationStop.playing === "false" &&
    checks.fullscreen.fullscreen === "true" &&
    checks.fullscreenExit.fullscreen === "false" &&
    checks.orbitChanged &&
    checks.canvas.nonblank &&
    checks.shared.shared === "true" &&
    metrics.document.width === 1024 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth === 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0590-reference.png"));
await writeFile(
  path.join(evidence, "0590-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0590",
      lessonId: 405,
      checks,
      metrics,
      mobileMetrics,
      consoleMessages,
      passed,
    },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
