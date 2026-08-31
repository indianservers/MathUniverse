/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0576-interactive-intermediate-advanced-3d-geometry-and-solids-cube-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/391-cube";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1009, height: 1558 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0576");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "side",
    "volume",
    "surface",
    "face-diagonal",
    "space-diagonal",
    "layers",
    "unfolded",
    "highlight",
    "expanded",
    "tab",
    "shared",
    "experiment",
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
await lesson.getByLabel("Side length", { exact: true }).fill("2.5");
checks.resized = await state();
await lesson.getByLabel("Show face diagonal (dᶠ)").uncheck();
await lesson.getByLabel("Show space diagonal (d)").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show face diagonal (dᶠ)").check();
await lesson.getByLabel("Show space diagonal (d)").check();
await lesson.getByLabel("Unfold net").check();
checks.unfolded = await state();
await lesson.getByLabel("Unfold net").uncheck();
await lesson.getByRole("button", { name: /Change a to 5/ }).click();
checks.experiment = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox();
await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.48);
await page.waitForTimeout(250);
checks.highlighted = await state();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.32, box.y + box.height * 0.7);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.44, box.y + box.height * 0.57, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByTitle("Toggle fullscreen").click();
checks.expanded = await state();
await lesson.getByTitle("Exit fullscreen").click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0576"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
    const bounds = await page.locator(selector).first().boundingBox();
    return bounds
      ? {
          top: Math.round(bounds.y),
          left: Math.round(bounds.x),
          width: Math.round(bounds.width),
          height: Math.round(bounds.height),
          bottom: Math.round(bounds.y + bounds.height),
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
    hero: await rect(".cube391-page .cs378-hero"),
    tabs: await rect(".cube391-page .cs378-tabs"),
    lab: await rect(".cube391-lab"),
    canvas: await rect(".cube391-scene"),
    controls: await rect(".cube391-controls"),
    results: await rect(".cube391-results"),
    info: await rect(".cube391-info"),
    practice: await rect(".cube391-try"),
    navigation: await rect(".cube391-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0576-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0576-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0576").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-cube-canvas")
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
  path: path.join(evidence, "0576-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.side === "4" &&
  checks.initial.volume === "64" &&
  checks.initial.surface === "96" &&
  checks.initial["face-diagonal"] === "5.66" &&
  checks.initial["space-diagonal"] === "6.93" &&
  checks.resized.side === "2.5" &&
  checks.resized.volume === "15.63" &&
  checks.resized.surface === "37.5" &&
  checks.resized["face-diagonal"] === "3.54" &&
  checks.resized["space-diagonal"] === "4.33" &&
  checks.layersOff.layers === "[false,false]" &&
  checks.unfolded.unfolded === "true" &&
  checks.experiment.side === "5" &&
  checks.experiment.volume === "125" &&
  checks.experiment.surface === "150" &&
  checks.experiment.experiment === "true" &&
  checks.shared.shared === "true" &&
  checks.highlighted.highlight !== "none" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.side === "4" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1009 &&
  metrics.document.height === 1558 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0576-reference.png"));
await writeFile(
  path.join(evidence, "0576-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0576",
      lessonId: 391,
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
