/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0564-interactive-intermediate-advanced-3d-geometry-and-solids-3d-points-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/379-3d-points";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 987, height: 1593 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0564");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2500);

const keys = [
  "points",
  "selected",
  "highest",
  "labels",
  "drops",
  "shadow",
  "path",
  "grade",
  "expanded",
  "tab",
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

await lesson.getByLabel("Selected point").selectOption("B");
await lesson.getByLabel("z value").fill("4");
checks.edited = await state();
for (const name of [
  "Show labels",
  "Show drop lines",
  "Show xy shadow",
  "Show step path (selected)",
])
  await lesson.getByLabel(name).uncheck();
checks.hidden = await state();
for (const name of [
  "Show labels",
  "Show drop lines",
  "Show xy shadow",
  "Show step path (selected)",
])
  await lesson.getByLabel(name).check();

await lesson.getByRole("button", { name: /Add point/ }).click();
await lesson.getByLabel("x value").fill("1.4");
await lesson.getByLabel("y value").fill("-2.6");
await lesson.getByLabel("z value").fill("2.2");
await lesson.getByRole("button", { name: /Snap to grid/ }).click();
checks.addedAndSnapped = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByRole("button", { name: /^B\./ }).click();
checks.incorrect = await state();
await lesson.getByRole("button", { name: /^A\./ }).click();
checks.challenge = await state();

const canvas = lesson.locator("canvas");
const canvasBox = await canvas.boundingBox();
const before = await canvas.screenshot();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.65,
  canvasBox.y + canvasBox.height * 0.45,
);
await page.mouse.down();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.52,
  canvasBox.y + canvasBox.height * 0.36,
  { steps: 8 },
);
await page.mouse.up();
await page.waitForTimeout(500);
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
    context.drawImage(image, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
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
      .querySelector('[data-testid="geometry3d-mockup-0564"]')
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
  hero: await rect(".p379-page .cs378-hero"),
  tabs: await rect(".p379-page .cs378-tabs"),
  lab: await rect(".p379-lab"),
  plot: await rect(".p379-plot"),
  canvas: await rect(".p379-canvas"),
  side: await rect(".p379-side"),
  learning: await rect(".p379-learning"),
  warning: await rect(".p379-warning"),
  navigation: await rect(".p379-page .cs378-nav"),
};

await page.screenshot({
  path: path.join(evidence, "0564-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0564-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0564").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1500);
const mobileCanvas = mobile
  .getByTestId("geometry3d-points-canvas")
  .locator("canvas");
const mobilePixels = await mobileCanvas.screenshot();
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  canvas: await mobileCanvas.boundingBox(),
  nonblank: mobilePixels.length > 1000,
};
await mobile.screenshot({
  path: path.join(evidence, "0564-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial.points === "[[2,1,3],[-2,3,1],[3,-1,2]]" &&
  checks.initial.selected === "A" &&
  checks.initial.highest === "A" &&
  checks.edited.selected === "B" &&
  checks.edited.highest === "B" &&
  checks.hidden.labels === "false" &&
  checks.hidden.drops === "false" &&
  checks.hidden.shadow === "false" &&
  checks.hidden.path === "false" &&
  checks.addedAndSnapped.points === "[[2,1,3],[-2,3,4],[3,-1,2],[1,-3,2]]" &&
  checks.addedAndSnapped.selected === "D" &&
  checks.incorrect.grade === "incorrect" &&
  checks.challenge.grade === "correct" &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.points === "[[2,1,3],[-2,3,1],[3,-1,2]]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 987 &&
  metrics.document.height === 1593 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0564-reference.png"));
await writeFile(
  path.join(evidence, "0564-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0564",
      lessonId: 379,
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
