import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document, innerWidth, innerHeight */

const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0236-interactive-intermediate-coordinate-geometry-coordinate-transformations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/179-coordinate-transformations";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1039, height: 1513 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0236");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        [
          "kind",
          "vector",
          "source",
          "image",
          "rule",
          "stage",
          "status",
          "animation",
          "vectors",
          "snap",
          "tool",
        ].map((k) => [k, el.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Transformation a").fill("2");
await lesson.getByLabel("Transformation b").fill("1");
checks.inputs = await state();
await lesson.getByTestId("transform-source-handle").press("ArrowRight");
checks.keyboard = await state();
let handle = lesson.getByTestId("transform-source-handle"),
  box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y + 25, { steps: 7 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Show vectors").uncheck();
await lesson.getByLabel("Snap to grid").check();
checks.toggles = await state();
await lesson.locator(".ct179-work>article>aside button").nth(2).click();
box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 35, box.y + 30, { steps: 7 });
await page.mouse.up();
checks.vertexDrag = await state();
await lesson.getByLabel("Transformation type").selectOption("reflectY");
checks.reflect = await state();
await lesson.getByText("(2, 2)", { exact: true }).click();
checks.preset = await state();
for (const name of ["Manipulate", "Notice", "Understand", "Try"])
  await lesson.getByText(name, { exact: true }).click();
checks.stages = await state();
await lesson.getByRole("button", { name: "Play animation" }).click();
await page.waitForTimeout(350);
checks.playing = await state();
await lesson.getByRole("button", { name: "Pause animation" }).click();
await page.waitForTimeout(100);
checks.paused = await state();
const labels = ["A′ x", "A′ y", "B′ x", "B′ y", "C′ x", "C′ y"];
for (const label of labels) await lesson.getByLabel(label).fill("0");
await lesson.getByRole("button", { name: /Check$/ }).click();
checks.wrong = await state();
const values = [-1, 1, 2, 4, 0, -1];
for (let i = 0; i < labels.length; i++)
  await lesson.getByLabel(labels[i]).fill(String(values[i]));
await lesson.getByRole("button", { name: /Check$/ }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show answer/ }).click();
checks.answer = await state();
await lesson.getByRole("button", { name: /New task/ }).click();
checks.newTask = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".ct179-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".ct179-nav a").last().getAttribute("href"),
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
        page: region(".ct179-page"),
        header: region(".ct179-header"),
        stages: region(".ct179-stages"),
        work: region(".ct179-work"),
        graph: region(".ct179-graph"),
        learn: region(".ct179-learn"),
        practice: region(".ct179-practice"),
        navigation: region(".ct179-nav"),
        footer: region(".ct179-footer"),
      },
    };
  });
const geometryPassed =
  metrics.viewport.width === 1039 &&
  metrics.viewport.height === 1513 &&
  metrics.document.width === 1039 &&
  metrics.document.height === 1513 &&
  Math.round(metrics.regions.page.left) === 211 &&
  Math.round(metrics.regions.header.left) === 228 &&
  Math.round(metrics.regions.header.top) === 98;
const passed =
  checks.initial.source === "-3:4|1:4|-1:1" &&
  checks.initial.image === "0:2|4:2|2:-1" &&
  checks.inputs.vector === "2:1" &&
  checks.keyboard.source !== checks.inputs.source &&
  checks.drag.source !== checks.keyboard.source &&
  checks.toggles.vectors === "false" &&
  checks.toggles.snap === "true" &&
  checks.vertexDrag.tool === "shape" &&
  checks.vertexDrag.source !== checks.drag.source &&
  checks.reflect.kind === "reflectY" &&
  checks.preset.vector === "2:2" &&
  checks.stages.stage === "4" &&
  Number(checks.playing.animation) > 0 &&
  Number(checks.playing.animation) < 1 &&
  checks.paused.animation === "1.00" &&
  checks.wrong.status === "Check every vertex" &&
  checks.correct.status === "Correct transformed triangle" &&
  checks.answer.status === "Answer shown" &&
  checks.newTask.status === "" &&
  checks.reset.vector === "3:-2" &&
  checks.reset.source === "-3:4|1:4|-1:1" &&
  previousHref === "/lessons/geometry/178-coordinate-loci" &&
  nextHref === "/lessons/geometry/180-polar-coordinates" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0236-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0236-reference.png"));
const report = {
  mockup: "0236",
  lessonId: 179,
  route: "/lessons/geometry/179-coordinate-transformations",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0236-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
