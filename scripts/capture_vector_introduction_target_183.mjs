import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0240-interactive-intermediate-advanced-vectors-vector-introduction-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/183-vector-introduction";
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
const lesson = page.getByTestId("vector-mockup-0240");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "a",
        "b",
        "vector",
        "magnitude",
        "angle",
        "components",
        "stage",
        "practice",
        "correct",
        "language",
        "shared",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByTestId("vector-point-b").press("ArrowRight");
checks.keyboard = await state();
let tip = lesson.getByTestId("vector-point-b"),
  box = await tip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 42, box.y + 28, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Point A x").fill("-2");
await lesson.getByLabel("Point A y").fill("1");
await lesson.getByLabel("Point B x").fill("4");
await lesson.getByLabel("Point B y").fill("5");
checks.draft = await state();
await lesson.getByRole("button", { name: "Set from points" }).click();
checks.points = await state();
await lesson.getByLabel("Vector x component").press("ArrowLeft");
await lesson.getByLabel("Vector y exact value").fill("-2");
checks.components = await state();
await lesson.getByRole("button", { name: /components/ }).click();
checks.hidden = await state();
for (const name of ["Manipulate", "Pattern", "Rule", "Practice"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
checks.stages = await state();
await lesson.getByTestId("vector-practice-tip").press("ArrowLeft");
checks.practiceWrong = await state();
await lesson.getByTestId("vector-practice-tip").press("ArrowRight");
await lesson.getByRole("checkbox").nth(0).check();
await lesson.getByRole("checkbox").nth(1).check();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceCorrect = await state();
const feedback = await lesson
  .getByText("Correct vector!", { exact: true })
  .isVisible();
await lesson.getByRole("button", { name: "Share" }).click();
checks.share = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".vi183-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".vi183-nav a").last().getAttribute("href");
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
      page: region(".vi183-page"),
      header: region(".vi183-header"),
      stages: region(".vi183-stages"),
      work: region(".vi183-work"),
      rule: region(".vi183-rule"),
      bottom: region(".vi183-bottom"),
      navigation: region(".vi183-nav"),
      footer: region(".vi183-footer"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1149 &&
  metrics.viewport.height === 1369 &&
  metrics.document.width === 1149 &&
  metrics.document.height <= 1369 &&
  Math.round(metrics.regions.header.top) === 100 &&
  Math.round(metrics.regions.header.height) === 149 &&
  Math.round(metrics.regions.stages.height) === 62 &&
  Math.round(metrics.regions.work.height) === 489 &&
  Math.round(metrics.regions.rule.height) === 157 &&
  Math.round(metrics.regions.bottom.height) === 191 &&
  Math.round(metrics.regions.navigation.height) === 59 &&
  Math.round(metrics.regions.footer.height) === 91;
const passed =
  checks.initial.a === "0:0" &&
  checks.initial.b === "3:2" &&
  checks.initial.vector === "3:2" &&
  Math.abs(+checks.initial.magnitude - Math.sqrt(13)) < 0.001 &&
  checks.keyboard.vector !== checks.initial.vector &&
  checks.drag.vector !== checks.keyboard.vector &&
  checks.draft.vector === checks.drag.vector &&
  checks.points.a === "-2:1" &&
  checks.points.b === "4:5" &&
  checks.points.vector === "6:4" &&
  checks.components.vector === "5:-2" &&
  checks.hidden.components === "false" &&
  checks.stages.stage === "4" &&
  checks.stages.language === "हिन्दी (Hindi)" &&
  checks.practiceWrong.practice === "1:-3" &&
  checks.practiceCorrect.correct === "true" &&
  feedback &&
  checks.share.shared === "true" &&
  checks.reset.vector === "3:2" &&
  checks.reset.components === "true" &&
  checks.reset.stage === "0" &&
  previousHref === "/lessons/geometry/182-barycentric-coordinates" &&
  nextHref === "/lessons/geometry/184-component-form" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0240-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0240-reference.png"));
const report = {
  mockup: "0240",
  lessonId: 183,
  route: "/lessons/geometry/183-vector-introduction",
  checks,
  feedback,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0240-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
