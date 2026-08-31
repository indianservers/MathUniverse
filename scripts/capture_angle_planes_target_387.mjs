/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0572-interactive-intermediate-advanced-3d-geometry-and-solids-angle-between-planes-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/387-angle-between-planes";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 975, height: 1614 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0572");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "normal-a",
    "normal-b",
    "dot",
    "magnitude-a",
    "magnitude-b",
    "cosine",
    "acute",
    "angle",
    "hinge",
    "valid",
    "mode",
    "layers",
    "answer",
    "grade",
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
await lesson.getByRole("button", { name: "Obtuse", exact: true }).click();
checks.obtuse = await state();
await lesson.getByRole("button", { name: "Acute", exact: true }).click();
await lesson.getByLabel("Plane B (Tilted) y").fill("0");
await lesson.getByLabel("Plane B (Tilted) z").fill("2");
checks.parallel = await state();
await lesson.getByLabel("Plane A (Base) z").fill("0");
checks.zero = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
for (const label of ["Show normals", "Show hinge line", "Show dihedral wedge"])
  await lesson.getByLabel(label).uncheck();
checks.layersOff = await state();
for (const label of ["Show normals", "Show hinge line", "Show dihedral wedge"])
  await lesson.getByLabel(label).check();
await lesson.getByRole("radio", { name: /60°/ }).check();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.incorrect = await state();
await lesson.getByRole("radio", { name: /45°/ }).check();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  beforeDrag = await state();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.215);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.28, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
checks.afterDrag = await state();
checks.dragChanged =
  checks.afterDrag["normal-a"] !== beforeDrag["normal-a"] ||
  checks.afterDrag["normal-b"] !== beforeDrag["normal-b"];
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.57);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.36, box.y + box.height * 0.44, {
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
      .querySelector('[data-testid="geometry3d-mockup-0572"]')
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
    hero: await rect(".ap387-page .cs378-hero"),
    tabs: await rect(".ap387-page .cs378-tabs"),
    lab: await rect(".ap387-lab"),
    scene: await rect(".ap387-scene"),
    canvas: await rect(".ap387-canvas"),
    side: await rect(".ap387-side"),
    learning: await rect(".ap387-learning"),
    misconception: await rect(".ap387-misconception"),
    navigation: await rect(".ap387-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0572-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0572-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0572").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-angle-planes-canvas")
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
  path: path.join(evidence, "0572-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial["normal-a"] === "[0,0,1]" &&
  checks.initial["normal-b"] === "[0,1,1]" &&
  checks.initial.dot === "1" &&
  checks.initial["magnitude-a"] === "1" &&
  checks.initial["magnitude-b"] === "1.4142" &&
  checks.initial.cosine === "0.7071" &&
  checks.initial.angle === "45" &&
  checks.initial.hinge === "[-1,0,0]" &&
  checks.obtuse.angle === "135" &&
  checks.parallel.angle === "0" &&
  checks.parallel.hinge === "null" &&
  checks.zero.valid === "false" &&
  checks.layersOff.layers === "[false,false,false]" &&
  checks.incorrect.grade === "incorrect" &&
  checks.correct.grade === "correct" &&
  checks.shared.shared === "true" &&
  checks.dragChanged &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset["normal-a"] === "[0,0,1]" &&
  checks.reset["normal-b"] === "[0,1,1]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 975 &&
  metrics.document.height === 1614 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0572-reference.png"));
await writeFile(
  path.join(evidence, "0572-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0572",
      lessonId: 387,
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
