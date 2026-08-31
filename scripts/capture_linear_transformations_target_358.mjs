/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0543-interactive-advanced-matrices-and-linear-algebra-linear-transformations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/358-linear-transformations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1046, height: 1504 } });
const consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0543");
await lesson.waitFor({ timeout: 600000 });
const keys = ["matrix", "det", "trace", "points", "tab", "drag", "actions"];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(
        names.map((name) => [name, node.getAttribute(`data-${name}`)]),
      ),
    keys,
  );
const checks = { initial: await state() };

await lesson.getByLabel("Matrix entry 1").fill("3");
checks.edited = await state();
await lesson.getByRole("button", { name: /Drag basis vector/ }).click();
const plot = lesson.locator(".mat358-plot svg");
const box = await plot.boundingBox();
await page.mouse.move(
  box.x + box.width * (486 / 720),
  box.y + box.height * (194 / 570),
);
checks.dragged = await state();
await lesson.getByRole("button", { name: "Explain", exact: true }).click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0543"]')
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
  hero: await rect(".mat358-hero"),
  tabs: await rect(".mat358-tabs"),
  lab: await rect(".mat358-lab"),
  results: await rect(".mat358-results"),
  insight: await rect(".mat358-insight"),
  adjacent: await rect(".lesson-adjacent-nav"),
};
const passed =
  checks.initial.matrix === "[2,1,1,2]" &&
  checks.initial.det === "3" &&
  checks.initial.trace === "4" &&
  checks.initial.points === "[[0,0],[2,1],[1,2],[3,3]]" &&
  checks.edited.det === "5" &&
  checks.dragged.matrix !== checks.edited.matrix &&
  checks.tabbed.tab === "Explain" &&
  checks.reset.matrix === "[2,1,1,2]" &&
  checks.reset.actions === "0" &&
  metrics.document.height === 1504 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0543-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0543-reference.png"));
await writeFile(
  path.join(evidence, "0543-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0543", lessonId: 358, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
