/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0525-interactive-intermediate-advanced-sequences-and-series-arithmetic-series-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/340-arithmetic-series";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 862, height: 1824 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0525");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "first",
        "difference",
        "count",
        "terms",
        "partials",
        "last",
        "pair-sum",
        "total",
        "tab",
        "interactive",
        "quick-result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Arithmetic series first term").fill("-1");
await lesson.getByLabel("Arithmetic series difference").fill("2");
await lesson.getByLabel("Arithmetic series count").fill("6");
checks.controls = await state();
await lesson.getByRole("button", { name: "Interactive mode" }).click();
checks.view = await state();
await lesson.getByRole("button", { name: "View mode" }).click();
const firstHandle = lesson.locator('[data-drag="arithmetic-series-point-1"]'),
  fb = await firstHandle.boundingBox();
if (!fb) throw Error("First series point missing");
await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
await page.mouse.down();
await page.mouse.move(fb.x, fb.y - 25, { steps: 7 });
await page.mouse.up();
checks.dragFirst = await state();
await lesson.getByRole("button", { name: /Reset/, exact: true }).click();
const lastHandle = lesson.locator('[data-drag="arithmetic-series-point-10"]'),
  lb = await lastHandle.boundingBox();
if (!lb) throw Error("Last series point missing");
await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2);
await page.mouse.down();
await page.mouse.move(lb.x, lb.y - 25, { steps: 7 });
await page.mouse.up();
checks.dragDifference = await state();
await lesson.getByRole("button", { name: /B\s+270/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /C\s+348/ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0525"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => {
  scrollTo(0, 0);
  document.querySelectorAll("*").forEach((n) => {
    if (n.scrollLeft) n.scrollLeft = 0;
  });
});
const rect = async (s) => {
  const b = await page.locator(s).first().boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        left: Math.round(b.x),
        width: Math.round(b.width),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  sidebar: await rect('[data-testid="desktop-sidebar"]'),
  hero: await rect(".seq340-hero"),
  tabs: await rect(".seq340-tabs"),
  objective: await rect(".seq340-objective"),
  lab: await rect(".seq340-lab"),
  derivation: await rect(".seq340-derivation"),
  check: await rect(".seq340-check"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.terms === "2,5,8,11,14,17,20,23,26,29" &&
  checks.initial.total === "155" &&
  checks.controls.terms === "-1,1,3,5,7,9" &&
  checks.controls.total === "24" &&
  checks.view.interactive === "false" &&
  checks.dragFirst.first !== "-1" &&
  checks.dragDifference.difference !== "3" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.accepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1824 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0525-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0525-reference.png"));
await writeFile(
  path.join(evidence, "0525-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0525", lessonId: 340, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
