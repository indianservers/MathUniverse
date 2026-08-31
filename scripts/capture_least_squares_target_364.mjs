/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0549-interactive-advanced-matrices-and-linear-algebra-least-squares-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/364-least-squares";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];

page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0549");
await lesson.waitFor({ timeout: 600000 });

const keys = [
    "points",
    "current-line",
    "best-line",
    "current-sse",
    "minimum-sse",
    "atr",
    "mode",
    "tab",
    "challenge",
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

await lesson.getByLabel("Slope m").fill("1");
checks.adjusted = await state();
await lesson.getByRole("button", { name: "I minimized it!" }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "Reveal minimum" }).click();
checks.revealed = await state();
await lesson.getByRole("button", { name: "Edit points (drag)" }).click();
checks.lineMode = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const draggablePoint = lesson.locator(".ls364-plot svg circle").nth(1),
  pointBox = await draggablePoint.boundingBox();
await page.mouse.move(
  pointBox.x + pointBox.width / 2,
  pointBox.y + pointBox.height / 2,
);
await page.mouse.down();
await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y - 45);
await page.mouse.up();
checks.dragged = await state();
await lesson
  .getByRole("button", { name: "Normal Equations", exact: true })
  .click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0549"]')
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
  },
  metrics = {
    document: await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    })),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    hero: await rect(".ls364-hero"),
    tabs: await rect(".ls364-tabs"),
    main: await rect(".ls364-main"),
    concepts: await rect(".ls364-concepts"),
    lower: await rect(".ls364-lower"),
    adjacent: await rect(".lesson-adjacent-nav"),
  };
const passed =
  checks.initial["best-line"] === "[0.7429,0.9619]" &&
  checks.initial["minimum-sse"] === "3.6762" &&
  checks.initial.atr === "[0,0]" &&
  checks.adjusted["current-line"] === "[1,0.1]" &&
  checks.adjusted["current-sse"] !== checks.initial["current-sse"] &&
  checks.rejected.challenge === "incorrect" &&
  checks.revealed["current-line"] === "[0.7429,0.9619]" &&
  checks.revealed.challenge === "correct" &&
  checks.lineMode.mode === "line" &&
  checks.dragged.points !== checks.initial.points &&
  checks.dragged["best-line"] !== checks.initial["best-line"] &&
  checks.tabbed.tab === "Normal Equations" &&
  checks.reset.actions === "0" &&
  checks.reset.points === checks.initial.points &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;

await page.screenshot({
  path: path.join(evidence, "0549-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0549-reference.png"));
await writeFile(
  path.join(evidence, "0549-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0549", lessonId: 364, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
