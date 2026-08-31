/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0577-interactive-intermediate-advanced-3d-geometry-and-solids-cuboid-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/392-cuboid";
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
const lesson = page.getByTestId("geometry3d-mockup-0577");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "dimensions",
    "volume",
    "surface",
    "base",
    "face-diagonal",
    "space-diagonal",
    "layers",
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
await lesson.getByLabel("Increase Length").click();
await lesson.getByLabel("Decrease Width").click();
await lesson.getByLabel("Increase Height").click();
checks.stepped = await state();
await lesson.getByLabel("Show face diagonal (l×w face)").uncheck();
await lesson.getByLabel("Show space diagonal").uncheck();
checks.diagonalsOff = await state();
await lesson.getByLabel("Show face diagonal (l×w face)").check();
await lesson.getByLabel("Show space diagonal").check();
await lesson.getByLabel("Show net (unfolded)").check();
checks.net = await state();
await lesson.getByLabel("Show net (unfolded)").uncheck();
await lesson.getByRole("button", { name: "Use values", exact: true }).click();
checks.practice = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson
  .getByRole("button", { name: "Reset", exact: true })
  .first()
  .click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.38, box.y + box.height * 0.62);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.51, box.y + box.height * 0.48, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvasPixels = await pixelStats(page, after);
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0577"]')
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
    hero: await rect(".cub392-page .cs378-hero"),
    tabs: await rect(".cub392-page .cs378-tabs"),
    work: await rect(".cub392-work"),
    canvas: await rect(".cub392-scene"),
    dimensions: await rect(".cub392-dims"),
    results: await rect(".cub392-results"),
    bottom: await rect(".cub392-bottom"),
    navigation: await rect(".cub392-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0577-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0577-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0577").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-cuboid-canvas")
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
  path: path.join(evidence, "0577-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.dimensions === "[5,3,2]" &&
  checks.initial.volume === "30" &&
  checks.initial.surface === "62" &&
  checks.initial.base === "15" &&
  checks.initial["face-diagonal"] === "5.83" &&
  checks.initial["space-diagonal"] === "6.16" &&
  checks.stepped.dimensions === "[6,2,3]" &&
  checks.stepped.volume === "36" &&
  checks.stepped.surface === "72" &&
  checks.stepped.base === "12" &&
  checks.stepped["face-diagonal"] === "6.32" &&
  checks.stepped["space-diagonal"] === "7" &&
  checks.diagonalsOff.layers === "[false,false,false]" &&
  checks.net.layers === "[true,true,true]" &&
  checks.practice.dimensions === "[4,2,3]" &&
  checks.practice.volume === "24" &&
  checks.practice.surface === "52" &&
  checks.shared.shared === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.dimensions === "[5,3,2]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1173 &&
  metrics.document.height === 1341 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0577-reference.png"));
await writeFile(
  path.join(evidence, "0577-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0577",
      lessonId: 392,
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
