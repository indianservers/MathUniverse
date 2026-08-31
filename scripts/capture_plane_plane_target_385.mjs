/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0570-interactive-intermediate-advanced-3d-geometry-and-solids-plane-plane-intersection-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/385-planeplane-intersection";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0570");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);

const keys = [
  "plane-a",
  "plane-b",
  "normal-a",
  "normal-b",
  "cross",
  "direction",
  "point",
  "status",
  "layers",
  "answer",
  "grade",
  "tab",
  "expanded",
  "copied",
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

for (const [label, value] of [
  ["Plane B e₁", "2"],
  ["Plane B f₁", "2"],
  ["Plane B g₁", "2"],
  ["Plane B h₁", "10"],
])
  await lesson.getByLabel(label).fill(value);
checks.parallel = await state();
await lesson.getByLabel("Plane B h₁").fill("12");
checks.coincident = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();

await lesson.getByLabel("Show normals (n₁, n₂)").uncheck();
await lesson.getByLabel("Show intersection line").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show normals (n₁, n₂)").check();
await lesson.getByLabel("Show intersection line").check();
await lesson.getByRole("radio", { name: "y = 2" }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.incorrect = await state();
await lesson.getByRole("radio", { name: "y = 1" }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Copy results" }).click();
checks.copied = await state();

const canvas = lesson.locator("canvas");
const box = await canvas.boundingBox();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.68, box.y + box.height * 0.48);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.34, {
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
    const pixels = context.getImageData(0, 0, 160, 160).data;
    const colors = new Set();
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
      .querySelector('[data-testid="geometry3d-mockup-0570"]')
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
  hero: await rect(".pp385-page .cs378-hero"),
  tabs: await rect(".pp385-page .cs378-tabs"),
  lab: await rect(".pp385-lab"),
  scene: await rect(".pp385-scene"),
  canvas: await rect(".pp385-canvas"),
  side: await rect(".pp385-side"),
  learning: await rect(".pp385-learning"),
  key: await rect(".pp385-key"),
  navigation: await rect(".pp385-page .cs378-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0570-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0570-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0570").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
  .getByTestId("geometry3d-plane-plane-canvas")
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
  path: path.join(evidence, "0570-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial["plane-a"] === "[1,1,1,6]" &&
  checks.initial["plane-b"] === "[1,-1,1,2]" &&
  checks.initial.cross === "[2,0,-2]" &&
  checks.initial.direction === "[1,0,-1]" &&
  checks.initial.point === "[4,2,0]" &&
  checks.initial.status === "Intersecting line" &&
  checks.parallel.status === "Parallel, no intersection" &&
  checks.parallel.direction === "null" &&
  checks.coincident.status === "Coincident planes" &&
  checks.layersOff.layers === "[false,false,true,true]" &&
  checks.incorrect.grade === "incorrect" &&
  checks.correct.grade === "correct" &&
  checks.copied.copied === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset["plane-a"] === "[1,1,1,6]" &&
  checks.reset["plane-b"] === "[1,-1,1,2]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0570-reference.png"));
await writeFile(
  path.join(evidence, "0570-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0570",
      lessonId: 385,
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
