/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0407-interactive-advanced-integral-calculus-and-differential-equations-second-order-equations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/calculus/328-second-order-equations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 945, height: 1665 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0407");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "m",
        "c",
        "k",
        "x0",
        "v0",
        "tmax",
        "dt",
        "zeta",
        "wn",
        "wd",
        "regime",
        "root-real",
        "root-imag",
        "peak-x",
        "peak-v",
        "peak-a",
        "period",
        "decrement",
        "tab",
        "choice",
        "result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Oscillator Damping c (N·s/m)").fill("4");
checks.critical = await state();
await lesson.getByLabel("Oscillator damping overview").fill("6");
checks.overdamped = await state();
await lesson.getByLabel("Oscillator Mass m (kg)").fill("2");
await lesson.getByLabel("Oscillator Stiffness k (N/m)").fill("18");
await lesson.getByLabel("Oscillator initial displacement").fill("0.5");
await lesson.getByLabel("Oscillator initial velocity").fill("1");
await lesson.getByLabel("Oscillator Time window (s)").fill("20");
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.controls = await state();
await lesson.getByRole("button", { name: "1.00", exact: true }).click();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "0.50", exact: true }).click();
await lesson.getByRole("button", { name: "Check answer", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0407"]')
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
    hero: rect(".osc328-hero"),
    tabs: rect(".osc328-tabs"),
    lab: rect(".osc328-lab"),
    damping: rect(".osc328-damping"),
    insights: rect(".osc328-insights"),
    bottom: rect(".osc328-bottom"),
    adjacent: rect(".lesson-adjacent-nav"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const close = (value, expected, tolerance = 1e-5) =>
  Math.abs(Number(value) - expected) <= tolerance;
const passed =
  close(checks.initial.m, 1) &&
  close(checks.initial.c, 0.2) &&
  close(checks.initial.k, 4) &&
  close(checks.initial.x0, 1) &&
  close(checks.initial.v0, 0) &&
  close(checks.initial.zeta, 0.05) &&
  close(checks.initial.wn, 2) &&
  checks.initial.regime === "Underdamped" &&
  close(checks.initial["root-real"], -0.1) &&
  close(checks.initial["root-imag"], Math.sqrt(15.96) / 2) &&
  close(checks.critical.zeta, 1) &&
  checks.critical.regime === "Critical" &&
  checks.overdamped.regime === "Overdamped" &&
  close(checks.controls.m, 2) &&
  close(checks.controls.c, 6) &&
  close(checks.controls.k, 18) &&
  close(checks.controls.x0, 0.5) &&
  close(checks.controls.v0, 1) &&
  close(checks.controls.tmax, 20) &&
  checks.controls.tab === "Formula" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.choice === "0.50" &&
  checks.accepted.result === "correct" &&
  checks.shellReset.m === "1" &&
  checks.shellReset.c === "0.2" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 945 &&
  metrics.document.height === 1665 &&
  !metrics.overflow &&
  metrics.sidebar.width === 194 &&
  metrics.hero.top === 91 &&
  metrics.lab.top === 288 &&
  metrics.damping.top === 966 &&
  metrics.adjacent.top === 1522 &&
  metrics.footer.bottom === 1665 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0407",
  lessonId: 328,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0407-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0407-reference.png"));
await writeFile(
  path.join(evidence, "0407-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
