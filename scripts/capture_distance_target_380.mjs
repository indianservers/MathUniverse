/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0565-interactive-intermediate-advanced-3d-geometry-and-solids-distance-in-3d-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/380-distance-in-3d";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1003, height: 1568 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0565");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
  "a",
  "b",
  "delta",
  "squared",
  "distance",
  "components",
  "segment",
  "box",
  "tab",
  "expanded",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attributes) =>
      Object.fromEntries(
        attributes.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByLabel("Point A x").fill("0");
await lesson.getByLabel("Point A y").fill("0");
await lesson.getByLabel("Point A z").fill("0");
await lesson.getByLabel("Point B x").fill("2");
await lesson.getByLabel("Point B y").fill("-1");
await lesson.getByLabel("Point B z").fill("2");
checks.practicePair = await state();
for (const name of [
  "Show component steps",
  "Show distance segment",
  "Show rectangular box",
])
  await lesson.getByLabel(name).uncheck();
checks.hidden = await state();
for (const name of [
  "Show component steps",
  "Show distance segment",
  "Show rectangular box",
])
  await lesson.getByLabel(name).check();
await lesson.getByLabel("Reset Point A").click();
checks.pointReset = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas");
const box = await canvas.boundingBox();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.45);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.36, {
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
      .querySelector('[data-testid="geometry3d-mockup-0565"]')
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
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".d380-page .cs378-hero"),
  tabs: await rect(".d380-page .cs378-tabs"),
  lab: await rect(".d380-lab"),
  scene: await rect(".d380-scene"),
  canvas: await rect(".d380-canvas"),
  side: await rect(".d380-side"),
  learning: await rect(".d380-learning"),
  warning: await rect(".d380-warning"),
  navigation: await rect(".d380-page .cs378-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0565-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0565-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0565").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
  .getByTestId("geometry3d-distance-canvas")
  .locator("canvas");
const mobileImage = await mobileCanvas.screenshot();
const mobileMetrics = {
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
  path: path.join(evidence, "0565-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial.a === "[1,2,1]" &&
  checks.initial.b === "[4,6,3]" &&
  checks.initial.delta === "[3,4,2]" &&
  checks.initial.squared === "29" &&
  checks.initial.distance === "5.39" &&
  checks.practicePair.a === "[0,0,0]" &&
  checks.practicePair.b === "[2,-1,2]" &&
  checks.practicePair.delta === "[2,-1,2]" &&
  checks.practicePair.squared === "9" &&
  checks.practicePair.distance === "3" &&
  checks.hidden.components === "false" &&
  checks.hidden.segment === "false" &&
  checks.hidden.box === "false" &&
  checks.pointReset.a === "[1,2,1]" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.a === "[1,2,1]" &&
  checks.reset.b === "[4,6,3]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1003 &&
  metrics.document.height === 1568 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0565-reference.png"));
await writeFile(
  path.join(evidence, "0565-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0565",
      lessonId: 380,
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
