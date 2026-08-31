/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0523-interactive-intermediate-advanced-sequences-and-series-fibonacci-sequence-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/338-fibonacci-sequence";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0523");
await lesson.waitFor({ timeout: 600000 });
await page.waitForFunction(() => {
  const node = document.querySelector('[data-testid="sequence-mockup-0523"]');
  return node && Math.round(node.getBoundingClientRect().left) === 180;
});
const state = () =>
  lesson.evaluate((node) =>
    Object.fromEntries(
      [
        "first",
        "second",
        "built",
        "auto",
        "playing",
        "speed",
        "terms",
        "ratios",
        "tab",
        "saved",
        "quick-result",
        "actions",
      ].map((k) => [k, node.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
const seedLabels = lesson.locator(".seeds label");
await seedLabels.nth(0).locator("button").nth(1).click();
await seedLabels.nth(1).locator("button").nth(1).click();
await seedLabels.nth(1).locator("button").nth(1).click();
checks.seeds = await state();
await lesson.getByLabel("Fibonacci auto build").uncheck();
await lesson.getByLabel("Fibonacci build speed").fill("7");
await lesson.getByLabel("Fibonacci auto build").check();
await lesson.getByTitle("Play").click();
await page.waitForTimeout(500);
await lesson.getByTitle("Pause").click();
checks.autoplay = await state();
const handle = lesson.locator('[data-drag="fibonacci-seed-square"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Fibonacci seed square missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 55, box.y, { steps: 8 });
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "Saved" }).click();
checks.unsaved = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0523"]')
      ?.getAttribute("data-actions") === "0",
);
await lesson.getByRole("button", { name: /A\s+34/ }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: /B\s+55/ }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0523"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => {
  scrollTo(0, 0);
  document.querySelectorAll("*").forEach((node) => {
    if (node.scrollLeft) node.scrollLeft = 0;
  });
});
await page.waitForFunction(() => {
  const node = document.querySelector(".seq338-hero");
  return node && Math.round(node.getBoundingClientRect().left) === 180;
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
  hero: await rect(".seq338-hero"),
  tabs: await rect(".seq338-tabs"),
  build: await rect(".seq338-build"),
  pair: await rect(".seq338-pair"),
  theory: await rect(".seq338-theory"),
  bottom: await rect(".seq338-bottom"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.terms === "1,1,2,3,5,8,13,21,34,55,89,144" &&
  checks.seeds.terms === "2,3,5,8,13,21,34,55,89,144,233,377" &&
  checks.autoplay.speed === "7" &&
  checks.autoplay.built !== checks.seeds.built &&
  checks.drag.second !== "3" &&
  checks.drag.built === "12" &&
  checks.unsaved.saved === "false" &&
  checks.rejected["quick-result"] === "incorrect" &&
  checks.accepted["quick-result"] === "correct" &&
  checks.accepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.hero?.left === 180 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0523-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0523-reference.png"));
await writeFile(
  path.join(evidence, "0523-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0523", lessonId: 338, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
