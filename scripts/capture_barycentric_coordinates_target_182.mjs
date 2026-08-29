import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0239-interactive-intermediate-coordinate-geometry-barycentric-coordinates-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/geometry/182-barycentric-coordinates";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 981, height: 1604 },
});
const page = await context.newPage();
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0239");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "weights",
        "point",
        "sum",
        "practice",
        "target",
        "matched",
        "stage",
        "medians",
        "areas",
        "grid",
        "language",
        "shared",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );

const checks = { initial: await state() };
await lesson.getByTestId("barycentric-main-point").press("ArrowRight");
checks.keyboard = await state();

const mainPoint = lesson.getByTestId("barycentric-main-point");
const mainBox = await mainPoint.boundingBox();
await page.mouse.move(
  mainBox.x + mainBox.width / 2,
  mainBox.y + mainBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(mainBox.x - 34, mainBox.y + 28, { steps: 8 });
await page.mouse.up();
checks.drag = await state();

await lesson.getByLabel("Weight a").press("ArrowRight");
checks.weight = await state();
await lesson.getByLabel("Show medians").check();
await lesson.getByLabel("Show areas").uncheck();
await lesson.getByLabel("Grid").check();
checks.toggles = await state();

for (const name of ["Manipulate", "Pattern", "Rule", "Try"]) {
  await lesson.getByText(name, { exact: true }).click();
}
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (Hindi)" });
checks.stagesAndLanguage = await state();

await lesson.getByTestId("barycentric-practice-point").press("ArrowLeft");
checks.practiceKeyboard = await state();
const practiceSvg = lesson.locator(".bc182-triangle.small");
const targetScreenPoint = await practiceSvg.evaluate((svg) => {
  const rect = svg.getBoundingClientRect();
  return {
    x: rect.left + (95 / 260) * rect.width,
    y: rect.top + (137.64 / 190) * rect.height,
  };
});
const practicePoint = lesson.getByTestId("barycentric-practice-point");
const practiceBox = await practicePoint.boundingBox();
await page.mouse.move(
  practiceBox.x + practiceBox.width / 2,
  practiceBox.y + practiceBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(targetScreenPoint.x, targetScreenPoint.y, { steps: 10 });
await page.mouse.up();
checks.practiceMatched = await state();

await lesson.getByRole("button", { name: "New target" }).click();
checks.newTarget = await state();
await lesson.getByRole("button", { name: "Share" }).click();
checks.share = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();

await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

const previousHref = await lesson
  .locator(".bc182-nav a")
  .first()
  .getAttribute("href");
const nextHref = await lesson
  .locator(".bc182-nav a")
  .last()
  .getAttribute("href");
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
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
      page: region(".bc182-page"),
      header: region(".bc182-header"),
      stages: region(".bc182-stages"),
      model: region(".bc182-model"),
      triangle: region(".bc182-triangle:not(.small)"),
      learn: region(".bc182-learn"),
      practice: region(".bc182-practice"),
      navigation: region(".bc182-nav"),
      footer: region(".bc182-footer"),
    },
  };
});

const geometryPassed =
  metrics.viewport.width === 981 &&
  metrics.viewport.height === 1604 &&
  metrics.document.width === 981 &&
  metrics.document.height <= 1604 &&
  Math.round(metrics.regions.header.left) === 242 &&
  Math.round(metrics.regions.header.top) === 112 &&
  Math.round(metrics.regions.header.height) === 160 &&
  Math.round(metrics.regions.stages.height) === 58 &&
  Math.round(metrics.regions.model.height) === 606 &&
  Math.round(metrics.regions.learn.height) === 257 &&
  Math.round(metrics.regions.practice.height) === 213;

const passed =
  checks.initial.weights === "0.5000:0.2000:0.3000" &&
  checks.initial.point === "0.600:2.000" &&
  checks.initial.sum === "1.0000" &&
  checks.initial.practice === "0.2000:0.5000:0.3000" &&
  checks.keyboard.point !== checks.initial.point &&
  checks.drag.point !== checks.keyboard.point &&
  checks.weight.weights !== checks.drag.weights &&
  checks.toggles.medians === "true" &&
  checks.toggles.areas === "false" &&
  checks.toggles.grid === "true" &&
  checks.stagesAndLanguage.stage === "4" &&
  checks.stagesAndLanguage.language === "हिन्दी (Hindi)" &&
  checks.practiceKeyboard.practice !== checks.initial.practice &&
  checks.practiceMatched.matched === "true" &&
  checks.newTarget.target === "0.6:0.1:0.3" &&
  checks.newTarget.practice === "0.3333:0.3333:0.3333" &&
  checks.share.shared === "true" &&
  checks.reset.weights === "0.5000:0.2000:0.3000" &&
  checks.reset.practice === "0.2000:0.5000:0.3000" &&
  checks.reset.stage === "0" &&
  checks.reset.medians === "false" &&
  checks.reset.areas === "true" &&
  checks.reset.grid === "false" &&
  previousHref === "/lessons/geometry/181-parametric-coordinates" &&
  nextHref === "/lessons/geometry/183-vector-introduction" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;

await page.screenshot({
  path: path.join(out, "0239-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0239-reference.png"));
const report = {
  mockup: "0239",
  lessonId: 182,
  route: "/lessons/geometry/182-barycentric-coordinates",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
  mathNote:
    "The target shows weights (0.5, 0.2, 0.3) for A(0,6), B(-6,-2), C(6,-2), but labels the point (1.2,1.8). The mathematically consistent weighted point is (0.6,2.0), which the implementation uses throughout.",
};
await writeFile(
  path.join(out, "0239-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
