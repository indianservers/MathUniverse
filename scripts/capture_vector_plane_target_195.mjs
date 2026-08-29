import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0252-interactive-intermediate-advanced-vectors-vector-equation-of-a-plane-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/195-vector-equation-of-a-plane",
  browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1148, height: 1370 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  const x = `${m.type()}: ${m.text()}`;
  if (
    ["error", "warning"].includes(m.type()) &&
    !x.includes("GPU stall due to ReadPixels")
  )
    messages.push(x);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0252");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const state = () =>
    lesson.evaluate((e) =>
      Object.fromEntries(
        [
          "a",
          "u",
          "v",
          "s",
          "t",
          "r",
          "normal",
          "independent",
          "grid",
          "show-normal",
          "equation",
          "tab",
          "language",
          "shared",
          "view",
          "challenge",
        ].map((k) => [k, e.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() },
  canvas = lesson.locator("canvas"),
  pixels = await canvas.evaluate((e) => {
    const gl = e.getContext("webgl2") ?? e.getContext("webgl"),
      p = new Uint8Array(e.width * e.height * 4);
    gl.readPixels(0, 0, e.width, e.height, gl.RGBA, gl.UNSIGNED_BYTE, p);
    let n = 0;
    for (let i = 0; i < p.length; i += 16) if (p[i + 3] && p[i] < 245) n++;
    return n;
  });
checks.canvas = { pixels, bytes: (await canvas.screenshot()).length };
const tip = await lesson.getByTestId("plane-r-tip").boundingBox();
await page.mouse.move(tip.x + tip.width / 2, tip.y + tip.height / 2);
await page.mouse.down();
await page.mouse.move(tip.x + 35, tip.y - 35, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Anchor point a x").fill("2");
await lesson.getByLabel("Direction vector u y").fill("1");
checks.fields = await state();
await lesson.getByLabel("Plane parameter s", { exact: true }).fill("-1");
await lesson.getByLabel("Exact plane parameter t").fill("2");
checks.params = await state();
await lesson.getByLabel("Show parameter grid").uncheck();
await lesson.getByLabel("Show normal").uncheck();
await lesson.getByLabel("Show plane equation").uncheck();
for (const name of ["Learn", "Examples", "Formula", "Practice", "Interact"])
  await lesson.getByRole("button", { name, exact: true }).click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
await lesson.getByRole("button", { name: "Share", exact: true }).click();
await lesson.getByRole("button", { name: "Reset view", exact: true }).click();
checks.actions = await state();
await lesson.getByRole("button", { name: /Try: find s,t/ }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(1000);
checks.reload = await state();
const previousHref = await lesson
    .locator(".vp195-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".vp195-nav a").last().getAttribute("href"),
  metrics = await page.evaluate(() => {
    const r = (s) => {
      const b = document.querySelector(s)?.getBoundingClientRect();
      return b
        ? { top: b.top, height: b.height, left: b.left, width: b.width }
        : null;
    };
    return {
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      overflow:
        document.documentElement.scrollWidth > innerWidth ||
        document.documentElement.scrollHeight > innerHeight,
      regions: {
        header: r(".vp195-header"),
        tabs: r(".vp195-tabs"),
        main: r(".vp195-main"),
        nav: r(".vp195-nav"),
        footer: r(".vp195-footer"),
      },
    };
  }),
  geometry =
    metrics.document.width === 1148 &&
    metrics.document.height <= 1370 &&
    Math.round(metrics.regions.header.top) === 105 &&
    Math.round(metrics.regions.header.height) === 147 &&
    Math.round(metrics.regions.tabs.top) === 263 &&
    Math.round(metrics.regions.tabs.height) === 43 &&
    Math.round(metrics.regions.main.top) === 317 &&
    Math.round(metrics.regions.main.height) === 849 &&
    Math.round(metrics.regions.nav.top) === 1176 &&
    Math.round(metrics.regions.footer.top) === 1231;
const passed =
  checks.initial.a === "1:1:1" &&
  checks.initial.u === "2:0:1" &&
  checks.initial.v === "0:2:1" &&
  checks.initial.s === "1.5" &&
  checks.initial.t === "1" &&
  checks.initial.r === "4:3:3.5" &&
  checks.initial.normal === "-1:-1:2" &&
  checks.initial.independent === "true" &&
  checks.canvas.pixels > 100 &&
  checks.canvas.bytes > 10000 &&
  checks.drag.r !== checks.initial.r &&
  checks.fields.a === "2:1:1" &&
  checks.fields.u === "2:1:1" &&
  checks.params.s === "-1" &&
  checks.params.t === "2" &&
  checks.actions.grid === "false" &&
  checks.actions["show-normal"] === "false" &&
  checks.actions.equation === "false" &&
  checks.actions.tab === "0" &&
  checks.actions.language === "हिन्दी (Hindi)" &&
  checks.actions.shared === "true" &&
  checks.challenge.s === "1" &&
  checks.challenge.t === "2" &&
  checks.challenge.challenge === "true" &&
  checks.reset.a === "1:1:1" &&
  checks.reset.r === "4:3:3.5" &&
  checks.reload.language === "English (English)" &&
  previousHref === "/lessons/geometry/194-vector-equation-of-a-line" &&
  nextHref === "/lessons/geometry/196-relative-motion" &&
  geometry &&
  !metrics.overflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0252-desktop.png"),
  fullPage: true,
});
await copyFile(ref, path.join(out, "0252-reference.png"));
const report = {
  mockup: "0252",
  lessonId: 195,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0252-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
