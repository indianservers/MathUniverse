/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0567-interactive-intermediate-advanced-3d-geometry-and-solids-planes-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/382-planes";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 963, height: 1633 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0567");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "coefficients",
    "intercepts",
    "normal",
    "test-value",
    "passes",
    "show-intercepts",
    "show-normal",
    "show-point",
    "show-equation",
    "mode",
    "answer",
    "grade",
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
for (const [label, value] of [
  ["A (x)", "1"],
  ["B (y)", "2"],
  ["C (z)", "2"],
  ["D", "8"],
])
  await lesson.getByLabel(label, { exact: true }).fill(value);
checks.changed = await state();
for (const name of [
  "Show intercepts",
  "Show normal vector",
  "Show test point",
  "Show equation",
])
  await lesson.getByLabel(name).uncheck();
checks.hidden = await state();
for (const name of [
  "Show intercepts",
  "Show normal vector",
  "Show test point",
  "Show equation",
])
  await lesson.getByLabel(name).check();
await lesson.getByLabel("Plane construction mode").selectOption("intercepts");
checks.mode = await state();
await lesson.getByLabel("Challenge normal vector").fill("1,1,1");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.incorrect = await state();
await lesson.getByLabel("Challenge normal vector").fill("1,2,2");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show solution/ }).click();
checks.solution = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.66, box.y + box.height * 0.45);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.35, {
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
      .querySelector('[data-testid="geometry3d-mockup-0567"]')
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
    hero: await rect(".pl382-page .cs378-hero"),
    tabs: await rect(".pl382-page .cs378-tabs"),
    lab: await rect(".pl382-lab"),
    scene: await rect(".pl382-scene"),
    canvas: await rect(".pl382-canvas"),
    side: await rect(".pl382-side"),
    learning: await rect(".pl382-learning"),
    practice: await rect(".pl382-practice"),
    navigation: await rect(".pl382-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0567-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0567-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0567").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-planes-canvas")
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
  path: path.join(evidence, "0567-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.coefficients === "[2,3,1,6]" &&
  checks.initial.intercepts === "[[3,0,0],[0,2,0],[0,0,6]]" &&
  checks.initial.normal === "[2,3,1]" &&
  checks.initial["test-value"] === "6" &&
  checks.initial.passes === "true" &&
  checks.changed.coefficients === "[1,2,2,8]" &&
  checks.changed.intercepts === "[[8,0,0],[0,4,0],[0,0,4]]" &&
  checks.changed.normal === "[1,2,2]" &&
  checks.changed["test-value"] === "5" &&
  checks.changed.passes === "false" &&
  checks.hidden["show-intercepts"] === "false" &&
  checks.hidden["show-normal"] === "false" &&
  checks.hidden["show-point"] === "false" &&
  checks.hidden["show-equation"] === "false" &&
  checks.mode.mode === "intercepts" &&
  checks.incorrect.grade === "incorrect" &&
  checks.correct.grade === "correct" &&
  checks.solution.solution === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.coefficients === "[2,3,1,6]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 963 &&
  metrics.document.height === 1633 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0567-reference.png"));
await writeFile(
  path.join(evidence, "0567-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0567",
      lessonId: 382,
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
