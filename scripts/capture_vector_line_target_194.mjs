import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0251-interactive-intermediate-advanced-vectors-vector-equation-of-a-line-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/194-vector-equation-of-a-line",
  browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1148, height: 1370 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0251");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((e) =>
      Object.fromEntries(
        [
          "a",
          "v",
          "t",
          "r",
          "trail",
          "steps",
          "table",
          "tab",
          "language",
          "shared",
          "challenge",
        ].map((k) => [k, e.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() },
  graph = lesson.locator(".vl194-graph");
checks.graphBytes = (await graph.screenshot()).length;
const tip = await lesson.getByTestId("line-r-tip").boundingBox();
await page.mouse.move(tip.x + tip.width / 2, tip.y + tip.height / 2);
await page.mouse.down();
await page.mouse.move(tip.x + 50, tip.y - 15, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Line parameter t", { exact: true }).fill("-1");
checks.parameter = await state();
await lesson.getByLabel("a x value").fill("2");
await lesson.getByLabel("v y value").fill("2");
checks.components = await state();
await lesson.getByLabel("Show t trail").uncheck();
await lesson.getByLabel("Show direction steps").uncheck();
await lesson.getByLabel("Show point table").uncheck();
for (const name of ["Learn", "Examples", "Formula", "Practice", "Interact"])
  await lesson.getByRole("button", { name, exact: true }).click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.actions = await state();
await lesson.getByRole("button", { name: /Try: find t/ }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.reload = await state();
const previousHref = await lesson
    .locator(".vl194-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".vl194-nav a").last().getAttribute("href"),
  metrics = await page.evaluate(() => {
    const r = (s) => {
      const b = document.querySelector(s)?.getBoundingClientRect();
      return b
        ? { top: b.top, height: b.height, left: b.left, width: b.width }
        : null;
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      overflow:
        document.documentElement.scrollWidth > innerWidth ||
        document.documentElement.scrollHeight > innerHeight,
      regions: {
        header: r(".vl194-header"),
        tabs: r(".vl194-tabs"),
        main: r(".vl194-main"),
        lower: r(".vl194-lower"),
        tip: r(".vl194-tip"),
        nav: r(".vl194-nav"),
        footer: r(".vl194-footer"),
      },
    };
  }),
  geometry =
    metrics.document.width === 1148 &&
    metrics.document.height <= 1370 &&
    Math.round(metrics.regions.header.top) === 105 &&
    Math.round(metrics.regions.header.height) === 230 &&
    Math.round(metrics.regions.tabs.top) === 349 &&
    Math.round(metrics.regions.main.top) === 410 &&
    Math.round(metrics.regions.main.height) === 470 &&
    Math.round(metrics.regions.lower.top) === 892 &&
    Math.round(metrics.regions.lower.height) === 222 &&
    Math.round(metrics.regions.tip.top) === 1126 &&
    Math.round(metrics.regions.nav.top) === 1185 &&
    Math.round(metrics.regions.footer.top) === 1252;
const passed =
  checks.initial.a === "1:2" &&
  checks.initial.v === "3:1" &&
  checks.initial.t === "1.5" &&
  checks.initial.r === "5.5:3.5" &&
  checks.graphBytes > 10000 &&
  checks.drag.t !== checks.initial.t &&
  checks.parameter.r === "-2:1" &&
  checks.components.a === "2:2" &&
  checks.components.v === "3:2" &&
  checks.actions.trail === "false" &&
  checks.actions.steps === "false" &&
  checks.actions.table === "false" &&
  checks.actions.tab === "0" &&
  checks.actions.shared === "true" &&
  checks.challenge.t === "2" &&
  checks.challenge.challenge === "true" &&
  checks.reset.a === "1:2" &&
  checks.reset.v === "3:1" &&
  checks.reset.r === "5.5:3.5" &&
  checks.reload.language === "English (English)" &&
  previousHref === "/lessons/geometry/193-linear-combinations" &&
  nextHref === "/lessons/geometry/195-vector-equation-of-a-plane" &&
  geometry &&
  !metrics.overflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0251-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0251-reference.png"));
const report = {
  mockup: "0251",
  lessonId: 194,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0251-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
