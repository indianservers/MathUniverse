/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0596-interactive-intermediate-advanced-3d-geometry-and-solids-orthographic-views-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/411-orthographic-views";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 946, height: 1662 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0596");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
const keys = [
    "tool",
    "render",
    "hidden",
    "rays",
    "dimensions",
    "layout",
    "scale",
    "unit",
    "selected",
    "width",
    "height",
    "depth",
    "building",
    "builder-count",
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
const canvas = lesson.locator(".ortho411-stage canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.67, box.y + box.height * 0.35, {
  steps: 10,
});
await page.mouse.up();
await page.waitForTimeout(250);
const after = await canvas.screenshot();
checks.orbitPixelsChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: "Pan", exact: true }).click();
checks.pan = await state();
await lesson.getByRole("button", { name: "Zoom", exact: true }).click();
checks.zoom = await state();
await lesson.getByRole("button", { name: "shaded", exact: true }).click();
checks.shaded = await state();
await lesson.getByLabel("Hidden lines").first().check();
checks.hidden = await state();
await lesson.getByLabel("Projection rays").first().uncheck();
checks.raysOff = await state();
await lesson.getByLabel("Dimensions").first().uncheck();
checks.dimensionsOff = await state();
const selectedBefore = (await state()).selected;
await lesson
  .locator(".ortho411-view-card")
  .first()
  .locator(".projection-cell")
  .first()
  .click();
checks.selection = await state();
checks.selectionChanged = checks.selection.selected !== selectedBefore;
await lesson.getByRole("button", { name: /Third-angle/ }).click();
checks.third = await state();
await lesson.getByLabel("Scale").selectOption("1:2");
checks.scaled = await state();
await lesson.getByLabel("Units").selectOption("cm");
checks.unit = await state();
await lesson
  .getByRole("button", { name: "Start building", exact: true })
  .click();
checks.building = await state();
await lesson.getByLabel("Toggle block 0:0:0").click();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.incorrect = await state();
await lesson
  .getByRole("button", { name: "Rebuild solid", exact: true })
  .click();
checks.rebuilt = await state();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.correct = await state();
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
  hero: await rect(".ortho411-hero"),
  tabs: await rect(".ortho411-tabs"),
  work: await rect(".ortho411-work"),
  how: await rect(".ortho411-how"),
  compare: await rect(".ortho411-compare"),
  example: await rect(".ortho411-example"),
  challenge: await rect(".ortho411-challenge"),
  next: await rect(".ortho411-next"),
};
await page.screenshot({
  path: path.join(evidence, "0596-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0596-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileImage = await lesson.locator(".ortho411-stage canvas").screenshot(),
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
  path: path.join(evidence, "0596-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.tool === "rotate" &&
  checks.initial.render === "edges" &&
  checks.initial.width === "60" &&
  checks.initial.height === "40" &&
  checks.initial.depth === "40" &&
  checks.orbitPixelsChanged &&
  checks.canvas.nonblank &&
  checks.pan.tool === "pan" &&
  checks.zoom.tool === "zoom" &&
  checks.shaded.render === "shaded" &&
  checks.hidden.hidden === "true" &&
  checks.raysOff.rays === "false" &&
  checks.dimensionsOff.dimensions === "false" &&
  checks.selectionChanged &&
  checks.third.layout === "third" &&
  checks.scaled.width === "120" &&
  checks.scaled.height === "80" &&
  checks.unit.width === "12" &&
  checks.unit.height === "8" &&
  checks.building.building === "true" &&
  checks.incorrect.feedback === "incorrect" &&
  checks.rebuilt["builder-count"] === "9" &&
  checks.correct.feedback === "correct" &&
  checks.shared.shared === "true" &&
  checks.reset.layout === "first" &&
  checks.reset.width === "60" &&
  metrics.document.width === 946 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0596-reference.png"));
await writeFile(
  path.join(evidence, "0596-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
