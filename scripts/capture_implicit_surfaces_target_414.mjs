/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0599-interactive-advanced-3d-functions-and-surfaces-implicit-surfaces-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2256/lessons/3d-mathematics/414-implicit-surfaces";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()) && !message.text().includes("GPU stall due to ReadPixels"))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry3d-mockup-0599");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1500);
const keys = ["preset", "iso", "f-value", "difference", "classification", "challenge", "actions"];
const state = () => lesson.evaluate((node, names) => Object.fromEntries(names.map((name) => [name, node.dataset[name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]])), keys);
const checks = { initial: await state() };
const canvas = lesson.locator(".is414-stage canvas");
const box = await canvas.boundingBox();
const before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.35, { steps: 10 });
await page.mouse.up();
await page.waitForTimeout(250);
const after = await canvas.screenshot();
checks.orbitPixelsChanged = !before.equals(after);
checks.canvas = { width: Math.round(box.width), height: Math.round(box.height), nonblank: after.length > 2000 };
for (const [label, key] of [["Ellipsoid", "ellipsoid"], ["Hyperboloid 1 sheet", "hyperboloid"], ["Torus", "torus"], ["Gyroid", "gyroid"], ["Sphere", "sphere"]]) {
  await lesson.getByRole("button", { name: label, exact: true }).click();
  checks[key] = await state();
}
await lesson.getByLabel("Iso-value c value", { exact: true }).fill("4");
checks.iso = await state();
await lesson.getByLabel("k (z) value", { exact: true }).fill("1.5");
await lesson.getByLabel("XZ plane", { exact: true }).uncheck();
checks.slices = { state: await state(), z: await lesson.getByLabel("k (z) value", { exact: true }).inputValue(), xz: await lesson.getByLabel("XZ plane", { exact: true }).isChecked() };
await lesson.getByLabel("xMax", { exact: true }).fill("7");
await lesson.getByLabel("Clipping box", { exact: true }).uncheck();
checks.domain = { xMax: await lesson.getByLabel("xMax", { exact: true }).inputValue(), clipping: await lesson.getByLabel("Clipping box", { exact: true }).isChecked() };
await lesson.getByRole("button", { name: "Try it", exact: true }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await page.waitForTimeout(450);
checks.reset = await state();
const rect = async (selector) => {
  const value = await lesson.locator(selector).boundingBox();
  return value ? { top: Math.round(value.y), left: Math.round(value.x), width: Math.round(value.width), height: Math.round(value.height), bottom: Math.round(value.y + value.height) } : null;
};
await page.evaluate(() => scrollTo(0, 0));
const metrics = {
  document: await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })),
  overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  hero: await rect(".is414-hero"), tabs: await rect(".is414-tabs"), main: await rect(".is414-main"),
  aside: await rect(".is414-main > aside"), view: await rect(".is414-view"), slices: await rect(".is414-slices"),
  bottom: await rect(".is414-bottom"), adjacent: await rect(".is414-adjacent"), footer: await rect(".is414-footer"),
};
await page.screenshot({ path: path.join(evidence, "0599-desktop.png"), fullPage: false });
await canvas.screenshot({ path: path.join(evidence, "0599-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(700);
const mobileCanvas = await lesson.locator(".is414-stage canvas").screenshot();
const mobileMetrics = { documentWidth: await page.evaluate(() => document.documentElement.scrollWidth), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), nonblank: mobileCanvas.length > 2000 };
await page.screenshot({ path: path.join(evidence, "0599-mobile.png"), fullPage: true });
const passed = checks.initial.preset === "sphere" && checks.initial.iso === "9" && checks.initial.classification === "outside" &&
  checks.orbitPixelsChanged && checks.canvas.nonblank && checks.ellipsoid.preset === "ellipsoid" && checks.hyperboloid.preset === "hyperboloid" &&
  checks.torus.preset === "torus" && checks.gyroid.preset === "gyroid" && checks.sphere.preset === "sphere" && checks.iso.iso === "4" &&
  checks.slices.z === "1.5" && !checks.slices.xz && checks.domain.xMax === "7" && !checks.domain.clipping &&
  checks.challenge.challenge === "true" && checks.reset.preset === "sphere" && checks.reset.iso === "9" && checks.reset.actions === "0" &&
  metrics.document.width === 1024 && metrics.document.height === 1536 && !metrics.overflow && mobileMetrics.documentWidth <= 390 && !mobileMetrics.overflow && mobileMetrics.nonblank && consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0599-reference.png"));
await writeFile(path.join(evidence, "0599-validation.json"), `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`);
await browser.close();
if (!passed) process.exitCode = 1;
