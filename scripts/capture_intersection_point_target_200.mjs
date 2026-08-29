import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0257-interactive-foundational-advanced-dynamic-geometry-constructions-intersection-point-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/200-intersection-point",
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
const lesson = page.getByTestId("dynamic-geometry-mockup-0257");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) =>
      Object.fromEntries(
        [
          "relation",
          "intersection",
          "graph-tool",
          "graph-zoom",
          "answer",
          "activities",
        ].map((k) => [k, n.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
const endpoint = await lesson
  .getByTestId("intersection-endpoint-l1a")
  .boundingBox();
await page.mouse.move(endpoint.x + endpoint.width / 2, endpoint.y + endpoint.height / 2);
await page.mouse.down();
await page.mouse.move(endpoint.x + endpoint.width / 2, endpoint.y + endpoint.height / 2 - 60, { steps: 7 });
await page.mouse.up();
checks.endpointDrag = await state();
await lesson.getByLabel("Line 1 slope").fill("1");
await lesson.getByLabel("Line 1 intercept").fill("2");
await lesson.getByLabel("Line 2 slope").fill("1");
await lesson.getByLabel("Line 2 intercept").fill("3");
checks.parallel = await state();
await lesson.getByLabel("Line 2 intercept").fill("2");
checks.coincident = await state();
await lesson.getByLabel("Line 2 slope").fill("-1");
checks.restored = await state();
await lesson.getByRole("button", { name: "Pan intersection graph" }).click();
const graph = lesson.getByRole("img", {
    name: "Two lines and their intersection on a coordinate plane",
  }),
  box = await graph.boundingBox();
await page.mouse.move(box.x + 220, box.y + 160);
await page.mouse.down();
await page.mouse.move(box.x + 245, box.y + 180, { steps: 5 });
await page.mouse.up();
await lesson.getByRole("button", { name: "Zoom intersection graph" }).click();
checks.view = await state();
await lesson.getByLabel("Intersection answer x").fill("1.2");
await lesson.getByLabel("Intersection answer y").fill("1.4");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.practice = await state();
await lesson.getByRole("button", { name: "Change lines" }).click();
await lesson.getByLabel("Intersection answer x").fill("1");
await lesson.getByLabel("Intersection answer y").fill("3");
await lesson.getByRole("button", { name: "Check answer" }).click();
await lesson.getByRole("button", { name: "Show steps" }).click();
for (const name of [
  "Pattern",
  "Rule",
  "Try",
  "Summary",
  "1 Observe & Manipulate",
])
  await lesson.getByRole("button", { name, exact: true }).click();
checks.actions = await state();
const previousHref = await lesson
    .locator("footer a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator("footer a").last().getAttribute("href");
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const root = document.querySelector(
      '[data-testid="dynamic-geometry-mockup-0257"]',
    ),
    children = root
      ? [...root.children].map((e) => {
          const b = e.getBoundingClientRect();
          return {
            tag: e.tagName,
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
const geometry =
  metrics.document.width === 1024 &&
  metrics.document.height <= 1536 &&
  metrics.children.every((r) => r.left >= 220 && r.left + r.width <= 1024);
const passed =
  checks.initial.relation === "Intersecting" &&
  checks.initial.intersection === "0.00:2.00" &&
  checks.endpointDrag.intersection !== checks.initial.intersection &&
  checks.parallel.relation === "Parallel" &&
  checks.coincident.relation === "Coincident" &&
  checks.restored.intersection === "0.00:2.00" &&
  checks.view["graph-tool"] === "pan" &&
  checks.view["graph-zoom"] === "1.25" &&
  checks.practice.answer === "correct" &&
  checks.actions.answer === "correct" &&
  previousHref === "/lessons/geometry/199-point-on-object" &&
  nextHref === "/lessons/geometry/201-midpoint-or-centre" &&
  geometry &&
  !metrics.horizontalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0257-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0257-reference.png"));
const report = {
  mockup: "0257",
  lessonId: 200,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0257-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
