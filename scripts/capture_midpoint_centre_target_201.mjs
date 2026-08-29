import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0258-interactive-foundational-advanced-dynamic-geometry-constructions-midpoint-or-centre-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/201-midpoint-or-centre",
  browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1024, height: 1536 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0258");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) =>
      Object.fromEntries(
        [
          "a",
          "b",
          "midpoint",
          "tab",
          "question",
          "answer",
          "reverse",
          "solution",
        ].map((k) => [k, n.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
const handle = lesson.getByTestId("midpoint-endpoint-a").locator("circle"),
  tip = await handle.boundingBox();
await page.mouse.move(tip.x + tip.width / 2, tip.y + tip.height / 2);
await page.mouse.down();
await page.mouse.move(tip.x + tip.width / 2 + 64, tip.y + tip.height / 2 - 64, {
  steps: 8,
});
await page.mouse.up();
checks.drag = await state();
const point = (s) => s.split(":").map(Number),
  da = point(checks.drag.a),
  db = point(checks.drag.b),
  dm = point(checks.drag.midpoint);
checks.distances = {
  am: Math.hypot(da[0] - dm[0], da[1] - dm[1]),
  mb: Math.hypot(db[0] - dm[0], db[1] - dm[1]),
};
await lesson.getByLabel("A x coordinate").fill("-2");
await lesson.getByLabel("A y coordinate").fill("5");
await lesson.getByLabel("B x coordinate").fill("6");
await lesson.getByLabel("B y coordinate").fill("-3");
checks.inputs = await state();
await lesson
  .getByRole("button", { name: "Reverse endpoints challenge" })
  .click();
checks.reverse = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await lesson.getByLabel("Midpoint answer x").fill("0");
await lesson.getByLabel("Midpoint answer y").fill("0");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Midpoint answer x").fill("-1");
await lesson.getByLabel("Midpoint answer y").fill("1");
await lesson.getByRole("button", { name: "Check Answer" }).click();
await lesson.getByRole("button", { name: "Show Solution" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "New Question" }).click();
await lesson.getByLabel("Midpoint answer x").fill("-1");
await lesson.getByLabel("Midpoint answer y").fill("2");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.nextQuestion = await state();
for (const name of ["Manipulate", "Notice", "Understand", "Try", "Observe"])
  await lesson
    .getByRole("button", { name: new RegExp(name) })
    .first()
    .click();
checks.tabs = await state();
const lessonNav = lesson.locator("footer:not(.mid201-site-footer)"),
  previousHref = await lessonNav.locator("a").first().getAttribute("href"),
  nextHref = await lessonNav.locator("a").last().getAttribute("href");
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const root = document.querySelector(
      '[data-testid="dynamic-geometry-mockup-0258"]',
    ),
    children = root
      ? [...root.children].map((e) => {
          const b = e.getBoundingClientRect();
          return {
            tag: e.tagName,
            class: e.className,
            top: b.top,
            height: b.height,
            left: b.left,
            width: b.width,
          };
        })
      : [];
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    children,
  };
});
const first = metrics.children[0],
  last = metrics.children.at(-1),
  geometry =
    metrics.document.width === 1024 &&
    metrics.document.height <= 1536 &&
    Math.round(first.left) === 223 &&
    Math.round(first.width) === 788 &&
    Math.round(first.top) === 110 &&
  Math.round(last.top) === 1452 &&
    Math.round(last.height) === 84;
const passed =
  checks.initial.a === "-4:2" &&
  checks.initial.b === "4:-1" &&
  checks.initial.midpoint === "0:0.5" &&
  checks.drag.midpoint !== checks.initial.midpoint &&
  Math.abs(checks.distances.am - checks.distances.mb) < 0.001 &&
  checks.inputs.midpoint === "2:1" &&
  checks.reverse.a === "6:-3" &&
  checks.reverse.b === "-2:5" &&
  checks.reverse.midpoint === "2:1" &&
  checks.reset.midpoint === "0:0.5" &&
  checks.reset.reverse === "false" &&
  checks.wrong.answer === "incorrect" &&
  checks.correct.answer === "correct" &&
  checks.correct.solution === "true" &&
  checks.nextQuestion.question === "1" &&
  checks.nextQuestion.answer === "correct" &&
  checks.tabs.tab === "Observe" &&
  previousHref === "/lessons/geometry/200-intersection-point" &&
  nextHref === "/lessons/geometry/202-attach-detach-point" &&
  geometry &&
  !metrics.horizontalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0258-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0258-reference.png"));
const report = {
  mockup: "0258",
  lessonId: 201,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0258-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
