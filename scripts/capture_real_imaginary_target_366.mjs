/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0551-interactive-advanced-complex-numbers-real-and-imaginary-parts-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/366-real-and-imaginary-parts";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 982, height: 1601 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(message.type() + ": " + message.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0551");
await lesson.waitFor({ timeout: 600000 });

const keys = [
  "z",
  "quadrant",
  "projections",
  "show-quadrant",
  "signs",
  "tab",
  "verdict",
  "solution",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(
        names.map((name) => [name, node.getAttribute("data-" + name)]),
      ),
    keys,
  );
const checks = { initial: await state() };
await lesson
  .getByRole("button", { name: "Increase Real part a = Re(z)" })
  .click();
checks.stepped = await state();
await lesson
  .getByRole("slider", { name: "Imaginary part b = Im(z)" })
  .fill("-2");
checks.slid = await state();
await lesson.getByLabel("Show projections").uncheck();
checks.hidden = await state();
await lesson.getByLabel("Show projections").check();
const point = lesson.locator(".ri366-inspector .point");
const pointBox = await point.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(pointBox.x - 65, pointBox.y - 80);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("Practice real part").fill("-2");
await lesson.getByLabel("Practice imaginary part").fill("-3");
await lesson.getByLabel("Practice quadrant").selectOption("Quadrant II");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.rejected = await state();
await lesson.getByLabel("Practice quadrant").selectOption("Quadrant III");
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.accepted = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0551"]')
      ?.getAttribute("data-actions") === "0",
);
checks.reset = await state();
await page.evaluate(() => scrollTo(0, 0));

const rect = async (selector) => {
  const box = await page.locator(selector).first().boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        left: Math.round(box.x),
        width: Math.round(box.width),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
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
  hero: await rect(".ri366-hero"),
  tabs: await rect(".ri366-tabs"),
  workspace: await rect(".ri366-workspace"),
  inspector: await rect(".ri366-inspector"),
  panel: await rect(".ri366-panel"),
  learning: await rect(".ri366-learning"),
  navigation: await rect(".ri366-nav"),
};
const passed =
  checks.initial.z === "[2,1]" &&
  checks.initial.quadrant === "Quadrant I" &&
  checks.stepped.z === "[3,1]" &&
  checks.slid.z === "[3,-2]" &&
  checks.slid.quadrant === "Quadrant IV" &&
  checks.hidden.projections === "false" &&
  checks.dragged.z !== checks.slid.z &&
  checks.rejected.verdict === "incorrect" &&
  checks.accepted.verdict === "correct" &&
  checks.solution.solution === "true" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.actions === "0" &&
  checks.reset.z === "[2,1]" &&
  metrics.document.width === 982 &&
  metrics.document.height === 1601 &&
  !metrics.overflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(evidence, "0551-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0551-reference.png"));
await writeFile(
  path.join(evidence, "0551-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0551", lessonId: 366, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
