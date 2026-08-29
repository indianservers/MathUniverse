import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0247-interactive-intermediate-advanced-vectors-dot-product-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/190-dot-product";
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
const lesson = page.getByTestId("vector-mockup-0247");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((element) =>
    Object.fromEntries(
      [
        "u",
        "v",
        "dot",
        "angle",
        "cosine",
        "projection",
        "scalar-projection",
        "snap",
        "lock-axes",
        "tab",
        "bookmarked",
        "shared",
        "language",
        "answer",
        "hint",
        "correct",
        "feedback",
      ].map((key) => [key, element.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByTestId("dot-u-tip").press("ArrowRight");
checks.keyboardU = await state();
let vTip = lesson.getByTestId("dot-v-tip"),
  box = await vTip.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 46, box.y + 46, { steps: 8 });
await page.mouse.up();
checks.dragV = await state();
await lesson.getByLabel("u x value").fill("3");
await lesson.getByLabel("u y value").fill("2");
await lesson.getByLabel("v x value").fill("-1");
await lesson.getByLabel("v y value").fill("3");
checks.components = await state();
await lesson.getByRole("button", { name: /Snap/ }).click();
checks.snapOff = await state();
await lesson.getByRole("button", { name: /Lock axes/ }).click();
let uTip = lesson.getByTestId("dot-u-tip"),
  uBox = await uTip.boundingBox();
await page.mouse.move(uBox.x + uBox.width / 2, uBox.y + uBox.height / 2);
await page.mouse.down();
await page.mouse.move(uBox.x - 50, uBox.y + 15, { steps: 8 });
await page.mouse.up();
checks.lockedDrag = await state();
await lesson.getByLabel("u x value").fill("3");
await lesson.getByLabel("u y value").fill("2");
for (const name of ["Components", "Formula", "Examples", "Practice", "Explore"])
  await lesson.getByRole("button", { name, exact: true }).click();
checks.tabs = await state();
await lesson.getByLabel("Bookmark lesson").click();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
await lesson
  .getByLabel("Lesson language")
  .selectOption({ label: "हिन्दी (HI)" });
checks.actions = await state();
await lesson.getByLabel("Practice dot product").fill("1");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Practice dot product").fill("0");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hint = await state();
await lesson
  .getByRole("button", { name: "Reset", exact: true })
  .first()
  .click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".dp190-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".dp190-nav a").last().getAttribute("href");
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
      page: region(".dp190-page"),
      header: region(".dp190-header"),
      main: region(".dp190-main"),
      lower: region(".dp190-lower"),
      navigation: region(".dp190-nav"),
    },
  };
});
const geometryPassed =
  metrics.viewport.width === 1149 &&
  metrics.viewport.height === 1369 &&
  metrics.document.width === 1149 &&
  metrics.document.height <= 1369 &&
  Math.round(metrics.regions.header.top) === 104 &&
  Math.round(metrics.regions.header.left) === 246 &&
  Math.round(metrics.regions.header.height) === 226 &&
  Math.round(metrics.regions.main.top) === 349 &&
  Math.round(metrics.regions.main.height) === 765 &&
  Math.round(metrics.regions.lower.top) === 1125 &&
  Math.round(metrics.regions.lower.height) === 190 &&
  Math.round(metrics.regions.navigation.top) === 1324 &&
  Math.round(metrics.regions.navigation.height) === 38;
const locked = checks.lockedDrag.u.split(":").map(Number),
  passed =
    checks.initial.u === "3:2" &&
    checks.initial.v === "-1:3" &&
    checks.initial.dot === "3.000" &&
    Math.abs(+checks.initial.angle - 74.745) < 0.002 &&
    checks.initial.cosine === "0.263" &&
    checks.initial.projection === "0.692:0.462" &&
    checks.initial["scalar-projection"] === "0.832" &&
    checks.initial.correct === "false" &&
    checks.keyboardU.u === "4:2" &&
    checks.keyboardU.dot === "2.000" &&
    checks.dragV.v !== checks.initial.v &&
    checks.components.u === "3:2" &&
    checks.components.v === "-1:3" &&
    checks.snapOff.snap === "false" &&
    checks.lockedDrag["lock-axes"] === "true" &&
    (locked[0] === 0 || locked[1] === 0) &&
    checks.tabs.tab === "0" &&
    checks.actions.bookmarked === "true" &&
    checks.actions.shared === "true" &&
    checks.actions.language === "हिन्दी (HI)" &&
    checks.wrong.correct === "false" &&
    checks.wrong.feedback.startsWith("Not yet") &&
    checks.correct.answer === "0" &&
    checks.correct.correct === "true" &&
    checks.correct.feedback.startsWith("Correct") &&
    checks.hint.hint === "true" &&
    checks.reset.u === "3:2" &&
    checks.reset.v === "-1:3" &&
    checks.reset.snap === "true" &&
    checks.reset["lock-axes"] === "false" &&
    previousHref === "/lessons/geometry/189-magnitude-and-unit-vectors" &&
    nextHref === "/lessons/geometry/191-cross-product" &&
    geometryPassed &&
    !metrics.horizontalOverflow &&
    !metrics.verticalOverflow &&
    messages.length === 0;
await page.screenshot({
  path: path.join(out, "0247-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0247-reference.png"));
const report = {
  mockup: "0247",
  lessonId: 190,
  route: "/lessons/geometry/190-dot-product",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0247-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
