/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0609-interactive-advanced-3d-functions-and-surfaces-tangent-plane-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/424-tangent-plane";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 956, height: 1645 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0609");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1300);

const keys = [
  "a",
  "b",
  "z",
  "fx",
  "fy",
  "error",
  "zoomed",
  "graded",
  "correct",
  "solution",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
    keys,
  );
const checks = { initial: await state() };
const canvas = lesson.locator(".tp424-canvas canvas");
const box = await canvas.boundingBox();
const before = await canvas.screenshot();

await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.45);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.32, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(200);
const after = await canvas.screenshot();
checks.orbitPixelsChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};

await lesson.getByRole("button", { name: /Reset view/ }).click();
await page.waitForTimeout(300);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.53, box.y + box.height * 0.49);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.64, box.y + box.height * 0.56, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(200);
checks.pointDrag = { before: dragBefore, after: await state() };

const setRange = (label, value) =>
  lesson.getByLabel(label).evaluate((input, next) => {
    const element = input;
    element.value = next;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
await setRange("a coordinate", "1");
await setRange("b coordinate", "0");
checks.changed = await state();
const fullError = Number(checks.changed.error);
await lesson.getByRole("button", { name: /Zoom to neighborhood/ }).click();
checks.zoomed = await state();
checks.errorShrank = Number(checks.zoomed.error) < fullError;
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");

for (const [key, value] of [
  ["c", "0"],
  ["fx", "0"],
  ["a", "1"],
  ["fy", "0"],
  ["b", "0"],
])
  await lesson.getByLabel(`Challenge ${key}`).fill(value);
await lesson.getByRole("button", { name: /Check Answer/ }).click();
checks.wrong = await state();

for (const [key, value] of [
  ["c", "1"],
  ["fx", "0"],
  ["a", "1"],
  ["fy", "1"],
  ["b", "0"],
])
  await lesson.getByLabel(`Challenge ${key}`).fill(value);
await lesson.getByRole("button", { name: /Check Answer/ }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show Hint/ }).click();
checks.hintVisible = await lesson
  .getByText(/Compute f, fₓ, fᵧ first/)
  .isVisible();
await lesson.getByRole("button", { name: /Show Solution/ }).click();
checks.solutionVisible = await lesson.getByText(/so z=1\+y/).isVisible();

await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(650);
checks.final = await state();
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
  hero: await rect(".tp424-hero"),
  tabs: await rect(".tp424-tabs"),
  lab: await rect(".tp424-lab"),
  canvas: await rect(".tp424-canvas"),
  worked: await rect(".tp424-worked"),
  info: await rect(".tp424-info"),
  challenge: await rect(".tp424-challenge"),
  adjacent: await rect(".tp424-adjacent"),
};

await page.screenshot({
  path: path.join(evidence, "0609-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0609-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobileCanvas = await lesson.locator(".tp424-canvas canvas").screenshot();
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  nonblank: mobileCanvas.length > 2000,
};
await page.screenshot({
  path: path.join(evidence, "0609-mobile.png"),
  fullPage: true,
});

const near = (value, expected, tolerance = 0.004) =>
  Math.abs(Number(value) - expected) <= tolerance;
const pointMoved =
  checks.pointDrag.before.a !== checks.pointDrag.after.a ||
  checks.pointDrag.before.b !== checks.pointDrag.after.b;
const passed =
  checks.initial.a === "0.6" &&
  checks.initial.b === "0.3" &&
  near(checks.initial.z, Math.sin(0.6) * Math.cos(0.3)) &&
  near(checks.initial.fx, Math.cos(0.6) * Math.cos(0.3)) &&
  near(checks.initial.fy, -Math.sin(0.6) * Math.sin(0.3)) &&
  checks.orbitPixelsChanged &&
  pointMoved &&
  checks.canvas.nonblank &&
  near(checks.changed.a, 1) &&
  near(checks.changed.b, 0) &&
  near(checks.changed.z, Math.sin(1)) &&
  near(checks.changed.fx, Math.cos(1)) &&
  near(checks.changed.fy, 0) &&
  checks.zoomed.zoomed === "true" &&
  checks.errorShrank &&
  checks.formula.includes("active") &&
  checks.wrong.graded === "true" &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.hintVisible &&
  checks.solutionVisible &&
  checks.final.a === "0.6" &&
  metrics.document.width === 956 &&
  metrics.document.height === 1645 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;

await copyFile(reference, path.join(evidence, "0609-reference.png"));
await writeFile(
  path.join(evidence, "0609-validation.json"),
  `${JSON.stringify(
    { passed, url, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  )}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
