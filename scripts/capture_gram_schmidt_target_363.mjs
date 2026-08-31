/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0548-interactive-advanced-matrices-and-linear-algebra-gram-schmidt-redesigned.png",
  url =
    process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/advanced-mathematics/363-gramschmidt";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0548");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "v1",
    "v2",
    "projection",
    "u2",
    "e1",
    "e2",
    "dot",
    "independent",
    "step",
    "use-projection",
    "tab",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, a) =>
        Object.fromEntries(a.map((k) => [k, n.getAttribute(`data-${k}`)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("v2 coordinate 1").fill("2");
await lesson.getByLabel("v2 coordinate 2").fill("2");
checks.dependent = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const circle = lesson.locator(".gs363-graph svg circle").nth(1),
  box = await circle.boundingBox();
await page.mouse.move(box.x + 3, box.y + 3);
await page.mouse.down();
await page.mouse.move(box.x + 50, box.y - 30);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByRole("button", { name: /3 Normalize/ }).click();
checks.normalized = await state();
await lesson.getByRole("button", { name: "Remove the projection" }).click();
checks.noProjection = await state();
await lesson.getByRole("button", { name: "Show steps" }).click();
await lesson
  .getByRole("button", { name: "Formula Sequence", exact: true })
  .click();
checks.tabbed = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0548"]')
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
    hero: await rect(".gs363-hero"),
    tabs: await rect(".gs363-tabs"),
    intro: await rect(".gs363-intro"),
    lab: await rect(".gs363-lab"),
    panels: await rect(".gs363-panels"),
    example: await rect(".gs363-example"),
    challenge: await rect(".gs363-challenge"),
  };
const passed =
  checks.initial.projection === "[0.5,0.5]" &&
  checks.initial.u2 === "[0.5,-0.5]" &&
  checks.initial.e1 === "[0.7071,0.7071]" &&
  checks.initial.e2 === "[0.7071,-0.7071]" &&
  checks.initial.dot === "0" &&
  checks.dependent.independent === "false" &&
  checks.dependent.u2 === "[0,0]" &&
  checks.dragged.v2 !== "[1,0]" &&
  checks.normalized.step === "2" &&
  checks.noProjection["use-projection"] === "false" &&
  checks.noProjection.projection === "[0,0]" &&
  checks.noProjection.dot === "0.7071" &&
  checks.tabbed.tab === "Formula Sequence" &&
  checks.reset.actions === "0" &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0548-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0548-reference.png"));
await writeFile(
  path.join(evidence, "0548-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0548", lessonId: 363, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
