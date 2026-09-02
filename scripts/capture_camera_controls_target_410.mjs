/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0595-interactive-intermediate-advanced-3d-geometry-and-solids-camera-controls-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/410-camera-controls";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 960, height: 1639 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0595");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
const keys = [
    "tool",
    "projection",
    "camera",
    "target",
    "azimuth",
    "elevation",
    "distance",
    "fov",
    "guide",
    "coach",
    "checked",
    "score",
    "shared",
    "actions",
  ],
  state = () =>
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
    ),
  checks = { initial: await state() };
const canvas = lesson.locator(".cam410-stage canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.38, box.y + box.height * 0.52);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.34, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(300);
const after = await canvas.screenshot();
checks.orbit = await state();
checks.orbitPixelsChanged = !before.equals(after);
await lesson.getByRole("button", { name: "Pan", exact: true }).click();
const panBefore = (await state()).target;
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.58, {
  steps: 8,
});
await page.mouse.up();
checks.pan = await state();
checks.panTargetChanged = checks.pan.target !== panBefore;
await lesson.getByRole("button", { name: "Zoom", exact: true }).click();
const distanceBefore = Number((await state()).distance);
await canvas.hover();
await page.mouse.wheel(0, -600);
await page.waitForTimeout(250);
checks.zoom = await state();
checks.zoomChanged = Number(checks.zoom.distance) < distanceBefore;
await lesson
  .getByRole("button", { name: "Orthographic", exact: true })
  .first()
  .click();
checks.orthographic = await state();
await lesson.getByRole("button", { name: "Touch", exact: true }).click();
checks.touchCoach = (await state()).coach === "Touch";
await lesson.getByRole("button", { name: "Start", exact: true }).nth(2).click();
checks.guide = await state();
await lesson.getByRole("button", { name: "Apply camera view 4" }).click();
checks.beforeAfter = await state();
await page.keyboard.press("1");
await page.waitForTimeout(150);
checks.topKey = await state();
await page.keyboard.press("p");
await page.waitForTimeout(150);
checks.projectionKey = await state();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(150);
checks.panKey = await state();
await page.keyboard.press("+");
await page.waitForTimeout(150);
checks.zoomKey = await state();
await lesson.getByRole("button", { name: "Check match", exact: true }).click();
checks.challenge = await state();
await lesson
  .getByRole("button", { name: "Try another target", exact: true })
  .click();
checks.newTarget = await state();
await lesson.getByRole("button", { name: /Share|Shared/ }).click();
checks.shared = await state();
await lesson
  .getByRole("button", { name: "Reset view", exact: true })
  .first()
  .click();
checks.reset = await state();
await page.waitForTimeout(500);
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
  hero: await rect(".cam410-hero"),
  tabs: await rect(".cam410-tabs"),
  lab: await rect(".cam410-lab"),
  guided: await rect(".cam410-guided"),
  before: await rect(".cam410-before"),
  reference: await rect(".cam410-reference"),
  challenge: await rect(".cam410-challenge"),
  next: await rect(".cam410-next"),
};
await page.screenshot({
  path: path.join(evidence, "0595-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0595-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileImage = await lesson.locator(".cam410-stage canvas").screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    nonblank: mobileImage.length > 2000,
  };
await page.screenshot({
  path: path.join(evidence, "0595-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.tool === "orbit" &&
  checks.initial.projection === "perspective" &&
  checks.initial.fov === "45" &&
  checks.orbitPixelsChanged &&
  checks.orbit.camera !== checks.initial.camera &&
  checks.pan.tool === "pan" &&
  checks.panTargetChanged &&
  checks.zoom.tool === "zoom" &&
  checks.zoomChanged &&
  checks.orthographic.projection === "orthographic" &&
  checks.touchCoach &&
  checks.guide.guide === "2" &&
  checks.beforeAfter.camera !== checks.guide.camera &&
  checks.topKey.camera.startsWith("0,9,") &&
  checks.projectionKey.projection === "perspective" &&
  checks.panKey.target !== checks.topKey.target &&
  Number(checks.zoomKey.distance) < Number(checks.panKey.distance) &&
  checks.challenge.checked === "true" &&
  Number(checks.challenge.score) >= 0 &&
  checks.newTarget.checked === "false" &&
  checks.shared.shared === "true" &&
  checks.reset.tool === "orbit" &&
  checks.reset.projection === "perspective" &&
  metrics.document.width === 960 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0595-reference.png"));
await writeFile(
  path.join(evidence, "0595-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
