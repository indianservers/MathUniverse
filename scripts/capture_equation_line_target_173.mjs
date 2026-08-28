import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document,innerWidth,innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0230-interactive-intermediate-coordinate-geometry-equation-of-a-line-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/173-equation-of-a-line";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1024, height: 1536 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["warning", "error"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0230");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        ["m", "b", "form", "tool", "grid", "tab", "status"].map((k) => [
          k,
          el.getAttribute(`data-${k}`),
        ]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Line slope value").fill("-1.5");
await lesson.getByLabel("Line intercept value").fill("4");
checks.inputs = await state();
await lesson.getByTestId("line-control-point").press("ArrowUp");
checks.keyboard = await state();
const p = lesson.getByTestId("line-control-point"),
  box = await p.boundingBox();
await page.mouse.move(box.x + 4, box.y + 4);
await page.mouse.down();
await page.mouse.move(box.x + 4, box.y - 45, { steps: 6 });
await page.mouse.up();
checks.pointer = await state();
await lesson.getByLabel("Show grid").uncheck();
checks.grid = await state();
await lesson.getByLabel("Show grid").check();
for (const name of ["Observe", "Manipulate", "Notice", "Understand", "Try"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
for (const name of ["Point-Slope", "Standard", "Slope-Intercept"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.forms = await state();
await lesson.getByLabel("Undo").click();
checks.undo = await state();
await lesson.getByLabel("Redo").click();
checks.redo = await state();
await lesson.getByRole("button", { name: "Pan" }).click();
const graph = lesson.locator(".el173-graph:not(.practice)"),
  gb = await graph.boundingBox();
await page.mouse.move(gb.x + 160, gb.y + 180);
await page.mouse.down();
await page.mouse.move(gb.x + 195, gb.y + 205, { steps: 5 });
await page.mouse.up();
checks.pan = await state();
await lesson.getByRole("button", { name: "Select" }).click();
await lesson.getByRole("button", { name: "Share" }).click();
checks.shared = await lesson.getByText("Share link ready").isVisible();
await lesson.locator(".el173-header aside button").last().click();
checks.menu = await lesson.getByText(/More line options/).isVisible();
await lesson.getByLabel("Practice line slope").fill("1.5");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hint = await lesson.getByText("Rise 6 while run is 6.").isVisible();
await lesson.getByLabel("Practice line slope").fill("1");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Reset task" }).click();
checks.taskReset = await state();
await lesson.getByRole("button", { name: "Reset" }).first().click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".el173-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".el173-nav a").last().getAttribute("href"),
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
        page: region(".el173-page"),
        header: region(".el173-header"),
        stages: region(".el173-stages"),
        lab: region(".el173-lab"),
        graph: region(".el173-graph:not(.practice)"),
        learning: region(".el173-learning"),
        practice: region(".el173-practice"),
        navigation: region(".el173-nav"),
        footer: region(".el173-footer"),
      },
    };
  }),
  geometryPassed =
    metrics.viewport.width === 1024 &&
    metrics.viewport.height === 1536 &&
    metrics.document.width === 1024 &&
    Math.round(metrics.regions.page.left) === 205;
const passed =
  checks.initial.m === "2" &&
  checks.initial.b === "1" &&
  checks.inputs.m === "-1.5" &&
  checks.inputs.b === "4" &&
  checks.keyboard.m === "-1.25" &&
  checks.pointer.m !== checks.keyboard.m &&
  checks.grid.grid === "false" &&
  checks.forms.form === "slope" &&
  checks.undo.m !== checks.redo.m &&
  checks.pan.tool === "pan" &&
  checks.shared &&
  checks.menu &&
  checks.wrong.status === "Recheck the slope" &&
  checks.hint &&
  checks.correct.status === "Correct line equations" &&
  checks.taskReset.status === "" &&
  checks.reset.m === "2" &&
  checks.reset.b === "1" &&
  previousHref === "/lessons/geometry/172-gradient-slope" &&
  nextHref === "/lessons/geometry/174-parallel-lines" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0230-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0230-reference.png"));
const report = {
  mockup: "0230",
  lessonId: 173,
  route: "/lessons/geometry/173-equation-of-a-line",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
  mathNote:
    "Target labels are inconsistent: y=2x+1 gives (-2,-3), not (-2,0), and practice points (-2,-1),(4,5) define y=x+1, not y=3x/2+2. Implementation uses correct equations.",
};
await writeFile(
  path.join(out, "0230-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
