/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0383-interactive-advanced-limits-and-differential-calculus-newton-s-method-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/304-newton-s-method";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1023, height: 1537 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0383");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x0",
        "count",
        "last",
        "residual",
        "error",
        "converged",
        "tangent",
        "iterates",
        "result",
        "solution",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Newton initial guess").fill("1");
await lesson.getByLabel("Newton iterations").fill("4");
checks.controls = await state();
const point = lesson.locator('[data-drag="newton-initial"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Newton initial-guess handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
const toggles = lesson.locator(".new304-lab .toggle input");
await toggles.nth(0).uncheck();
await toggles.nth(1).uncheck();
checks.layersOff = await state();
await lesson.getByLabel("Newton practice x1").fill("1");
await lesson.getByRole("button", { name: "Check answers" }).click();
checks.rejected = await state();
await lesson.getByLabel("Newton practice x1").fill("1.347826");
await lesson.getByRole("button", { name: "Check answers" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0383"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0383").waitFor();
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
    hero: rect(".new304-hero"),
    tabs: rect(".new304-tabs"),
    lab: rect(".new304-lab"),
    flow: rect(".new304-flow"),
    info: rect(".new304-info"),
    adjacent: rect(".new304-adjacent"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.x0 === "-0.7" &&
  checks.initial.count === "6" &&
  Math.abs(Number(checks.initial.last) - 1.52138) < 0.00001 &&
  Math.abs(Number(checks.initial.residual)) < 0.00001 &&
  checks.initial.converged === "true" &&
  checks.controls.x0 === "1" &&
  checks.controls.count === "4" &&
  checks.dragged.x0 !== checks.controls.x0 &&
  checks.layersOff.tangent === "false" &&
  checks.layersOff.iterates === "false" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.solution.solution === "true" &&
  checks.localReset.x0 === "-0.7" &&
  checks.localReset.tangent === "true" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1023 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0383",
  lessonId: 304,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0383-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0383-reference.png"));
await writeFile(
  path.join(evidence, "0383-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
