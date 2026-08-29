import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0238-interactive-intermediate-coordinate-geometry-parametric-coordinates-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/181-parametric-coordinates";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1037, height: 1516 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0238");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        ["t", "x", "y", "playing", "animate", "speed", "stage", "status"].map(
          (k) => [k, el.getAttribute(`data-${k}`)],
        ),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByTestId("parametric-motion-point").press("ArrowRight");
checks.keyboard = await state();
let handle = lesson.getByTestId("parametric-motion-point"),
  box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 40, box.y + 35, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Start parameter").click();
checks.start = await state();
await lesson.getByLabel("Step forward").click();
checks.step = await state();
await lesson.getByLabel("Animation speed").press("ArrowRight");
checks.speed = await state();
await lesson.getByLabel("Play motion").click();
await page.waitForTimeout(300);
checks.playing = await state();
await lesson.getByLabel("Pause motion").click();
checks.paused = await state();
await lesson.getByLabel("Animate").uncheck();
await lesson.getByLabel("End parameter").click();
await lesson.getByLabel("Play motion").click();
await page.waitForTimeout(120);
checks.noLoop = await state();
for (const name of ["Manipulate", "Pattern", "Rule", "Try"])
  await lesson.getByText(name, { exact: true }).click();
checks.stages = await state();
await lesson.getByLabel("Circle").check();
await lesson.getByLabel("Parametric practice equation").fill("x+y=1");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Ellipse").check();
await lesson.getByLabel("Parametric practice equation").fill("x^2/4+y^2=1");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution = await lesson
  .getByText("x²/4 + y² = 1", { exact: true })
  .last()
  .isVisible();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".pm181-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".pm181-nav a").last().getAttribute("href"),
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
        page: region(".pm181-page"),
        header: region(".pm181-header"),
        stages: region(".pm181-stages"),
        work: region(".pm181-work"),
        graph: region(".pm181-main-graph"),
        note: region(".pm181-note"),
        learn: region(".pm181-learn"),
        practice: region(".pm181-practice"),
        navigation: region(".pm181-nav"),
        footer: region(".pm181-footer"),
      },
    };
  });
const geometryPassed =
  metrics.viewport.width === 1037 &&
  metrics.viewport.height === 1516 &&
  metrics.document.width === 1037 &&
  metrics.document.height === 1516 &&
  Math.round(metrics.regions.page.left) === 211 &&
  Math.round(metrics.regions.header.left) === 221 &&
  Math.round(metrics.regions.header.top) === 102;
const passed =
  checks.initial.t === "1.000" &&
  checks.initial.playing === "false" &&
  checks.initial.animate === "true" &&
  checks.keyboard.t !== checks.initial.t &&
  checks.drag.t !== checks.keyboard.t &&
  Number(checks.start.t) < -6.2 &&
  Number(checks.step.t) > Number(checks.start.t) &&
  Number(checks.speed.speed) > 1 &&
  checks.playing.playing === "true" &&
  checks.playing.t !== checks.step.t &&
  checks.paused.playing === "false" &&
  checks.noLoop.playing === "false" &&
  checks.noLoop.animate === "false" &&
  checks.stages.stage === "4" &&
  checks.wrong.status === "Check the curve and eliminate t" &&
  checks.correct.status === "Correct ellipse equation" &&
  checks.solution &&
  checks.reset.t === "1.000" &&
  checks.reset.playing === "false" &&
  previousHref === "/lessons/geometry/180-polar-coordinates" &&
  nextHref === "/lessons/geometry/182-barycentric-coordinates" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0238-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0238-reference.png"));
const report = {
  mockup: "0238",
  lessonId: 181,
  route: "/lessons/geometry/181-parametric-coordinates",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
  mathNote:
    "The target labels x=cos(t)+2 and y=sin(t)+1 but also shows incompatible point/equation values. The implementation consistently uses the stated equations, yielding (x-2)^2+(y-1)^2=1.",
};
await writeFile(
  path.join(out, "0238-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
