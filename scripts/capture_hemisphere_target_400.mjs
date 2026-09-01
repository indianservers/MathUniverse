/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0585-interactive-intermediate-advanced-3d-geometry-and-solids-hemisphere-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/400-hemisphere";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 928, height: 1695 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0585");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1600);
const keys = [
    "radius",
    "cut",
    "cut-radius",
    "half",
    "display",
    "opacity",
    "plane",
    "base",
    "radius-line",
    "isolated",
    "view",
    "projection",
    "camera-distance",
    "tool",
    "rotating",
    "fullscreen",
    "volume-coefficient",
    "curved-coefficient",
    "total-coefficient",
    "past",
    "future",
    "tab",
    "challenge-mode",
    "checked",
    "correct",
    "shared",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, attrs) =>
        Object.fromEntries(
          attrs.map((key) => [key, node.getAttribute(`data-${key}`)]),
        ),
      keys,
    ),
  checks = { initial: await state() };

await lesson.getByLabel("Plane height", { exact: true }).fill("0.6");
checks.cut = await state();
await lesson.getByLabel("Bottom half", { exact: true }).check();
await lesson
  .locator(".hemi400-segment button")
  .filter({ hasText: "Open bowl" })
  .click();
await lesson.getByLabel("Opacity", { exact: true }).fill("45");
await lesson.getByLabel("Radius", { exact: true }).fill("6");
checks.edited = await state();
await lesson.getByLabel("Show plane").uncheck();
await lesson.getByLabel("Show base circle").uncheck();
await lesson.getByLabel("Show radius").uncheck();
await lesson.getByLabel("Isolate one half").uncheck();
checks.layersOff = await state();
await lesson.getByRole("button", { name: "Undo" }).click();
checks.undo = await state();
await lesson.getByRole("button", { name: "Redo" }).click();
checks.redo = await state();
await lesson
  .locator(".hemi400-scene > nav button")
  .filter({ hasText: "Whole sphere" })
  .click();
checks.whole = await state();
await lesson
  .locator(".hemi400-scene > nav button")
  .filter({ hasText: "Hemisphere (isolated)" })
  .click();
await lesson.getByLabel("Zoom out").click();
checks.zoomOut = await state();
await lesson.getByLabel("Zoom in").click();
checks.zoomIn = await state();
await lesson.getByLabel("Toggle projection").click();
checks.orthographic = await state();
await lesson.getByLabel("Toggle projection").click();
checks.perspective = await state();
await lesson.getByLabel("Select tool").click();
checks.selectTool = await state();
await lesson.getByLabel("Rotate tool").click();

const canvas = lesson
    .getByTestId("geometry3d-hemisphere-canvas")
    .locator("canvas"),
  box = await canvas.boundingBox(),
  beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.43, box.y + box.height * 0.45);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.61, box.y + box.height * 0.32, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByLabel("Reset view").click();
await lesson.getByRole("button", { name: /Drag to rotate/ }).click();
const beforeAnimation = await canvas.screenshot();
await page.waitForTimeout(650);
const afterAnimation = await canvas.screenshot();
checks.animationChanged = !beforeAnimation.equals(afterAnimation);
checks.animationRunning = await state();
await lesson.getByRole("button", { name: /Stop rotation/ }).click();
checks.animationStopped = await state();

await lesson.getByRole("button", { name: /Full screen/, exact: false }).click();
checks.fullscreen = await state();
await lesson.getByLabel("Exit expanded workspace").click();
checks.fullscreenExit = await state();
await lesson.getByRole("button", { name: "Curved area", exact: true }).click();
await lesson.getByRole("button", { name: /Check your answer/ }).click();
checks.curvedChallenge = await state();
await lesson.getByRole("button", { name: "Total area", exact: true }).click();
await lesson.getByRole("button", { name: /Check your answer/ }).click();
checks.totalChallenge = await state();
await lesson.getByRole("button", { name: /Share|Shared/ }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0585"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));

const rect = async (selector) => {
    const b = await page.locator(selector).first().boundingBox();
    return b
      ? {
          top: Math.round(b.y),
          left: Math.round(b.x),
          width: Math.round(b.width),
          height: Math.round(b.height),
          bottom: Math.round(b.y + b.height),
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
    hero: await rect(".hemi400-hero"),
    tabs: await rect(".hemi400-tabs"),
    work: await rect(".hemi400-work"),
    canvas: await rect(".hemi400-scene"),
    why: await rect(".hemi400-why"),
    bottom: await rect(".hemi400-bottom"),
    navigation: await rect(".hemi400-nav"),
    footer: await rect(".hemi400-footer"),
  };
await page.screenshot({
  path: path.join(evidence, "0585-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0585-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
const mobile = page;
await mobile.waitForTimeout(1000);
await mobile.getByTestId("geometry3d-mockup-0585").waitFor({ timeout: 600000 });
const mobileCanvas = mobile
    .getByTestId("geometry3d-hemisphere-canvas")
    .locator("canvas"),
  mobileImage = await mobileCanvas.screenshot(),
  mobileMetrics = {
    documentWidth: await mobile.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await mobile.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    canvas: await mobileCanvas.boundingBox(),
    nonblank: mobileImage.length > 1000,
  };
await mobile.screenshot({
  path: path.join(evidence, "0585-mobile.png"),
  fullPage: true,
});
const near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.001,
  passed =
    checks.initial.radius === "4" &&
    checks.initial.cut === "0" &&
    checks.initial["cut-radius"] === "4" &&
    checks.initial.half === "Top half" &&
    checks.initial.display === "Solid" &&
    checks.initial.opacity === "70" &&
    near(checks.initial["volume-coefficient"], 42.6667) &&
    checks.initial["curved-coefficient"] === "32" &&
    checks.initial["total-coefficient"] === "48" &&
    checks.cut.cut === "0.6" &&
    checks.cut["cut-radius"] === "3.2" &&
    checks.edited.radius === "6" &&
    checks.edited.half === "Bottom half" &&
    checks.edited.display === "Open bowl" &&
    checks.edited.opacity === "45" &&
    checks.edited["cut-radius"] === "4.8" &&
    checks.edited["volume-coefficient"] === "144" &&
    checks.edited["curved-coefficient"] === "72" &&
    checks.edited["total-coefficient"] === "108" &&
    checks.layersOff.plane === "false" &&
    checks.layersOff.base === "false" &&
    checks.layersOff["radius-line"] === "false" &&
    checks.layersOff.isolated === "false" &&
    checks.undo.isolated === "true" &&
    checks.redo.isolated === "false" &&
    checks.whole.view === "Whole sphere" &&
    checks.zoomOut["camera-distance"] === "9" &&
    checks.zoomIn["camera-distance"] === "8" &&
    checks.orthographic.projection === "Orthographic" &&
    checks.perspective.projection === "Perspective" &&
    checks.selectTool.tool === "Select" &&
    checks.orbitChanged &&
    checks.canvasPixels.colored > 500 &&
    checks.canvasPixels.unique > 100 &&
    checks.animationChanged &&
    checks.animationRunning.rotating === "true" &&
    checks.animationStopped.rotating === "false" &&
    checks.fullscreen.fullscreen === "true" &&
    checks.fullscreenExit.fullscreen === "false" &&
    checks.curvedChallenge["challenge-mode"] === "Curved area" &&
    checks.curvedChallenge.checked === "true" &&
    checks.totalChallenge["challenge-mode"] === "Total area" &&
    checks.totalChallenge.checked === "true" &&
    checks.shared.shared === "true" &&
    checks.tabbed.tab === "Formulas" &&
    checks.reset.radius === "4" &&
    checks.reset.cut === "0" &&
    checks.reset.actions === "0" &&
    metrics.document.width === 928 &&
    metrics.document.height === 1695 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth === 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0585-reference.png"));
await writeFile(
  path.join(evidence, "0585-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0585",
      lessonId: 400,
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
async function pixelStats(targetPage, imageBuffer) {
  return targetPage.evaluate(
    async (dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const sample = document.createElement("canvas"),
        context = sample.getContext("2d");
      sample.width = 160;
      sample.height = 160;
      context.drawImage(image, 0, 0, 160, 160);
      const pixels = context.getImageData(0, 0, 160, 160).data,
        colors = new Set();
      let colored = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const spread =
          Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) -
          Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
        if (spread > 12) colored++;
        colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
      }
      return {
        colored,
        unique: colors.size,
        width: image.width,
        height: image.height,
      };
    },
    `data:image/png;base64,${imageBuffer.toString("base64")}`,
  );
}
