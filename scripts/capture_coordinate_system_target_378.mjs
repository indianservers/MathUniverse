/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0563-interactive-intermediate-advanced-3d-geometry-and-solids-3d-coordinate-system-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/378-3d-coordinate-system";
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
const lesson = page.getByTestId("geometry3d-mockup-0563");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2500);
const keys = [
    "point",
    "distance",
    "planes",
    "path",
    "labels",
    "challenge",
    "grade",
    "expanded",
    "tab",
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
await lesson.getByLabel("x (left / right) value").fill("-2");
await lesson.getByRole("slider", { name: "y (forward / back)" }).fill("3");
await lesson.getByLabel("z (up / down) value").fill("1");
checks.changed = await state();
await lesson.getByLabel("Show projection planes").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show projection planes").check();
const canvas = lesson.locator("canvas"),
  canvasBox = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.65,
  canvasBox.y + canvasBox.height * 0.45,
);
await page.mouse.down();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.52,
  canvasBox.y + canvasBox.height * 0.38,
  { steps: 8 },
);
await page.mouse.up();
await page.waitForTimeout(500);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvasPixels = await page.evaluate(
  async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    const sample = document.createElement("canvas");
    sample.width = 160;
    sample.height = 160;
    const context = sample.getContext("2d");
    context.drawImage(image, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
    const colors = new Set();
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
  `data:image/png;base64,${after.toString("base64")}`,
);
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.challenge = await state();
await lesson.getByTitle("Toggle fullscreen").click();
checks.expanded = await state();
await lesson.getByTitle("Toggle fullscreen").click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0563"]')
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
    hero: await rect(".cs378-hero"),
    tabs: await rect(".cs378-tabs"),
    lab: await rect(".cs378-lab"),
    scene: await rect(".cs378-scene"),
    canvas: await rect(".cs378-canvas"),
    learning: await rect(".cs378-learning"),
    warning: await rect(".cs378-warning"),
    navigation: await rect(".cs378-nav"),
  };
const passed =
  checks.initial.point === "[3,2,4]" &&
  checks.initial.distance === "5.39" &&
  checks.changed.point === "[-2,3,1]" &&
  checks.changed.distance === "3.74" &&
  checks.hidden.planes === "false" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.challenge.grade === "correct" &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.point === "[3,2,4]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1002 &&
  metrics.document.height === 1569 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0563-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0563-canvas.png") });
await copyFile(reference, path.join(evidence, "0563-reference.png"));
await writeFile(
  path.join(evidence, "0563-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0563", lessonId: 378, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
