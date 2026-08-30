/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0396-interactive-advanced-integral-calculus-and-differential-equations-volume-by-slicing-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/317-volume-by-slicing";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0396");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "x",
        "dx",
        "area",
        "dv",
        "volume",
        "tab",
        "actions-open",
        "answer",
        "result",
        "actions",
      ].map((key) => [key, node.getAttribute(`data-${key}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Slice position", { exact: true }).fill("-1.5");
await lesson.getByLabel("Slice thickness", { exact: true }).fill("0.2");
checks.controls = await state();
await lesson.getByRole("button", { name: "Actions", exact: true }).click();
checks.menu = await state();
await lesson.getByRole("button", { name: "Center slice" }).click();
await lesson.getByRole("button", { name: "Thicker slice" }).click();
checks.actions = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tab = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
const handle = lesson.locator('[data-drag="slice-band"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Volume-slicing drag band missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 75, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "B", exact: true }).last().click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "C", exact: true }).last().click();
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0396"]')
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
    hero: rect(".vs317-hero"),
    tabs: rect(".vs317-tabs"),
    lab: rect(".vs317-lab"),
    flow: rect(".vs317-flow"),
    cards: rect(".vs317-cards"),
    practice: rect(".vs317-practice"),
    adjacent: rect(".vs317-adjacent"),
    footer: rect(".vs317-footer"),
  };
});
const passed =
  checks.initial.x === "0.8" &&
  checks.initial.dx === "0.1" &&
  checks.initial.area === "26.26371458" &&
  checks.initial.dv === "2.62637146" &&
  checks.initial.volume === "113.09733553" &&
  checks.controls.x === "-1.5" &&
  checks.controls.dx === "0.2" &&
  checks.menu["actions-open"] === "true" &&
  checks.actions.x === "0" &&
  checks.actions.dx === "0.2" &&
  checks.tab.tab === "Formulas" &&
  checks.localReset.actions === "0" &&
  checks.drag.x !== "0.8" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.shellReset.x === "0.8" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  metrics.footer.bottom === 1526 &&
  consoleMessages.length === 0;
const report = {
  mockup: "0396",
  lessonId: 317,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0396-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0396-reference.png"));
await writeFile(
  path.join(evidence, "0396-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
