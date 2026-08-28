import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0231-interactive-intermediate-coordinate-geometry-parallel-lines-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/174-parallel-lines";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 982, height: 1602 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0231");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        [
          "m1",
          "b1",
          "m2",
          "b2",
          "parallel",
          "angles",
          "tab",
          "construct",
          "status",
        ].map((k) => [k, el.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Line 1 m value").fill("1.5");
checks.unequal = await state();
await lesson.getByLabel("Line 2 m value").fill("1.5");
await lesson.getByLabel("Line 2 b value").fill("-3");
checks.inputs = await state();
await lesson.getByTestId("parallel-line-1").press("ArrowUp");
checks.keyboard = await state();
const p = lesson.getByTestId("parallel-line-2"),
  box = await p.boundingBox();
await page.mouse.move(box.x + 4, box.y + 4);
await page.mouse.down();
await page.mouse.move(box.x + 4, box.y - 35, { steps: 6 });
await page.mouse.up();
checks.pointer = await state();
await lesson.getByRole("button", { name: /Show angles/ }).click();
checks.angles = await state();
await lesson.getByRole("button", { name: /Show angles/ }).click();
for (const name of ["Explore", "Try It", "Observe", "Rule", "Practice"])
  await lesson.getByRole("button", { name }).click();
checks.tabs = await state();
await lesson.getByRole("button", { name: /Check on graph/ }).click();
checks.construct = await state();
await lesson.getByLabel("Practice parallel slope").fill("-2");
await lesson.getByLabel("Practice parallel intercept").fill("6");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice parallel slope").fill("-3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".pl174-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".pl174-nav a").last().getAttribute("href"),
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
        page: region(".pl174-page"),
        header: region(".pl174-header"),
        observe: region(".pl174-observe"),
        graph: region(".pl174-graph"),
        observations: region(".pl174-observations"),
        cards: region(".pl174-cards"),
        practice: region(".pl174-practice"),
        navigation: region(".pl174-nav"),
      },
    };
  }),
  geometryPassed =
    metrics.viewport.width === 982 &&
    metrics.viewport.height === 1602 &&
    metrics.document.width === 982 &&
    Math.round(metrics.regions.page.left) === 204;
const passed =
  checks.initial.parallel === "true" &&
  checks.initial.m1 === "2.00" &&
  checks.unequal.parallel === "false" &&
  checks.inputs.parallel === "true" &&
  checks.inputs.b2 === "-3.00" &&
  checks.keyboard.m1 === "1.75" &&
  checks.pointer.m2 !== checks.inputs.m2 &&
  checks.angles.angles === "false" &&
  checks.tabs.tab === "4" &&
  checks.construct.construct === "true" &&
  checks.construct.m2 === "1.75" &&
  checks.construct.b2 === "-4.75" &&
  checks.construct.parallel === "true" &&
  checks.wrong.status === "Enter a valid equation and click Check" &&
  checks.correct.status === "Correct parallel equation" &&
  checks.reset.parallel === "true" &&
  previousHref === "/lessons/geometry/173-equation-of-a-line" &&
  nextHref === "/lessons/geometry/175-perpendicular-lines" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0231-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0231-reference.png"));
const report = {
  mockup: "0231",
  lessonId: 174,
  route: "/lessons/geometry/174-parallel-lines",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0231-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
