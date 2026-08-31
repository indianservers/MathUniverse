/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0526-interactive-intermediate-advanced-sequences-and-series-geometric-series-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/341-geometric-series";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 863, height: 1822 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0526");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "first",
        "ratio",
        "count",
        "terms",
        "partials",
        "finite",
        "converges",
        "infinite",
        "tab",
        "challenge",
        "quick-result",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson
  .getByLabel("Geometric series first term", { exact: true })
  .fill("4");
await lesson.getByLabel("Geometric series ratio", { exact: true }).fill("-0.5");
await lesson.getByLabel("Geometric series count", { exact: true }).fill("6");
checks.controls = await state();
await lesson.getByLabel("Geometric series ratio number").fill("1.2");
checks.divergent = await state();
await lesson.getByRole("button", { name: /Reset/, exact: true }).click();
const h1 = lesson.locator('[data-drag="geometric-series-point-1"]'),
  b1 = await h1.boundingBox();
if (!b1) throw Error("First geometric bar missing");
await page.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2);
await page.mouse.down();
await page.mouse.move(b1.x, b1.y - 20, { steps: 6 });
await page.mouse.up();
checks.dragFirst = await state();
await lesson.getByRole("button", { name: /Reset/, exact: true }).click();
const h2 = lesson.locator('[data-drag="geometric-series-point-2"]'),
  b2 = await h2.boundingBox();
if (!b2) throw Error("Ratio bar missing");
await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
await page.mouse.down();
await page.mouse.move(b2.x, b2.y - 20, { steps: 6 });
await page.mouse.up();
checks.dragRatio = await state();
await lesson.getByRole("button", { name: /A\s+2\.5/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /C\s+1\.428571/ }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Try another" }).click();
checks.next = await state();
await lesson.getByRole("button", { name: /B\s+6\.25/ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.secondAccepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0526"]')
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
  hero: await rect(".seq341-hero"),
  tabs: await rect(".seq341-tabs"),
  explorer: await rect(".seq341-explorer"),
  guide: await rect(".seq341-guide"),
  formulas: await rect(".seq341-formulas"),
  worked: await rect(".seq341-worked"),
  check: await rect(".seq341-check"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.terms ===
    "3,1.5,0.75,0.375,0.1875,0.09375,0.046875,0.023438,0.011719,0.005859" &&
  checks.initial.infinite === "6" &&
  checks.controls.terms === "4,-2,1,-0.5,0.25,-0.125" &&
  checks.controls.infinite === "2.666667" &&
  checks.divergent.converges === "false" &&
  checks.divergent.infinite === "diverges" &&
  checks.dragFirst.first !== "3" &&
  checks.dragRatio.ratio !== "0.5" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.next.challenge === "1" &&
  checks.secondAccepted["quick-result"] === "correct" &&
  checks.secondAccepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1822 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0526-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0526-reference.png"));
await writeFile(
  path.join(evidence, "0526-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0526", lessonId: 341, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
