/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0557-interactive-advanced-complex-numbers-euler-form-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/372-euler-form";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 916, height: 1717 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0557");
await lesson.waitFor({ timeout: 600000 });
const keys = [
  "radius",
  "degrees",
  "radians",
  "point",
  "unit",
  "circle",
  "bridge",
  "rectangular-check",
  "answer",
  "correct",
  "challenge",
  "tab",
  "dragging",
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

await lesson.getByLabel("Radius r value").fill("2");
checks.radius = await state();
await lesson.getByRole("slider", { name: "Angle theta" }).fill("120");
checks.angle = await state();
await lesson.getByRole("button", { name: "Radians", exact: true }).click();
checks.radians = await state();
await lesson.getByLabel("Show trig bridge").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show trig bridge").check();

const point = lesson.locator(".ef372-plane .point");
const pointBox = await point.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await point.dispatchEvent("pointerdown", {
  pointerId: 1,
  isPrimary: true,
  clientX: pointBox.x + pointBox.width / 2,
  clientY: pointBox.y + pointBox.height / 2,
});
await page.waitForTimeout(60);
checks.pointerDown = await state();
await page.mouse.move(pointBox.x + 45, pointBox.y - 28);
await lesson.locator(".ef372-plane svg").dispatchEvent("pointerup", {
  pointerId: 1,
  isPrimary: true,
});
checks.dragged = await state();

await lesson.locator(".ef372-options button").nth(1).click();
checks.wrong = await state();
await lesson.locator(".ef372-options button").nth(0).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "New challenge" }).click();
checks.newChallenge = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0557"]')
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
  hero: await rect(".ef372-hero"),
  tabs: await rect(".ef372-tabs"),
  work: await rect(".ef372-work"),
  lab: await rect(".ef372-lab"),
  side: await rect(".ef372-side"),
  learning: await rect(".ef372-learning"),
  practice: await rect(".ef372-practice"),
  navigation: await rect(".ef372-nav"),
};

const passed =
  checks.initial.radius === "5" &&
  checks.initial.degrees === "53.1" &&
  checks.initial.radians === "0.927" &&
  checks.initial.point === "[3,4]" &&
  checks.radius.radius === "2" &&
  checks.radius.point === "[1.2,1.6]" &&
  checks.angle.degrees === "120" &&
  checks.angle.point === "[-1,1.7]" &&
  checks.radians.unit === "radians" &&
  checks.radians.radians === "2.094" &&
  checks.hidden.bridge === "false" &&
  checks.pointerDown.dragging === "true" &&
  checks.dragged.point !== checks.angle.point &&
  checks.wrong.answer === "B" &&
  checks.wrong.correct === "false" &&
  checks.correct.answer === "A" &&
  checks.correct.correct === "true" &&
  checks.newChallenge.answer === "" &&
  checks.newChallenge.challenge === "2" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.radius === "5" &&
  checks.reset.point === "[3,4]" &&
  checks.reset.actions === "0" &&
  metrics.document.width === 916 &&
  metrics.document.height === 1717 &&
  !metrics.overflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(evidence, "0557-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0557-reference.png"));
await writeFile(
  path.join(evidence, "0557-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0557", lessonId: 372, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
