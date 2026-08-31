/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0554-interactive-advanced-complex-numbers-complex-conjugate-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/369-complex-conjugate";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1029, height: 1529 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(m.type() + ": " + m.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0554");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "z",
    "conjugate",
    "product",
    "argument",
    "mirror",
    "distances",
    "product-check",
    "tab",
    "verdict",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, a) =>
        Object.fromEntries(a.map((k) => [k, n.getAttribute("data-" + k)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByRole("button", { name: "Increase Real part (a)" }).click();
checks.stepped = await state();
await lesson.getByRole("slider", { name: "Imaginary part (b)" }).fill("-2");
checks.negative = await state();
await lesson.getByLabel("Show product check").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show product check").check();
const point = lesson.locator(".cc369-lab .z-point"),
  box = await point.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 55, box.y - 52);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Conjugate real answer").fill("-3");
await lesson.getByLabel("Conjugate imaginary answer").fill("4");
await lesson.getByLabel("Reflected real answer").fill("-3");
await lesson.getByLabel("Reflected imaginary answer").fill("-4");
await lesson.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await lesson.getByLabel("Conjugate imaginary answer").fill("-4");
await lesson.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0554"]')
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
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await rect(".cc369-hero"),
    tabs: await rect(".cc369-tabs"),
    work: await rect(".cc369-work"),
    lab: await rect(".cc369-lab"),
    controls: await rect(".cc369-controls"),
    learning: await rect(".cc369-learning"),
    practice: await rect(".cc369-practice"),
    navigation: await rect(".cc369-nav"),
  };
const passed =
  checks.initial.conjugate === "[2,-1]" &&
  checks.initial.product === "5" &&
  checks.stepped.conjugate === "[3,-1]" &&
  checks.stepped.product === "10" &&
  checks.negative.conjugate === "[3,2]" &&
  checks.negative.argument < "0" &&
  checks.hidden["product-check"] === "false" &&
  checks.dragged.z !== checks.negative.z &&
  checks.dragged.conjugate !== checks.negative.conjugate &&
  checks.rejected.verdict === "incorrect" &&
  checks.accepted.verdict === "correct" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.actions === "0" &&
  checks.reset.z === "[2,1]" &&
  metrics.document.width === 1029 &&
  metrics.document.height === 1529 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0554-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0554-reference.png"));
await writeFile(
  path.join(evidence, "0554-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0554", lessonId: 369, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
