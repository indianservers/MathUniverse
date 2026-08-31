/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0552-interactive-advanced-complex-numbers-complex-addition-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/367-complex-addition";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1002, height: 1569 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(m.type() + ": " + m.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0552");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "z",
  "w",
  "sum",
  "tip",
  "parallelogram",
  "components",
  "tab",
  "revealed",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (n, a) =>
      Object.fromEntries(a.map((k) => [k, n.getAttribute("data-" + k)])),
    keys,
  );
const checks = { initial: await state() };
await lesson.getByLabel("Real part (a) value").fill("3");
checks.edited = await state();
await lesson.getByRole("slider", { name: "Imaginary part (d)" }).fill("-2");
checks.slid = await state();
await lesson.getByLabel("Parallelogram").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Parallelogram").check();
const point = lesson.locator(".ca367-lab .z-point"),
  box = await point.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 55, box.y - 45);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Reveal answer" }).click();
checks.revealed = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0552"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
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
  hero: await rect(".ca367-hero"),
  tabs: await rect(".ca367-tabs"),
  work: await rect(".ca367-work"),
  lab: await rect(".ca367-lab"),
  controls: await rect(".ca367-controls"),
  learning: await rect(".ca367-learning"),
  navigation: await rect(".ca367-nav"),
};
const passed =
  checks.initial.z === "[2,1]" &&
  checks.initial.w === "[-1,3]" &&
  checks.initial.sum === "[1,4]" &&
  checks.edited.sum === "[2,4]" &&
  checks.slid.sum === "[2,-1]" &&
  checks.hidden.parallelogram === "false" &&
  checks.dragged.z !== checks.edited.z &&
  checks.dragged.sum !== checks.slid.sum &&
  checks.revealed.revealed === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.actions === "0" &&
  checks.reset.sum === "[1,4]" &&
  metrics.document.width === 1002 &&
  metrics.document.height === 1569 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0552-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0552-reference.png"));
await writeFile(
  path.join(evidence, "0552-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0552", lessonId: 367, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
