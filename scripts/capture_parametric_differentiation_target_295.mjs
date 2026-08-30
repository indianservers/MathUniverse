/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0374-interactive-advanced-limits-and-differential-calculus-parametric-differentiation-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2255/lessons/calculus/295-parametric-differentiation";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0374");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      ["t", "x", "y", "dx", "dy", "slope", "result", "solution", "actions"].map(
        (k) => [k, n.getAttribute(`data-${k}`)],
      ),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Parametric t").fill("2");
checks.tDriven = await state();
const point = lesson.locator('[data-drag="parametric-point"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Parametric point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y + 40, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByText("A", { exact: true }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByText("B", { exact: true }).click();
await lesson.getByRole("button", { name: "Show solution" }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0374"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0374").waitFor({ timeout: 600000 });
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
    hero: rect(".par295-hero"),
    tabs: rect(".par295-tabs"),
    main: rect(".par295-main"),
    flow: rect(".par295-flow"),
    lab: rect(".par295-lab"),
    learning: rect(".par295-learning"),
    practice: rect(".par295-practice"),
    adjacent: rect(".par295-adjacent"),
  };
});
const passed =
  checks.initial.t === "1.25" &&
  checks.initial.x === "0.5653" &&
  checks.initial.y === "0.88" &&
  checks.initial.dx === "-0.949" &&
  checks.initial.dy === "1.2615" &&
  checks.initial.slope === "-1.3293" &&
  checks.tDriven.t === "2" &&
  checks.dragged.t !== checks.tDriven.t &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.solution === "true" &&
  checks.reset.t === "1.25" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0374",
  lessonId: 295,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0374-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0374-reference.png"));
await writeFile(
  path.join(evidence, "0374-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
