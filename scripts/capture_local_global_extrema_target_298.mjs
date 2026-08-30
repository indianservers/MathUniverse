/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0377-interactive-advanced-limits-and-differential-calculus-local-and-global-extrema-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/298-local-and-global-extrema";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0377");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "left",
        "right",
        "left-value",
        "right-value",
        "absolute-max",
        "absolute-min",
        "vertex",
        "range",
        "result",
        "solution",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Extrema left endpoint").fill("2");
checks.vertexExcluded = await state();
await lesson.getByLabel("Extrema left endpoint").fill("-4");
await lesson.getByLabel("Extrema right endpoint").fill("4");
checks.sliders = await state();
const right = lesson.locator('[data-drag="extrema-right"]'),
  box = await right.boundingBox();
if (!box) throw new Error("Extrema right handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 45, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByText("B", { exact: true }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByText("A", { exact: true }).click();
await lesson.getByRole("button", { name: "Show solution" }).click();
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0377"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0377").waitFor({ timeout: 600000 });
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
    const e = document.querySelector(s);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return Object.fromEntries(
      ["top", "left", "width", "height", "bottom"].map((k) => [
        k,
        Math.round(b[k]),
      ]),
    );
  };
  return {
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    overflow: document.documentElement.scrollWidth > innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    hero: rect(".ext298-hero"),
    tabs: rect(".ext298-tabs"),
    flow: rect(".ext298-flow"),
    lab: rect(".ext298-lab"),
    info: rect(".ext298-info"),
    practice: rect(".ext298-practice"),
    adjacent: rect(".ext298-adjacent"),
  };
});
const passed =
  checks.initial.left === "-5" &&
  checks.initial.right === "5" &&
  checks.initial["left-value"] === "-69" &&
  checks.initial["right-value"] === "-29" &&
  checks.initial["absolute-max"] === "1,3" &&
  checks.initial["absolute-min"] === "-5,-69" &&
  checks.initial.range === "-69,3" &&
  checks.vertexExcluded.vertex === "false" &&
  checks.vertexExcluded["absolute-max"] === "2,1" &&
  checks.sliders.left === "-4" &&
  checks.sliders.right === "4" &&
  checks.dragged.right !== checks.sliders.right &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.solution === "true" &&
  checks.reset.left === "-5" &&
  checks.reset.right === "5" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0377",
  lessonId: 298,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0377-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0377-reference.png"));
await writeFile(
  path.join(evidence, "0377-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
