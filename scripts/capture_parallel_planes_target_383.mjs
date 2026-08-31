/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0568-interactive-intermediate-advanced-3d-geometry-and-solids-parallel-and-perpendicular-planes-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/383-parallel-and-perpendicular-planes";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1006, height: 1564 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0568");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "plane-a",
    "plane-b",
    "normal-a",
    "normal-b",
    "dot",
    "relation",
    "separation",
    "scalar",
    "choice",
    "choice-correct",
    "normals",
    "separation-layer",
    "dot-layer",
    "challenge",
    "tab",
    "expanded",
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
for (const [label, value] of [
  ["Plane B a", "2"],
  ["Plane B b", "-1"],
  ["Plane B c", "0"],
  ["Plane B d", "1"],
])
  await lesson.getByLabel(label).fill(value);
checks.perpendicular = await state();
await lesson
  .getByRole("button", { name: "Perpendicular", exact: true })
  .click();
checks.perpendicularChoice = await state();
await lesson.getByLabel("Plane B a").fill("1");
await lesson.getByLabel("Plane B b").fill("1");
checks.neither = await state();
await lesson.getByRole("button", { name: "Neither", exact: true }).click();
checks.neitherChoice = await state();
for (const name of [
  "Show normals (n₁, n₂)",
  "Show separation distance",
  "Show dot product (n₁ · n₂)",
])
  await lesson.getByLabel(name).uncheck();
checks.hidden = await state();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeHidden = await state();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeShown = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.66, box.y + box.height * 0.45);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.51, box.y + box.height * 0.34, {
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
      .querySelector('[data-testid="geometry3d-mockup-0568"]')
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
    hero: await rect(".pp383-page .cs378-hero"),
    tabs: await rect(".pp383-page .cs378-tabs"),
    lab: await rect(".pp383-lab"),
    scene: await rect(".pp383-scene"),
    canvas: await rect(".pp383-canvas"),
    side: await rect(".pp383-side"),
    learning: await rect(".pp383-learning"),
    bottom: await rect(".pp383-bottom"),
    navigation: await rect(".pp383-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0568-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0568-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0568").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-parallel-planes-canvas")
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
  path: path.join(evidence, "0568-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial["plane-a"] === "[1,2,2,6]" &&
  checks.initial["plane-b"] === "[2,4,4,10]" &&
  checks.initial.dot === "18" &&
  checks.initial.relation === "Parallel" &&
  checks.initial.scalar === "2" &&
  checks.initial.separation === "0.33" &&
  checks.perpendicular["plane-b"] === "[2,-1,0,1]" &&
  checks.perpendicular.dot === "0" &&
  checks.perpendicular.relation === "Perpendicular" &&
  checks.perpendicularChoice["choice-correct"] === "true" &&
  checks.neither["plane-b"] === "[1,1,0,1]" &&
  checks.neither.dot === "3" &&
  checks.neither.relation === "Neither" &&
  checks.neitherChoice["choice-correct"] === "true" &&
  checks.hidden.normals === "false" &&
  checks.hidden["separation-layer"] === "false" &&
  checks.hidden["dot-layer"] === "false" &&
  checks.challengeHidden.challenge === "false" &&
  checks.challengeShown.challenge === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset["plane-a"] === "[1,2,2,6]" &&
  checks.reset["plane-b"] === "[2,4,4,10]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1006 &&
  metrics.document.height === 1564 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0568-reference.png"));
await writeFile(
  path.join(evidence, "0568-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0568",
      lessonId: 383,
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
