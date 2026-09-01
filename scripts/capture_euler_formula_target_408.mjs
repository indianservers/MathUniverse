/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0593-interactive-intermediate-advanced-3d-geometry-and-solids-euler-s-polyhedron-formula-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/408-euler-s-polyhedron-formula";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1006, height: 1564 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0593");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1800);
const keys = [
    "solid",
    "mode",
    "unfold",
    "vertices",
    "edges",
    "faces",
    "euler",
    "verified",
    "challenge-v",
    "challenge-e",
    "challenge-f",
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
await lesson.getByRole("button", { name: "Reset count" }).click();
checks.cleared = await state();
await lesson.getByRole("button", { name: "vertex", exact: true }).click();
await lesson.getByRole("button", { name: "edge", exact: true }).click();
await lesson.getByRole("button", { name: "face", exact: true }).click();
checks.oneEach = await state();
await lesson.getByRole("button", { name: /cube preview Cube/i }).click();
checks.cube = await state();
await lesson
  .getByRole("button", { name: /tetra preview Tetrahedron/i })
  .click();
checks.tetra = await state();
await lesson.getByRole("button", { name: /octa preview Octahedron/i }).click();
checks.octa = await state();
await lesson
  .getByRole("button", { name: /irregular preview Irregular/i })
  .click();
checks.irregular = await state();
await lesson.getByRole("button", { name: /cube preview Cube/i }).click();
await lesson.getByRole("button", { name: "Unfold", exact: true }).click();
checks.unfold = await state();
await lesson.getByRole("button", { name: "Pan", exact: true }).click();
checks.pan = await state();
await lesson.getByRole("button", { name: "Zoom", exact: true }).click();
checks.zoom = await state();
await lesson.getByRole("button", { name: "Rotate", exact: true }).click();
await lesson.getByRole("spinbutton", { name: "Vertices (V)" }).fill("10");
await lesson.getByRole("spinbutton", { name: "Edges (E)" }).fill("20");
await lesson.getByRole("spinbutton", { name: "Faces (F)" }).fill("12");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeWrong = await state();
await lesson.getByRole("spinbutton", { name: "Vertices (V)" }).fill("12");
await lesson.getByRole("spinbutton", { name: "Edges (E)" }).fill("30");
await lesson.getByRole("spinbutton", { name: "Faces (F)" }).fill("20");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challengeCorrect = await state();
const canvas = lesson.getByTestId("geometry3d-euler-canvas").locator("canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.68, box.y + box.height * 0.34, {
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
  hero: await rect(".eu408-hero"),
  interact: await rect(".eu408-interact"),
  concepts: await rect(".eu408-concepts"),
  reference: await rect(".eu408-reference"),
  challenge: await rect(".eu408-challenge"),
};
await page.screenshot({
  path: path.join(evidence, "0593-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0593-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
const mobileCanvas = lesson
    .getByTestId("geometry3d-euler-canvas")
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
  path: path.join(evidence, "0593-mobile.png"),
  fullPage: true,
});
const same = (s, v, e, f) =>
    s.vertices === String(v) &&
    s.edges === String(e) &&
    s.faces === String(f) &&
    s.euler === "2" &&
    s.verified === "true",
  passed =
    same(checks.initial, 8, 12, 6) &&
    checks.cleared.vertices === "0" &&
    checks.cleared.edges === "0" &&
    checks.cleared.faces === "0" &&
    checks.oneEach.vertices === "1" &&
    checks.oneEach.edges === "1" &&
    checks.oneEach.faces === "1" &&
    same(checks.cube, 8, 12, 6) &&
    same(checks.tetra, 4, 6, 4) &&
    same(checks.octa, 6, 12, 8) &&
    same(checks.irregular, 20, 30, 12) &&
    checks.unfold.unfold === "true" &&
    checks.pan.mode === "pan" &&
    checks.zoom.mode === "zoom" &&
    checks.challengeWrong.correct === "false" &&
    checks.challengeCorrect.correct === "true" &&
    checks.orbitChanged &&
    checks.canvas.nonblank &&
    checks.shared.shared === "true" &&
    metrics.document.width === 1006 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth === 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0593-reference.png"));
await writeFile(
  path.join(evidence, "0593-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
