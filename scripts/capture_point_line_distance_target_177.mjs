import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0234-interactive-intermediate-coordinate-geometry-point-to-line-distance-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/177-point-to-line-distance";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 984, height: 1598 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0234");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        [
          "point",
          "m",
          "c",
          "foot",
          "distance",
          "tab",
          "expanded",
          "status",
        ].map((k) => [k, el.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Point P x value").fill("3");
await lesson.getByLabel("Point P y value").fill("4");
checks.inputs = await state();
await lesson.getByTestId("distance-point").press("ArrowUp");
checks.keyboard = await state();
const p = lesson.getByTestId("distance-point"),
  box = await p.boundingBox();
await page.mouse.move(box.x + 4, box.y + 4);
await page.mouse.down();
await page.mouse.move(box.x - 34, box.y + 28, { steps: 6 });
await page.mouse.up();
checks.pointDrag = await state();
await lesson.getByLabel("Distance line slope value").fill("0.5");
await lesson.getByLabel("Distance line intercept value").fill("-1");
checks.lineInputs = await state();
const line = lesson.getByTestId("distance-line-handle"),
  lb = await line.boundingBox();
await page.mouse.move(lb.x + 4, lb.y + 4);
await page.mouse.down();
await page.mouse.move(lb.x + 4, lb.y - 35, { steps: 6 });
await page.mouse.up();
checks.lineDrag = await state();
await line.press("ArrowDown");
checks.lineKeyboard = await state();
for (const name of [
  "Explore",
  "Construct",
  "Formula",
  "Compare Paths",
  "Practice",
])
  await lesson.getByRole("button", { name }).click();
checks.tabs = await state();
await lesson.getByLabel("Expand view").click();
checks.expanded = await state();
await lesson.getByLabel("Expand view").click();
await lesson.getByLabel("Practice distance answer").fill("2");
await lesson.getByRole("button", { name: "Check" }).click();
checks.wrong = await state();
await lesson.getByRole("button", { name: /Show hint/ }).click();
checks.hint = await lesson.getByText(/Use \|2\(3\)-2\+1\|/).isVisible();
await lesson.getByLabel("Practice distance answer").fill("sqrt(5)");
await lesson.getByRole("button", { name: "Check" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Reset view/ }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".pld177-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".pld177-nav a").last().getAttribute("href"),
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
        page: region(".pld177-page"),
        header: region(".pld177-header"),
        tabs: region(".pld177-tabs"),
        main: region(".pld177-main"),
        graph: region(".pld177-graph"),
        observation: region(".pld177-observation"),
        proof: region(".pld177-proof"),
        formula: region(".pld177-formula"),
        compare: region(".pld177-compare"),
        practice: region(".pld177-practice"),
        navigation: region(".pld177-nav"),
      },
    };
  }),
  geometryPassed =
    metrics.viewport.width === 984 &&
    metrics.viewport.height === 1598 &&
    metrics.document.width === 984 &&
    Math.round(metrics.regions.page.left) === 211;
const passed =
  checks.initial.point === "2:5" &&
  checks.initial.foot === "3.50:3.50" &&
  checks.initial.distance === "2.121" &&
  checks.inputs.foot === "3.50:3.50" &&
  checks.keyboard.point === "3:4.5" &&
  checks.pointDrag.point !== checks.keyboard.point &&
  checks.lineInputs.m === "0.50" &&
  checks.lineInputs.c === "-1.00" &&
  checks.lineDrag.m !== checks.lineInputs.m &&
  checks.lineKeyboard.m !== checks.lineDrag.m &&
  checks.tabs.tab === "4" &&
  checks.expanded.expanded === "true" &&
  checks.wrong.status === "Recheck the distance formula" &&
  checks.hint &&
  checks.correct.status === "Correct shortest distance" &&
  checks.reset.point === "2:5" &&
  checks.reset.foot === "3.50:3.50" &&
  previousHref === "/lessons/geometry/176-angle-between-lines" &&
  nextHref === "/lessons/geometry/178-coordinate-loci" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0234-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0234-reference.png"));
const report = {
  mockup: "0234",
  lessonId: 177,
  route: "/lessons/geometry/177-point-to-line-distance",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
  mathNote:
    "For P(2,5) and y=x, the correct foot is F(3.5,3.5) and distance is 3/sqrt(2)=2.121. Target sections showing F(1,1) and sqrt(32)=5.657 are inconsistent; implementation uses the correct projection everywhere.",
};
await writeFile(
  path.join(out, "0234-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
