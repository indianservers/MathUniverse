/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0555-interactive-advanced-complex-numbers-modulus-and-argument-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/370-modulus-and-argument";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(m.type() + ": " + m.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0555");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "z",
    "modulus",
    "argument",
    "quadrant",
    "ring",
    "triangle",
    "principal",
    "tab",
    "challenge",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, a) =>
        Object.fromEntries(a.map((k) => [k, n.getAttribute("data-" + k)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Real part (a) value").fill("-3");
checks.quadrant2 = await state();
await lesson.getByRole("slider", { name: "Imaginary part (b)" }).fill("-4");
checks.quadrant3 = await state();
await lesson.getByLabel("Show radius ring").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show radius ring").check();
const point = lesson.locator(".ma370-plane .point"),
  box = await point.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 60, box.y - 45);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0555"]')
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
    hero: await rect(".ma370-hero"),
    tabs: await rect(".ma370-tabs"),
    work: await rect(".ma370-work"),
    plane: await rect(".ma370-plane"),
    side: await rect(".ma370-side"),
    learning: await rect(".ma370-learning"),
    practice: await rect(".ma370-practice"),
    navigation: await rect(".ma370-nav"),
  };
const passed =
  checks.initial.z === "[3,4]" &&
  checks.initial.modulus === "5" &&
  checks.initial.argument === "53.13" &&
  checks.quadrant2.z === "[-3,4]" &&
  checks.quadrant2.argument === "126.87" &&
  checks.quadrant2.quadrant === "Quadrant II" &&
  checks.quadrant3.z === "[-3,-4]" &&
  checks.quadrant3.argument === "-126.87" &&
  checks.quadrant3.quadrant === "Quadrant III" &&
  checks.hidden.ring === "false" &&
  checks.dragged.z !== checks.quadrant3.z &&
  checks.challenge.challenge === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.actions === "0" &&
  checks.reset.z === "[3,4]" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0555-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0555-reference.png"));
await writeFile(
  path.join(evidence, "0555-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0555", lessonId: 370, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
