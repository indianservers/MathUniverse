/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0573-interactive-intermediate-advanced-3d-geometry-and-solids-angle-between-line-and-plane-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/388-angle-between-line-and-plane";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1586, height: 992 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0573");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "vector",
    "normal",
    "plane",
    "dot",
    "magnitude-v",
    "magnitude-n",
    "sine",
    "angle",
    "normal-angle",
    "projection",
    "valid",
    "layers",
    "tab",
    "expanded",
    "shared",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, attributes) =>
        Object.fromEntries(
          attributes.map((key) => [key, node.getAttribute(`data-${key}`)]),
        ),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Plane equation").selectOption("x = 0");
checks.planeX = await state();
await lesson.getByLabel("Plane normal y").fill("1");
checks.custom = await state();
await lesson.getByLabel("Plane equation").selectOption("z = 0");
await lesson.getByLabel("Line direction x").fill("0");
await lesson.getByLabel("Line direction y").fill("0");
checks.perpendicular = await state();
await lesson.getByLabel("Line direction x").fill("1");
await lesson.getByLabel("Line direction z").fill("0");
checks.parallel = await state();
await lesson.getByLabel("Line direction x").fill("0");
checks.zero = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByLabel("Show projection on plane").uncheck();
await lesson.getByLabel("Show normal to plane").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show projection on plane").check();
await lesson.getByLabel("Show normal to plane").check();
await lesson.getByRole("button", { name: /Use these values/ }).click();
checks.experiment = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  beforeDrag = await state();
await page.mouse.move(box.x + box.width * 0.715, box.y + box.height * 0.158);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.78, box.y + box.height * 0.24, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
checks.afterDrag = await state();
checks.dragChanged =
  checks.afterDrag.vector !== beforeDrag.vector ||
  checks.afterDrag.normal !== beforeDrag.normal;
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.51, box.y + box.height * 0.53);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.4, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvasPixels = await page.evaluate(
  async (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    const sample = document.createElement("canvas");
    sample.width = 160;
    sample.height = 160;
    const context = sample.getContext("2d");
    context.drawImage(image, 0, 0, 160, 160);
    const pixels = context.getImageData(0, 0, 160, 160).data,
      colors = new Set();
    let colored = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      const spread =
        Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) -
        Math.min(pixels[index], pixels[index + 1], pixels[index + 2]);
      if (spread > 12) colored++;
      colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`);
    }
    return {
      colored,
      unique: colors.size,
      width: image.width,
      height: image.height,
    };
  },
  `data:image/png;base64,${after.toString("base64")}`,
);
await lesson.getByTitle("Toggle fullscreen").dispatchEvent("click");
checks.expanded = await state();
await lesson.getByTitle("Toggle fullscreen").dispatchEvent("click");
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0573"]')
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
    hero: await rect(".alp388-page .cs378-hero"),
    tabs: await rect(".alp388-page .cs378-tabs"),
    lab: await rect(".alp388-lab"),
    canvas: await rect(".alp388-canvas"),
    controls: await rect(".alp388-controls"),
    calculation: await rect(".alp388-calculation"),
    key: await rect(".alp388-key"),
    warning: await rect(".alp388-warning"),
    experiment: await rect(".alp388-try"),
    navigation: await rect(".alp388-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0573-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0573-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0573").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-angle-line-plane-canvas")
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
  path: path.join(evidence, "0573-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.vector === "[1,1,1]" &&
  checks.initial.normal === "[0,0,1]" &&
  checks.initial.plane === "z = 0" &&
  checks.initial.dot === "1" &&
  checks.initial["magnitude-v"] === "1.7321" &&
  checks.initial["magnitude-n"] === "1" &&
  checks.initial.sine === "0.5774" &&
  checks.initial.angle === "35.3" &&
  checks.initial["normal-angle"] === "54.7" &&
  checks.initial.projection === "[1,1,0]" &&
  checks.planeX.normal === "[1,0,0]" &&
  checks.planeX.projection === "[0,1,1]" &&
  checks.custom.plane === "Custom plane" &&
  checks.perpendicular.angle === "90" &&
  checks.perpendicular.projection === "[0,0,0]" &&
  checks.parallel.angle === "0" &&
  checks.parallel.projection === "[1,0,0]" &&
  checks.zero.valid === "false" &&
  checks.layersOff.layers === "[false,false]" &&
  checks.experiment.vector === "[0,1,1]" &&
  checks.experiment.angle === "45" &&
  checks.shared.shared === "true" &&
  checks.dragChanged &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.vector === "[1,1,1]" &&
  checks.reset.normal === "[0,0,1]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1586 &&
  metrics.document.height === 992 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0573-reference.png"));
await writeFile(
  path.join(evidence, "0573-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0573",
      lessonId: 388,
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
