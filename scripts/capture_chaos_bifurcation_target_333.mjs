/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0412-interactive-advanced-integral-calculus-and-differential-equations-chaos-and-bifurcation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/calculus/333-chaos-and-bifurcation";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0412");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "r",
        "x0",
        "latest",
        "period",
        "lambda",
        "sensitive",
        "playing",
        "compare",
        "preset",
        "tab",
        "result",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Chaos parameter r").fill("3.2");
await lesson.getByLabel("Chaos initial value").fill("0.21");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.periodic = await state();
const graph = lesson.locator(".chaos333-bifurcation"),
  box = await graph.boundingBox();
if (!box) throw new Error("Bifurcation graph missing");
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
await page.mouse.down();
await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.5, {
  steps: 8,
});
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Play chaos parameter sweep").click();
await page.waitForTimeout(220);
checks.playing = await state();
await lesson.getByLabel("Play chaos parameter sweep").click();
await lesson.getByText("See how dynamics change across regimes.").click();
await lesson
  .getByLabel("Chaos comparison preset")
  .selectOption("Fixed point vs Period-4");
checks.comparison = await state();
await lesson.getByLabel("Chaos period three answer").fill("3.7");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Chaos period three answer").fill("3.83");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0412"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((e) => {
    try {
      e.scrollLeft = 0;
      e.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(250);
const metrics = await page.evaluate(() => {
  const rect = (s) => {
    const b = document.querySelector(s)?.getBoundingClientRect();
    return (
      b &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((k) => [
          k,
          Math.round(b[k]),
        ]),
      )
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".chaos333-hero"),
    tabs: rect(".chaos333-tabs"),
    controls: rect(".chaos333-controls"),
    top: rect(".chaos333-top"),
    mini: rect(".chaos333-mini"),
    compare: rect(".chaos333-compare"),
    bottom: rect(".chaos333-bottom"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (v, e, t = 1e-5) => Math.abs(Number(v) - e) <= t;
const passed =
  close(checks.initial.r, 3.65) &&
  close(checks.initial.x0, 0.2) &&
  Number.isFinite(Number(checks.initial.latest)) &&
  Number.isFinite(Number(checks.initial.lambda)) &&
  Number(checks.initial.sensitive) > 0 &&
  close(checks.periodic.r, 3.2) &&
  checks.periodic.period === "2" &&
  Number(checks.periodic.lambda) < 0 &&
  checks.periodic.tab === "Formula" &&
  checks.drag.r !== checks.periodic.r &&
  checks.playing.playing === "true" &&
  Number(checks.playing.r) > Number(checks.drag.r) &&
  checks.comparison.compare === "false" &&
  checks.comparison.preset === "Fixed point vs Period-4" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.shellReset.r === "3.65" &&
  checks.shellReset.x0 === "0.2" &&
  checks.shellReset.compare === "true" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  metrics.sidebar.width === 208 &&
  metrics.hero.top === 99 &&
  metrics.tabs.top === 214 &&
  metrics.controls.top === 271 &&
  metrics.top.top === 363 &&
  metrics.mini.top === 655 &&
  metrics.compare.top === 870 &&
  metrics.bottom.top === 1147 &&
  metrics.adjacent.top === 1384 &&
  metrics.footer.top === 1445 &&
  metrics.footer.bottom === 1536 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0412",
  lessonId: 333,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0412-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0412-reference.png"));
await writeFile(
  path.join(evidence, "0412-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
