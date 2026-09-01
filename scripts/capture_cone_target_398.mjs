/* global document, Image, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0583-interactive-intermediate-advanced-3d-geometry-and-solids-cone-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/398-cone";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0583");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1600);

const keys = [
  "radius",
  "height",
  "slant",
  "volume-coefficient",
  "cylinder-coefficient",
  "curved-coefficient",
  "total-coefficient",
  "sector-angle",
  "tab",
  "shared",
  "steps",
  "complete",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attrs) =>
      Object.fromEntries(
        attrs.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByLabel("Radius value", { exact: true }).fill("6");
await lesson.getByLabel("Height value", { exact: true }).fill("8");
checks.scaled345 = await state();
await lesson.getByLabel("Radius value", { exact: true }).fill("5");
await lesson.getByLabel("Height value", { exact: true }).fill("12");
checks.fiveTwelve = await state();

const canvas = lesson.getByTestId("geometry3d-cone-canvas").locator("canvas");
const box = await canvas.boundingBox();
const beforeOrbit = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.43, box.y + box.height * 0.48);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.64, box.y + box.height * 0.35, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(350);
const afterOrbit = await canvas.screenshot();
checks.orbitChanged = !beforeOrbit.equals(afterOrbit);
checks.canvasPixels = await pixelStats(page, afterOrbit);
await lesson.getByLabel("Reset cone camera").click();

await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await lesson.getByRole("button", { name: /Share|Shared/ }).click();
checks.shared = await state();
await lesson.getByRole("button", { name: "↻ Reset", exact: true }).click();
checks.localReset = await state();
for (let index = 1; index <= 4; index++)
  await lesson.getByLabel(`Challenge step ${index}`).check();
checks.challengeComplete = await state();
await lesson.getByLabel("Radius value", { exact: true }).fill("4");
checks.challengeInvalidated = await state();

await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="geometry3d-mockup-0583"]')
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
  hero: await rect(".cone398-hero"),
  tabs: await rect(".cone398-tabs"),
  work: await rect(".cone398-work"),
  canvas: await rect(".cone398-canvas"),
  formulas: await rect(".cone398-formulas"),
  bottom: await rect(".cone398-bottom"),
  navigation: await rect(".cone398-nav"),
  footer: await rect(".cone398-footer"),
};
await page.screenshot({
  path: path.join(evidence, "0583-desktop.png"),
  fullPage: true,
});
await canvas.screenshot({ path: path.join(evidence, "0583-canvas.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("geometry3d-mockup-0583").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(1000);
const mobileCanvas = mobile
  .getByTestId("geometry3d-cone-canvas")
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
  path: path.join(evidence, "0583-mobile.png"),
  fullPage: true,
});

const near = (actual, expected) => Math.abs(Number(actual) - expected) < 0.01;
const passed =
  checks.initial.radius === "3" &&
  checks.initial.height === "4" &&
  checks.initial.slant === "5" &&
  checks.initial["volume-coefficient"] === "12" &&
  checks.initial["cylinder-coefficient"] === "36" &&
  checks.initial["curved-coefficient"] === "15" &&
  checks.initial["total-coefficient"] === "24" &&
  checks.initial["sector-angle"] === "216" &&
  checks.scaled345.radius === "6" &&
  checks.scaled345.height === "8" &&
  checks.scaled345.slant === "10" &&
  checks.scaled345["volume-coefficient"] === "96" &&
  checks.scaled345["cylinder-coefficient"] === "288" &&
  checks.scaled345["curved-coefficient"] === "60" &&
  checks.scaled345["total-coefficient"] === "96" &&
  checks.scaled345["sector-angle"] === "216" &&
  checks.fiveTwelve.radius === "5" &&
  checks.fiveTwelve.height === "12" &&
  checks.fiveTwelve.slant === "13" &&
  checks.fiveTwelve["volume-coefficient"] === "100" &&
  checks.fiveTwelve["cylinder-coefficient"] === "300" &&
  checks.fiveTwelve["curved-coefficient"] === "65" &&
  checks.fiveTwelve["total-coefficient"] === "90" &&
  near(checks.fiveTwelve["sector-angle"], 138.462) &&
  checks.orbitChanged &&
  checks.canvasPixels.colored > 500 &&
  checks.canvasPixels.unique > 100 &&
  checks.tabbed.tab === "Formulas" &&
  checks.shared.shared === "true" &&
  checks.localReset.radius === "3" &&
  checks.localReset.height === "4" &&
  checks.challengeComplete.steps === "[true,true,true,true]" &&
  checks.challengeComplete.complete === "true" &&
  checks.challengeInvalidated.complete === "false" &&
  checks.reset.radius === "3" &&
  checks.reset.height === "4" &&
  checks.reset.steps === "[false,false,false,false]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0583-reference.png"));
await writeFile(
  path.join(evidence, "0583-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0583",
      lessonId: 398,
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
      for (let index = 0; index < pixels.length; index += 4) {
        const spread =
          Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) -
          Math.min(pixels[index], pixels[index + 1], pixels[index + 2]);
        if (spread > 12) colored++;
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
