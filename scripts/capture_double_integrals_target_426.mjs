/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0611-interactive-advanced-3d-functions-and-surfaces-double-integrals-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/426-double-integrals",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 975, height: 1612 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (
    ["error", "warning"].includes(m.type()) &&
    !m.text().includes("GPU stall due to ReadPixels")
  )
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0611");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1400);
const keys = [
    "a",
    "b",
    "c",
    "d",
    "surface",
    "nx",
    "ny",
    "volume",
    "area",
    "average",
    "min",
    "max",
    "order",
    "columns",
    "mesh",
    "graded",
    "correct",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() },
  canvas = lesson.locator(".di426-scene canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.27, {
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
for (const [label, value] of [
  ["Bound a", "0"],
  ["Bound b", "2"],
  ["Bound c", "0"],
  ["Bound d", "1"],
])
  await lesson.getByLabel(label).fill(value);
await lesson.getByLabel("Surface function").selectOption("bowl");
await lesson.getByLabel("Nx partition").fill("6");
await lesson.getByLabel("Ny partition").fill("5");
checks.changed = await state();
await lesson.getByText("Show columns", { exact: true }).click();
await lesson.getByText("Show mesh", { exact: true }).click();
checks.layers = await state();
await lesson.getByRole("button", { name: "dx dy", exact: true }).click();
checks.order = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge volume").fill("72");
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge volume").fill("84");
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Hint" }).click();
checks.hintVisible = await lesson
  .getByText(/average corner height is 7/)
  .isVisible();
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
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await rect(".di426-hero"),
    tabs: await rect(".di426-tabs"),
    lab: await rect(".di426-lab"),
    work: await rect(".di426-work"),
    canvas: await rect(".di426-scene"),
    pattern: await rect(".di426-pattern"),
    rule: await rect(".di426-rule"),
    challenge: await rect(".di426-challenge"),
    adjacent: await rect(".di426-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0611-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0611-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobileCanvas = await lesson.locator(".di426-scene canvas").screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    nonblank: mobileCanvas.length > 2000,
  };
await page.screenshot({
  path: path.join(evidence, "0611-mobile.png"),
  fullPage: true,
});
const near = (value, expected, tolerance = 0.005) =>
    Math.abs(Number(value) - expected) <= tolerance,
  passed =
    checks.initial.volume === "21" &&
    checks.initial.area === "6" &&
    checks.initial.average === "3.5" &&
    checks.initial.min === "1" &&
    checks.initial.max === "6" &&
    checks.orbitPixelsChanged &&
    checks.canvas.nonblank &&
    checks.changed.surface === "bowl" &&
    checks.changed.nx === "6" &&
    checks.changed.ny === "5" &&
    near(checks.changed.volume, 10 / 3) &&
    checks.changed.area === "2" &&
    near(checks.changed.average, 5 / 3) &&
    checks.changed.min === "0" &&
    checks.changed.max === "5" &&
    checks.layers.columns === "false" &&
    checks.layers.mesh === "true" &&
    checks.order.order === "dx dy" &&
    checks.formula.includes("active") &&
    checks.wrong.graded === "true" &&
    checks.wrong.correct === "false" &&
    checks.correct.correct === "true" &&
    checks.hintVisible &&
    checks.final.volume === "21" &&
    metrics.document.width === 975 &&
    metrics.document.height === 1612 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth <= 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0611-reference.png"));
await writeFile(
  path.join(evidence, "0611-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
