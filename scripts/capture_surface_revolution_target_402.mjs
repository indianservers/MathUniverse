/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0587-interactive-intermediate-advanced-3d-geometry-and-solids-surface-of-revolution-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/402-surface-of-revolution";
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
const lesson = page.getByTestId("geometry3d-mockup-0587");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1200);

const keys = [
  "curve",
  "a",
  "b",
  "axis",
  "angle",
  "method",
  "complete",
  "section",
  "playing",
  "projection",
  "volume-coefficient",
  "surface-coefficient",
  "prediction",
  "expected",
  "revealed",
  "correct",
  "tab",
  "shared",
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

await lesson.getByLabel("Rotation angle").fill("240");
checks.partial = await state();
await lesson.getByLabel("Complete revolution").check();
checks.complete = await state();
await lesson.getByRole("button", { name: /y-axis/ }).click();
checks.yAxisWasher = await state();
await lesson.getByRole("button", { name: "Shell" }).click();
checks.yAxisShell = await state();
await lesson.getByRole("button", { name: /x-axis/ }).click();

await lesson.getByLabel("Change generating curve").click();
checks.lineCurve = await state();
await lesson.getByRole("button", { name: /A sphere/ }).click();
await lesson.getByRole("button", { name: "Reveal answer" }).click();
checks.incorrectPrediction = await state();
await lesson.getByRole("button", { name: /A cylinder/ }).click();
await lesson.getByRole("button", { name: "Reveal answer" }).click();
checks.correctPrediction = await state();
await lesson.getByLabel("Change generating curve").click();
checks.semicircleCurve = await state();

await lesson.getByLabel("Interval start a").fill("1");
await lesson.getByLabel("Interval end b").fill("5");
checks.domainEdit = await state();

const endpoint = lesson.getByLabel("Drag interval endpoint");
const endpointBox = await endpoint.boundingBox();
await page.mouse.move(
  endpointBox.x + endpointBox.width / 2,
  endpointBox.y + endpointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  endpointBox.x + endpointBox.width / 2 + 24,
  endpointBox.y + endpointBox.height / 2,
);
await page.mouse.up();
checks.directDrag = await state();

await lesson.getByLabel("Restart animation").click();
checks.animationStart = await state();
await page.waitForTimeout(350);
checks.animationAdvanced = await state();
await lesson.getByLabel("Pause animation").click();
checks.animationStopped = await state();
await lesson.getByLabel("Toggle 3D projection").click();
checks.orthographic = await state();
await lesson.getByLabel("Toggle 3D projection").click();
checks.perspective = await state();

const canvas = lesson
  .getByTestId("geometry3d-surface-revolution-canvas")
  .locator("canvas");
const canvasBox = await canvas.boundingBox();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.45,
  canvasBox.y + canvasBox.height * 0.54,
);
await page.mouse.down();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.58,
  canvasBox.y + canvasBox.height * 0.42,
  { steps: 8 },
);
await page.mouse.up();
await page.waitForTimeout(250);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);

await lesson.getByRole("button", { name: "Explain" }).click();
await lesson.getByRole("button", { name: /Share/ }).click();
checks.tabAndShare = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(350);

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
  hero: await rect(".sor402-hero"),
  workspace: await rect(".sor402-workspace"),
  controls: await rect(".sor402-controls"),
  visuals: await rect(".sor402-visuals"),
  plot: await rect(".sor402-plot"),
  scene: await rect(".sor402-scene"),
  formulas: await rect(".sor402-formulas"),
  bottom: await rect(".sor402-bottom"),
  navigation: await rect(".sor402-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0587-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0587-canvas.png") });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = page
  .getByTestId("geometry3d-surface-revolution-canvas")
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
  nonblank: mobileImage.length > 1000,
};
await page.screenshot({
  path: path.join(evidence, "0587-mobile.png"),
  fullPage: true,
});

const near = (value, expected, tolerance = 0.04) =>
  Math.abs(Number(value) - expected) <= tolerance;
const exactSurface = (17 * Math.sqrt(17) - 1) / 6;
const passed =
  checks.initial.curve === "sqrt" &&
  checks.initial.a === "0" &&
  checks.initial.b === "4" &&
  checks.initial.axis === "x" &&
  checks.initial.angle === "360" &&
  checks.initial.method === "Washer" &&
  checks.initial.complete === "true" &&
  checks.initial["volume-coefficient"] === "8" &&
  near(checks.initial["surface-coefficient"], exactSurface, 0.08) &&
  checks.partial.angle === "240" &&
  checks.partial.complete === "false" &&
  checks.complete.angle === "360" &&
  checks.complete.complete === "true" &&
  checks.yAxisWasher.axis === "y" &&
  near(checks.yAxisWasher["volume-coefficient"], 25.6, 0.2) &&
  checks.yAxisShell.method === "Shell" &&
  near(checks.yAxisShell["volume-coefficient"], 25.6, 0.05) &&
  checks.lineCurve.curve === "line" &&
  checks.lineCurve.expected === "cylinder" &&
  checks.lineCurve["volume-coefficient"] === "16" &&
  checks.incorrectPrediction.correct === "false" &&
  checks.correctPrediction.correct === "true" &&
  checks.semicircleCurve.curve === "semicircle" &&
  checks.semicircleCurve.expected === "sphere" &&
  checks.domainEdit.a === "1" &&
  checks.domainEdit.b === "5" &&
  Number(checks.directDrag.b) > 5.2 &&
  checks.animationStart.playing === "true" &&
  Number(checks.animationAdvanced.section) >
    Number(checks.animationStart.section) &&
  checks.animationStopped.playing === "false" &&
  checks.orthographic.projection === "Orthographic" &&
  checks.perspective.projection === "Perspective" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.tabAndShare.tab === "Explain" &&
  checks.tabAndShare.shared === "true" &&
  checks.reset.curve === "sqrt" &&
  checks.reset.b === "4" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0587-reference.png"));
await writeFile(
  path.join(evidence, "0587-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0587",
      lessonId: 402,
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
      const sample = document.createElement("canvas");
      const context = sample.getContext("2d");
      sample.width = 160;
      sample.height = 160;
      context.drawImage(image, 0, 0, 160, 160);
      const pixels = context.getImageData(0, 0, 160, 160).data;
      const colors = new Set();
      let colored = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const spread =
          Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) -
          Math.min(pixels[index], pixels[index + 1], pixels[index + 2]);
        if (spread > 12) colored += 1;
        colors.add(
          `${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`,
        );
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
