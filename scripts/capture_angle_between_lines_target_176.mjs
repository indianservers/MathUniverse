import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0233-interactive-intermediate-coordinate-geometry-angle-between-lines-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/176-angle-between-lines";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1036, height: 1518 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0233");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        [
          "m1",
          "m2",
          "angle",
          "classification",
          "axes",
          "grid",
          "expanded",
          "tab",
          "practice-status",
        ].map((k) => [k, el.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Angle line 1 slope value").fill("2");
await lesson.getByLabel("Angle line 2 slope value").fill("-0.5");
checks.perpendicular = await state();
await lesson.getByTestId("angle-line-1").press("ArrowDown");
checks.keyboard = await state();
const p = lesson.getByTestId("angle-line-2"),
  box = await p.boundingBox();
await page.mouse.move(box.x + 4, box.y + 4);
await page.mouse.down();
await page.mouse.move(box.x + 25, box.y - 35, { steps: 6 });
await page.mouse.up();
checks.pointer = await state();
await lesson.getByRole("button", { name: "Axes" }).click();
await lesson.getByRole("button", { name: /Grid/ }).click();
checks.visibility = await state();
await lesson.getByRole("button", { name: "Axes" }).click();
await lesson.getByRole("button", { name: /Grid/ }).click();
for (const name of [
  "Explore",
  "Notice the pattern",
  "Understand the rule",
  "Try yourself",
  "Summary",
])
  await lesson.getByRole("button", { name }).click();
checks.tabs = await state();
await lesson.getByLabel("Expand graph").click();
checks.expanded = await state();
await lesson.getByLabel("Expand graph").click();
await lesson.getByRole("button", { name: "Show answer" }).click();
checks.answerVisible = await lesson
  .getByText("90°", { exact: true })
  .isVisible();
await lesson
  .locator(".abl176-practice")
  .getByRole("button", { name: "Reset" })
  .click();
await lesson.getByLabel("Practice angle answer").fill("45");
await lesson.getByRole("button", { name: "Check mine" }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice angle answer").fill("90");
await lesson.getByRole("button", { name: "Check mine" }).click();
checks.correct = await state();
await lesson
  .locator(".abl176-main")
  .getByRole("button", { name: "Reset" })
  .click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".abl176-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".abl176-nav a").last().getAttribute("href"),
  metrics = await page.evaluate(() => {
    const region = (s) => {
      const r = document.querySelector(s)?.getBoundingClientRect();
      return r
        ? {
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            width: r.width,
            height: r.height,
          }
        : null;
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      verticalOverflow: document.documentElement.scrollHeight > innerHeight,
      regions: {
        page: region(".abl176-page"),
        header: region(".abl176-header"),
        tabs: region(".abl176-tabs"),
        main: region(".abl176-main"),
        graph: region(".abl176-graph:not(.practice)"),
        info: region(".abl176-info"),
        insight: region(".abl176-insight"),
        practice: region(".abl176-practice"),
        navigation: region(".abl176-nav"),
        footer: region(".abl176-footer"),
      },
    };
  }),
  geometryPassed =
    metrics.viewport.width === 1036 &&
    metrics.viewport.height === 1518 &&
    metrics.document.width === 1036 &&
    Math.round(metrics.regions.page.left) === 213;
const passed =
  checks.initial.m1 === "1.43" &&
  checks.initial.m2 === "0.50" &&
  checks.initial.angle === "28.47" &&
  checks.initial.classification === "Acute" &&
  checks.perpendicular.angle === "90.00" &&
  checks.perpendicular.classification === "Right" &&
  checks.keyboard.m1 === "1.90" &&
  checks.pointer.m2 !== checks.perpendicular.m2 &&
  checks.visibility.axes === "false" &&
  checks.visibility.grid === "false" &&
  checks.tabs.tab === "4" &&
  checks.expanded.expanded === "true" &&
  checks.answerVisible &&
  checks.wrong["practice-status"] === "Recheck the perpendicular slopes" &&
  checks.correct["practice-status"] === "Correct angle" &&
  checks.reset.m1 === "1.43" &&
  checks.reset.m2 === "0.50" &&
  previousHref === "/lessons/geometry/175-perpendicular-lines" &&
  nextHref === "/lessons/geometry/177-point-to-line-distance" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0233-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0233-reference.png"));
const report = {
  mockup: "0233",
  lessonId: 176,
  route: "/lessons/geometry/176-angle-between-lines",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
  mathNote:
    "Target calls the angle 55°, but slopes 1.43 and 0.50 have inclinations about 55.03° and 26.57°, so the correct acute angle is 28.47°. Implementation keeps graph and tan formula consistent.",
};
await writeFile(
  path.join(out, "0233-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
