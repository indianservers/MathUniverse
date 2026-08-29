import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0243-interactive-intermediate-advanced-vectors-vector-addition-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/186-vector-addition";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1024, height: 1536 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0243");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "u",
        "v",
        "result",
        "origin",
        "head-tail",
        "parallelogram",
        "grid",
        "scale",
        "tab",
        "stage",
        "language",
        "practice",
        "target",
        "correct",
        "feedback",
        "problem",
        "shared",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByTestId("addition-u-tip").press("ArrowRight");
checks.keyboardU = await state();
let vTip = lesson.getByTestId("addition-v-tip"),
  box = await vTip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 38, box.y + 38, { steps: 8 });
await page.mouse.up();
checks.dragV = await state();
await lesson.getByTestId("addition-origin").press("ArrowRight");
checks.origin = await state();
await lesson.getByLabel("Head-to-tail").uncheck();
await lesson.getByRole("button", { name: "Parallelogram" }).click();
await lesson.getByLabel("Grid").uncheck();
await lesson.getByLabel("Increase graph scale").click();
checks.view = await state();
await lesson.getByLabel("Decrease graph scale").click();
await lesson.getByRole("button", { name: /Origin/ }).click();
checks.originReset = await state();
await lesson.getByLabel("u x value").fill("2");
await lesson.getByLabel("u y value").fill("1");
await lesson.getByLabel("v x value").fill("0");
await lesson.getByLabel("v y value").fill("4");
checks.components = await state();
for (const name of ["Components", "Steps", "Rule", "Practice", "Model"])
  await lesson.getByRole("button", { name, exact: true }).click();
checks.tabs = await state();
for (const name of ["Observe", "Pattern", "Rule", "Try"])
  await lesson
    .locator(".va186-header > aside > section button")
    .filter({ hasText: name })
    .click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
checks.stages = await state();
await lesson.getByTestId("addition-practice-tip").press("ArrowLeft");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.practiceWrong = await state();
await lesson.getByLabel("Practice result x value").fill("2");
await lesson.getByLabel("Practice result y value").fill("5");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.practiceCorrect = await state();
await lesson.getByRole("button", { name: "New Problem" }).click();
checks.newProblem = await state();
await lesson.getByRole("button", { name: "Share" }).click();
checks.share = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".va186-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".va186-nav a").last().getAttribute("href");
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
      page: region(".va186-page"),
      header: region(".va186-header"),
      tabs: region(".va186-tabs"),
      work: region(".va186-work"),
      learn: region(".va186-learn"),
      practice: region(".va186-practice"),
      navigation: region(".va186-nav"),
      footer: region(".va186-footer"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1024 &&
  metrics.viewport.height === 1536 &&
  metrics.document.width === 1024 &&
  metrics.document.height <= 1536 &&
  Math.round(metrics.regions.header.top) === 94 &&
  Math.round(metrics.regions.header.left) === 222 &&
  Math.round(metrics.regions.header.height) === 159 &&
  Math.round(metrics.regions.tabs.height) === 41 &&
  Math.round(metrics.regions.work.height) === 584 &&
  Math.round(metrics.regions.learn.height) === 218 &&
  Math.round(metrics.regions.practice.height) === 250 &&
  Math.round(metrics.regions.navigation.height) === 39 &&
  Math.round(metrics.regions.footer.height) === 88;
const passed =
  checks.initial.u === "3:2" &&
  checks.initial.v === "-1:3" &&
  checks.initial.result === "2:5" &&
  checks.keyboardU.u === "4:2" &&
  checks.keyboardU.result === "3:5" &&
  checks.dragV.v !== checks.initial.v &&
  checks.dragV.result !== checks.keyboardU.result &&
  checks.origin.origin === "1:0" &&
  checks.origin.result === checks.dragV.result &&
  checks.view["head-tail"] === "false" &&
  checks.view.parallelogram === "false" &&
  checks.view.grid === "false" &&
  checks.view.scale === "1.25" &&
  checks.originReset.origin === "0:0" &&
  checks.originReset.scale === "1.00" &&
  checks.components.u === "2:1" &&
  checks.components.v === "0:4" &&
  checks.components.result === "2:5" &&
  checks.tabs.tab === "Model" &&
  checks.stages.stage === "4" &&
  checks.stages.language === "हिन्दी (Hindi)" &&
  checks.practiceWrong.practice === "1:5" &&
  checks.practiceWrong.correct === "false" &&
  checks.practiceWrong.feedback.startsWith("Not yet") &&
  checks.practiceCorrect.correct === "true" &&
  checks.practiceCorrect.feedback === "Correct!" &&
  checks.newProblem.problem === "1" &&
  checks.newProblem.target === "2:2" &&
  checks.newProblem.practice === "0:0" &&
  checks.share.shared === "true" &&
  checks.reset.u === "3:2" &&
  checks.reset.v === "-1:3" &&
  checks.reset.result === "2:5" &&
  checks.reset["head-tail"] === "true" &&
  checks.reset.parallelogram === "true" &&
  checks.reset.grid === "true" &&
  previousHref === "/lessons/geometry/185-position-vectors" &&
  nextHref === "/lessons/geometry/187-vector-subtraction" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0243-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0243-reference.png"));
const report = {
  mockup: "0243",
  lessonId: 186,
  route: "/lessons/geometry/186-vector-addition",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0243-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
