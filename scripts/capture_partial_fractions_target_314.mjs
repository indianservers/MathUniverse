/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0393-interactive-advanced-integral-calculus-and-differential-equations-partial-fractions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/314-partial-fractions";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0393");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x",
        "zoom",
        "asymptotes",
        "overlay",
        "solved",
        "original",
        "split",
        "match",
        "tab",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByRole("button", { name: "Clear coefficients" }).click();
checks.cleared = await state();
await lesson.getByRole("button", { name: "Solve coefficients" }).click();
await lesson.getByLabel("Partial fractions x probe").fill("-3");
await lesson.getByLabel("Partial fractions zoom").fill("2");
checks.controls = await state();
const handle = lesson.locator('[data-drag="partial-probe"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Partial-fractions probe missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 30, box.y, { steps: 6 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByLabel("Show rational asymptotes").uncheck();
await lesson.getByLabel("Show decomposition overlay").uncheck();
await lesson.getByRole("button", { name: "Formulas" }).click();
checks.hidden = await state();
await lesson
  .getByLabel("Partial fractions practice A", { exact: true })
  .fill("1");
await lesson
  .getByLabel("Partial fractions practice B", { exact: true })
  .fill("2");
await lesson
  .getByLabel("Partial fractions practice antiderivative")
  .fill("ln|x-1|+2ln|x+2|");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson
  .getByLabel("Partial fractions practice A", { exact: true })
  .fill("2");
await lesson
  .getByLabel("Partial fractions practice B", { exact: true })
  .fill("1");
await lesson
  .getByLabel("Partial fractions practice antiderivative")
  .fill("2ln|x-1|+ln|x+2|");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0393"]')
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
    hero: rect(".pf314-hero"),
    tabs: rect(".pf314-tabs"),
    workspace: rect(".pf314-workspace"),
    cards: rect(".pf314-cards"),
    adjacent: rect(".pf314-adjacent"),
  };
});
const passed =
  checks.initial.x === "0" &&
  checks.initial.original === "0.125" &&
  checks.initial.split === "0.125" &&
  checks.initial.match === "true" &&
  checks.cleared.solved === "false" &&
  checks.controls.solved === "true" &&
  checks.controls.x === "-3" &&
  checks.controls.zoom === "2" &&
  checks.drag.x !== checks.controls.x &&
  checks.hidden.asymptotes === "false" &&
  checks.hidden.overlay === "false" &&
  checks.hidden.tab === "Formulas" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.localReset.x === "0" &&
  checks.localReset.zoom === "1" &&
  checks.localReset.asymptotes === "true" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0393",
  lessonId: 314,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0393-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0393-reference.png"));
await writeFile(
  path.join(evidence, "0393-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
