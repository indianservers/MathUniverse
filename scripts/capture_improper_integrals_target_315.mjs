/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0394-interactive-advanced-integral-calculus-and-differential-equations-improper-integrals-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/315-improper-integrals";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 998, height: 1575 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0394");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "c",
        "range",
        "model",
        "accumulated",
        "limit",
        "remainder",
        "converges",
        "tab",
        "answer",
        "result",
        "hint",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Improper integral truncation").fill("4");
await lesson.getByLabel("Improper integral tail range").fill("12");
await lesson.getByLabel("Improper integral function").selectOption("gaussian");
checks.controls = await state();
await lesson.getByRole("button", { name: "Explain", exact: true }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
const handle = lesson.locator('[data-drag="improper-bound"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Improper-integral bound handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 55, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByText("Converges to 0", { exact: true }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByText("Converges to 1", { exact: true }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0394"]')
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
await page.waitForTimeout(100);
const metrics = await page.evaluate(() => {
  const rect = (selector) => {
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return (
      box &&
      Object.fromEntries(
        ["top", "left", "width", "height", "bottom"].map((key) => [
          key,
          Math.round(box[key]),
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
    hero: rect(".ii315-hero"),
    tabs: rect(".ii315-tabs"),
    lab: rect(".ii315-lab"),
    rule: rect(".ii315-rule"),
    bottom: rect(".ii315-bottom"),
    adjacent: rect(".ii315-adjacent"),
    footer: rect(".ii315-footer"),
  };
});
const passed =
  checks.initial.c === "2" &&
  checks.initial.accumulated === "2.21429744" &&
  checks.initial.limit === "3.14159265" &&
  checks.initial.remainder === "0.92729522" &&
  checks.controls.c === "4" &&
  checks.controls.range === "12" &&
  checks.controls.model === "gaussian" &&
  checks.tab.tab === "Explain" &&
  checks.localReset.actions === "0" &&
  checks.drag.c !== "2" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.hint.hint === "true" &&
  checks.shellReset.c === "2" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 998 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0394",
  lessonId: 315,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0394-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0394-reference.png"));
await writeFile(
  path.join(evidence, "0394-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
