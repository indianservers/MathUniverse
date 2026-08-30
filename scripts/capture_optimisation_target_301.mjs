/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0380-interactive-advanced-limits-and-differential-calculus-optimisation-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/301-optimisation";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1015, height: 1549 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0380");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x",
        "h",
        "f",
        "slope",
        "finite-slope",
        "best-x",
        "best-value",
        "result",
        "solution",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Optimisation x").fill("1");
checks.xDriven = await state();
await lesson.getByLabel("Optimisation h").fill("0.2");
checks.hDriven = await state();
const point = lesson.locator('[data-drag="optimisation-point"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Optimisation drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 60, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0380"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0380").waitFor();
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
    const e = document.querySelector(s),
      b = e?.getBoundingClientRect();
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
    hero: rect(".opt301-hero"),
    tabs: rect(".opt301-tabs"),
    flow: rect(".opt301-flow"),
    lab: rect(".opt301-lab"),
    info: rect(".opt301-info"),
    adjacent: rect(".opt301-adjacent"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.x === "3" &&
  checks.initial.h === "0.05" &&
  checks.initial.f === "9" &&
  checks.initial.slope === "0" &&
  checks.initial["finite-slope"] === "0" &&
  checks.xDriven.f === "5" &&
  checks.xDriven.slope === "4" &&
  checks.hDriven["finite-slope"] === "4" &&
  checks.dragged.x !== checks.hDriven.x &&
  checks.challenge.result === "correct" &&
  checks.solution.solution === "true" &&
  checks.localReset.x === "3" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1015 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0380",
  lessonId: 301,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0380-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0380-reference.png"));
await writeFile(
  path.join(evidence, "0380-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
