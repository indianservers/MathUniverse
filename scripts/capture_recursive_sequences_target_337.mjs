/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0522-interactive-intermediate-advanced-sequences-and-series-recursive-sequences-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/337-recursive-sequences";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 986, height: 1594 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0522");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "preset",
        "custom",
        "rule",
        "initial",
        "terms",
        "fixed",
        "behavior",
        "precision",
        "shown",
        "tab",
        "quick-result",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByRole("button", { name: /Logistic/ }).click();
checks.logistic = await state();
await lesson.getByLabel("Custom").check();
await lesson.getByLabel("Recursive relation").fill("0.5a + 5");
await lesson.getByLabel("Recursive initial value").fill("4");
await lesson.getByLabel("Recursive precision").selectOption("4");
await lesson.getByRole("button", { name: "Compute sequence" }).click();
checks.custom = await state();
const handle = lesson.locator('[data-drag="recursive-time-seed"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Recursive seed missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 25, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
const download = page.waitForEvent("download");
await lesson.getByRole("button", { name: /Export/ }).click();
checks.download = (await download).suggestedFilename();
await lesson.getByRole("button", { name: /A\s+9\.200000/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /B\s+9\.377920/ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0522"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => scrollTo(0, 0));
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
  tabs: await rect(".seq337-tabs"),
  hero: await rect(".seq337-hero"),
  config: await rect(".seq337-config"),
  three: await rect(".seq337-three"),
  data: await rect(".seq337-data"),
  quick: await rect(".seq337-quick"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.terms ===
    "2,5.2,7.12,8.272,8.9632,9.37792,9.626752,9.776051,9.865631,9.919378" &&
  checks.initial.fixed === "10" &&
  checks.logistic.initial === "0.2" &&
  checks.logistic.behavior === "Nonlinear / divergent" &&
  checks.custom.rule === "0.5aₙ₋₁ + 5" &&
  checks.custom.fixed === "10" &&
  checks.custom.precision === "4" &&
  checks.custom.shown === "10" &&
  checks.drag.initial !== "4" &&
  checks.download === "recursive-sequence.csv" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.accepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0522-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0522-reference.png"));
await writeFile(
  path.join(evidence, "0522-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0522", lessonId: 337, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
