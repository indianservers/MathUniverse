import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path"; /* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0253-interactive-intermediate-advanced-vectors-relative-motion-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/196-relative-motion",
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
const lesson = page.getByTestId("vector-mockup-0253");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((e) =>
      Object.fromEntries(
        [
          "a",
          "b",
          "relative",
          "time",
          "trails",
          "show-relative",
          "locked",
          "reverse",
          "tab",
          "language",
          "shared",
          "speed",
          "bearing",
        ].map((k) => [k, e.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() },
  map = lesson.locator(".rm196-map");
checks.mapBytes = (await map.screenshot()).length;
const tip = await lesson.getByTestId("motion-a-tip").boundingBox();
await page.mouse.move(tip.x + tip.width / 2, tip.y + tip.height / 2);
await page.mouse.down();
await page.mouse.move(tip.x + 26, tip.y - 26, { steps: 8 });
await page.mouse.up();
checks.dragA = await state();
await lesson.getByLabel("Motion time").fill("3");
await lesson.getByLabel("Object A x velocity").fill("6");
await lesson.getByLabel("Object A y velocity").fill("4");
await lesson.getByLabel("Observer B x velocity").fill("2");
await lesson.getByLabel("Observer B y velocity").fill("1");
checks.fields = await state();
await lesson.getByLabel("Show ground trails").uncheck();
await lesson.getByLabel("Show relative vector").uncheck();
await lesson.getByLabel("Lock observer B").uncheck();
const btip = await lesson.getByTestId("motion-b-tip").boundingBox();
await page.mouse.move(btip.x + btip.width / 2, btip.y + btip.height / 2);
await page.mouse.down();
await page.mouse.move(btip.x + 60, btip.y, { steps: 8 });
await page.mouse.up();
checks.dragB = await state();
await lesson.getByRole("button", { name: "B from A", exact: true }).click();
checks.reverse = await state();
for (const name of ["Learn", "Examples", "Formula", "Practice", "Interact"])
  await lesson.getByRole("button", { name: new RegExp(`^${name}`) }).click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.actions = await state();
await lesson
  .getByRole("button", { name: "Try: find B from A", exact: true })
  .click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const previousHref = await lesson
    .locator(".rm196-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".rm196-nav a").last().getAttribute("href"),
  metrics = await page.evaluate(() => {
    const r = (s) => {
      const b = document.querySelector(s)?.getBoundingClientRect();
      return b ? { top: b.top, height: b.height } : null;
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
        header: r(".rm196-header"),
        tabs: r(".rm196-tabs"),
        main: r(".rm196-main"),
        lower: r(".rm196-lower"),
        note: r(".rm196-note"),
        nav: r(".rm196-nav"),
        footer: r(".rm196-footer"),
      },
    };
  }),
  geometry =
    metrics.document.width === 1148 &&
    metrics.document.height <= 1370 &&
    Math.round(metrics.regions.header.top) === 105 &&
    Math.round(metrics.regions.header.height) === 250 &&
    Math.round(metrics.regions.tabs.top) === 369 &&
    Math.round(metrics.regions.main.top) === 440 &&
    Math.round(metrics.regions.main.height) === 468 &&
    Math.round(metrics.regions.lower.top) === 918 &&
  Math.round(metrics.regions.note.top) === 1157 &&
  Math.round(metrics.regions.nav.top) === 1198 &&
  Math.round(metrics.regions.footer.top) === 1261;
const passed =
  checks.initial.a === "6:4" &&
  checks.initial.b === "2:1" &&
  checks.initial.relative === "4:3" &&
  checks.initial.speed === "5.00" &&
  checks.initial.bearing === "36.9" &&
  checks.mapBytes > 10000 &&
  checks.dragA.a !== checks.initial.a &&
  checks.fields.a === "6:4" &&
  checks.fields.b === "2:1" &&
  checks.fields.time === "3" &&
  checks.dragB.b !== checks.fields.b &&
  checks.dragB.locked === "false" &&
  checks.reverse.reverse === "true" &&
  checks.reverse.relative.startsWith("-") &&
  checks.actions.tab === "0" &&
  checks.actions.language === "हिन्दी (Hindi)" &&
  checks.actions.shared === "true" &&
  checks.challenge.reverse === "false" &&
  checks.reset.a === "6:4" &&
  checks.reset.b === "2:1" &&
  checks.reset.relative === "4:3" &&
  previousHref === "/lessons/geometry/195-vector-equation-of-a-plane" &&
  nextHref === "/lessons/geometry/197-force-vectors" &&
  geometry &&
  !metrics.overflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0253-desktop.png"),
  fullPage: true,
});
await copyFile(ref, path.join(out, "0253-reference.png"));
const report = {
  mockup: "0253",
  lessonId: 196,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0253-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
