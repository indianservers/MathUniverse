import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0242-interactive-intermediate-advanced-vectors-position-vectors-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/185-position-vectors";
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
const lesson = page.getByTestId("vector-mockup-0242");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "a",
        "b",
        "c",
        "active",
        "grid",
        "snap",
        "stage",
        "practice",
        "correct",
        "feedback",
        "shared",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByTestId("position-vector-a").press("ArrowRight");
checks.keyboardA = await state();
let bTip = lesson.getByTestId("position-vector-b"),
  box = await bTip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 35, box.y - 38, { steps: 8 });
await page.mouse.up();
checks.dragB = await state();
await lesson.getByLabel("C x coordinate").fill("-3.5");
await lesson.getByLabel("C y coordinate").fill("2.5");
checks.inputC = await state();
await lesson.getByRole("button", { name: "Hide grid" }).click();
await lesson.getByLabel("Snap to grid").uncheck();
await lesson.getByRole("button", { name: "Select next" }).click();
checks.tools = await state();
for (const name of ["Manipulate", "Pattern", "Rule", "Practice"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.stages = await state();
await lesson.getByLabel("Reset practice").click();
await lesson.getByTestId("position-practice-point").press("ArrowRight");
checks.practiceMove = await state();
await lesson.getByLabel("Practice x coordinate").fill("2");
await lesson.getByLabel("Practice y coordinate").fill("-3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.practiceCorrect = await state();
const correctVisible = await lesson
  .getByText("Correct!", { exact: true })
  .isVisible();
await lesson.getByRole("button", { name: "Share" }).click();
checks.share = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const workspaceHref = await lesson
    .locator(".pv185-header aside a")
    .getAttribute("href"),
  previousHref = await lesson
    .locator(".pv185-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".pv185-nav a").last().getAttribute("href");
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
      page: region(".pv185-page"),
      header: region(".pv185-header"),
      stages: region(".pv185-stages"),
      work: region(".pv185-work"),
      learn: region(".pv185-learn"),
      practice: region(".pv185-practice"),
      navigation: region(".pv185-nav"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1024 &&
  metrics.viewport.height === 1536 &&
  metrics.document.width === 1024 &&
  metrics.document.height <= 1536 &&
  Math.round(metrics.regions.header.top) === 109 &&
  Math.round(metrics.regions.header.left) === 232 &&
  Math.round(metrics.regions.header.height) === 145 &&
  Math.round(metrics.regions.stages.height) === 37 &&
  Math.round(metrics.regions.work.height) === 662 &&
  Math.round(metrics.regions.learn.height) === 253 &&
  Math.round(metrics.regions.practice.height) === 190 &&
  Math.round(metrics.regions.navigation.height) === 54;
const passed =
  checks.initial.a === "3:2" &&
  checks.initial.b === "4:-1" &&
  checks.initial.c === "-2:4" &&
  checks.keyboardA.a === "4:2" &&
  checks.dragB.b !== checks.initial.b &&
  checks.dragB.active === "b" &&
  checks.inputC.c === "-3.5:2.5" &&
  checks.tools.grid === "false" &&
  checks.tools.snap === "false" &&
  checks.stages.stage === "4" &&
  checks.practiceMove.practice === "1:0" &&
  checks.practiceCorrect.practice === "2:-3" &&
  checks.practiceCorrect.correct === "true" &&
  correctVisible &&
  checks.share.shared === "true" &&
  checks.reset.a === "3:2" &&
  checks.reset.b === "4:-1" &&
  checks.reset.c === "-2:4" &&
  checks.reset.grid === "true" &&
  checks.reset.snap === "true" &&
  workspaceHref === "/workspace/geometry" &&
  previousHref === "/lessons/geometry/184-component-form" &&
  nextHref === "/lessons/geometry/186-vector-addition" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0242-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0242-reference.png"));
const report = {
  mockup: "0242",
  lessonId: 185,
  route: "/lessons/geometry/185-position-vectors",
  checks,
  correctVisible,
  navigation: { workspaceHref, previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0242-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
