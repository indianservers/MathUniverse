import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
/* global document, innerWidth, innerHeight */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0237-interactive-intermediate-coordinate-geometry-polar-coordinates-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/geometry/180-polar-coordinates";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 997, height: 1577 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("geometry-mockup-0237");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((el) =>
      Object.fromEntries(
        ["r", "theta", "x", "y", "quadrant", "stage", "tab", "status"].map(
          (k) => [k, el.getAttribute(`data-${k}`)],
        ),
      ),
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Polar radius value").fill("4");
await lesson.getByLabel("Polar angle value").fill("135");
checks.inputs = await state();
await lesson.getByTestId("polar-cartesian-point").press("ArrowDown");
checks.cartesianKeyboard = await state();
let handle = lesson.getByTestId("polar-cartesian-point"),
  box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 34, box.y + 24, { steps: 7 });
await page.mouse.up();
checks.cartesianDrag = await state();
handle = lesson.getByTestId("polar-radius-point");
await handle.press("ArrowRight");
checks.polarKeyboard = await state();
box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 30, box.y + 35, { steps: 7 });
await page.mouse.up();
checks.polarDrag = await state();
await lesson.getByRole("button", { name: "315°" }).click();
checks.quick = await state();
for (const name of ["Manipulate", "Notice", "Understand", "Try"])
  await lesson.getByText(name, { exact: true }).click();
for (const name of ["Examples", "Formula", "Notes", "Practice"])
  await lesson.getByRole("button", { name, exact: true }).click();
checks.views = await state();
const labels = ["x coordinate", "y coordinate", "radius back", "angle back"];
for (const label of labels) await lesson.getByLabel(label).fill("0");
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.wrong = await state();
const values = [6.062, -3.5, 7, -30];
for (let i = 0; i < labels.length; i++)
  await lesson.getByLabel(labels[i]).fill(String(values[i]));
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.evaluate(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
const previousHref = await lesson
    .locator(".pc180-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".pc180-nav a").last().getAttribute("href"),
  metrics = await page.evaluate(() => {
    const region = (s) => {
      const r = document.querySelector(s)?.getBoundingClientRect();
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
        page: region(".pc180-page"),
        header: region(".pc180-header"),
        stages: region(".pc180-stages"),
        tabs: region(".pc180-tabs"),
        explore: region(".pc180-explore"),
        cartesian: region(".pc180-cart"),
        polar: region(".pc180-polar"),
        learn: region(".pc180-learn"),
        navigation: region(".pc180-nav"),
        footer: region(".pc180-footer"),
      },
    };
  });
const geometryPassed =
  metrics.viewport.width === 997 &&
  metrics.viewport.height === 1577 &&
  metrics.document.width === 997 &&
  metrics.document.height === 1577 &&
  Math.round(metrics.regions.page.left) === 211 &&
  Math.round(metrics.regions.header.left) === 228 &&
  Math.round(metrics.regions.header.top) === 100;
const passed =
  checks.initial.r === "5.000" &&
  checks.initial.theta === "53.130" &&
  checks.initial.x === "3.000" &&
  checks.initial.y === "4.000" &&
  checks.inputs.quadrant === "II" &&
  checks.cartesianKeyboard.r !== checks.inputs.r &&
  checks.cartesianDrag.x !== checks.cartesianKeyboard.x &&
  checks.polarKeyboard.theta !== checks.cartesianDrag.theta &&
  checks.polarDrag.r !== checks.polarKeyboard.r &&
  checks.quick.theta === "-45.000" &&
  checks.quick.quadrant === "IV" &&
  checks.views.stage === "4" &&
  checks.views.tab === "4" &&
  checks.wrong.status === "Recheck the formulas and signs" &&
  checks.correct.status === "Correct polar conversion" &&
  checks.reset.x === "3.000" &&
  checks.reset.y === "4.000" &&
  previousHref === "/lessons/geometry/179-coordinate-transformations" &&
  nextHref === "/lessons/geometry/181-parametric-coordinates" &&
  geometryPassed &&
  !metrics.horizontalOverflow &&
  !metrics.verticalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0237-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0237-reference.png"));
const report = {
  mockup: "0237",
  lessonId: 180,
  route: "/lessons/geometry/180-polar-coordinates",
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0237-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
