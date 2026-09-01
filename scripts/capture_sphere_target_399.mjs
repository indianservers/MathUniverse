/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0584-interactive-intermediate-advanced-3d-geometry-and-solids-sphere-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/399-sphere";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0584");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1600);
const keys = [
    "radius",
    "slice-height",
    "slice-radius",
    "longitude",
    "great-circle",
    "layers",
    "layer-intensity",
    "projection",
    "animating",
    "area-coefficient",
    "volume-coefficient",
    "tab",
    "volume-answer",
    "area-answer",
    "revealed",
    "correct",
    "saved",
    "exported",
    "shared",
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

await lesson.getByLabel("Radius", { exact: true }).fill("6");
await lesson.getByLabel("Slice height", { exact: true }).fill("3");
checks.edited = await state();
await lesson.getByLabel("Radius", { exact: true }).fill("2");
checks.clamped = await state();
await lesson.getByLabel("Radius", { exact: true }).fill("5");
await lesson.getByLabel("Slice height", { exact: true }).fill("2");
await lesson.getByLabel("Meridian / Longitude", { exact: true }).fill("120");
checks.longitude = await state();
await lesson.getByLabel("Great circle").uncheck();
checks.greatCircleOff = await state();
await lesson.getByLabel("Great circle").check();
await lesson.getByLabel("Show layers (fill)").uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Show layers (fill)").check();
await lesson.getByLabel("Layer fill intensity").fill("0.4");
checks.intensity = await state();
await lesson.getByRole("button", { name: "Orthographic", exact: true }).click();
checks.orthographic = await state();
await lesson.getByRole("button", { name: "Perspective", exact: true }).click();
checks.perspective = await state();

const canvas = lesson.getByTestId("geometry3d-sphere-canvas").locator("canvas"),
  box = await canvas.boundingBox(),
  beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.43, box.y + box.height * 0.43);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.61, box.y + box.height * 0.32, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByRole("button", { name: /Reset view/ }).click();
await lesson.getByRole("button", { name: /Animate rotation/ }).click();
const beforeAnimation = await canvas.screenshot();
await page.waitForTimeout(650);
const afterAnimation = await canvas.screenshot();
checks.animationChanged = !beforeAnimation.equals(afterAnimation);
checks.animationRunning = await state();
await lesson.getByRole("button", { name: /Stop rotation/ }).click();
checks.animationStopped = await state();

await lesson
  .locator(".sph399-choice")
  .nth(0)
  .getByRole("button", { name: "× 9" })
  .click();
await lesson
  .locator(".sph399-choice")
  .nth(1)
  .getByRole("button", { name: "× 3" })
  .click();
await lesson.getByRole("button", { name: /Reveal Answer/ }).click();
checks.wrong = await state();
await lesson
  .locator(".sph399-choice")
  .nth(0)
  .getByRole("button", { name: "× 27" })
  .click();
await lesson
  .locator(".sph399-choice")
  .nth(1)
  .getByRole("button", { name: "× 9" })
  .click();
await lesson.getByRole("button", { name: /Reveal Answer/ }).click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "Save Workspace", exact: true })
  .click();
checks.saved = await state();
checks.savedPayload = await page.evaluate(() =>
  localStorage.getItem("sphere-399-workspace"),
);
const downloadPromise = page.waitForEvent("download");
await lesson.getByRole("button", { name: "Export Image", exact: true }).click();
const download = await downloadPromise;
checks.downloadName = download.suggestedFilename();
checks.exported = await state();
await lesson.getByRole("button", { name: /Share|Shared/ }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0584"]')
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
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".sph399-hero"),
  tabs: await rect(".sph399-tabs"),
  work: await rect(".sph399-work"),
  canvas: await rect(".sph399-scene"),
  cards: await rect(".sph399-cards"),
  insight: await rect(".sph399-insight"),
  challenge: await rect(".sph399-challenge"),
  facts: await rect(".sph399-facts"),
  navigation: await rect(".sph399-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0584-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0584-canvas.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0584").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1000);
const mobileCanvas = mobile
    .getByTestId("geometry3d-sphere-canvas")
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
  path: path.join(evidence, "0584-mobile.png"),
  fullPage: true,
});

const near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.001,
  passed =
    checks.initial.radius === "5" &&
    checks.initial["slice-height"] === "2" &&
    near(checks.initial["slice-radius"], 4.5826) &&
    checks.initial["area-coefficient"] === "100" &&
    near(checks.initial["volume-coefficient"], 166.6667) &&
    checks.edited.radius === "6" &&
    checks.edited["slice-height"] === "3" &&
    near(checks.edited["slice-radius"], 5.1962) &&
    checks.edited["area-coefficient"] === "144" &&
    checks.edited["volume-coefficient"] === "288" &&
    checks.clamped.radius === "2" &&
    checks.clamped["slice-height"] === "2" &&
    checks.clamped["slice-radius"] === "0" &&
    checks.longitude.longitude === "120" &&
    checks.greatCircleOff["great-circle"] === "false" &&
    checks.layersOff.layers === "false" &&
    checks.intensity["layer-intensity"] === "0.4" &&
    checks.orthographic.projection === "Orthographic" &&
    checks.perspective.projection === "Perspective" &&
    checks.orbitChanged &&
    checks.canvasPixels.colored > 500 &&
    checks.canvasPixels.unique > 100 &&
    checks.animationChanged &&
    checks.animationRunning.animating === "true" &&
    checks.animationStopped.animating === "false" &&
    checks.wrong.revealed === "true" &&
    checks.wrong.correct === "false" &&
    checks.correct["volume-answer"] === "27" &&
    checks.correct["area-answer"] === "9" &&
    checks.correct.correct === "true" &&
    checks.saved.saved === "true" &&
    checks.savedPayload?.includes('"radius":5') &&
    checks.downloadName === "sphere-lesson-399.png" &&
    checks.exported.exported === "true" &&
    checks.shared.shared === "true" &&
    checks.tabbed.tab === "Formulas" &&
    checks.reset.radius === "5" &&
    checks.reset["slice-height"] === "2" &&
    checks.reset.longitude === "45" &&
    checks.reset.actions === "0" &&
    metrics.document.width === 864 &&
    metrics.document.height === 1821 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth === 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0584-reference.png"));
await writeFile(
  path.join(evidence, "0584-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0584",
      lessonId: 399,
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
