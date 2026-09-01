/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0588-interactive-intermediate-advanced-3d-geometry-and-solids-extrusion-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/403-extrusion";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0588");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1200);

const keys = [
  "profile",
  "depth",
  "path",
  "invariant",
  "profile-area",
  "profile-perimeter",
  "volume",
  "lateral-area",
  "checked",
  "correct",
  "fullscreen",
  "tool",
  "actions",
];
const state = async () =>
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
  );
const checks = { initial: await state() };

await lesson.getByLabel("Extrusion depth").fill("10");
checks.targetDepth = await state();
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.correctChallenge = await state();
await lesson.getByRole("button", { name: "Undo depth change" }).click();
checks.undo = await state();
await lesson.getByRole("button", { name: "Redo depth change" }).click();
checks.redo = await state();
await lesson.getByRole("button", { name: "Oblique" }).click();
await lesson.getByLabel("Cross-section invariant").uncheck();
checks.obliqueTapered = await state();
await lesson
  .getByRole("button", { name: "Circle", exact: true })
  .first()
  .click();
checks.circle = await state();
await lesson.getByRole("button", { name: "Select", exact: true }).click();
checks.selectTool = await state();

await lesson.getByTitle("Full screen").click();
checks.fullscreen = await state();
await lesson.getByTitle("Exit full screen").click();
checks.fullscreenExit = await state();

const canvas = lesson
  .getByTestId("geometry3d-extrusion-canvas")
  .locator("canvas");
const canvasBox = await canvas.boundingBox();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.45,
  canvasBox.y + canvasBox.height * 0.52,
);
await page.mouse.down();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.62,
  canvasBox.y + canvasBox.height * 0.4,
  { steps: 8 },
);
await page.mouse.up();
await page.waitForTimeout(250);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvas = {
  width: Math.round(canvasBox.width),
  height: Math.round(canvasBox.height),
  nonblank: afterOrbit.length > 2000,
};

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(300);

const rect = async (selector) => {
  const box = await lesson.locator(selector).boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        left: Math.round(box.x),
        width: Math.round(box.width),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
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
  hero: await rect(".ext403-hero"),
  tabs: await rect(".ext403-tabs"),
  builder: await rect(".ext403-builder"),
  stages: await rect(".ext403-stages"),
  scene: await rect(".ext403-scene"),
  formulas: await rect(".ext403-formulas"),
  practice: await rect(".ext403-practice"),
  footerInfo: await rect(".ext403-footer-info"),
  navigation: await rect(".ext403-next"),
};
await page.screenshot({
  path: path.join(evidence, "0588-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0588-canvas.png") });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = lesson
  .getByTestId("geometry3d-extrusion-canvas")
  .locator("canvas");
const mobileImage = await mobileCanvas.screenshot();
const mobileMetrics = {
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
  path: path.join(evidence, "0588-mobile.png"),
  fullPage: true,
});

const near = (value, expected, tolerance = 0.04) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.profile === "triangle" &&
  checks.initial.depth === "8" &&
  checks.initial.path === "straight" &&
  checks.initial.invariant === "true" &&
  checks.initial["profile-area"] === "6" &&
  checks.initial["profile-perimeter"] === "6" &&
  checks.initial.volume === "48" &&
  checks.initial["lateral-area"] === "48" &&
  checks.targetDepth.volume === "60" &&
  checks.correctChallenge.correct === "true" &&
  checks.undo.depth === "8" &&
  checks.redo.depth === "10" &&
  checks.obliqueTapered.path === "oblique" &&
  checks.obliqueTapered.invariant === "false" &&
  near(checks.obliqueTapered.volume, 41.45, 0.1) &&
  checks.circle.profile === "circle" &&
  near(checks.circle["profile-area"], 4 * Math.PI) &&
  checks.selectTool.tool === "select" &&
  checks.fullscreen.fullscreen === "true" &&
  checks.fullscreenExit.fullscreen === "false" &&
  checks.orbitChanged &&
  checks.canvas.nonblank &&
  checks.reset.profile === "triangle" &&
  checks.reset.depth === "8" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0588-reference.png"));
await writeFile(
  path.join(evidence, "0588-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0588",
      lessonId: 403,
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
