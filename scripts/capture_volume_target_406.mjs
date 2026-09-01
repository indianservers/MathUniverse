/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0591-interactive-intermediate-advanced-3d-geometry-and-solids-volume-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/406-volume";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 957, height: 1644 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0591");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);

const keys = [
  "solid",
  "base-area",
  "height",
  "a",
  "b",
  "layers",
  "slice",
  "show-slice",
  "auto",
  "playing",
  "prism-volume",
  "pyramid-volume",
  "sphere-volume",
  "selected-volume",
  "converted",
  "challenge-volume",
  "checked",
  "correct",
  "shared",
  "actions",
];
const state = () =>
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

await lesson.getByRole("button", { name: /^Cylinder\. Drag/ }).click();
checks.cylinder = await state();
await lesson.getByRole("button", { name: /^Square Pyramid\. Drag/ }).click();
checks.pyramid = await state();
await lesson.getByRole("button", { name: /^Sphere\. Drag/ }).click();
checks.sphere = await state();
await lesson.getByRole("button", { name: /^Rectangular Prism\. Drag/ }).click();
await lesson.getByRole("slider", { name: "Layers", exact: true }).fill("4");
await lesson.getByLabel("Auto layers").uncheck();
await lesson.getByRole("button", { name: "Animation" }).click();
checks.animationStart = await state();
await page.waitForTimeout(1150);
checks.animationStop = await state();
await lesson.getByLabel("Slice height").fill("4");
await lesson.getByLabel("Show cross-section").uncheck();
checks.sliceOff = await state();
await lesson
  .getByRole("spinbutton", { name: "Base area, B (u²)", exact: true })
  .fill("20");
await lesson
  .getByRole("spinbutton", { name: "Height, h (u)", exact: true })
  .fill("6");
checks.dimensions = await state();
await lesson.getByLabel("Convert to").selectOption("L");
checks.conversion = await state();
await lesson
  .getByRole("spinbutton", { name: "Base area, B challenge", exact: true })
  .fill("20");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeWrong = await state();
await lesson
  .getByRole("spinbutton", { name: "Base area, B challenge", exact: true })
  .fill("24");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeCorrect = await state();

const canvas = lesson
  .getByTestId("geometry3d-volume-prism-canvas")
  .locator("canvas");
const box = await canvas.boundingBox();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.35, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(300);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: /Share/ }).click();
checks.shared = await state();

await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const value = await lesson.locator(selector).boundingBox();
  return value
    ? {
        top: Math.round(value.y),
        left: Math.round(value.x),
        width: Math.round(value.width),
        height: Math.round(value.height),
        bottom: Math.round(value.y + value.height),
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
  hero: await rect(".vol406-hero"),
  top: await rect(".vol406-top"),
  compare: await rect(".vol406-compare"),
  tools: await rect(".vol406-tools"),
  challenge: await rect(".vol406-challenge"),
  next: await rect(".vol406-next"),
};
await page.screenshot({ path: path.join(evidence, "0591-desktop.png") });
await lesson
  .getByTestId("geometry3d-volume-prism-canvas")
  .locator("canvas")
  .screenshot({ path: path.join(evidence, "0591-canvas.png") });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1000);
const mobileCanvas = lesson
  .getByTestId("geometry3d-volume-prism-canvas")
  .locator("canvas");
const mobileImage = await mobileCanvas.screenshot();
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  nonblank: mobileImage.length > 2000,
};
await page.screenshot({
  path: path.join(evidence, "0591-mobile.png"),
  fullPage: true,
});

const near = (value, expected, tolerance = 0.05) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  checks.initial.solid === "prism" &&
  checks.initial["base-area"] === "12" &&
  checks.initial.height === "5" &&
  checks.initial.layers === "10" &&
  checks.initial.slice === "2.5" &&
  checks.initial["show-slice"] === "true" &&
  near(checks.initial["prism-volume"], 60) &&
  near(checks.initial["pyramid-volume"], 20) &&
  near(checks.initial["sphere-volume"], 16 * Math.PI) &&
  checks.cylinder.solid === "cylinder" &&
  near(checks.cylinder["selected-volume"], 60) &&
  checks.pyramid.solid === "pyramid" &&
  near(checks.pyramid["selected-volume"], 20) &&
  checks.sphere.solid === "sphere" &&
  near(checks.sphere["selected-volume"], 16 * Math.PI) &&
  checks.animationStart.playing === "true" &&
  checks.animationStop.playing === "false" &&
  checks.animationStop.layers === "10" &&
  checks.sliceOff.slice === "4" &&
  checks.sliceOff["show-slice"] === "false" &&
  checks.dimensions["base-area"] === "20" &&
  checks.dimensions.height === "6" &&
  checks.dimensions["selected-volume"] === "120" &&
  checks.conversion.converted === "120000" &&
  checks.challengeWrong.correct === "false" &&
  checks.challengeCorrect.correct === "true" &&
  checks.orbitChanged &&
  checks.canvas.nonblank &&
  checks.shared.shared === "true" &&
  metrics.document.width === 957 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0591-reference.png"));
await writeFile(
  path.join(evidence, "0591-validation.json"),
  `${JSON.stringify(
    { passed, url, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  )}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
