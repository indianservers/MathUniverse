/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0386-interactive-advanced-integral-calculus-and-differential-equations-riemann-sums-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2255/lessons/calculus/307-riemann-sums";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1007, height: 1562 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("calculus-mockup-0386");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "n",
        "mode",
        "alpha",
        "sum",
        "exact",
        "error",
        "percent",
        "rectangles",
        "result",
        "steps",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Riemann partition count").fill("12");
await lesson.getByLabel("Riemann sample point").selectOption("midpoint");
checks.controls = await state();
const boundary = lesson.locator('[data-drag="riemann-partition"]'),
  boundaryBox = await boundary.boundingBox();
if (!boundaryBox) throw new Error("Riemann partition handle missing");
await page.mouse.move(
  boundaryBox.x + boundaryBox.width / 2,
  boundaryBox.y + boundaryBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(boundaryBox.x + 25, boundaryBox.y, { steps: 5 });
await page.mouse.up();
checks.boundaryDrag = await state();
const sample = lesson.locator('[data-drag="riemann-sample"]'),
  sampleBox = await sample.boundingBox();
if (!sampleBox) throw new Error("Riemann sample handle missing");
await page.mouse.move(
  sampleBox.x + sampleBox.width / 2,
  sampleBox.y + sampleBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(sampleBox.x + 10, sampleBox.y, { steps: 5 });
await page.mouse.up();
checks.sampleDrag = await state();
await lesson.locator('.rie307-lab input[type="checkbox"]').uncheck();
checks.hidden = await state();
await lesson.getByLabel("Riemann practice sum").fill("0.3");
await lesson.getByLabel("Riemann practice exact").fill("0.333333");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Riemann practice sum").fill("0.328125");
await lesson.getByRole("button", { name: "Check answer" }).click();
await lesson.getByRole("button", { name: "Show steps" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.localReset = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="calculus-mockup-0386"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByTestId("calculus-mockup-0386").waitFor();
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
    hero: rect(".rie307-hero"),
    tabs: rect(".rie307-tabs"),
    flow: rect(".rie307-flow"),
    lab: rect(".rie307-lab"),
    rule: rect(".rie307-rule"),
    worked: rect(".rie307-worked"),
    practice: rect(".rie307-practice"),
    adjacent: rect(".rie307-adjacent"),
  };
});
const passed =
  checks.initial.n === "8" &&
  checks.initial.mode === "left" &&
  Math.abs(Number(checks.initial.sum) - 4 * Math.PI) < 1e-5 &&
  checks.initial.error === "0" &&
  checks.controls.n === "12" &&
  checks.controls.mode === "midpoint" &&
  checks.boundaryDrag.n !== checks.controls.n &&
  checks.sampleDrag.alpha !== checks.boundaryDrag.alpha &&
  checks.hidden.rectangles === "false" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.steps === "true" &&
  checks.localReset.n === "8" &&
  checks.localReset.mode === "left" &&
  checks.shellReset.actions === "0" &&
  metrics.document.width === 1007 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
const report = {
  mockup: "0386",
  lessonId: 307,
  checks,
  metrics,
  consoleMessages,
  passed,
};
await page.screenshot({
  path: path.join(evidence, "0386-desktop.png"),
  fullPage: false,
});
await copyFile(reference, path.join(evidence, "0386-reference.png"));
await writeFile(
  path.join(evidence, "0386-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
