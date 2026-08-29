import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0241-interactive-intermediate-advanced-vectors-component-form-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/184-component-form";
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
const lesson = page.getByTestId("vector-mockup-0241");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "vector",
        "magnitude",
        "angle",
        "stage",
        "hint",
        "feedback",
        "correct",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByTestId("component-vector-tip").press("ArrowLeft");
checks.keyboard = await state();
let tip = lesson.getByTestId("component-vector-tip"),
  box = await tip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 46, box.y + 45, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("x component value").fill("5");
await lesson.getByLabel("y component slider").press("ArrowDown");
checks.controls = await state();
for (const name of ["Manipulate", "Notice", "Understand", "Try"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.stages = await state();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByRole("button", { name: "Hint" }).click();
checks.hint = await state();
const hintVisible = await lesson
  .getByText("Move left to -4, then up to +1.", { exact: true })
  .isVisible();
await lesson.getByLabel("x component value").fill("-4");
await lesson.getByLabel("y component value").fill("1");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
const correctVisible = await lesson
  .getByText("Correct: w = (-4, 1).", { exact: true })
  .isVisible();
await lesson.getByRole("button", { name: "Reset View" }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".cf184-nav>a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".cf184-nav>a").last().getAttribute("href"),
  resourceHrefs = await lesson
    .locator(".cf184-nav>div a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
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
      page: region(".cf184-page"),
      header: region(".cf184-header"),
      stages: region(".cf184-stages"),
      work: region(".cf184-work"),
      learn: region(".cf184-learn"),
      navigation: region(".cf184-nav"),
      footer: region(".cf184-footer"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1149 &&
  metrics.viewport.height === 1369 &&
  metrics.document.width === 1149 &&
  metrics.document.height <= 1369 &&
  Math.round(metrics.regions.header.top) === 106 &&
  Math.round(metrics.regions.header.left) === 247 &&
  Math.round(metrics.regions.header.height) === 159 &&
  Math.round(metrics.regions.stages.height) === 56 &&
  Math.round(metrics.regions.work.height) === 568 &&
  Math.round(metrics.regions.learn.height) === 208 &&
  Math.round(metrics.regions.navigation.height) === 63 &&
  Math.round(metrics.regions.footer.height) === 151;
const passed =
  checks.initial.vector === "3:2" &&
  Math.abs(+checks.initial.magnitude - Math.sqrt(13)) < 0.001 &&
  checks.initial.angle === "33.690" &&
  checks.keyboard.vector === "2:2" &&
  checks.drag.vector !== checks.keyboard.vector &&
  checks.controls.vector === "5:0" &&
  checks.stages.stage === "4" &&
  checks.wrong.correct === "false" &&
  checks.wrong.feedback.startsWith("Not yet") &&
  checks.hint.hint === "true" &&
  hintVisible &&
  checks.correct.vector === "-4:1" &&
  checks.correct.correct === "true" &&
  correctVisible &&
  checks.reset.vector === "3:2" &&
  checks.reset.stage === "0" &&
  checks.reset.hint === "false" &&
  previousHref === "/lessons/geometry/183-vector-introduction" &&
  nextHref === "/lessons/geometry/185-position-vectors" &&
  resourceHrefs.join(",") ===
    "#component-example,#component-formula,#component-practice" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0241-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0241-reference.png"));
const report = {
  mockup: "0241",
  lessonId: 184,
  route: "/lessons/geometry/184-component-form",
  checks,
  hintVisible,
  correctVisible,
  navigation: { previousHref, nextHref, resourceHrefs },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0241-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
