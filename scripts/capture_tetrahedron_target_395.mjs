/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0580-interactive-intermediate-advanced-3d-geometry-and-solids-tetrahedron-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/395-tetrahedron";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (
    ["error", "warning"].includes(m.type()) &&
    !m.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0580");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "points",
    "base",
    "base-area",
    "height",
    "volume",
    "centroid",
    "slice",
    "tool",
    "net",
    "rotating",
    "exploded",
    "tab",
    "shared",
    "checked",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, attrs) =>
        Object.fromEntries(
          attrs.map((key) => [key, node.getAttribute(`data-${key}`)]),
        ),
      keys,
    ),
  checks = { initial: await state() };
for (const name of ["ABD", "ACD", "BCD"]) {
  await lesson.getByRole("button", { name: `△ ${name}`, exact: true }).click();
  checks[`base${name}`] = await state();
}
await lesson.getByRole("button", { name: "△ ABC", exact: true }).click();
await lesson.getByLabel("Height", { exact: true }).fill("7");
checks.height7 = await state();
await lesson.getByLabel("Slice position", { exact: true }).fill("3.2");
checks.slice = await state();
for (const name of ["Move", "Measure", "Slice", "Explode"]) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks[`tool${name}`] = await state();
}
await lesson.getByRole("button", { name: /Show net/ }).click();
checks.net = await state();
await lesson.getByRole("button", { name: /Rotate/ }).click();
checks.rotating = await state();
await lesson.getByRole("button", { name: "Check volume", exact: true }).click();
checks.checked = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  dragImage = await canvas.screenshot(),
  candidates = await cyanComponents(page, dragImage),
  beforeDrag = await state();
for (const offsetY of [0, -8]) {
  const x = box.x + box.width * 0.403,
    y = box.y + box.height * 0.512 + offsetY;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.waitForTimeout(160);
  await page.mouse.move(x + 30, y + 25, { steps: 7 });
  await page.mouse.up();
  await page.waitForTimeout(160);
  if ((await state()).points !== beforeDrag.points) break;
}
checks.afterDrag = await state();
checks.dragChanged = checks.afterDrag.points !== beforeDrag.points;
checks.cyanCandidates = candidates;
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.55);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.43, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0580"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
    const b = await page.locator(selector).first().boundingBox();
    return b
      ? {
          top: Math.round(b.y),
          left: Math.round(b.x),
          width: Math.round(b.width),
          height: Math.round(b.height),
          bottom: Math.round(b.y + b.height),
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
    hero: await rect(".tet395-hero"),
    tabs: await rect(".tet395-tabs"),
    work: await rect(".tet395-work"),
    canvas: await rect(".tet395-scene"),
    side: await rect(".tet395-side"),
    measurements: await rect(".tet395-measures"),
    insight: await rect(".tet395-insight"),
    challenge: await rect(".tet395-challenge"),
    navigation: await rect(".tet395-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0580-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0580-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0580").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-tetrahedron-canvas")
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
  path: path.join(evidence, "0580-mobile.png"),
  fullPage: true,
});
const invariant = (name) => Math.abs(Number(checks[name].volume) - 20) < 0.01,
  passed =
    checks.initial.base === "ABC" &&
    checks.initial["base-area"] === "12" &&
    checks.initial.height === "5" &&
    checks.initial.volume === "20" &&
    checks.initial.centroid === "[2,1.333,1.25]" &&
    invariant("baseABD") &&
    invariant("baseACD") &&
    invariant("baseBCD") &&
    checks.height7.height === "7" &&
    checks.height7.volume === "28" &&
    checks.slice.slice === "3.2" &&
    checks.toolMove.tool === "Move" &&
    checks.toolMeasure.tool === "Measure" &&
    checks.toolSlice.tool === "Slice" &&
    checks.toolExplode.tool === "Explode" &&
    checks.toolExplode.exploded === "true" &&
    checks.net.net === "true" &&
    checks.rotating.rotating === "true" &&
    checks.checked.checked === "true" &&
    checks.shared.shared === "true" &&
    checks.dragChanged &&
    checks.orbitChanged &&
    checks.canvasPixels.colored > 500 &&
    checks.canvasPixels.unique > 100 &&
    checks.tabbed.tab === "Formulas" &&
    checks.reset.base === "ABC" &&
    checks.reset.actions === "0" &&
    metrics.document.width === 864 &&
    metrics.document.height === 1821 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth === 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0580-reference.png"));
await writeFile(
  path.join(evidence, "0580-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0580",
      lessonId: 395,
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
async function cyanComponents(targetPage, imageBuffer) {
  return targetPage.evaluate(
    async (dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, image.width, image.height).data,
        active = new Uint8Array(image.width * image.height),
        seen = new Uint8Array(active.length),
        items = [];
      for (let i = 0; i < active.length; i++) {
        const o = i * 4;
        active[i] =
          pixels[o] < 80 && pixels[o + 1] > 110 && pixels[o + 2] > 120 ? 1 : 0;
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
        if (queue.length > 5)
          items.push({
            x: sx / queue.length,
            y: sy / queue.length,
            size: queue.length,
          });
      }
      return items.sort((a, b) => b.size - a.size);
    },
    `data:image/png;base64,${imageBuffer.toString("base64")}`,
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
