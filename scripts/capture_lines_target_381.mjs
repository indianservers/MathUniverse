/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0566-interactive-intermediate-advanced-3d-geometry-and-solids-lines-in-3d-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/381-lines-in-3d";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1002, height: 1569 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0566");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "anchor",
    "vector",
    "t",
    "selected",
    "minus",
    "samples",
    "step",
    "equations",
    "solution",
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
await lesson
  .getByRole("slider", { name: "Parameter t", exact: true })
  .fill("-1");
checks.minus = await state();
for (const [label, value] of [
  ["Anchor x", "0"],
  ["Anchor y", "1"],
  ["Anchor z", "2"],
  ["Direction x", "1"],
  ["Direction y", "-2"],
  ["Direction z", "1"],
  ["Parameter t value", "3"],
])
  await lesson.getByLabel(label).fill(value);
checks.challengeValues = await state();
for (const name of [
  "Show sample points (t = -1, 0, 1)",
  "Show direction step (+1, +-2, +1)",
  "Show parametric equations",
])
  await lesson.getByLabel(name).uncheck();
checks.hidden = await state();
await lesson.getByRole("button", { name: /Show solution/ }).click();
checks.hiddenSolution = await state();
await lesson.getByRole("button", { name: /Show solution/ }).click();
checks.solution = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
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
      .querySelector('[data-testid="geometry3d-mockup-0566"]')
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
    hero: await rect(".l381-page .cs378-hero"),
    tabs: await rect(".l381-page .cs378-tabs"),
    lab: await rect(".l381-lab"),
    scene: await rect(".l381-scene"),
    canvas: await rect(".l381-canvas"),
    side: await rect(".l381-side"),
    learning: await rect(".l381-learning"),
    warning: await rect(".l381-warning"),
    navigation: await rect(".l381-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0566-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0566-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0566").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-lines-canvas")
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
  path: path.join(evidence, "0566-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.anchor === "[1,2,1]" &&
  checks.initial.vector === "[2,1,3]" &&
  checks.initial.selected === "[3,3,4]" &&
  checks.initial.minus === "[-1,1,-2]" &&
  checks.minus.selected === "[-1,1,-2]" &&
  checks.challengeValues.anchor === "[0,1,2]" &&
  checks.challengeValues.vector === "[1,-2,1]" &&
  checks.challengeValues.t === "3" &&
  checks.challengeValues.selected === "[3,-5,5]" &&
  checks.hidden.samples === "false" &&
  checks.hidden.step === "false" &&
  checks.hidden.equations === "false" &&
  checks.hiddenSolution.solution === "false" &&
  checks.solution.solution === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.anchor === "[1,2,1]" &&
  checks.reset.vector === "[2,1,3]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1002 &&
  metrics.document.height === 1569 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0566-reference.png"));
await writeFile(
  path.join(evidence, "0566-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0566",
      lessonId: 381,
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
