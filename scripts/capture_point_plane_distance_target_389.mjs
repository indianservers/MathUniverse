/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0574-interactive-intermediate-advanced-3d-geometry-and-solids-point-to-plane-distance-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/389-point-to-plane-distance";
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
const lesson = page.getByTestId("geometry3d-mockup-0574");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(2200);
const keys = [
    "point",
    "plane",
    "numerator",
    "denominator",
    "distance",
    "factor",
    "foot",
    "valid",
    "layers",
    "tab",
    "checked",
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
  setPoint = async (values) => {
    for (const [label, value] of [
      ["Point P = (x₀, y₀, z₀) x₀", values[0]],
      ["Point P = (x₀, y₀, z₀) y₀", values[1]],
      ["Point P = (x₀, y₀, z₀) z₀", values[2]],
    ])
      await lesson.getByLabel(label).fill(String(value));
  },
  setPlane = async (values) => {
    for (const [label, value] of [
      ["Plane Ax + By + Cz = D A", values[0]],
      ["Plane Ax + By + Cz = D B", values[1]],
      ["Plane Ax + By + Cz = D C", values[2]],
      ["Plane Ax + By + Cz = D D", values[3]],
    ])
      await lesson.getByLabel(label).fill(String(value));
  },
  checks = { initial: await state() };
await setPoint([1, 1, 5]);
await setPlane([0, 0, 1, 2]);
checks.axisAligned = await state();
await setPoint([1, 1, 2]);
checks.onPlane = await state();
await setPlane([0, 0, 0, 2]);
checks.invalid = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByLabel("Show perpendicular PH").uncheck();
await lesson.getByLabel("Show foot H").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show perpendicular PH").check();
await lesson.getByLabel("Show foot H").check();
await lesson.getByRole("button", { name: "Check it", exact: true }).click();
checks.experiment = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const canvas = lesson.locator("canvas"),
  box = await canvas.boundingBox(),
  beforeDrag = await state(),
  pointImage = await canvas.screenshot(),
  yellowCandidates = await page.evaluate(
    async (dataUrl) => {
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
      for (let index = 0; index < active.length; index++) {
        const offset = index * 4;
        active[index] =
          pixels[offset] > 175 &&
          pixels[offset + 1] > 120 &&
          pixels[offset + 2] < 120
            ? 1
            : 0;
      }
      for (let start = 0; start < active.length; start++) {
        if (!active[start] || seen[start]) continue;
        const queue = [start];
        seen[start] = 1;
        let head = 0,
          sumX = 0,
          sumY = 0;
        while (head < queue.length) {
          const index = queue[head++],
            x = index % image.width,
            y = Math.floor(index / image.width);
          sumX += x;
          sumY += y;
          for (const neighbor of [
            index - 1,
            index + 1,
            index - image.width,
            index + image.width,
          ]) {
            if (
              neighbor >= 0 &&
              neighbor < active.length &&
              active[neighbor] &&
              !seen[neighbor] &&
              Math.abs((neighbor % image.width) - x) <= 1
            ) {
              seen[neighbor] = 1;
              queue.push(neighbor);
            }
          }
        }
        if (queue.length > 4)
          components.push({
            x: sumX / queue.length,
            y: sumY / queue.length,
            size: queue.length,
          });
      }
      return components.sort((a, b) => b.size - a.size).slice(0, 20);
    },
    `data:image/png;base64,${pointImage.toString("base64")}`,
  );
for (const candidate of yellowCandidates) {
  await page.mouse.move(box.x + candidate.x, box.y + candidate.y);
  await page.mouse.down();
  await page.mouse.move(box.x + candidate.x + 35, box.y + candidate.y + 30, {
    steps: 8,
  });
  await page.mouse.up();
  await page.waitForTimeout(100);
  if ((await state()).point !== beforeDrag.point) break;
}
checks.afterDrag = await state();
checks.yellowCandidates = yellowCandidates;
checks.dragChanged = checks.afterDrag.point !== beforeDrag.point;
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.65);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.34, box.y + box.height * 0.55, {
  steps: 8,
});
await page.mouse.up();
await page.waitForTimeout(400);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
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
  `data:image/png;base64,${afterOrbit.toString("base64")}`,
);
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await lesson.getByRole("button", { name: "Reset view", exact: true }).click();
checks.viewReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0574"]')
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
    hero: await rect(".ppd389-page .cs378-hero"),
    tabs: await rect(".ppd389-page .cs378-tabs"),
    lab: await rect(".ppd389-lab"),
    canvas: await rect(".ppd389-canvas"),
    controls: await rect(".ppd389-side"),
    calculation: await rect(".ppd389-calc"),
    key: await rect(".ppd389-key"),
    experiment: await rect(".ppd389-try"),
    navigation: await rect(".ppd389-page .cs378-nav"),
  };
await page.screenshot({
  path: path.join(evidence, "0574-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0574-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0574").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1200);
const mobileCanvas = mobile
    .getByTestId("geometry3d-point-plane-canvas")
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
  path: path.join(evidence, "0574-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.point === "[4,4,4]" &&
  checks.initial.plane === "[1,1,1,6]" &&
  checks.initial.numerator === "6" &&
  checks.initial.denominator === "1.73" &&
  checks.initial.distance === "3.46" &&
  checks.initial.factor === "2" &&
  checks.initial.foot === "[2,2,2]" &&
  checks.axisAligned.distance === "3" &&
  checks.axisAligned.foot === "[1,1,2]" &&
  checks.onPlane.distance === "0" &&
  checks.onPlane.foot === "[1,1,2]" &&
  checks.invalid.valid === "false" &&
  checks.layersOff.layers === "[false,false]" &&
  checks.experiment.point === "[1,1,5]" &&
  checks.experiment.plane === "[0,0,1,2]" &&
  checks.experiment.checked === "true" &&
  checks.shared.shared === "true" &&
  checks.dragChanged &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.tabbed.tab === "Formulas" &&
  checks.viewReset.actions !== checks.tabbed.actions &&
  checks.reset.point === "[4,4,4]" &&
  checks.reset.plane === "[1,1,1,6]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 963 &&
  metrics.document.height === 1633 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0574-reference.png"));
await writeFile(
  path.join(evidence, "0574-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0574",
      lessonId: 389,
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
