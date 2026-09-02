/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0597-interactive-intermediate-advanced-3d-geometry-and-solids-ar-placement-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/412-ar-placement";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 862, height: 1825 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0597");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
const keys = [
    "placed",
    "tool",
    "position",
    "rotation",
    "scale",
    "locked",
    "occlusion",
    "grid",
    "target",
    "feedback",
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
await lesson.getByRole("button", { name: "Tap to place", exact: true }).click();
checks.placed = await state();
const canvas = lesson.locator(".ar412-room canvas"),
  canvasBox = await canvas.boundingBox(),
  placedImage = await canvas.screenshot();
checks.canvas = {
  width: Math.round(canvasBox.width),
  height: Math.round(canvasBox.height),
  nonblank: placedImage.length > 2000,
};
await lesson.locator(".ar412-tools > button").nth(3).click();
await lesson.locator(".ar412-tools > button").nth(0).click();
const drag = lesson.getByLabel("Drag placed object"),
  box = await drag.boundingBox();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.55);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.48, {
  steps: 8,
});
await page.mouse.up();
checks.moved = await state();
await lesson.locator(".ar412-tools > button").nth(1).click();
await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5, {
  steps: 8,
});
await page.mouse.up();
checks.rotated = await state();
await lesson.locator(".ar412-tools > button").nth(2).click();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.4, {
  steps: 8,
});
await page.mouse.up();
checks.scaled = await state();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.incorrect = await state();
await lesson.locator(".ar412-tools > button").nth(3).click();
checks.relocked = await state();
await lesson.getByLabel("Occlusion").uncheck();
checks.occlusionOff = await state();
await lesson.getByRole("button", { name: "Toggle detected grid" }).click();
checks.gridOff = await state();
await lesson.getByRole("button", { name: "Center object" }).click();
checks.centered = await state();
await lesson
  .getByRole("button", { name: "Reset", exact: true })
  .first()
  .click();
await lesson.getByRole("button", { name: "Tap to place", exact: true }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Try another", exact: true }).click();
checks.another = await state();
await lesson.getByRole("button", { name: /Share|Shared/ }).click();
checks.shared = await state();
await lesson
  .getByRole("button", { name: "Reset", exact: true })
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
  hero: await rect(".ar412-hero"),
  tabs: await rect(".ar412-tabs"),
  simulator: await rect(".ar412-simulator"),
  tools: await rect(".ar412-tools"),
  status: await rect(".ar412-status"),
  challenge: await rect(".ar412-challenge"),
  notes: await rect(".ar412-notes"),
  tags: await rect(".ar412-tags"),
  next: await rect(".ar412-next"),
};
await page.screenshot({
  path: path.join(evidence, "0597-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0597-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileImage = await lesson.locator(".ar412-room canvas").screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    nonblank: mobileImage.length > 1000,
  };
await page.screenshot({
  path: path.join(evidence, "0597-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.placed === "true" &&
  checks.initial.scale === "1" &&
  checks.initial.locked === "true" &&
  checks.placed.placed === "true" &&
  checks.canvas.nonblank &&
  checks.moved.position !== "0,0" &&
  Number(checks.rotated.rotation) !== 0 &&
  Number(checks.scaled.scale) > 1 &&
  checks.incorrect.feedback === "incorrect" &&
  checks.relocked.locked === "true" &&
  checks.occlusionOff.occlusion === "false" &&
  checks.gridOff.grid === "false" &&
  checks.centered.position === "0,0" &&
  checks.correct.feedback === "correct" &&
  checks.another.target === "0.5" &&
  checks.another.feedback === "idle" &&
  checks.shared.shared === "true" &&
  checks.reset.placed === "true" &&
  checks.reset.scale === "1" &&
  metrics.document.width === 862 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0597-reference.png"));
await writeFile(
  path.join(evidence, "0597-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
