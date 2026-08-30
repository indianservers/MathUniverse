/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0408-interactive-advanced-integral-calculus-and-differential-equations-phase-plane-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/329-phase-plane";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 992, height: 1586 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0408");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x0",
        "y0",
        "time",
        "x",
        "y",
        "speed",
        "radius",
        "field",
        "nullclines",
        "trajectories",
        "playing",
        "tab",
        "classification",
        "radius-result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Phase plane initial x").fill("2");
await lesson.getByLabel("Phase plane initial y").fill("-1");
await lesson.getByLabel("Phase plane time").fill("1.5");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.controls = await state();
await lesson.getByRole("switch", { name: "Phase plane Vector field" }).click();
await lesson.getByRole("switch", { name: "Phase plane Nullclines" }).click();
await lesson.getByRole("switch", { name: "Phase plane Trajectories" }).click();
checks.layers = await state();
const portrait = lesson.locator(".phase329-portrait");
const portraitBox = await portrait.boundingBox();
if (!portraitBox) throw new Error("Phase portrait missing");
const handle = lesson.locator('[data-drag="phase-initial"]');
const handleBox = await handle.boundingBox();
if (!handleBox) throw new Error("Initial-state handle missing");
await page.mouse.move(
  handleBox.x + handleBox.width / 2,
  handleBox.y + handleBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  portraitBox.x + portraitBox.width * 0.7,
  portraitBox.y + portraitBox.height * 0.25,
  { steps: 8 },
);
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Play phase animation").click();
await page.waitForTimeout(180);
checks.playing = await state();
await lesson.getByLabel("Play phase animation").click();
await lesson.getByRole("button", { name: "Saddle", exact: true }).click();
await lesson.getByLabel("Phase plane radius answer").fill("3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "Center", exact: true }).click();
await lesson.getByLabel("Phase plane radius answer").fill("2");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0408"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.evaluate(() => {
  document.querySelectorAll("*").forEach((element) => {
    try {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } catch {
      /* SVG */
    }
  });
  scrollTo(0, 0);
});
await page.waitForTimeout(150);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const bounds = document.querySelector(selector)?.getBoundingClientRect();
    return (
      bounds &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(bounds[key]),
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
    hero: rect(".phase329-hero"),
    tabs: rect(".phase329-tabs"),
    lab: rect(".phase329-lab"),
    insights: rect(".phase329-insights"),
    system: rect(".phase329-system"),
    worked: rect(".phase329-worked"),
    practice: rect(".phase329-practice"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (value, expected, tolerance = 1e-5) =>
  Math.abs(Number(value) - expected) <= tolerance;
const initialRadius = Math.hypot(1.2, 1.1);
const controlX = 2 * Math.cos(1.5) - Math.sin(1.5);
const controlY = -2 * Math.sin(1.5) - Math.cos(1.5);
const passed =
  close(checks.initial.x0, 1.2) &&
  close(checks.initial.y0, 1.1) &&
  close(checks.initial.radius, initialRadius) &&
  close(checks.initial.speed, initialRadius) &&
  checks.initial.classification === "Center" &&
  close(checks.controls.x0, 2) &&
  close(checks.controls.y0, -1) &&
  close(checks.controls.time, 1.5) &&
  close(checks.controls.x, controlX) &&
  close(checks.controls.y, controlY) &&
  checks.controls.tab === "Formula" &&
  checks.layers.field === "false" &&
  checks.layers.nullclines === "false" &&
  checks.layers.trajectories === "false" &&
  checks.drag.x0 !== checks.layers.x0 &&
  checks.drag.y0 !== checks.layers.y0 &&
  checks.playing.playing === "true" &&
  Number(checks.playing.time) > Number(checks.drag.time) &&
  checks.rejected.classification === "Saddle" &&
  checks.rejected["radius-result"] === "incorrect" &&
  checks.accepted.classification === "Center" &&
  checks.accepted["radius-result"] === "correct" &&
  checks.shellReset.x0 === "1.2" &&
  checks.shellReset.y0 === "1.1" &&
  checks.shellReset.field === "true" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 992 &&
  metrics.document.height === 1586 &&
  !metrics.overflow &&
  metrics.sidebar.width === 208 &&
  metrics.hero.top === 102 &&
  metrics.tabs.top === 228 &&
  metrics.lab.top === 290 &&
  metrics.insights.top === 869 &&
  metrics.system.top === 981 &&
  metrics.worked.top === 1119 &&
  metrics.practice.top === 1298 &&
  metrics.adjacent.top === 1430 &&
  metrics.footer.top === 1485 &&
  metrics.footer.bottom === 1574 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0408",
  lessonId: 329,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0408-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0408-reference.png"));
await writeFile(
  path.join(evidence, "0408-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
