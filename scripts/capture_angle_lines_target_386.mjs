/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0571-interactive-intermediate-advanced-3d-geometry-and-solids-angle-between-lines-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/386-angle-between-lines";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 989, height: 1589 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0571");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);

const keys = [
  "u",
  "v",
  "dot",
  "magnitude-u",
  "magnitude-v",
  "cosine",
  "acute",
  "angle",
  "valid",
  "mode",
  "layers",
  "translate",
  "tab",
  "challenge",
  "challenge-angle",
  "expanded",
  "shared",
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

await lesson.getByRole("button", { name: "Obtuse", exact: true }).click();
checks.obtuse = await state();
await lesson.getByLabel("Vector v (direction of line 2) x").fill("-1");
await lesson.getByLabel("Vector v (direction of line 2) y").fill("0");
checks.opposite = await state();
await lesson.getByLabel("Vector u (direction of line 1) x").fill("0");
checks.zero = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();

for (const label of [
  "Show dot product",
  "Show angle arc",
  "Show translated line",
])
  await lesson.getByLabel(label).uncheck();
await lesson.getByLabel("Translate a line parallel to itself").uncheck();
checks.layersOff = await state();
for (const label of [
  "Show dot product",
  "Show angle arc",
  "Show translated line",
])
  await lesson.getByLabel(label).check();
await lesson.getByLabel("Translate a line parallel to itself").check();
await lesson.getByRole("button", { name: /Try another/ }).click();
checks.challengeTwo = await state();
await lesson.getByRole("button", { name: /Try another/ }).click();
checks.challengeThree = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas");
const box = await canvas.boundingBox();
const beforeDrag = await state();
await page.mouse.move(box.x + box.width * 0.86, box.y + box.height * 0.56);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.62, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
checks.afterDrag = await state();
checks.dragChanged =
  checks.afterDrag.v !== beforeDrag.v || checks.afterDrag.u !== beforeDrag.u;

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.55);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.37, box.y + box.height * 0.43, {
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
      .querySelector('[data-testid="geometry3d-mockup-0571"]')
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
  hero: await rect(".al386-page .cs378-hero"),
  tabs: await rect(".al386-page .cs378-tabs"),
  lab: await rect(".al386-lab"),
  scene: await rect(".al386-scene"),
  canvas: await rect(".al386-canvas"),
  side: await rect(".al386-side"),
  learning: await rect(".al386-learning"),
  misconception: await rect(".al386-misconception"),
  navigation: await rect(".al386-page .cs378-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0571-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0571-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0571").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
  .getByTestId("geometry3d-angle-lines-canvas")
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
  path: path.join(evidence, "0571-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial.u === "[1,0,0]" &&
  checks.initial.v === "[1,1,0]" &&
  checks.initial.dot === "1" &&
  checks.initial["magnitude-u"] === "1" &&
  checks.initial["magnitude-v"] === "1.4142" &&
  checks.initial.cosine === "0.7071" &&
  checks.initial.angle === "45" &&
  checks.obtuse.angle === "135" &&
  checks.opposite.angle === "180" &&
  checks.zero.valid === "false" &&
  checks.zero.angle === "" &&
  checks.layersOff.layers === "[false,false,false]" &&
  checks.layersOff.translate === "false" &&
  checks.challengeTwo.challenge === "1" &&
  checks.challengeTwo["challenge-angle"] === "90" &&
  checks.challengeThree.challenge === "2" &&
  checks.challengeThree["challenge-angle"] === "45" &&
  checks.shared.shared === "true" &&
  checks.dragChanged &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.u === "[1,0,0]" &&
  checks.reset.v === "[1,1,0]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 989 &&
  metrics.document.height === 1589 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0571-reference.png"));
await writeFile(
  path.join(evidence, "0571-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0571",
      lessonId: 386,
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
