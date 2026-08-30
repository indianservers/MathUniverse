/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0389-interactive-advanced-integral-calculus-and-differential-equations-fundamental-theorem-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/310-fundamental-theorem";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0389");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x",
        "a",
        "function",
        "area",
        "instant",
        "tab",
        "result",
        "hint",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("FTC upper bound").fill("4");
await lesson.getByLabel("FTC lower bound").fill("0");
checks.bounds = await state();
await lesson.getByLabel("FTC upper bound").fill("2.5");
const handle = lesson.locator('[data-drag="ftc-x"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("FTC drag handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 45, box.y, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("FTC integrand").selectOption("quadratic");
await lesson.getByRole("button", { name: "Key ideas" }).click();
checks.function = await state();
await lesson.getByLabel("FTC practice accumulation").fill("x^3");
await lesson.getByLabel("FTC practice derivative").fill("2x^2-3x+1");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("FTC practice accumulation").fill("2/3x^3-3/2x^2+x");
await lesson.getByRole("button", { name: "Check answer" }).click();
await lesson.getByRole("button", { name: "Need a hint?" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0389"]')
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
      /*SVG*/
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
    hero: rect(".ftc310-hero"),
    tabs: rect(".ftc310-tabs"),
    lab: rect(".ftc310-lab"),
    theorem: rect(".ftc310-theorem"),
    worked: rect(".ftc310-worked"),
    practice: rect(".ftc310-practice"),
    adjacent: rect(".ftc310-adjacent"),
  };
});
const passed =
  checks.initial.x === "2.5" &&
  checks.initial.a === "-1" &&
  checks.initial.function === "cubic" &&
  checks.bounds.x === "4" &&
  checks.bounds.a === "0" &&
  checks.drag.x !== checks.bounds.x &&
  checks.drag.x !== "2.5" &&
  checks.function.function === "quadratic" &&
  checks.function.tab === "Key ideas" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.hint === "true" &&
  checks.localReset.x === "2.5" &&
  checks.localReset.a === "-1" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0389",
  lessonId: 310,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0389-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0389-reference.png"));
await writeFile(
  path.join(evidence, "0389-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
