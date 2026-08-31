/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0550-interactive-advanced-complex-numbers-complex-plane-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/365-complex-plane";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(message.type() + ": " + message.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("complex-mockup-0550");
await lesson.waitFor({ timeout: 600000 });

const keys = [
  "z",
  "rotated",
  "modulus",
  "argument",
  "theta",
  "zoom",
  "tab",
  "components",
  "trace",
  "grid",
  "values",
  "challenge",
  "verdict",
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
await lesson.getByRole("slider", { name: "Real part (a)" }).fill("3");
await lesson
  .getByRole("slider", { name: "Rotation θ (degrees)" })
  .fill("90");
checks.calculated = await state();
await lesson.getByLabel("Show components (a, b)").uncheck();
checks.hiddenComponents = await state();
await lesson.getByLabel("Show components (a, b)").check();
const point = lesson.locator(".zpoint");
const pointBox = await point.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(pointBox.x - 50, pointBox.y - 40);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByTitle("Zoom").click();
checks.zoomed = await state();
await lesson.getByRole("button", { name: "Start challenge" }).click();
await lesson.getByLabel("Quadrant answer").fill("II");
await lesson.getByRole("button", { name: "Check" }).click();
checks.challenge = await state();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="complex-mockup-0550"]')
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
  hero: await rect(".cp365-hero"),
  tabs: await rect(".cp365-tabs"),
  workspace: await rect(".cp365-workspace"),
  plane: await rect(".cp365-plane"),
  controls: await rect(".cp365-controls"),
  notes: await rect(".cp365-notes"),
  practice: await rect(".cp365-practice"),
  navigation: await rect(".cp365-nav"),
};
const passed =
  checks.initial.z === "[2,1]" &&
  checks.initial.rotated === "[0.7071,2.1213]" &&
  checks.initial.modulus === "2.2361" &&
  checks.initial.argument === "26.5651" &&
  checks.calculated.z === "[3,1]" &&
  checks.calculated.rotated === "[-1,3]" &&
  checks.hiddenComponents.components === "false" &&
  checks.dragged.z !== checks.calculated.z &&
  checks.dragged.rotated !== checks.calculated.rotated &&
  checks.zoomed.zoom === "1.12" &&
  checks.challenge.challenge === "true" &&
  checks.challenge.verdict === "correct" &&
  checks.tabbed.tab === "Formulas" &&
  checks.reset.actions === "0" &&
  checks.reset.z === "[2,1]" &&
  metrics.document.width === 1536 &&
  metrics.document.height === 1024 &&
  !metrics.overflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(evidence, "0550-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0550-reference.png"));
await writeFile(
  path.join(evidence, "0550-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0550", lessonId: 365, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
