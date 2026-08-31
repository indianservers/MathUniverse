/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0559-interactive-advanced-complex-numbers-roots-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/374-roots";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1008, height: 1561 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0559");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "target-radius",
  "target-angle",
  "index",
  "root-radius",
  "angle-step",
  "roots",
  "selected",
  "unit",
  "spacing",
  "power-check",
  "all-roots",
  "dragging",
  "challenge",
  "tab",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, attributes) =>
      Object.fromEntries(
        attributes.map((key) => [key, node.getAttribute(`data-${key}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };
await lesson.getByLabel("Target modulus").fill("27");
await lesson.getByRole("button", { name: "Decrease root index" }).click();
checks.cube = await state();
await lesson.getByLabel("Target angle").fill("90");
checks.rotated = await state();
await lesson.getByLabel("Radians").check();
checks.radians = await state();
await lesson.getByLabel("Show all roots").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show all roots").check();
const rootPoint = lesson.locator(".rt374-wheel .root").nth(1);
await rootPoint.click();
checks.selected = await state();
const pointBox = await rootPoint.boundingBox();
await rootPoint.dispatchEvent("pointerdown", {
  pointerId: 1,
  isPrimary: true,
  clientX: pointBox.x + pointBox.width / 2,
  clientY: pointBox.y + pointBox.height / 2,
});
checks.pointerDown = await state();
await page.mouse.move(pointBox.x + 40, pointBox.y - 25);
await lesson
  .locator(".rt374-wheel svg")
  .dispatchEvent("pointerup", { pointerId: 1, isPrimary: true });
checks.dragged = await state();
await lesson.getByRole("button", { name: "Start challenge" }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0559"]')
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
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".rt374-hero"),
  tabs: await rect(".rt374-tabs"),
  lab: await rect(".rt374-lab"),
  main: await rect(".rt374-main"),
  learning: await rect(".rt374-learning"),
  warning: await rect(".rt374-warning"),
  navigation: await rect(".rt374-nav"),
};
const passed =
  checks.initial["target-radius"] === "16" &&
  checks.initial.index === "4" &&
  checks.initial["root-radius"] === "2" &&
  checks.initial["angle-step"] === "90" &&
  checks.initial.selected === "1" &&
  checks.initial.roots === "[[2,0],[0,2],[-2,0],[0,-2]]" &&
  checks.cube["target-radius"] === "27" &&
  checks.cube.index === "3" &&
  checks.cube["root-radius"] === "3" &&
  checks.cube["angle-step"] === "120" &&
  checks.rotated["target-angle"] === "90" &&
  checks.rotated.roots === "[[2.598,1.5],[-2.598,1.5],[0,-3]]" &&
  checks.radians.unit === "radians" &&
  checks.hidden["all-roots"] === "false" &&
  checks.selected.selected === "1" &&
  checks.pointerDown.dragging === "true" &&
  checks.dragged["target-angle"] !== checks.rotated["target-angle"] &&
  checks.challenge.challenge === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset["target-radius"] === "16" &&
  checks.reset.index === "4" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 1008 &&
  metrics.document.height === 1561 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0559-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0559-reference.png"));
await writeFile(
  path.join(evidence, "0559-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0559", lessonId: 374, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
