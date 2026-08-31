/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0521-interactive-intermediate-advanced-sequences-and-series-geometric-sequences-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/336-geometric-sequences";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0521");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "first",
        "ratio",
        "terms",
        "behavior",
        "plot",
        "tab",
        "solver",
        "answer",
        "quick-result",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Geometric first term").fill("4");
await lesson.getByLabel("Geometric common ratio").fill("0.5");
await lesson.getByRole("button", { name: "Log plot (semi-log)" }).click();
checks.controls = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0521"]')
      ?.getAttribute("data-actions") === "0",
);
const handle = lesson.locator('[data-drag="geometric-point-6"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Geometric graph handle missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x, box.y - 25, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0521"]')
      ?.getAttribute("data-actions") === "0",
);
await lesson.getByRole("button", { name: "Solve" }).click();
checks.findN = await state();
await lesson.getByRole("button", { name: "Find a₁" }).click();
await lesson.getByRole("button", { name: "Solve" }).click();
checks.findFirst = await state();
await lesson.getByRole("button", { name: "Find r" }).click();
await lesson.getByRole("button", { name: "Solve" }).click();
checks.findRatio = await state();
await lesson.getByRole("button", { name: "A. 384" }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "C. 1536" }).click();
await lesson.getByRole("button", { name: "Key Insight", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0521"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const b = await page.locator(selector).first().boundingBox();
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
  hero: await rect(".seq336-hero"),
  tabs: await rect(".seq336-tabs"),
  intro: await rect(".seq336-intro"),
  steps: await rect(".seq336-steps"),
  tableGraph: await rect(".seq336-pair.tall"),
  forms: await rect(".seq336-pair.forms"),
  solver: await rect(".seq336-pair.solve-row"),
  notes: await rect(".seq336-notes"),
  quick: await rect(".seq336-quick"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.terms === "3,6,12,24,48,96,192,384,768,1536" &&
  checks.controls.terms ===
    "4,2,1,0.5,0.25,0.125,0.0625,0.03125,0.015625,0.007813" &&
  checks.controls.behavior === "Decay" &&
  checks.controls.plot === "log" &&
  checks.drag.ratio !== "2" &&
  checks.findN.answer === "n = 7" &&
  checks.findFirst.answer === "a₁ = 3" &&
  checks.findRatio.answer === "r = 2" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.accepted.tab === "Key Insight" &&
  checks.shellReset.actions === "0" &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0521-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0521-reference.png"));
await writeFile(
  path.join(evidence, "0521-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0521", lessonId: 336, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
