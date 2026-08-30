/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0384-interactive-advanced-limits-and-differential-calculus-taylor-polynomial-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/305-taylor-polynomial";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 991, height: 1588 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0384");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "degree",
        "center",
        "live-f",
        "live-t",
        "live-error",
        "max-error",
        "result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Taylor degree").fill("4");
await lesson.getByLabel("Taylor center").evaluate(
  (element, value) => {
    element.value = String(value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  },
  -2 * Math.PI + 146 * 0.05,
);
checks.controls = await state();
const point = lesson.locator('[data-drag="taylor-center"]'),
  box = await point.boundingBox();
if (!box) throw new Error("Taylor center handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 45, box.y, { steps: 6 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Taylor value answer").fill("0.7");
await lesson.getByRole("button", { name: "Check answers" }).click();
checks.rejected = await state();
await lesson.getByLabel("Taylor value answer").fill("0.697067");
await lesson.getByRole("button", { name: "Check answers" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0384"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0384").waitFor();
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
    hero: rect(".tay305-hero"),
    tabs: rect(".tay305-tabs"),
    flow: rect(".tay305-flow"),
    lab: rect(".tay305-lab"),
    info: rect(".tay305-info"),
    practice: rect(".tay305-practice"),
    adjacent: rect(".tay305-adjacent"),
    footer: rect('footer[aria-label="Site footer"]'),
  };
});
const passed =
  checks.initial.degree === "3" &&
  checks.initial.center === "0" &&
  checks.initial["live-f"] === "1" &&
  checks.initial["live-t"] === "1" &&
  checks.initial["live-error"] === "0" &&
  checks.initial.result === "correct" &&
  checks.controls.degree === "4" &&
  Math.abs(Number(checks.controls.center) - 1.016815) < 0.00001 &&
  checks.controls["live-error"] === "0" &&
  checks.dragged.center !== checks.controls.center &&
  checks.dragged["max-error"] !== checks.controls["max-error"] &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.localReset.degree === "3" &&
  checks.localReset.center === "0" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 991 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0384",
  lessonId: 305,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0384-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0384-reference.png"));
await writeFile(
  path.join(evidence, "0384-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
