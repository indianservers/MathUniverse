/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0401-interactive-advanced-integral-calculus-and-differential-equations-accumulation-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/calculus/322-accumulation-functions";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 943, height: 1667 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0401");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x",
        "n",
        "mode",
        "f",
        "area",
        "approx",
        "error",
        "numerical",
        "playing",
        "tab",
        "selection",
        "result",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
const endpoint = lesson.getByLabel("Accumulation endpoint"),
  endpointBox = await endpoint.boundingBox();
if (!endpointBox) throw new Error("Accumulation slider missing");
const endpointRatio = (1.5 + 2 * Math.PI) / (5 * Math.PI);
await page.mouse.click(
  endpointBox.x + endpointBox.width * endpointRatio,
  endpointBox.y + endpointBox.height / 2,
);
await lesson.getByLabel("Accumulation rectangles").selectOption("24");
await lesson.getByLabel("Accumulation area mode").selectOption("absolute");
checks.controls = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.tab = await state();
await lesson.getByLabel("Play accumulation").click();
await page.waitForTimeout(320);
checks.playing = await state();
await lesson.getByLabel("Pause accumulation").click();
checks.paused = await state();
await lesson.getByLabel("Step accumulation").click();
checks.step = await state();
await lesson.getByLabel("Reset accumulation").click();
checks.localReset = await state();
const handle = lesson.locator('[data-drag="accumulation-x"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Accumulation endpoint handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 80, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Accumulation prediction (0, π)").check();
await lesson
  .getByRole("button", { name: "Check prediction", exact: true })
  .click();
checks.rejected = await state();
await lesson.getByLabel("Accumulation prediction (0, π)").uncheck();
await lesson
  .getByLabel("Accumulation prediction A is always increasing")
  .check();
await lesson
  .getByRole("button", { name: "Check prediction", exact: true })
  .click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0401"]')
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
await page.waitForTimeout(100);
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
    hero: rect(".acc322-hero"),
    tabs: rect(".acc322-tabs"),
    top: rect(".acc322-top"),
    bottom: rect(".acc322-bottom"),
    metrics: rect(".acc322-metrics"),
    learning: rect(".acc322-learning"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (v, n, t = 1e-7) => Math.abs(Number(v) - n) <= t;
const passed =
  checks.initial.x === "3.6" &&
  checks.initial.n === "12" &&
  checks.initial.mode === "signed" &&
  close(checks.initial.f, 1.55747956) &&
  close(checks.initial.area, 9.09675842) &&
  close(checks.initial.numerical, 1.55747963) &&
  close(checks.controls.x, 1.5, 0.02) &&
  checks.controls.n === "24" &&
  checks.controls.mode === "absolute" &&
  close(checks.controls.f, 2 + Math.sin(Number(checks.controls.x))) &&
  close(
    checks.controls.area,
    2 * Number(checks.controls.x) - Math.cos(Number(checks.controls.x)) + 1,
  ) &&
  checks.tab.tab === "Formula" &&
  checks.playing.playing === "true" &&
  checks.playing.x !== checks.controls.x &&
  checks.paused.playing === "false" &&
  Number(checks.step.x) > Number(checks.paused.x) &&
  checks.localReset.x === "0" &&
  checks.drag.x !== "0" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.selection === "4" &&
  checks.shellReset.x === "3.6" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 943 &&
  metrics.document.height === 1667 &&
  !metrics.overflow &&
  metrics.sidebar.width === 197 &&
  metrics.hero.top === 94 &&
  metrics.top.top === 311 &&
  metrics.adjacent.bottom === 1521 &&
  metrics.footer.bottom === 1667 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0401",
  lessonId: 322,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0401-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0401-reference.png"));
await writeFile(
  path.join(evidence, "0401-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
