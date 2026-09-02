/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0598-interactive-advanced-3d-functions-and-surfaces-surface-z-f-x-y-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/413-surface-z-f-x-y";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1027, height: 1531 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0598");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
const keys = [
    "preset",
    "a",
    "b",
    "c",
    "x",
    "y",
    "z",
    "gradient",
    "range",
    "equation",
    "trace-x",
    "trace-y",
    "challenge",
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
const canvas = lesson.locator(".sf413-stage canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.35, {
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
await lesson.getByRole("button", { name: /Plane/ }).click();
checks.plane = await state();
await lesson.getByRole("button", { name: /Paraboloid/ }).click();
checks.paraboloid = await state();
await lesson.getByRole("button", { name: /Ripple/ }).click();
checks.ripple = await state();
await lesson.getByRole("button", { name: /Saddle/ }).click();
checks.saddle = await state();
await lesson.getByRole("slider", { name: "a (x² coef.)" }).fill("2");
await lesson.getByRole("slider", { name: "b (y² coef.)" }).fill("-2");
await lesson.getByRole("slider", { name: "c (constant)" }).fill("1");
checks.parameters = await state();
await lesson.getByLabel("x maximum").fill("4");
checks.domain = await state();
const contour = lesson.locator(".sf413-contour"),
  cb = await contour.boundingBox();
await page.mouse.click(cb.x + cb.width * 0.72, cb.y + cb.height * 0.35);
checks.contour = await state();
await lesson.getByLabel("y trace value").fill("1.2");
await lesson.getByLabel("x trace value").fill("-1.1");
checks.traces = await state();
await lesson.getByRole("slider", { name: "a (x² coef.)" }).fill("-1");
await lesson.getByRole("slider", { name: "b (y² coef.)" }).fill("1");
checks.incorrect = await state();
await lesson.getByRole("slider", { name: "a (x² coef.)" }).fill("1");
await lesson.getByRole("slider", { name: "b (y² coef.)" }).fill("-1");
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
  hero: await rect(".sf413-hero"),
  tabs: await rect(".sf413-tabs"),
  main: await rect(".sf413-main"),
  domain: await rect(".sf413-domain"),
  plots: await rect(".sf413-plots"),
  analysis: await rect(".sf413-analysis"),
  challenge: await rect(".sf413-challenge"),
  tip: await rect(".sf413-tip"),
};
await page.screenshot({
  path: path.join(evidence, "0598-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0598-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileImage = await lesson.locator(".sf413-stage canvas").screenshot(),
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
  path: path.join(evidence, "0598-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.preset === "saddle" &&
  checks.initial.range === "-9,9" &&
  checks.initial.gradient === "0,0" &&
  checks.orbitPixelsChanged &&
  checks.canvas.nonblank &&
  checks.plane.preset === "plane" &&
  checks.paraboloid.preset === "paraboloid" &&
  checks.ripple.preset === "ripple" &&
  checks.saddle.preset === "saddle" &&
  checks.parameters.a === "2" &&
  checks.parameters.b === "-2" &&
  checks.parameters.c === "1" &&
  checks.parameters.range === "-17,19" &&
  checks.domain.range !== checks.parameters.range &&
  checks.contour.x !== "0" &&
  checks.contour.gradient !== "0,0" &&
  checks.traces["trace-y"] === "1.2" &&
  checks.traces["trace-x"] === "-1.1" &&
  checks.incorrect.challenge === "incorrect" &&
  checks.correct.challenge === "correct" &&
  checks.shared.shared === "true" &&
  checks.reset.preset === "saddle" &&
  checks.reset.range === "-9,9" &&
  metrics.document.width === 1027 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth === 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0598-reference.png"));
await writeFile(
  path.join(evidence, "0598-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
