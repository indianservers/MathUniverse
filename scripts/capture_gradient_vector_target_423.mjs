/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0608-interactive-advanced-3d-functions-and-surfaces-gradient-vector-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/3d-mathematics/423-gradient-vector",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 972, height: 1619 } }),
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
const lesson = page.getByTestId("geometry3d-mockup-0608");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(1300);
const keys = [
    "x",
    "y",
    "z",
    "gx",
    "gy",
    "magnitude",
    "ux",
    "uy",
    "dot",
    "tool",
    "opacity",
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
  canvas = lesson.locator(".gv423-canvas canvas"),
  box = await canvas.boundingBox(),
  before = await canvas.screenshot();
await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.31, {
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
await lesson.getByRole("button", { name: "reset tool" }).click();
await page.waitForTimeout(250);
const dragBefore = await state();
await page.mouse.move(box.x + box.width * 0.528, box.y + box.height * 0.7);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.62, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(200);
checks.pointDrag = { before: dragBefore, after: await state() };
await lesson.getByLabel("x coordinate value").fill("2");
await lesson.getByLabel("y coordinate value").fill("-1");
checks.changed = await state();
await lesson.getByRole("slider", { name: "Surface opacity" }).fill("0.45");
checks.opacity = await state();
for (const tool of ["pan", "target", "select"]) {
  await lesson.getByRole("button", { name: `${tool} tool` }).click();
  checks[tool] = await state();
}
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
for (const [k, v] of [
  ["fx", "0"],
  ["fy", "0"],
  ["magnitude", "1"],
  ["ux", "0"],
  ["uy", "0"],
])
  await lesson.getByLabel(`Challenge ${k}`).fill(v);
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
for (const [k, v] of [
  ["fx", "2"],
  ["fy", "2"],
  ["magnitude", String(Math.sqrt(8))],
  ["ux", String(1 / Math.sqrt(2))],
  ["uy", String(1 / Math.sqrt(2))],
])
  await lesson.getByLabel(`Challenge ${k}`).fill(v);
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Need a hint/ }).click();
checks.hintVisible = await lesson.getByText("∇f=(2x,-2y).").isVisible();
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
    hero: await rect(".gv423-hero"),
    tabs: await rect(".gv423-tabs"),
    steps: await rect(".gv423-steps"),
    lab: await rect(".gv423-lab"),
    canvas: await rect(".gv423-canvas"),
    info: await rect(".gv423-info"),
    challenge: await rect(".gv423-challenge"),
    adjacent: await rect(".gv423-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0608-desktop.png"),
  fullPage: false,
});
await canvas.screenshot({ path: path.join(evidence, "0608-canvas.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(650);
const mobile = await lesson.locator(".gv423-canvas canvas").screenshot(),
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
  path: path.join(evidence, "0608-mobile.png"),
  fullPage: true,
});
const near = (v, n, t = 0.004) => Math.abs(Number(v) - n) <= t,
  passed =
    checks.initial.x === "1" &&
    checks.initial.y === "0.5" &&
    checks.initial.z === "0.75" &&
    checks.initial.gx === "1.5" &&
    checks.initial.gy === "0" &&
    checks.initial.magnitude === "1.5" &&
  checks.orbitPixelsChanged &&
  (checks.pointDrag.before.x !== checks.pointDrag.after.x || checks.pointDrag.before.y !== checks.pointDrag.after.y) &&
    checks.canvas.nonblank &&
    checks.changed.x === "2" &&
    checks.changed.y === "-1" &&
    checks.changed.z === "7" &&
    checks.changed.gx === "5" &&
    checks.changed.gy === "-4" &&
    near(checks.changed.magnitude, Math.sqrt(41)) &&
    near(checks.changed.dot, 0) &&
    checks.opacity.opacity === "0.45" &&
    checks.pan.tool === "pan" &&
    checks.target.tool === "target" &&
    checks.select.tool === "select" &&
    checks.formula.includes("active") &&
    checks.wrong.correct === "false" &&
    checks.wrong.graded === "true" &&
    checks.correct.correct === "true" &&
    checks.hintVisible &&
    checks.final.x === "1" &&
    metrics.document.width === 972 &&
    metrics.document.height === 1619 &&
    !metrics.overflow &&
    mobileMetrics.documentWidth <= 390 &&
    !mobileMetrics.overflow &&
    mobileMetrics.nonblank &&
    consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0608-reference.png"));
await writeFile(
  path.join(evidence, "0608-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
