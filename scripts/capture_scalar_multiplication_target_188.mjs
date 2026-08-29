import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0245-interactive-intermediate-advanced-vectors-scalar-multiplication-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/188-scalar-multiplication";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1149, height: 1369 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0245");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "vector",
        "scalar",
        "result",
        "grid",
        "expanded",
        "stage",
        "language",
        "shared",
        "answers",
        "hint",
        "correct",
        "feedback",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };

await lesson.getByTestId("scalar-source-tip").press("ArrowRight");
checks.keyboard = await state();
const tip = lesson.getByTestId("scalar-source-tip"),
  box = await tip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 30, box.y + 30, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Source x value").fill("3");
await lesson.getByLabel("Source y value").fill("2");
checks.components = await state();

for (const value of ["-2", "0", "2"])
  await lesson.getByRole("button", { name: value, exact: true }).click();
checks.positive = await state();
await lesson.getByLabel("Scalar k").fill("-2.5");
checks.range = await state();
await lesson.getByRole("button", { name: "-5", exact: true }).click();
checks.preset = await state();
await lesson.getByLabel("Scalar k").fill("-3");

await lesson.getByLabel("Show scalar grid").uncheck();
checks.gridOff = await state();
await lesson.getByLabel("Show scalar grid").check();
await lesson.getByLabel("Expand vector plane").click();
checks.expanded = await state();
await lesson.getByLabel("Expand vector plane").click();

for (const name of [
  "Observe",
  "Notice the pattern",
  "Understand the rule",
  "Try independently",
  "Manipulate",
])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.stages = await state();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.actions = await state();

await lesson.getByLabel("Practice result x").fill("4");
await lesson.getByLabel("Practice result y").fill("-2");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.practiceWrong = await state();
await lesson.getByLabel("Practice result x").fill("5");
await lesson.getByLabel("Practice result y").fill("-2.5");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.practiceCorrect = await state();
await lesson.getByRole("button", { name: /Show hint/ }).click();
checks.hint = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".sm188-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".sm188-nav a").last().getAttribute("href");
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const r = document.querySelector(selector)?.getBoundingClientRect();
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
      page: region(".sm188-page"),
      header: region(".sm188-header"),
      stages: region(".sm188-stages"),
      work: region(".sm188-work"),
      instruction: region(".sm188-instruction"),
      learn: region(".sm188-learn"),
      practice: region(".sm188-practice"),
      navigation: region(".sm188-nav"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1149 &&
  metrics.viewport.height === 1369 &&
  metrics.document.width === 1149 &&
  metrics.document.height <= 1369 &&
  Math.round(metrics.regions.header.top) === 99 &&
  Math.round(metrics.regions.header.left) === 250 &&
  Math.round(metrics.regions.header.height) === 187 &&
  Math.round(metrics.regions.stages.top) === 298 &&
  Math.round(metrics.regions.stages.height) === 68 &&
  Math.round(metrics.regions.work.top) === 378 &&
  Math.round(metrics.regions.work.height) === 488 &&
  Math.round(metrics.regions.instruction.top) === 874 &&
  Math.round(metrics.regions.instruction.height) === 31 &&
  Math.round(metrics.regions.learn.top) === 916 &&
  Math.round(metrics.regions.learn.height) === 272 &&
  Math.round(metrics.regions.practice.top) === 1200 &&
  Math.round(metrics.regions.practice.height) === 96 &&
  Math.round(metrics.regions.navigation.top) === 1307 &&
  Math.round(metrics.regions.navigation.height) === 55;
const passed =
  checks.initial.vector === "3:2" &&
  checks.initial.scalar === "-3.000" &&
  checks.initial.result === "-9:-6" &&
  checks.keyboard.vector === "4:2" &&
  checks.keyboard.result === "-12:-6" &&
  checks.drag.vector !== checks.keyboard.vector &&
  checks.components.vector === "3:2" &&
  checks.components.result === "-9:-6" &&
  checks.positive.scalar === "2.000" &&
  checks.positive.result === "6:4" &&
  checks.range.scalar === "-2.500" &&
  checks.range.result === "-7.5:-5" &&
  checks.preset.scalar === "-5.000" &&
  checks.gridOff.grid === "false" &&
  checks.expanded.expanded === "true" &&
  checks.stages.stage === "1" &&
  checks.actions.language === "हिन्दी (Hindi)" &&
  checks.actions.shared === "true" &&
  checks.practiceWrong.correct === "false" &&
  checks.practiceWrong.feedback.startsWith("Not yet") &&
  checks.practiceCorrect.answers === "5:-2.5" &&
  checks.practiceCorrect.correct === "true" &&
  checks.practiceCorrect.feedback === "Correct: v = (5, -2.5)." &&
  checks.hint.hint === "true" &&
  checks.reset.vector === "3:2" &&
  checks.reset.scalar === "-3.000" &&
  checks.reset.result === "-9:-6" &&
  checks.reset.grid === "true" &&
  checks.reset.stage === "1" &&
  previousHref === "/lessons/geometry/187-vector-subtraction" &&
  nextHref === "/lessons/geometry/189-magnitude-and-unit-vectors" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0245-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0245-reference.png"));
const report = {
  mockup: "0245",
  lessonId: 188,
  route: "/lessons/geometry/188-scalar-multiplication",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0245-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
