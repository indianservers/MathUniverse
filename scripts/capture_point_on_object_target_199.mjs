import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0256-interactive-foundational-advanced-dynamic-geometry-constructions-point-on-object-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/199-point-on-object";
const browser = await chromium.launch({ headless: true }),
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
const lesson = page.getByTestId("dynamic-geometry-mockup-0256");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) =>
      Object.fromEntries(
        ["object", "point", "free", "tab", "shared", "practice"].map((k) => [
          k,
          n.getAttribute(`data-${k}`),
        ]),
      ),
    ),
  checks = { initial: await state() };
const handle = await lesson.getByTestId("point-on-object-handle").boundingBox();
await page.mouse.move(handle.x, handle.y);
await page.mouse.down();
await page.mouse.move(handle.x + 75, handle.y - 38, { steps: 8 });
await page.mouse.up();
checks.lineDrag = await state();
const [lx, ly] = checks.lineDrag.point.split(":").map(Number);
checks.lineResidual = ly - 0.5 * lx;
await lesson.getByLabel("Slope m").fill("1");
checks.slope = await state();
await lesson.getByRole("button", { name: "Circle object" }).click();
checks.circleInitial = await state();
const circleHandle = await lesson
  .getByTestId("point-on-object-handle")
  .boundingBox();
await page.mouse.move(circleHandle.x, circleHandle.y);
await page.mouse.down();
await page.mouse.move(circleHandle.x - 70, circleHandle.y + 30, { steps: 7 });
await page.mouse.up();
checks.circleDrag = await state();
const [cx, cy] = checks.circleDrag.point.split(":").map(Number);
checks.circleResidual = cx * cx + cy * cy - 16;
await lesson.getByLabel("Free point mode").check({ force: true });
const graph = await lesson.locator(".po199-graph").boundingBox();
await page.mouse.click(graph.x + 350, graph.y + 80);
checks.free = await state();
await lesson.getByLabel("Free point mode").uncheck({ force: true });
await lesson.getByRole("button", { name: "Line object" }).click();
await lesson.getByLabel("Practice constrained point").fill("4");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.practice = await state();
for (const name of ["Construct", "Formula", "Example", "Practice", "Explore"])
  await lesson
    .getByRole("button", { name: new RegExp(name), exact: false })
    .first()
    .click();
await lesson.getByRole("button", { name: "Share", exact: true }).click();
checks.actions = await state();
const previousHref = await lesson
    .locator(".po199-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".po199-nav a").last().getAttribute("href");
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const r = (s) => {
    const b = document.querySelector(s)?.getBoundingClientRect();
    return b
      ? { top: b.top, height: b.height, left: b.left, width: b.width }
      : null;
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    regions: {
      header: r(".po199-header"),
      tabs: r(".po199-tabs"),
      explore: r(".po199-explore"),
      insights: r(".po199-insights"),
      examples: r(".po199-examples"),
      practice: r(".po199-practice"),
      nav: r(".po199-nav"),
      footer: r(".po199-footer"),
    },
  };
});
const geometry =
  metrics.document.width === 1024 &&
  metrics.document.height <= 1536 &&
  Math.round(metrics.regions.header.left) === 233 &&
  Math.round(metrics.regions.header.width) === 775;
const passed =
  checks.initial.object === "line" &&
  checks.initial.point === "2:1" &&
  checks.lineDrag.point !== checks.initial.point &&
  Math.abs(checks.lineResidual) < 0.02 &&
  checks.slope.point.split(":")[0] === checks.lineDrag.point.split(":")[0] &&
  checks.circleInitial.object === "circle" &&
  Math.abs(checks.circleResidual) < 0.08 &&
  checks.free.free === "true" &&
  checks.practice.practice === "correct" &&
  checks.actions.tab === "Explore" &&
  checks.actions.shared === "true" &&
  previousHref === "/lessons/geometry/198-free-point" &&
  nextHref === "/lessons/geometry/200-intersection-point" &&
  geometry &&
  !metrics.horizontalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0256-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0256-reference.png"));
const report = {
  mockup: "0256",
  lessonId: 199,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0256-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
