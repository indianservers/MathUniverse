/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0604-interactive-advanced-3d-functions-and-surfaces-spherical-coordinates-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/419-spherical-coordinates";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1178, height: 1335 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0604");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1200);
const keys = [
    "rho",
    "theta",
    "phi",
    "x",
    "y",
    "z",
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
  canvas = lesson.locator(".sc419-canvas canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.52);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.35, {
  steps: 10,
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
await page.waitForTimeout(250);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.53, box.y + box.height * 0.46);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.4, {
  steps: 12,
});
await page.mouse.up();
await page.waitForTimeout(150);
checks.pointDrag = { before: dragBefore, after: await state() };
await lesson.getByRole("slider", { name: "rho" }).fill("4");
await lesson.getByRole("slider", { name: "theta" }).fill("30");
await lesson.getByRole("slider", { name: "phi" }).fill("60");
checks.adjusted = await state();
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.formula = await lesson
  .getByRole("button", { name: /Formula/ })
  .getAttribute("class");
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hintVisible = await lesson.getByText(/Expected signs/).isVisible();
for (const [key, value] of [
  ["x", "0"],
  ["y", "0"],
  ["z", "0"],
])
  await lesson.getByLabel(`Challenge ${key}`).fill(value);
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
for (const [key, value] of [
  ["x", String((-5 * Math.sqrt(6)) / 4)],
  ["y", String((-5 * Math.sqrt(2)) / 4)],
  ["z", String((5 * Math.sqrt(2)) / 2)],
])
  await lesson.getByLabel(`Challenge ${key}`).fill(value);
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(650);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
    const r = await lesson.locator(s).boundingBox();
    return r
      ? {
          top: Math.round(r.y),
          left: Math.round(r.x),
          width: Math.round(r.width),
          height: Math.round(r.height),
          bottom: Math.round(r.y + r.height),
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
    hero: await rect(".sc419-hero"),
    tabs: await rect(".sc419-tabs"),
    lab: await rect(".sc419-lab"),
    canvas: await rect(".sc419-canvas"),
    guides: await rect(".sc419-guides"),
    rule: await rect(".sc419-rule"),
    challenge: await rect(".sc419-challenge"),
    adjacent: await rect(".sc419-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0604-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0604-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobile = await lesson.locator(".sc419-canvas canvas").screenshot(),
  mobileMetrics = {
    documentWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    nonblank: mobile.length > 2000,
  };
await page.screenshot({
  path: path.join(evidence, "0604-mobile.png"),
  fullPage: true,
});
const near = (v, n, t = 0.03) => Math.abs(Number(v) - n) <= t,
  passed =
    near(checks.initial.rho, 3) &&
    near(checks.initial.theta, 45) &&
    near(checks.initial.phi, 60) &&
    near(checks.initial.x, 1.84) &&
    near(checks.initial.y, 1.84) &&
    near(checks.initial.z, 1.5) &&
    checks.orbitPixelsChanged &&
    checks.canvas.nonblank &&
    (checks.pointDrag.before.theta !== checks.pointDrag.after.theta ||
      checks.pointDrag.before.phi !== checks.pointDrag.after.phi) &&
    near(checks.adjusted.x, 3) &&
    near(checks.adjusted.y, 1.73) &&
    near(checks.adjusted.z, 2) &&
    checks.formula.includes("active") &&
    checks.hintVisible &&
    checks.wrong.correct === "false" &&
    checks.correct.correct === "true" &&
    near(checks.final.rho, 3) &&
    metrics.document.width === 1178 &&
    metrics.document.height === 1335 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth <= 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0604-reference.png"));
await writeFile(
  path.join(evidence, "0604-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
