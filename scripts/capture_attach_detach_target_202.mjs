import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0259-interactive-foundational-advanced-dynamic-geometry-constructions-attach-detach-point-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/geometry/202-attach-detach-point",
  browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
  }),
  page = await context.newPage(),
  messages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    messages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0259");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) =>
      Object.fromEntries(
        [
          "selected",
          "p",
          "q",
          "attached",
          "center",
          "grid",
          "zoom",
          "pan",
          "tab",
        ].map((k) => [k, n.getAttribute(`data-${k}`)]),
      ),
    ),
  checks = { initial: await state() };
const pt = (s) => s.split(":").map(Number),
  dist = (v, c) => Math.abs(Math.hypot(v[0] - c[0], v[1] - c[1]) - 4);
const drag = async (testid, dx, dy) => {
  const tip = await lesson
    .getByTestId(testid)
    .locator("circle")
    .first()
    .boundingBox();
  await page.mouse.move(tip.x + tip.width / 2, tip.y + tip.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    tip.x + tip.width / 2 + dx,
    tip.y + tip.height / 2 + dy,
    { steps: 8 },
  );
  await page.mouse.up();
};
await drag("attach-point-p", -85, 55);
checks.attachedDrag = await state();
checks.attachedDistance = dist(
  pt(checks.attachedDrag.p),
  pt(checks.attachedDrag.center),
);
await lesson.getByRole("button", { name: "Detach point", exact: true }).click();
const beforeFree = await state();
await drag("attach-point-p", 100, 60);
checks.detachedDrag = await state();
checks.detachedDistance = dist(
  pt(checks.detachedDrag.p),
  pt(checks.detachedDrag.center),
);
await lesson.getByRole("button", { name: /Point Q/ }).click();
await lesson
  .getByRole("button", { name: "Attach to circle", exact: true })
  .click();
checks.qAttached = await state();
checks.qDistance = dist(pt(checks.qAttached.q), pt(checks.qAttached.center));
const pBeforeCenter = checks.qAttached.p,
  qBeforeCenter = checks.qAttached.q;
await drag("constraint-circle-center", 48, -47);
checks.centerMove = await state();
checks.detachedPStayed = checks.centerMove.p === pBeforeCenter;
const q0 = pt(qBeforeCenter),
  q1 = pt(checks.centerMove.q),
  c1 = pt(checks.centerMove.center);
checks.followDelta = { q: [q1[0] - q0[0], q1[1] - q0[1]], center: c1 };
const canvas = await lesson
  .getByRole("img", {
    name: "Circle with attached point P and detached point Q",
  })
  .boundingBox();
await page.mouse.move(canvas.x + 80, canvas.y + 340);
await page.mouse.down();
await page.mouse.move(canvas.x + 110, canvas.y + 360, { steps: 5 });
await page.mouse.up();
await lesson.getByLabel("Model zoom").fill("1.2");
checks.viewChanged = await state();
await lesson.getByRole("button", { name: "Fit view", exact: true }).click();
await lesson.getByRole("button", { name: /Grid/ }).click();
checks.view = await state();
for (const index of [1, 2, 3, 4, 0])
  await lesson.locator(".ad202-tabs button").nth(index).click();
checks.tabs = await state();
const previousHref = await lesson
    .locator(".ad202-nav a")
    .first()
    .getAttribute("href"),
  nextHref = await lesson.locator(".ad202-nav a").last().getAttribute("href");
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
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
      header: r(".ad202-header"),
      tabs: r(".ad202-tabs"),
      main: r(".ad202-main"),
      nav: r(".ad202-nav"),
      footer: r(".ad202-footer"),
    },
  };
});
const geometry =
  metrics.document.width === 1536 &&
  metrics.document.height <= 1024 &&
  Math.round(metrics.regions.header.left) === 291 &&
  Math.round(metrics.regions.header.width) === 1229 &&
  Math.round(metrics.regions.header.top) === 106 &&
  Math.round(metrics.regions.footer.top + metrics.regions.footer.height) <=
    1024;
const passed =
  checks.initial.attached === "true:false" &&
  checks.initial.p === "2.83:2.83" &&
  checks.initial.q === "4.2:2.1" &&
  checks.attachedDrag.p !== checks.initial.p &&
  checks.attachedDistance < 0.02 &&
  beforeFree.attached === "false:false" &&
  checks.detachedDrag.p !== beforeFree.p &&
  checks.detachedDistance > 0.2 &&
  checks.qAttached.attached === "false:true" &&
  checks.qDistance < 0.02 &&
  checks.centerMove.center !== "0:0" &&
  checks.detachedPStayed &&
  Math.abs(checks.followDelta.q[0] - checks.followDelta.center[0]) < 0.02 &&
  Math.abs(checks.followDelta.q[1] - checks.followDelta.center[1]) < 0.02 &&
  checks.viewChanged.zoom === "1.2" &&
  checks.viewChanged.pan !== "0:0" &&
  checks.view.zoom === "1" &&
  checks.view.pan === "0:0" &&
  checks.view.grid === "false" &&
  checks.tabs.tab === "Interaction + visualization" &&
  checks.reset.attached === "true:false" &&
  checks.reset.p === "2.83:2.83" &&
  previousHref === "/lessons/geometry/201-midpoint-or-centre" &&
  nextHref === "/lessons/geometry/203-line-through-two-points" &&
  geometry &&
  !metrics.horizontalOverflow &&
  messages.length === 0;
await page.screenshot({
  path: path.join(out, "0259-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(out, "0259-reference.png"));
const report = {
  mockup: "0259",
  lessonId: 202,
  checks,
  navigation: { previousHref, nextHref },
  metrics,
  consoleMessages: messages,
  passed,
};
await writeFile(
  path.join(out, "0259-dedicated-target-validation.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);
