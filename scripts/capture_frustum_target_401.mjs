/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0586-interactive-intermediate-advanced-3d-geometry-and-solids-frustum-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/401-frustum";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 984, height: 1599 } });
const consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0586");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1500);

const keys = [
  "top-radius",
  "bottom-radius",
  "height",
  "slant",
  "volume-coefficient",
  "curved-coefficient",
  "total-coefficient",
  "original-height",
  "removed-height",
  "original-volume-coefficient",
  "net-angle",
  "removed",
  "net",
  "fullscreen",
  "checked",
  "correct",
  "actions",
];
const state = async () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(
        names.map((name) => [
          name,
          node.dataset[
            name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
          ],
        ]),
      ),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByRole("spinbutton", { name: "Top radius (r)" }).fill("3");
await lesson.getByRole("spinbutton", { name: "Bottom radius (R)" }).fill("6");
await lesson.getByRole("spinbutton", { name: "Height (h)" }).fill("8");
checks.edited = await state();

await lesson.getByLabel("Show removed cone").uncheck();
checks.removedOff = await state();
await lesson.getByLabel("Show removed cone").check();
await lesson.getByLabel("Unfold net").uncheck();
checks.folded = await state();
await lesson.getByLabel("Unfold net").check();
checks.layersRestored = await state();

const topHandle = lesson.getByLabel("Drag top radius handle");
const topBox = await topHandle.boundingBox();
await page.mouse.move(
  topBox.x + topBox.width / 2,
  topBox.y + topBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  topBox.x + topBox.width / 2 + 24,
  topBox.y + topBox.height / 2,
);
await page.mouse.up();
checks.directDrag = await state();

const canvas = lesson
  .getByTestId("geometry3d-frustum-canvas")
  .locator("canvas");
const canvasBox = await canvas.boundingBox();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.48,
  canvasBox.y + canvasBox.height * 0.58,
);
await page.mouse.down();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.58,
  canvasBox.y + canvasBox.height * 0.47,
  { steps: 8 },
);
await page.mouse.up();
await page.waitForTimeout(300);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);

await lesson.getByLabel("Reset 3D view").click();
await lesson.getByLabel("Full screen").click();
checks.fullscreen = await state();
await lesson.locator(".fru401-exit").click();
checks.fullscreenExit = await state();

const challengeState = await state();
await lesson.getByLabel("Original cone height").fill("1");
await lesson.getByLabel("Original cone volume coefficient").fill("1");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.incorrectChallenge = await state();
await lesson
  .getByLabel("Original cone height")
  .fill(challengeState["original-height"]);
await lesson
  .getByLabel("Original cone volume coefficient")
  .fill(challengeState["original-volume-coefficient"]);
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correctChallenge = await state();

await lesson.getByRole("button", { name: /Interactive 3D/ }).click();
await lesson.getByRole("button", { name: /Draggable measurements/ }).click();
await lesson.getByRole("button", { name: /Unfoldable net/ }).click();
checks.heroNetToggle = await state();
await lesson.getByRole("button", { name: /Unfoldable net/ }).click();
await lesson.getByRole("button", { name: /Live formulas/ }).click();
await lesson.getByRole("spinbutton", { name: "Top radius (r)" }).fill("2");
await lesson.getByRole("spinbutton", { name: "Bottom radius (R)" }).fill("5");
await lesson.getByRole("spinbutton", { name: "Height (h)" }).fill("4");
await lesson.getByLabel("Original cone height").fill("");
await lesson.getByLabel("Original cone volume coefficient").fill("");
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(350);

const rect = async (selector) => {
  const box = await lesson.locator(selector).boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        left: Math.round(box.x),
        width: Math.round(box.width),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
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
  hero: await rect(".fru401-hero"),
  lab: await rect(".fru401-lab"),
  interactive: await rect(".fru401-interactive"),
  canvas: await rect(".fru401-stage"),
  net: await rect(".fru401-net"),
  formulas: await rect(".fru401-formulas"),
  worked: await rect(".fru401-worked"),
  challenge: await rect(".fru401-challenge"),
  navigation: await rect(".fru401-nav"),
};
await page.screenshot({
  path: path.join(evidence, "0586-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0586-canvas.png") });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1000);
const mobileCanvas = page
  .getByTestId("geometry3d-frustum-canvas")
  .locator("canvas");
const mobileImage = await mobileCanvas.screenshot();
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  canvas: await mobileCanvas.boundingBox(),
  nonblank: mobileImage.length > 1000,
};
await page.screenshot({
  path: path.join(evidence, "0586-mobile.png"),
  fullPage: true,
});

const near = (value, expected, tolerance = 0.02) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial["top-radius"] === "2" &&
  checks.initial["bottom-radius"] === "5" &&
  checks.initial.height === "4" &&
  checks.initial.slant === "5" &&
  checks.initial["volume-coefficient"] === "52" &&
  checks.initial["curved-coefficient"] === "35" &&
  checks.initial["total-coefficient"] === "64" &&
  near(checks.initial["original-height"], 20 / 3) &&
  near(checks.initial["original-volume-coefficient"], 500 / 9) &&
  checks.initial["net-angle"] === "216" &&
  checks.edited["top-radius"] === "3" &&
  checks.edited["bottom-radius"] === "6" &&
  checks.edited.height === "8" &&
  near(checks.edited.slant, Math.sqrt(73)) &&
  checks.edited["volume-coefficient"] === "168" &&
  near(checks.edited["curved-coefficient"], 9 * Math.sqrt(73)) &&
  near(checks.edited["total-coefficient"], 45 + 9 * Math.sqrt(73)) &&
  checks.removedOff.removed === "false" &&
  checks.folded.net === "false" &&
  checks.layersRestored.removed === "true" &&
  checks.layersRestored.net === "true" &&
  Number(checks.directDrag["top-radius"]) > 3.2 &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.fullscreen.fullscreen === "true" &&
  checks.fullscreenExit.fullscreen === "false" &&
  checks.incorrectChallenge.checked === "true" &&
  checks.incorrectChallenge.correct === "false" &&
  checks.correctChallenge.checked === "true" &&
  checks.correctChallenge.correct === "true" &&
  checks.heroNetToggle.net === "false" &&
  metrics.document.width === 984 &&
  metrics.document.height === 1599 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0586-reference.png"));
await writeFile(
  path.join(evidence, "0586-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0586",
      lessonId: 401,
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
      const sample = document.createElement("canvas");
      const context = sample.getContext("2d");
      sample.width = 160;
      sample.height = 160;
      context.drawImage(image, 0, 0, 160, 160);
      const pixels = context.getImageData(0, 0, 160, 160).data;
      const colors = new Set();
      let colored = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const spread =
          Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) -
          Math.min(pixels[index], pixels[index + 1], pixels[index + 2]);
        if (spread > 12) colored += 1;
        colors.add(
          `${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`,
        );
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
