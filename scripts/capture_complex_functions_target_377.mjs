/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0562-interactive-advanced-complex-numbers-complex-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/377-complex-functions";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1008, height: 1560 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0562");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "function",
    "z",
    "output",
    "modulus",
    "argument",
    "output-modulus",
    "output-argument",
    "grid",
    "components",
    "polar",
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
await lesson.getByLabel("Function").selectOption("cube");
checks.cube = await state();
await lesson.getByLabel("Function").selectOption("conjugate");
checks.conjugate = await state();
await lesson.getByLabel("Function").selectOption("reciprocal");
await lesson.getByLabel("Real part Re(z) value").fill("0");
await lesson.getByLabel("Imaginary part Im(z) value").fill("0");
checks.undefined = await state();
await lesson.getByLabel("Function").selectOption("square");
await lesson.getByLabel("Real part Re(z) value").fill("2");
await lesson.getByLabel("Imaginary part Im(z) value").fill("1");
await lesson.getByLabel("Show component calculation").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show component calculation").check();
const point = lesson.locator(".cf377-plane.input .point"),
  box = await point.boundingBox();
await point.dispatchEvent("pointerdown", {
  pointerId: 1,
  isPrimary: true,
  clientX: box.x + box.width / 2,
  clientY: box.y + box.height / 2,
});
checks.pointerDown = await state();
await page.mouse.move(box.x + 44, box.y - 30);
await lesson
  .locator(".cf377-plane.input > svg")
  .dispatchEvent("pointerup", { pointerId: 1, isPrimary: true });
checks.dragged = await state();
await lesson.getByRole("button", { name: "Try it now" }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0562"]')
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
    hero: await rect(".cf377-hero"),
    tabs: await rect(".cf377-tabs"),
    lab: await rect(".cf377-lab"),
    main: await rect(".cf377-main"),
    learning: await rect(".cf377-learning"),
    insights: await rect(".cf377-insights"),
    next: await rect(".cf377-next"),
    navigation: await rect(".cf377-nav"),
  };
const passed =
  checks.initial.function === "square" &&
  checks.initial.z === "[2,1]" &&
  checks.initial.output === "[3,4]" &&
  checks.initial.modulus === "2.236" &&
  checks.initial["output-modulus"] === "5" &&
  checks.cube.function === "cube" &&
  checks.cube.output === "[2,11]" &&
  checks.conjugate.output === "[2,-1]" &&
  checks.undefined.output === "undefined" &&
  checks.undefined["output-modulus"] === "undefined" &&
  checks.hidden.components === "false" &&
  checks.pointerDown.dragging === "true" &&
  checks.dragged.z !== "[2,1]" &&
  checks.dragged.output !== "[3,4]" &&
  checks.challenge.function === "square" &&
  checks.challenge.z === "[1,2]" &&
  checks.challenge.output === "[-3,4]" &&
  checks.challenge.challenge === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.z === "[2,1]" &&
  checks.reset.output === "[3,4]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1008 &&
  metrics.document.height === 1560 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0562-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0562-reference.png"));
await writeFile(
  path.join(evidence, "0562-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0562", lessonId: 377, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
