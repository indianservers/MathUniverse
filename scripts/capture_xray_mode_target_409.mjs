/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0594-interactive-intermediate-advanced-3d-geometry-and-solids-transparent-x-ray-mode-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/409-transparent-x-ray-mode";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 890, height: 1767 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0594");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
const keys = [
    "opacity",
    "layers",
    "hidden",
    "tab",
    "challenge-mode",
    "solution",
    "length",
    "space-diagonal",
    "body-diagonal",
    "face-diagonal",
    "cylinder-height",
    "sphere-diameter",
    "cross-area",
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
const xray = lesson
    .getByTestId("geometry3d-xray-xray-canvas")
    .locator("canvas"),
  beforeOpacity = await xray.screenshot();
await lesson.getByRole("slider", { name: "Opacity" }).fill("35");
await page.waitForTimeout(300);
const afterOpacity = await xray.screenshot();
checks.opacity = await state();
checks.opacityPixelsChanged = !beforeOpacity.equals(afterOpacity);
await lesson.getByLabel("Inscribed sphere").uncheck();
checks.layerOff = await state();
const afterLayer = await xray.screenshot();
checks.layerPixelsChanged = !afterOpacity.equals(afterLayer);
await lesson.getByLabel("Inscribed sphere").check();
await lesson.getByLabel("Faint").check();
checks.faint = await state();
await lesson.getByLabel("Hide").check();
checks.hide = await state();
await lesson.getByLabel("Show").check();
await lesson.getByRole("button", { name: "How it works", exact: true }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Transparent", exact: true }).click();
checks.transparent = await state();
await lesson.getByRole("button", { name: "X-Ray", exact: true }).click();
checks.xray = await state();
await lesson.getByRole("button", { name: "Show length", exact: true }).click();
checks.length = await state();
await lesson
  .getByRole("button", { name: "Check solution", exact: true })
  .click();
checks.solution = await state();
const box = await xray.boundingBox(),
  before = await xray.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.35, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(300);
const after = await xray.screenshot();
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
await page.waitForTimeout(1600);
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
  hero: await rect(".xr409-hero"),
  tabs: await rect(".xr409-tabs"),
  explore: await rect(".xr409-explore"),
  visible: await rect(".xr409-visible"),
  guides: await rect(".xr409-guides"),
  challenge: await rect(".xr409-challenge"),
  measures: await rect(".xr409-measures"),
  next: await rect(".xr409-next"),
};
await page.screenshot({
  path: path.join(evidence, "0594-desktop.png"),
  fullPage: false,
});
await xray.screenshot({ path: path.join(evidence, "0594-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = lesson
    .getByTestId("geometry3d-xray-xray-canvas")
    .locator("canvas"),
  mobileImage = await mobileCanvas.screenshot(),
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
  path: path.join(evidence, "0594-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.opacity === "100" &&
  checks.initial.layers === "7" &&
  checks.initial.hidden === "show" &&
  checks.initial["space-diagonal"] === "11.18" &&
  checks.initial["body-diagonal"] === "7.81" &&
  checks.initial["face-diagonal"] === "9.43" &&
  checks.opacity.opacity === "35" &&
  checks.opacityPixelsChanged &&
  checks.layerOff.layers === "6" &&
  checks.layerPixelsChanged &&
  checks.faint.hidden === "faint" &&
  checks.hide.hidden === "hide" &&
  checks.tab.tab === "How it works" &&
  checks.transparent["challenge-mode"] === "transparent" &&
  checks.xray["challenge-mode"] === "xray" &&
  checks.length.length === "true" &&
  checks.solution.solution === "true" &&
  checks.orbitChanged &&
  checks.canvas.nonblank &&
  checks.shared.shared === "true" &&
  metrics.document.width === 890 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0594-reference.png"));
await writeFile(
  path.join(evidence, "0594-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
