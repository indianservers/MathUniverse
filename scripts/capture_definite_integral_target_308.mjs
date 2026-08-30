/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0387-interactive-advanced-integral-calculus-and-differential-equations-definite-integral-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/308-definite-integral";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 999, height: 1575 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0387");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "a",
        "b",
        "total",
        "positive",
        "negative",
        "zoom",
        "result",
        "actions",
        "layers",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Lower integration bound").fill("-3");
await lesson.getByLabel("Upper integration bound").fill("2");
checks.bounds = await state();
const handle = lesson.locator('[data-drag="definite-a"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Lower-bound drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 35, box.y, { steps: 6 });
await page.mouse.up();
checks.boundDrag = await state();
await lesson.getByRole("button", { name: "Swap limits" }).click();
checks.swapped = await state();
await lesson.getByLabel("Show areas").uncheck();
await lesson.getByLabel("Show curve").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Zoom in").click();
checks.zoomed = await state();
await lesson.getByRole("button", { name: "Fit" }).click();
await lesson.locator('input[name="def308-answer"]').nth(0).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.locator('input[name="def308-answer"]').nth(4).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0387"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0387").waitFor();
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
    hero: rect(".def308-hero"),
    tabs: rect(".def308-tabs"),
    lab: rect(".def308-lab"),
    learning: rect(".def308-learning"),
    practice: rect(".def308-practice"),
  };
});
const expected = integral(-4, 4),
  passed =
    checks.initial.a === "-4" &&
    checks.initial.b === "4" &&
    Math.abs(Number(checks.initial.total) - expected) < 1e-5 &&
    checks.bounds.a === "-3" &&
    checks.bounds.b === "2" &&
    checks.boundDrag.a !== checks.bounds.a &&
    checks.swapped.a === checks.boundDrag.b &&
    checks.swapped.b === checks.boundDrag.a &&
    !checks.hidden.layers.includes("areas") &&
    !checks.hidden.layers.includes("curve") &&
    Number(checks.zoomed.zoom) > 1 &&
    checks.rejected.result === "incorrect" &&
    checks.accepted.result === "correct" &&
    checks.localReset.a === "-4" &&
    checks.localReset.b === "4" &&
    checks.localReset.layers === "axes,grid,curve,areas,labels" &&
    checks.shellReset.actions === "0" &&
    metrics.document.width === 999 &&
    !metrics.overflow &&
    consoleMessages.length === 0;
function primitive(x) {
  return -(x ** 3) / 3 - x ** 2 + 3 * x;
}
function integral(a, b) {
  return primitive(b) - primitive(a);
}
const report = {
  mockup: "0387",
  lessonId: 308,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0387-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0387-reference.png"));
await writeFile(
  path.join(evidence, "0387-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
