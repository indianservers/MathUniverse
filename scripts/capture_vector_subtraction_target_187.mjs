import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0244-interactive-intermediate-advanced-vectors-vector-subtraction-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/187-vector-subtraction";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1148, height: 1371 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0244");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "a",
        "b",
        "negative-b",
        "result",
        "construction",
        "zoom",
        "fullscreen",
        "tab",
        "bookmarked",
        "shared",
        "answers",
        "choice",
        "hint",
        "revealed",
        "correct",
        "feedback",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };

await lesson.getByTestId("subtraction-a-tip").press("ArrowRight");
checks.keyboardA = await state();
const bTip = lesson.getByTestId("subtraction-b-tip"),
  box = await bTip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 37, box.y + 37, { steps: 8 });
await page.mouse.up();
checks.dragB = await state();

await lesson.getByLabel("a x value").fill("3");
await lesson.getByLabel("a y value").fill("2");
await lesson.getByLabel("b x value").fill("-1");
await lesson.getByLabel("b y value").fill("3");
checks.components = await state();

await lesson.getByLabel("Show construction").uncheck();
checks.constructionOff = await state();
await lesson.getByLabel("Show construction").check();
await lesson.getByLabel("Zoom out").click();
checks.zoomOut = await state();
await lesson.getByLabel("Zoom in").click();
await lesson.getByLabel("Expand subtraction graph").click();
checks.fullscreen = await state();
await lesson.getByLabel("Expand subtraction graph").click();

for (const name of [
  "Manipulate",
  "Notice the pattern",
  "Understand the rule",
  "Try independently",
  "Observe",
])
  await lesson.getByRole("button", { name, exact: true }).click();
checks.tabs = await state();

await lesson.getByLabel("Bookmark lesson").click();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.actions = await state();

await lesson.getByLabel("Practice subtraction x").fill("1");
await lesson.getByLabel("Practice subtraction y").fill("1");
await lesson.getByLabel("a-b=a-b", { exact: true }).check();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceWrong = await state();
await lesson.getByLabel("a-b=a+(-b)", { exact: true }).check();
await lesson.getByLabel("Practice subtraction x").fill("-2");
await lesson.getByLabel("Practice subtraction y").fill("3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceCorrect = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hintHidden = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
await lesson.getByRole("button", { name: "Show answer", exact: true }).click();
checks.revealed = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

const previousHref = await lesson
    .locator(".vs187-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".vs187-nav a").last().getAttribute("href"),
  workspaceHref = await lesson
    .getByRole("link", { name: /Workspace/ })
    .getAttribute("href");
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
      page: region(".vs187-page"),
      header: region(".vs187-header"),
      tabs: region(".vs187-tabs"),
      work: region(".vs187-work"),
      learn: region(".vs187-learn"),
      practice: region(".vs187-practice"),
      navigation: region(".vs187-nav"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1148 &&
  metrics.viewport.height === 1371 &&
  metrics.document.width === 1148 &&
  metrics.document.height <= 1371 &&
  Math.round(metrics.regions.page.top) === 107 &&
  Math.round(metrics.regions.page.bottom) === 1371 &&
  Math.round(metrics.regions.header.top) === 107 &&
  Math.round(metrics.regions.header.left) === 250 &&
  Math.round(metrics.regions.header.height) === 129 &&
  Math.round(metrics.regions.tabs.top) === 248 &&
  Math.round(metrics.regions.tabs.height) === 41 &&
  Math.round(metrics.regions.work.top) === 301 &&
  Math.round(metrics.regions.work.height) === 543 &&
  Math.round(metrics.regions.learn.top) === 858 &&
  Math.round(metrics.regions.learn.height) === 168 &&
  Math.round(metrics.regions.practice.top) === 1040 &&
  Math.round(metrics.regions.practice.height) === 237 &&
  Math.round(metrics.regions.navigation.top) === 1294 &&
  Math.round(metrics.regions.navigation.height) === 61;
const passed =
  checks.initial.a === "3:2" &&
  checks.initial.b === "-1:3" &&
  checks.initial["negative-b"] === "1:-3" &&
  checks.initial.result === "4:-1" &&
  checks.initial.hint === "true" &&
  checks.keyboardA.a === "4:2" &&
  checks.keyboardA.result === "5:-1" &&
  checks.dragB.b !== checks.initial.b &&
  checks.dragB.result !== checks.keyboardA.result &&
  checks.components.a === "3:2" &&
  checks.components.b === "-1:3" &&
  checks.components.result === "4:-1" &&
  checks.constructionOff.construction === "false" &&
  checks.zoomOut.zoom === "0.75" &&
  checks.fullscreen.fullscreen === "true" &&
  checks.tabs.tab === "0" &&
  checks.actions.bookmarked === "true" &&
  checks.actions.shared === "true" &&
  checks.practiceWrong.correct === "false" &&
  checks.practiceWrong.feedback.startsWith("Not yet") &&
  checks.practiceCorrect.answers === "-2:3" &&
  checks.practiceCorrect.correct === "true" &&
  checks.practiceCorrect.feedback === "Correct: (-2,3)." &&
  checks.hintHidden.hint === "false" &&
  checks.revealed.revealed === "true" &&
  checks.reset.a === "3:2" &&
  checks.reset.b === "-1:3" &&
  checks.reset.result === "4:-1" &&
  checks.reset.construction === "true" &&
  checks.reset.zoom === "1.00" &&
  checks.reset.hint === "true" &&
  previousHref === "/lessons/geometry/186-vector-addition" &&
  nextHref === "/lessons/geometry/188-scalar-multiplication" &&
  workspaceHref === "/workspace/geometry" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(out, "0244-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0244-reference.png"));
const report = {
  mockup: "0244",
  lessonId: 187,
  route: "/lessons/geometry/187-vector-subtraction",
  checks,
  navigation: { previousHref, nextHref, workspaceHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0244-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
