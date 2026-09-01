/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0592-interactive-intermediate-advanced-3d-geometry-and-solids-surface-area-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/407-surface-area";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 938, height: 1677 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0592");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1500);
const keys = [
    "solid",
    "length",
    "breadth",
    "height",
    "selected-faces",
    "open-top",
    "folded",
    "coverage",
    "total-area",
    "covered-area",
    "layout",
    "waste",
    "checked",
    "correct",
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
await lesson.locator(".sa407-net svg g").first().click();
checks.faceOff = await state();
await lesson.getByRole("button", { name: "Reset net" }).click();
await lesson.getByRole("checkbox", { name: "Open top", exact: true }).check();
checks.openTop = await state();
await lesson.getByRole("checkbox", { name: "Open top", exact: true }).uncheck();
await lesson.getByRole("spinbutton", { name: "Dimension l" }).fill("5");
await lesson.getByRole("spinbutton", { name: "Dimension b" }).fill("4");
await lesson.getByRole("spinbutton", { name: "Dimension h" }).fill("3");
checks.dimensions = await state();
await lesson.getByRole("button", { name: "Cube", exact: true }).click();
checks.cube = await state();
await lesson.getByRole("button", { name: "Cylinder", exact: true }).click();
checks.cylinder = await state();
await lesson.getByRole("button", { name: "Cuboid", exact: true }).click();
await lesson.getByRole("button", { name: "Fold", exact: true }).click();
checks.folded = await state();
await lesson.getByRole("button", { name: "Cover", exact: true }).click();
checks.coverStart = await state();
await page.waitForTimeout(2000);
checks.coverDone = await state();
await lesson.getByLabel("Show dimensions").uncheck();
await lesson.getByLabel("Show face labels").uncheck();
await lesson.getByLabel("Show area on net").uncheck();
checks.options = await state();
await lesson.getByRole("button", { name: /Poor layout/ }).click();
checks.poor = await state();
await lesson.getByRole("button", { name: "Try Challenge" }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeWrong = await state();
await lesson.getByRole("button", { name: "Efficient" }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeCorrect = await state();
await lesson.getByLabel("Rotate solid").uncheck();
const canvas = lesson
    .getByTestId("geometry3d-surface-area-canvas")
    .locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
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
await page.waitForTimeout(1400);
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
  hero: await rect(".sa407-hero"),
  tabs: await rect(".sa407-tabs"),
  picker: await rect(".sa407-picker"),
  lab: await rect(".sa407-lab"),
  cover: await rect(".sa407-cover"),
  context: await rect(".sa407-context"),
  bottom: await rect(".sa407-bottom"),
  next: await rect(".sa407-next"),
};
await page.screenshot({
  path: path.join(evidence, "0592-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0592-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = lesson
    .getByTestId("geometry3d-surface-area-canvas")
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
  path: path.join(evidence, "0592-mobile.png"),
  fullPage: true,
});
const near = (value, expected, tolerance = 0.05) =>
    Math.abs(Number(value) - expected) <= tolerance,
  passed =
    checks.initial.solid === "cuboid" &&
    checks.initial["selected-faces"] === "6" &&
    near(checks.initial["total-area"], 52) &&
    checks.faceOff["selected-faces"] === "5" &&
    near(checks.faceOff["total-area"], 44) &&
    near(checks.openTop["total-area"], 40) &&
    near(checks.dimensions["total-area"], 94) &&
    checks.cube.solid === "cube" &&
    near(checks.cube["total-area"], 150) &&
    checks.cylinder.solid === "cylinder" &&
    checks.folded.folded === "true" &&
    checks.coverStart.coverage === "0" &&
    checks.coverDone.coverage === "100" &&
    checks.poor.waste === "22" &&
    checks.challengeWrong.correct === "false" &&
    checks.challengeCorrect.correct === "true" &&
    checks.orbitChanged &&
    checks.canvas.nonblank &&
    checks.shared.shared === "true" &&
    metrics.document.width === 938 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth === 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0592-reference.png"));
await writeFile(
  path.join(evidence, "0592-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
