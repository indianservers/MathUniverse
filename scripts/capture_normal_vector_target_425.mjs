/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0610-interactive-advanced-3d-functions-and-surfaces-normal-vector-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/3d-mathematics/425-normal-vector";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 959, height: 1640 } });
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
const lesson = page.getByTestId("geometry3d-mockup-0610");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1300);
const keys = [
  "px",
  "py",
  "pz",
  "ux",
  "uy",
  "uz",
  "vx",
  "vy",
  "vz",
  "nx",
  "ny",
  "nz",
  "du",
  "dv",
  "graded",
  "correct",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
    keys,
  );
const checks = { initial: await state() };
const canvas = lesson.locator(".nv425-canvas canvas");
const box = await canvas.boundingBox();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.4);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.28, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(180);
const after = await canvas.screenshot();
checks.orbitPixelsChanged = !before.equals(after);
checks.canvas = {
  width: Math.round(box.width),
  height: Math.round(box.height),
  nonblank: after.length > 2000,
};
await lesson.getByRole("button", { name: "Reset view" }).click();
await page.waitForTimeout(250);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.64, box.y + box.height * 0.58, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(180);
checks.pointDrag = { before: dragBefore, after: await state() };

for (const [label, value] of [
  ["Point P x", "-1"],
  ["Point P y", "1.5"],
  ["Point P z", "2"],
  ["Vector u x", "1"],
  ["Vector u y", "0"],
  ["Vector u z", "0"],
  ["Vector v x", "0"],
  ["Vector v y", "1"],
  ["Vector v z", "0"],
])
  await lesson.getByLabel(label).fill(value);
checks.changed = await state();
await lesson.getByRole("button", { name: "Recompute" }).click();
checks.recomputed = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
for (const [key, value] of [
  ["x", "1"],
  ["y", "1"],
  ["z", "1"],
])
  await lesson.getByLabel(`Challenge ${key}`).fill(value);
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
for (const [key, value] of [
  ["x", "2"],
  ["y", "-2"],
  ["z", "4"],
])
  await lesson.getByLabel(`Challenge ${key}`).fill(value);
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
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
  hero: await rect(".nv425-hero"),
  tabs: await rect(".nv425-tabs"),
  lab: await rect(".nv425-lab"),
  canvas: await rect(".nv425-canvas"),
  checks: await rect(".nv425-checks"),
  middle: await rect(".nv425-middle"),
  bottom: await rect(".nv425-bottom"),
  adjacent: await rect(".nv425-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0610-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0610-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobileCanvas = await lesson.locator(".nv425-canvas canvas").screenshot();
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
  path: path.join(evidence, "0610-mobile.png"),
  fullPage: true,
});
const pointMoved =
  checks.pointDrag.before.px !== checks.pointDrag.after.px ||
  checks.pointDrag.before.pz !== checks.pointDrag.after.pz;
const passed =
  checks.initial.nx === "5" &&
  checks.initial.ny === "0" &&
  checks.initial.nz === "-5" &&
  checks.initial.du === "0" &&
  checks.initial.dv === "0" &&
  checks.orbitPixelsChanged &&
  pointMoved &&
  checks.canvas.nonblank &&
  checks.changed.px === "-1" &&
  checks.changed.py === "1.5" &&
  checks.changed.pz === "2" &&
  checks.changed.nx === "0" &&
  checks.changed.ny === "0" &&
  checks.changed.nz === "1" &&
  checks.changed.du === "0" &&
  checks.changed.dv === "0" &&
  Number(checks.recomputed.actions) > Number(checks.changed.actions) &&
  checks.formula.includes("active") &&
  checks.wrong.graded === "true" &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.final.nx === "5" &&
  metrics.document.width === 959 &&
  metrics.document.height === 1640 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  mobileMetrics.nonblank &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0610-reference.png"));
await writeFile(
  path.join(evidence, "0610-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
