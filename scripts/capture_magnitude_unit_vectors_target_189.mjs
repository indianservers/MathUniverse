import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0246-interactive-intermediate-advanced-vectors-magnitude-and-unit-vectors-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/189-magnitude-and-unit-vectors";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("vector-mockup-0246");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "vector",
        "magnitude",
        "unit",
        "drag",
        "tab",
        "shared",
        "answers",
        "hint",
        "correct",
        "feedback",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByTestId("magnitude-vector-tip").press("ArrowRight");
checks.keyboard = await state();
const tip = lesson.getByTestId("magnitude-vector-tip"),
  box = await tip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 45, box.y + 45, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Vector x value").fill("3");
await lesson.getByLabel("Vector y value").fill("2");
checks.components = await state();
await lesson.getByLabel("Enable vector dragging").uncheck();
await lesson.getByTestId("magnitude-vector-tip").press("ArrowRight");
checks.dragDisabled = await state();
await lesson.getByLabel("Enable vector dragging").check();
for (const name of ["Manipulate", "Pattern", "Rule", "Try", "Observe"])
  await lesson.getByRole("button", { name: new RegExp(name) }).click();
checks.tabs = await state();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.share = await state();
await lesson.getByLabel("Practice magnitude").fill("5");
await lesson.getByLabel("Practice unit x").fill("0");
await lesson.getByLabel("Practice unit y").fill("0");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice magnitude").fill("5.385");
await lesson.getByLabel("Practice unit x").fill("-0.371");
await lesson.getByLabel("Practice unit y").fill("0.928");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".muv189-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".muv189-nav a").last().getAttribute("href");
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
      page: region(".muv189-page"),
      header: region(".muv189-header"),
      main: region(".muv189-main"),
      lower: region(".muv189-lower"),
      navigation: region(".muv189-nav"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1536 &&
  metrics.viewport.height === 1024 &&
  metrics.document.width === 1536 &&
  metrics.document.height <= 1024 &&
  Math.round(metrics.regions.header.top) === 114 &&
  Math.round(metrics.regions.header.left) === 292 &&
  Math.round(metrics.regions.header.height) === 159 &&
  Math.round(metrics.regions.main.top) === 286 &&
  Math.round(metrics.regions.main.height) === 421 &&
  Math.round(metrics.regions.lower.top) === 719 &&
  Math.round(metrics.regions.lower.height) === 208 &&
  Math.round(metrics.regions.navigation.top) === 937 &&
  Math.round(metrics.regions.navigation.height) === 75;
const passed =
  checks.initial.vector === "3:2" &&
  Math.abs(+checks.initial.magnitude - Math.sqrt(13)) < 0.001 &&
  checks.initial.unit === "0.832:0.555" &&
  checks.keyboard.vector === "4:2" &&
  checks.drag.vector !== checks.keyboard.vector &&
  checks.components.vector === "3:2" &&
  checks.dragDisabled.drag === "false" &&
  checks.dragDisabled.vector === "3:2" &&
  checks.tabs.tab === "0" &&
  checks.share.shared === "true" &&
  checks.wrong.correct === "false" &&
  checks.wrong.feedback.startsWith("Not yet") &&
  checks.correct.answers === "5.385:-0.371:0.928" &&
  checks.correct.correct === "true" &&
  checks.correct.feedback.startsWith("Correct") &&
  checks.hint.hint === "true" &&
  checks.reset.vector === "3:2" &&
  checks.reset.drag === "true" &&
  checks.reset.tab === "0" &&
  previousHref === "/lessons/geometry/188-scalar-multiplication" &&
  nextHref === "/lessons/geometry/190-dot-product" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0246-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0246-reference.png"));
const report = {
  mockup: "0246",
  lessonId: 189,
  route: "/lessons/geometry/189-magnitude-and-unit-vectors",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0246-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
