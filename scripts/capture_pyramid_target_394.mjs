/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0579-interactive-intermediate-advanced-3d-geometry-and-solids-pyramid-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/394-pyramid";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1173, height: 1341 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (
    ["error", "warning"].includes(m.type()) &&
    !m.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0579");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "shape",
    "side",
    "height",
    "n",
    "apothem",
    "radius",
    "base-area",
    "volume",
    "slant",
    "lateral",
    "surface",
    "layers",
    "expanded",
    "tab",
    "shared",
    "practice",
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
await lesson.getByRole("button", { name: "Triangle", exact: true }).click();
checks.triangle = await state();
await lesson.getByRole("button", { name: "Pentagon", exact: true }).click();
checks.pentagon = await state();
await lesson.getByRole("button", { name: "Square", exact: true }).click();
await lesson.getByLabel("Base side s", { exact: true }).fill("6");
await lesson.getByLabel("Height h", { exact: true }).fill("8");
checks.edited = await state();
await lesson.getByLabel("Show height (h)").uncheck();
await lesson.getByLabel("Show slant height (l)").uncheck();
await lesson.getByLabel("Show net (unfolded)").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show height (h)").check();
await lesson.getByLabel("Show slant height (l)").check();
await lesson.getByLabel("Show net (unfolded)").check();
checks.layersOn = await state();
await lesson.getByRole("button", { name: "Try it now", exact: true }).click();
checks.practice = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.53);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.54, box.y + box.height * 0.42, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvasPixels = await pixelStats(page, after);
await lesson.getByTitle("Toggle fullscreen").click();
checks.expanded = await state();
await lesson.getByTitle("Exit fullscreen").click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0579"]')
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
    hero: await rect(".pyr394-page .cs378-hero"),
    tabs: await rect(".pyr394-page .cs378-tabs"),
    panel: await rect(".pyr394-panel"),
    canvas: await rect(".pyr394-scene"),
    controls: await rect(".pyr394-controls"),
    results: await rect(".pyr394-results"),
    navigation: await rect(".pyr394-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0579-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0579-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0579").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-pyramid-canvas")
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
  path: path.join(evidence, "0579-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.shape === "Square" &&
  checks.initial["base-area"] === "16" &&
  checks.initial.volume === "32" &&
  checks.initial.slant === "6.32" &&
  checks.initial.lateral === "50.6" &&
  checks.initial.surface === "66.6" &&
  checks.triangle.shape === "Triangle" &&
  checks.triangle.n === "3" &&
  checks.triangle["base-area"] === "6.93" &&
  checks.triangle.volume === "13.86" &&
  checks.triangle.slant === "6.11" &&
  checks.triangle.lateral === "36.66" &&
  checks.triangle.surface === "43.59" &&
  checks.pentagon.shape === "Pentagon" &&
  checks.pentagon.n === "5" &&
  checks.pentagon["base-area"] === "27.53" &&
  checks.pentagon.volume === "55.06" &&
  checks.pentagon.slant === "6.6" &&
  checks.pentagon.lateral === "66.01" &&
  checks.pentagon.surface === "93.54" &&
  checks.edited.side === "6" &&
  checks.edited.height === "8" &&
  checks.edited["base-area"] === "36" &&
  checks.edited.volume === "96" &&
  checks.edited.slant === "8.54" &&
  checks.layersOff.layers === "[false,false,false]" &&
  checks.layersOn.layers === "[true,true,true]" &&
  checks.practice.practice === "true" &&
  checks.shared.shared === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.shape === "Square" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1173 &&
  metrics.document.height === 1341 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0579-reference.png"));
await writeFile(
  path.join(evidence, "0579-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0579",
      lessonId: 394,
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
