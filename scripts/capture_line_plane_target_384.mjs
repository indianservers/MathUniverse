/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0569-interactive-intermediate-advanced-3d-geometry-and-solids-line-plane-intersection-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/384-lineplane-intersection";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0569");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
console.log("stage: loaded");
const keys = [
    "point",
    "vector",
    "plane",
    "numerator",
    "denominator",
    "status",
    "t",
    "intersection",
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
await lesson.getByLabel("Vector x").fill("1");
await lesson.getByLabel("Vector y").fill("-1");
await lesson.getByLabel("Vector z").fill("0");
checks.parallel = await state();
await lesson.getByLabel("Point x").fill("2");
await lesson.getByLabel("Point y").fill("3");
await lesson.getByLabel("Point z").fill("1");
checks.contained = await state();
for (const [label, value] of [
  ["Point x", "0"],
  ["Point y", "0"],
  ["Point z", "1"],
  ["Vector x", "2"],
  ["Vector y", "1"],
  ["Vector z", "0"],
  ["Plane D", "7"],
])
  await lesson.getByLabel(label).fill(value);
checks.challengeModel = await state();
await lesson.getByLabel("Challenge t").fill("1");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.incorrect = await state();
await lesson.getByLabel("Challenge t").fill("2");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show solution/ }).click();
checks.solution = await state();
console.log("stage: solver branches");
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
console.log("stage: canvas audit");
await lesson.getByTitle("Toggle fullscreen").dispatchEvent("click");
checks.expanded = await state();
await lesson.getByTitle("Toggle fullscreen").dispatchEvent("click");
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0569"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
console.log("stage: reset");
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
    hero: await rect(".lp384-page .cs378-hero"),
    tabs: await rect(".lp384-page .cs378-tabs"),
    lab: await rect(".lp384-lab"),
    scene: await rect(".lp384-scene"),
    canvas: await rect(".lp384-canvas"),
    side: await rect(".lp384-side"),
    workflow: await rect(".lp384-workflow"),
    bottom: await rect(".lp384-bottom"),
    navigation: await rect(".lp384-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0569-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0569-canvas.png") });
console.log("stage: desktop captures");
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0569").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-line-plane-canvas")
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
console.log("stage: mobile canvas");
await mobile.screenshot({
  path: path.join(evidence, "0569-mobile.png"),
  fullPage: true,
});
console.log("stage: mobile full page");
const passed =
  checks.initial.point === "[1,1,1]" &&
  checks.initial.vector === "[1,2,0]" &&
  checks.initial.plane === "[1,1,1,6]" &&
  checks.initial.numerator === "3" &&
  checks.initial.denominator === "3" &&
  checks.initial.status === "single intersection" &&
  checks.initial.t === "1" &&
  checks.initial.intersection === "[2,3,1]" &&
  checks.parallel.denominator === "0" &&
  checks.parallel.numerator === "3" &&
  checks.parallel.status === "no intersection" &&
  checks.contained.denominator === "0" &&
  checks.contained.numerator === "0" &&
  checks.contained.status === "line in plane" &&
  checks.challengeModel.point === "[0,0,1]" &&
  checks.challengeModel.vector === "[2,1,0]" &&
  checks.challengeModel.plane === "[1,1,1,7]" &&
  checks.challengeModel.t === "2" &&
  checks.challengeModel.intersection === "[4,2,1]" &&
  checks.incorrect.grade === "incorrect" &&
  checks.correct.grade === "correct" &&
  checks.solution.solution === "true" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.point === "[1,1,1]" &&
  checks.reset.vector === "[1,2,0]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0569-reference.png"));
await writeFile(
  path.join(evidence, "0569-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0569",
      lessonId: 384,
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
