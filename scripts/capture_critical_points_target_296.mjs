/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0375-interactive-advanced-limits-and-differential-calculus-critical-points-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/296-critical-points";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0375");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "x",
        "h",
        "f",
        "fp",
        "left",
        "right",
        "concavity",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Critical x").fill("-1");
checks.maximum = await state();
await lesson.getByLabel("Critical x").fill("1");
checks.minimum = await state();
await lesson.getByLabel("Critical h").fill("0.1");
checks.step = await state();
const probe = lesson.locator('[data-drag="critical-probe"]'),
  box = await probe.boundingBox();
if (!box) throw new Error("Critical probe missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 40, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("f(x) graph").uncheck();
const curveHidden =
  (await lesson.locator(".crit296-model svg .curve").count()) === 0;
await lesson.getByLabel("f(x) graph").check();
await lesson.getByText("B", { exact: true }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByText("A", { exact: true }).click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0375"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0375").waitFor({ timeout: 600000 });
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
    hero: rect(".crit296-hero"),
    tabs: rect(".crit296-tabs"),
    flow: rect(".crit296-flow"),
    model: rect(".crit296-model"),
    bottom: rect(".crit296-bottom"),
    adjacent: rect(".crit296-adjacent"),
  };
});
const passed =
  checks.initial.x === "0" &&
  checks.initial.fp === "DNE" &&
  checks.initial.left === "-3.9" &&
  checks.initial.right === "-1.95" &&
  checks.maximum.f === "2" &&
  checks.maximum.fp === "0" &&
  checks.maximum.concavity === "Concave down" &&
  checks.minimum.f === "-1" &&
  checks.minimum.fp === "0" &&
  checks.minimum.concavity === "Concave up" &&
  checks.dragged.x !== checks.minimum.x &&
  curveHidden &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.reset.x === "0" &&
  checks.reset.h === "0.05" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0375",
  lessonId: 296,
  checks,
  curveHidden,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0375-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0375-reference.png"));
await writeFile(
  path.join(evidence, "0375-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
