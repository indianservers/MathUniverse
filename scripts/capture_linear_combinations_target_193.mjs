import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0250-interactive-intermediate-advanced-vectors-linear-combinations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/193-linear-combinations",
  browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1148, height: 1370 },
  }),
  page = await context.newPage(),
  messages = [];
page.setDefaultTimeout(5000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0250");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((e) =>
      Object.fromEntries(
        [
          "u",
          "v",
          "a",
          "b",
          "w",
          "determinant",
          "independent",
          "scaled",
          "parallelogram",
          "span",
          "tab",
          "language",
          "shared",
        ].map((k) => [k, e.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() },
  graph = lesson.locator(".lc193-graph");
checks.graphBytes = (await graph.screenshot()).length;
await lesson.getByLabel("a coefficient").fill("2");
await lesson.getByLabel("b exact coefficient").fill("1");
checks.coefficients = await state();
await lesson.getByLabel("u x combination value").fill("4");
await lesson.getByLabel("v y combination value").fill("2");
checks.vectors = await state();
await lesson.getByLabel("Show scaled tips").uncheck();
await lesson.getByLabel("Show parallelogram").uncheck();
await lesson.getByLabel("Show span").uncheck();
for (const name of ["Learn", "Examples", "Formula", "Practice", "Interact"])
  await lesson.getByRole("button", { name, exact: true }).click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.actions = await state();
await lesson.getByRole("button", { name: /Try: make/ }).click();
checks.target = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const previousHref = await lesson
    .locator(".lc193-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".lc193-nav a").last().getAttribute("href"),
  metrics = await page.evaluate(() => {
    const r = (s) => {
      const b = document.querySelector(s)?.getBoundingClientRect();
      return b ? { top: b.top, height: b.height } : null;
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
        header: r(".lc193-header"),
        tabs: r(".lc193-tabs"),
        main: r(".lc193-main"),
        status: r(".lc193-status"),
        nav: r(".lc193-nav"),
        footer: r(".lc193-footer"),
      },
    };
  }),
  passed =
    checks.initial.u === "3:2" &&
    checks.initial.v === "-1:3" &&
    checks.initial.a === "1.5" &&
    checks.initial.b === "-0.5" &&
    checks.initial.w === "5:1.5" &&
    checks.initial.determinant === "11" &&
    checks.initial.independent === "true" &&
    checks.graphBytes > 10000 &&
    checks.coefficients.w === "5:7" &&
  checks.vectors.w === "7:6" &&
    checks.actions.scaled === "false" &&
    checks.actions.parallelogram === "false" &&
    checks.actions.span === "false" &&
    checks.actions.tab === "0" &&
    checks.actions.language === "हिन्दी (Hindi)" &&
    checks.actions.shared === "true" &&
    checks.target.w === "4:7" &&
    checks.reset.u === "3:2" &&
    checks.reset.v === "-1:3" &&
    previousHref === "/lessons/geometry/192-vector-projection" &&
    nextHref === "/lessons/geometry/194-vector-equation-of-a-line" &&
    !metrics.overflow &&
    messages.length === 0;
await page.screenshot({
  path: path.join(out, "0250-desktop.png"),
  fullPage: true,
});
await copyFile(ref, path.join(out, "0250-reference.png"));
const report = {
  mockup: "0250",
  lessonId: 193,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0250-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
