/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0553-interactive-advanced-complex-numbers-complex-multiplication-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/368-complex-multiplication";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1001, height: 1570 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(m.type() + ": " + m.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0553");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "z",
    "w",
    "product",
    "scale",
    "rotation",
    "algebra",
    "show-rotation",
    "show-scale",
    "trace",
    "tab",
    "challenge",
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
await lesson.getByLabel("a (real)").fill("3");
checks.edited = await state();
await lesson.getByLabel("d (imag)").fill("-1");
checks.negative = await state();
await lesson.getByLabel("Show algebra").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show algebra").check();
const point = lesson.locator(".cm368-plane .w-point"),
  box = await point.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 48, box.y - 44);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Try It Yourself" }).click();
await lesson.getByLabel("Rotation direction").selectOption("counterclockwise");
await lesson.getByRole("button", { name: "Check" }).click();
checks.rejected = await state();
await lesson.getByLabel("Rotation direction").selectOption("clockwise");
await lesson.getByRole("button", { name: "Check" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0553"]')
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
    hero: await rect(".cm368-hero"),
    tabs: await rect(".cm368-tabs"),
    work: await rect(".cm368-work"),
    plane: await rect(".cm368-plane"),
    controls: await rect(".cm368-controls"),
    learning: await rect(".cm368-learning"),
    warning: await rect(".cm368-warning"),
    deeper: await rect(".cm368-deeper"),
    navigation: await rect(".cm368-nav"),
  };
const passed =
  checks.initial.product === "[1,3]" &&
  checks.initial.scale === "1.4142" &&
  checks.initial.rotation === "45" &&
  checks.edited.product === "[2,4]" &&
  checks.negative.product === "[4,-2]" &&
  checks.negative.rotation === "-45" &&
  checks.hidden.algebra === "false" &&
  checks.dragged.w !== checks.negative.w &&
  checks.dragged.product !== checks.negative.product &&
  checks.rejected.verdict === "incorrect" &&
  checks.accepted.verdict === "correct" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.actions === "0" &&
  checks.reset.product === "[1,3]" &&
  metrics.document.width === 1001 &&
  metrics.document.height === 1570 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0553-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0553-reference.png"));
await writeFile(
  path.join(evidence, "0553-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0553", lessonId: 368, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
