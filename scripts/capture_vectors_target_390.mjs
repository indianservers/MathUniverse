/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0575-interactive-intermediate-advanced-3d-geometry-and-solids-3d-vectors-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/390-3d-vectors";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 992, height: 1586 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0575");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "a",
    "b",
    "sum",
    "dot",
    "cross",
    "magnitude-a",
    "magnitude-b",
    "cosine",
    "angle",
    "valid",
    "mode",
    "axes",
    "expanded",
    "steps",
    "tab",
    "shared",
    "checked",
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
await lesson.getByLabel("Increase Vector a x").click();
checks.stepped = await state();
await lesson.getByLabel("Decrease Vector a x").click();
await lesson.getByRole("button", { name: "Dot", exact: true }).click();
checks.dotMode = await state();
await lesson.getByRole("button", { name: "Cross", exact: true }).click();
checks.crossMode = await state();
await lesson.getByLabel("Show axes").uncheck();
checks.axesOff = await state();
await lesson.getByLabel("Show axes").check();
await lesson.getByRole("button", { name: /Show steps/ }).click();
checks.steps = await state();
await lesson
  .getByRole("button", { name: "Check my work", exact: true })
  .click();
checks.practice = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  beforeDrag = await state(),
  dragImage = await canvas.screenshot(),
  cyanCandidates = await colorComponents(page, dragImage, "cyan");
for (const offsetY of [-10, 0]) {
  const x = box.x + box.width * 0.64,
    y = box.y + box.height * 0.585 + offsetY;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.waitForTimeout(180);
  await page.mouse.move(x + 35, y + 30, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(180);
  if ((await state()).a !== beforeDrag.a) break;
}
checks.afterDrag = await state();
checks.dragChanged = checks.afterDrag.a !== beforeDrag.a;
checks.cyanCandidates = cyanCandidates;
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.58);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.34, box.y + box.height * 0.48, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByTitle("Toggle fullscreen").click();
checks.expanded = await state();
await lesson.getByTitle("Toggle fullscreen").click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0575"]')
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
    hero: await rect(".vec390-page .cs378-hero"),
    tabs: await rect(".vec390-page .cs378-tabs"),
    layout: await rect(".vec390-layout"),
    canvas: await rect(".vec390-scene"),
    controls: await rect(".vec390-components"),
    results: await rect(".vec390-results"),
    concept: await rect(".vec390-concept"),
    practice: await rect(".vec390-practice"),
  };
await page.screenshot({
  path: path.join(evidence, "0575-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0575-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0575").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-vectors-canvas")
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
  path: path.join(evidence, "0575-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.a === "[3,2,1]" &&
  checks.initial.b === "[1,-1,2]" &&
  checks.initial.sum === "[4,1,3]" &&
  checks.initial.dot === "3" &&
  checks.initial.cross === "[5,-5,-5]" &&
  checks.initial["magnitude-a"] === "3.74" &&
  checks.initial["magnitude-b"] === "2.45" &&
  checks.initial.angle === "70.89" &&
  checks.stepped.a === "[4,2,1]" &&
  checks.stepped.sum === "[5,1,3]" &&
  checks.stepped.dot === "4" &&
  checks.stepped.cross === "[5,-7,-6]" &&
  checks.dotMode.mode === "Dot" &&
  checks.crossMode.mode === "Cross" &&
  checks.axesOff.axes === "false" &&
  checks.steps.steps === "true" &&
  checks.practice.checked === "true" &&
  checks.shared.shared === "true" &&
  checks.dragChanged &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.expanded.expanded === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.a === "[3,2,1]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 992 &&
  metrics.document.height === 1586 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0575-reference.png"));
await writeFile(
  path.join(evidence, "0575-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0575",
      lessonId: 390,
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

async function colorComponents(targetPage, imageBuffer, color) {
  return targetPage.evaluate(
    async ({ dataUrl, colorName }) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const sample = document.createElement("canvas"),
        context = sample.getContext("2d");
      sample.width = image.width;
      sample.height = image.height;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, image.width, image.height).data,
        active = new Uint8Array(image.width * image.height),
        seen = new Uint8Array(image.width * image.height),
        components = [];
      for (let i = 0; i < active.length; i++) {
        const o = i * 4;
        active[i] =
          colorName === "cyan" &&
          pixels[o + 2] > 130 &&
          pixels[o + 1] > 100 &&
          pixels[o] < 100
            ? 1
            : 0;
      }
      for (let start = 0; start < active.length; start++) {
        if (!active[start] || seen[start]) continue;
        const queue = [start];
        seen[start] = 1;
        let head = 0,
          sx = 0,
          sy = 0;
        while (head < queue.length) {
          const index = queue[head++],
            x = index % image.width,
            y = Math.floor(index / image.width);
          sx += x;
          sy += y;
          for (const n of [
            index - 1,
            index + 1,
            index - image.width,
            index + image.width,
          ])
            if (
              n >= 0 &&
              n < active.length &&
              active[n] &&
              !seen[n] &&
              Math.abs((n % image.width) - x) <= 1
            ) {
              seen[n] = 1;
              queue.push(n);
            }
        }
        if (queue.length > 4)
          components.push({
            x: sx / queue.length,
            y: sy / queue.length,
            size: queue.length,
          });
      }
      return components.sort((a, b) => b.size - a.size).slice(0, 25);
    },
    {
      dataUrl: `data:image/png;base64,${imageBuffer.toString("base64")}`,
      colorName: color,
    },
  );
}

async function pixelStats(targetPage, imageBuffer) {
  return targetPage.evaluate(
    async (dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const sample = document.createElement("canvas"),
        context = sample.getContext("2d");
      sample.width = 160;
      sample.height = 160;
      context.drawImage(image, 0, 0, 160, 160);
      const pixels = context.getImageData(0, 0, 160, 160).data,
        colors = new Set();
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
    `data:image/png;base64,${imageBuffer.toString("base64")}`,
  );
}
