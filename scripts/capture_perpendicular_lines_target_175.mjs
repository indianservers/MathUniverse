import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0232-interactive-intermediate-coordinate-geometry-perpendicular-lines-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/175-perpendicular-lines";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1003, height: 1569 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0232");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        [
          "theta1",
          "theta2",
          "m1",
          "m2",
          "product",
          "perpendicular",
          "locked",
          "zoom",
          "tab",
          "language",
          "practice-angle",
          "practice-status",
        ].map((k) => [k, el.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Blue line angle").fill("70");
checks.angle = await state();
const main=lesson.locator(".perp175-main");
await main.getByTestId("perpendicular-line-1").press("ArrowRight");
checks.keyboard = await state();
const p = main.getByTestId("perpendicular-line-1"),
  box = await p.boundingBox();
await page.mouse.move(box.x + 4, box.y + 4);
await page.mouse.down();
await page.mouse.move(box.x - 35, box.y - 35, { steps: 6 });
await page.mouse.up();
checks.pointer = await state();
await lesson.getByRole("button", { name: /Lock perpendicular/ }).click();
checks.unlocked = await state();
await lesson.getByLabel("Purple line angle").fill("110");
checks.independent = await state();
const p2 = main.getByTestId("perpendicular-line-2"),
  box2 = await p2.boundingBox();
await page.mouse.move(box2.x + 4, box2.y + 4);
await page.mouse.down();
await page.mouse.move(box2.x + 30, box2.y + 35, { steps: 6 });
await page.mouse.up();
checks.purplePointer = await state();
await lesson.getByRole("button", { name: /Unlock lines/ }).click();
checks.relocked = await state();
await lesson.getByLabel("Zoom in").click();
checks.zoom = await state();
await lesson.getByRole("button", { name: "Fit" }).click();
for (const name of ["Explore", "Pattern", "Rule", "Practice"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.tabs = await state();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "Hindi (हिन्दी)" });
checks.language = await state();
await lesson.getByRole("button", { name: "Share" }).click();
checks.shared = await lesson.getByText("Share link ready").isVisible();
await lesson.getByRole("button", { name: "Check" }).click();
checks.practiceWrong = await state();
await lesson.getByLabel("Practice blue angle").fill("20");
await lesson.getByTestId("practice-perpendicular-line-1").press("ArrowLeft");
checks.practiceKeyboard = await state();
const pp = lesson.getByTestId("practice-perpendicular-line-1"),
  pb = await pp.boundingBox();
await page.mouse.move(pb.x + 4, pb.y + 4);
await page.mouse.down();
await page.mouse.move(pb.x + 10, pb.y - 4, { steps: 4 });
await page.mouse.up();
await lesson.getByLabel("Practice blue angle").fill("20");
await lesson.getByRole("button", { name: "Check" }).click();
checks.practiceCorrect = await state();
await lesson.getByRole("button", { name: "Reset" }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".perp175-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".perp175-nav a").last().getAttribute("href"),
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
        page: region(".perp175-page"),
        header: region(".perp175-header"),
        tabs: region(".perp175-tabs"),
        main: region(".perp175-main"),
        graph: region(".perp175-graph:not(.practice)"),
        rule: region(".perp175-rule"),
        practice: region(".perp175-practice"),
        navigation: region(".perp175-nav"),
      },
    };
  }),
  geometryPassed =
    metrics.viewport.width === 1003 &&
    metrics.viewport.height === 1569 &&
    metrics.document.width === 1003 &&
    Math.round(metrics.regions.page.left) === 209;
const passed =
  checks.initial.theta1 === "55.0" &&
  checks.initial.theta2 === "145.0" &&
  checks.initial.m1 === "1.43" &&
  checks.initial.m2 === "-0.70" &&
  checks.initial.product === "-1.00" &&
  checks.angle.theta2 === "160.0" &&
  checks.angle.perpendicular === "true" &&
  checks.keyboard.theta1 === "71.0" &&
  checks.pointer.theta1 !== checks.keyboard.theta1 &&
  checks.unlocked.locked === "false" &&
  checks.independent.perpendicular === "false" &&
  checks.purplePointer.theta2 !== checks.independent.theta2 &&
  checks.relocked.locked === "true" &&
  checks.relocked.perpendicular === "true" &&
  checks.zoom.zoom === "1.1" &&
  checks.tabs.tab === "3" &&
  checks.language.language === "Hindi (हिन्दी)" &&
  checks.shared &&
  checks.practiceWrong["practice-status"] === "Keep rotating the blue line" &&
  checks.practiceKeyboard["practice-angle"] === "19.0" &&
  checks.practiceCorrect["practice-status"] === "Correct perpendicular pair" &&
  checks.reset.theta1 === "55.0" &&
  previousHref === "/lessons/geometry/174-parallel-lines" &&
  nextHref === "/lessons/geometry/176-angle-between-lines" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0232-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0232-reference.png"));
const report = {
  mockup: "0232",
  lessonId: 175,
  route: "/lessons/geometry/175-perpendicular-lines",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0232-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
