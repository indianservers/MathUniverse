/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0578-interactive-intermediate-advanced-3d-geometry-and-solids-prism-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/393-prism";
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
const lesson = page.getByTestId("geometry3d-mockup-0578");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "shape",
    "base",
    "height",
    "length",
    "base-area",
    "perimeter",
    "volume",
    "lateral",
    "surface",
    "layers",
    "expanded",
    "tab",
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
await lesson.getByRole("button", { name: "Rectangle", exact: true }).click();
checks.rectangle = await state();
await lesson.getByRole("button", { name: "Hexagon", exact: true }).click();
checks.hexagon = await state();
await lesson.getByRole("button", { name: "Triangle", exact: true }).click();
await lesson.getByLabel("Base, b", { exact: true }).fill("8");
await lesson.getByLabel("Triangle height, h", { exact: true }).fill("6");
await lesson.getByLabel("Length, L", { exact: true }).fill("7");
checks.edited = await state();
await lesson.getByLabel("Show bases").uncheck();
await lesson.getByLabel("Show lateral faces").uncheck();
await lesson.getByLabel("Unfold net (ghost)").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show bases").check();
await lesson.getByLabel("Show lateral faces").check();
await lesson.getByLabel("Unfold net (ghost)").check();
checks.layersOn = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.55);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.43, {
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
      .querySelector('[data-testid="geometry3d-mockup-0578"]')
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
    hero: await rect(".prism393-page .cs378-hero"),
    tabs: await rect(".prism393-page .cs378-tabs"),
    work: await rect(".prism393-work"),
    canvas: await rect(".prism393-scene"),
    controls: await rect(".prism393-controls"),
    results: await rect(".prism393-results"),
    navigation: await rect(".prism393-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0578-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0578-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0578").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-prism-canvas")
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
  path: path.join(evidence, "0578-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.shape === "Triangle" &&
  checks.initial["base-area"] === "12" &&
  checks.initial.perimeter === "16" &&
  checks.initial.volume === "60" &&
  checks.initial.lateral === "80" &&
  checks.initial.surface === "104" &&
  checks.rectangle.shape === "Rectangle" &&
  checks.rectangle["base-area"] === "24" &&
  checks.rectangle.perimeter === "20" &&
  checks.rectangle.volume === "120" &&
  checks.rectangle.lateral === "100" &&
  checks.rectangle.surface === "148" &&
  checks.hexagon.shape === "Hexagon" &&
  checks.hexagon["base-area"] === "93.53" &&
  checks.hexagon.perimeter === "36" &&
  checks.hexagon.volume === "467.65" &&
  checks.hexagon.lateral === "180" &&
  checks.hexagon.surface === "367.06" &&
  checks.edited.base === "8" &&
  checks.edited.height === "6" &&
  checks.edited.length === "7" &&
  checks.edited["base-area"] === "24" &&
  checks.edited.volume === "168" &&
  checks.layersOff.layers === "[false,false,false]" &&
  checks.layersOn.layers === "[true,true,true]" &&
  checks.shared.shared === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.shape === "Triangle" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1173 &&
  metrics.document.height === 1341 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0578-reference.png"));
await writeFile(
  path.join(evidence, "0578-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0578",
      lessonId: 393,
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
