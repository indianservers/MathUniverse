/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0589-interactive-intermediate-advanced-3d-geometry-and-solids-nets-of-solids-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/404-nets-of-solids";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 987, height: 1593 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (
    ["error", "warning"].includes(message.type()) &&
    !message.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0589");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1200);
const keys = [
  "solid",
  "fold",
  "gallery",
  "tabs",
  "valid",
  "face-count",
  "surface-area",
  "selected",
  "checked",
  "correct",
  "playing",
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

const face = lesson.getByRole("button", { name: "Drag face 1" }),
  faceBox = await face.boundingBox();
await page.mouse.move(
  faceBox.x + faceBox.width / 2,
  faceBox.y + faceBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  faceBox.x + faceBox.width / 2 + 36,
  faceBox.y + faceBox.height / 2 + 12,
  { steps: 5 },
);
await page.mouse.up();
checks.dragInvalid = await state();
await lesson.locator(".net404-picker button").nth(0).click();
checks.reconnected = await state();
await lesson.getByLabel("Edge tabs").uncheck();
checks.tabsOff = await state();
await lesson.getByLabel("Fold net").fill("0");
checks.unfolded = await state();
await lesson.getByRole("button", { name: "Animate", exact: true }).click();
checks.animationStart = await state();
await page.waitForTimeout(500);
checks.animationAdvanced = await state();
await lesson.locator(".net404-picker button").nth(1).click();
checks.prism = await state();
await lesson.locator(".net404-picker button").nth(2).click();
checks.pyramid = await state();
await lesson.getByLabel("Load cube net 3").click();
checks.gallery = await state();

await lesson.locator(".net404-challenge > div > button").nth(3).click();
await lesson.locator(".net404-challenge > div > button").nth(5).click();
await lesson
  .getByRole("button", { name: "Check answers", exact: true })
  .click();
checks.challenge = await state();

const canvas = lesson.getByTestId("geometry3d-nets-canvas").locator("canvas"),
  canvasBox = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.45,
  canvasBox.y + canvasBox.height * 0.48,
);
await page.mouse.down();
await page.mouse.move(
  canvasBox.x + canvasBox.width * 0.62,
  canvasBox.y + canvasBox.height * 0.38,
  { steps: 8 },
);
await page.mouse.up();
await page.waitForTimeout(250);
const after = await canvas.screenshot();
checks.orbitChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(canvasBox.width),
  height: Math.round(canvasBox.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: /Share/ }).click();
checks.shared = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(900);
await page.evaluate(() => scrollTo(0, 0));
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
  hero: await rect(".net404-hero"),
  picker: await rect(".net404-picker"),
  builder: await rect(".net404-builder"),
  net: await rect(".net404-net"),
  scene: await rect(".net404-scene"),
  middle: await rect(".net404-middle"),
  challenge: await rect(".net404-challenge"),
  navigation: await rect(".net404-next"),
};
await page.screenshot({
  path: path.join(evidence, "0589-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0589-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = lesson
    .getByTestId("geometry3d-nets-canvas")
    .locator("canvas"),
  mobileImage = await mobileCanvas.screenshot();
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  canvas: await mobileCanvas.boundingBox(),
  nonblank: mobileImage.length > 2000,
};
await page.screenshot({
  path: path.join(evidence, "0589-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.solid === "cube" &&
  checks.initial.fold === "100" &&
  checks.initial.valid === "true" &&
  checks.initial["face-count"] === "6" &&
  checks.initial["surface-area"] === "6" &&
  checks.dragInvalid.valid === "false" &&
  checks.reconnected.valid === "true" &&
  checks.tabsOff.tabs === "false" &&
  checks.unfolded.fold === "0" &&
  checks.animationStart.playing === "true" &&
  Number(checks.animationAdvanced.fold) > 0 &&
  checks.prism.solid === "prism" &&
  checks.prism["face-count"] === "5" &&
  checks.pyramid.solid === "pyramid" &&
  checks.gallery.solid === "cube" &&
  checks.gallery.gallery === "2" &&
  checks.challenge.selected.split(",").sort().join(",") === "A,C,D,F" &&
  checks.challenge.correct === "true" &&
  checks.orbitChanged &&
  checks.canvas.nonblank &&
  checks.shared.shared === "true" &&
  metrics.document.width === 987 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0589-reference.png"));
await writeFile(
  path.join(evidence, "0589-dedicated-target-validation.json"),
  JSON.stringify(
    {
      mockup: "0589",
      lessonId: 404,
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
