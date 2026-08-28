import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0229-interactive-intermediate-coordinate-geometry-gradient-slope-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/172-gradient-slope";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1014, height: 1551 },
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0229");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        [
          "a",
          "b",
          "slope",
          "tool",
          "zoom",
          "tab",
          "rise-run",
          "values",
          "attempts",
          "best",
          "status",
        ].map((n) => [n, el.getAttribute(`data-${n}`)]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Point A x").fill("-2");
await lesson.getByLabel("Point A y").fill("1");
checks.inputs = await state();
await lesson.getByTestId("slope-point-a").press("ArrowRight");
checks.keyboard = await state();
const p = lesson.getByTestId("slope-point-b"),
  box = await p.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 45, box.y + 35, { steps: 6 });
await page.mouse.up();
checks.pointer = await state();
await lesson.getByLabel("Rise / Run").uncheck();
await lesson.getByLabel("Values").uncheck();
checks.visibility = await state();
await lesson.getByLabel("Rise / Run").check();
await lesson.getByLabel("Values").check();
for (const name of ["Observe", "Manipulate", "Notice", "Understand", "Try"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
await lesson.getByRole("button", { name: /select/i }).click();
await lesson.getByRole("button", { name: /pan/i }).click();
const graph = lesson.locator(".gs172-graph:not(.practice)"),
  gb = await graph.boundingBox();
await page.mouse.move(gb.x + 200, gb.y + 160);
await page.mouse.down();
await page.mouse.move(gb.x + 235, gb.y + 180, { steps: 5 });
await page.mouse.up();
checks.pan = await state();
await lesson.getByLabel("Zoom in").click();
await lesson.getByLabel("Zoom out").click();
checks.zoom = await state();
await lesson.getByLabel("Point B x").fill("-1");
checks.vertical = await state();
await lesson.getByRole("button", { name: /Full screen/i }).click();
checks.fullscreen = await lesson.evaluate((el) =>
  el.classList.contains("fullscreen"),
);
await lesson.getByRole("button", { name: /Full screen/i }).click();
await lesson.getByRole("button", { name: /Share/ }).click();
checks.shared = await lesson.getByText("Share link ready").isVisible();
await lesson.getByLabel("Practice slope").fill("0");
await lesson.getByRole("button", { name: "Check" }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice slope").fill("0.6667");
await lesson.getByRole("button", { name: "Check" }).click();
checks.correct = await state();
const pp = lesson.getByTestId("practice-slope-point-a"),
  pb = await pp.boundingBox();
await page.mouse.move(pb.x + 4, pb.y + 4);
await page.mouse.down();
await page.mouse.move(pb.x + 39, pb.y - 31, { steps: 5 });
await page.mouse.up();
checks.practiceDrag = await state();
await lesson.getByRole("button", { name: /Reset/ }).first().click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".gs172-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".gs172-nav a").last().getAttribute("href"),
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
        page: region(".gs172-page"),
        header: region(".gs172-header"),
        stages: region(".gs172-stages"),
        explore: region(".gs172-explore"),
        graph: region(".gs172-graph:not(.practice)"),
        learning: region(".gs172-learning"),
        practice: region(".gs172-practice"),
        navigation: region(".gs172-nav"),
        footer: region(".gs172-footer"),
      },
    };
  }),
  geometryPassed =
    metrics.viewport.width === 1014 &&
    metrics.viewport.height === 1551 &&
    metrics.document.width === 1014 &&
    Math.round(metrics.regions.page.left) === 209;
const passed =
  checks.initial.a === "-4:-1" &&
  checks.initial.b === "3:2" &&
  checks.initial.slope === "0.4286" &&
  checks.inputs.slope === "0.2000" &&
  checks.keyboard.a === "-1:1" &&
  checks.pointer.b !== checks.initial.b &&
  checks.visibility["rise-run"] === "false" &&
  checks.visibility.values === "false" &&
  checks.pan.tool === "pan" &&
  checks.vertical.slope === "undefined" &&
  checks.fullscreen &&
  checks.shared &&
  checks.wrong.status === "Recheck rise over run" &&
  checks.correct.status === "Correct slope" &&
  Number(checks.correct.attempts) === 2 &&
  checks.correct.best === "true" &&
  checks.reset.a === "-4:-1" &&
  previousHref === "/lessons/geometry/171-section-formula" &&
  nextHref === "/lessons/geometry/173-equation-of-a-line" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(out, "0229-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0229-reference.png"));
const report = {
  mockup: "0229",
  lessonId: 172,
  route: "/lessons/geometry/172-gradient-slope",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0229-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
