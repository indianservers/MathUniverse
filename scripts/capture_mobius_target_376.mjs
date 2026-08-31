/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0561-interactive-advanced-complex-numbers-mobius-transformations-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/376-mobius-transformations";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0561");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "coefficients",
    "z",
    "w",
    "pole",
    "determinant",
    "defined",
    "grid",
    "circle",
    "show-pole",
    "calculation",
    "challenge",
    "dragging",
    "tab",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, attributes) =>
        Object.fromEntries(
          attributes.map((key) => [key, node.getAttribute(`data-${key}`)]),
        ),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Re(z) value").fill("1");
checks.point = await state();
await lesson.getByLabel("b coefficient").fill("0");
checks.coefficient = await state();
await lesson.getByLabel("Show circle image").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show circle image").check();
const point = lesson.locator(".mb376-plane .point").first(),
  box = await point.boundingBox();
await point.dispatchEvent("pointerdown", {
  pointerId: 1,
  isPrimary: true,
  clientX: box.x + box.width / 2,
  clientY: box.y + box.height / 2,
});
checks.pointerDown = await state();
await page.mouse.move(box.x + 45, box.y - 32);
await lesson
  .locator(".mb376-plane svg")
  .first()
  .dispatchEvent("pointerup", { pointerId: 1, isPrimary: true });
checks.dragged = await state();
await lesson.getByRole("button", { name: "Try it in the lab" }).click();
checks.challenge = await state();
await lesson.getByLabel("Re(z) value").fill("0");
await lesson.getByLabel("Im(z) value").fill("0");
checks.undefined = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0561"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
    const bounds = await page.locator(selector).first().boundingBox();
    return bounds
      ? {
          top: Math.round(bounds.y),
          left: Math.round(bounds.x),
          width: Math.round(bounds.width),
          height: Math.round(bounds.height),
          bottom: Math.round(bounds.y + bounds.height),
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
    hero: await rect(".mb376-hero"),
    tabs: await rect(".mb376-tabs"),
    lab: await rect(".mb376-lab"),
    main: await rect(".mb376-main"),
    learning: await rect(".mb376-learning"),
    navigation: await rect(".mb376-nav"),
  };
const passed =
  checks.initial.coefficients === "[1,-1,1,1]" &&
  checks.initial.z === "[2,1]" &&
  checks.initial.w === "[0.4,0.2]" &&
  checks.initial.pole === "-1" &&
  checks.initial.determinant === "2" &&
  checks.point.z === "[1,1]" &&
  checks.point.w === "[0.2,0.4]" &&
  checks.coefficient.coefficients === "[1,0,1,1]" &&
  checks.hidden.circle === "false" &&
  checks.pointerDown.dragging === "true" &&
  checks.dragged.z !== checks.point.z &&
  checks.dragged.w !== checks.coefficient.w &&
  checks.challenge.coefficients === "[0,1,1,0]" &&
  checks.challenge.z === "[1,0.5]" &&
  checks.challenge.w === "[0.8,-0.4]" &&
  checks.challenge.pole === "0" &&
  checks.undefined.w === "undefined" &&
  checks.undefined.defined === "false" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.z === "[2,1]" &&
  checks.reset.w === "[0.4,0.2]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0561-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0561-reference.png"));
await writeFile(
  path.join(evidence, "0561-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0561", lessonId: 376, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
