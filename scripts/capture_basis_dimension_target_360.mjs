/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0545-interactive-advanced-matrices-and-linear-algebra-basis-and-dimension-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/360-basis-and-dimension";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0545");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "v1",
    "v2",
    "target",
    "det",
    "independent",
    "coordinates",
    "result",
    "selected",
    "basis-result",
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
await lesson.getByLabel("v₂ coordinate 2").fill("1");
checks.dependent = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const circle = lesson.locator(".basis360-work > svg circle").first(),
  box = await circle.boundingBox();
await page.mouse.move(box.x + 3, box.y + 3);
await page.mouse.down();
await page.mouse.move(box.x + 45, box.y - 22);
await page.mouse.up();
checks.dragged = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await lesson.getByLabel("Coefficient c1").fill("2");
await lesson.getByRole("button", { name: "Check decomposition" }).click();
checks.rejected = await state();
await lesson.getByLabel("Coefficient c1").fill("3");
await lesson.getByRole("button", { name: "Check decomposition" }).click();
checks.accepted = await state();
const choices = lesson.locator(".basis360-challenge > div button");
await choices.nth(2).click();
await choices.nth(3).click();
await lesson.getByRole("button", { name: "Check basis" }).click();
checks.collinear = await state();
await choices.nth(3).click();
await choices.nth(4).click();
await lesson.getByRole("button", { name: "Check basis" }).click();
await lesson.getByRole("button", { name: "Definition", exact: true }).click();
checks.basis = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0545"]')
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
    header: await rect(".basis360-page > header"),
    summary: await rect(".basis360-summary"),
    lab: await rect(".basis360-lab"),
    info: await rect(".basis360-info"),
    example: await rect(".basis360-example"),
    challenge: await rect(".basis360-challenge"),
  };
const passed =
  checks.initial.det === "-2" &&
  checks.initial.independent === "true" &&
  checks.initial.coordinates === "[3,1]" &&
  checks.dependent.det === "0" &&
  checks.dependent.independent === "false" &&
  checks.dependent.coordinates === "null" &&
  checks.dragged.v1 !== "[1,1]" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.collinear["basis-result"] === "incorrect" &&
  checks.basis["basis-result"] === "correct" &&
  checks.basis.tab === "Definition" &&
  checks.reset.actions === "0" &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0545-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0545-reference.png"));
await writeFile(
  path.join(evidence, "0545-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0545", lessonId: 360, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
