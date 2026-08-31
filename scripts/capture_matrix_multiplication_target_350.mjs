/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0535-interactive-advanced-matrices-and-linear-algebra-matrix-multiplication-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/350-matrix-multiplication";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 864, height: 1821 } }),
  consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0535");
await lesson.waitFor({ timeout: 600000 });
const keys = [
    "a",
    "b",
    "compatible",
    "result",
    "cell",
    "value",
    "substep",
    "playing",
    "formula",
    "after-b",
    "after-a",
    "direct",
    "tab",
    "quick",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (n, a) =>
        Object.fromEntries(a.map((k) => [k, n.getAttribute(`data-${k}`)])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Matrix A row 1 column 1").fill("2");
checks.edit = await state();
await lesson.getByLabel("Matrix B rows").selectOption("2");
checks.incompatible = await state();
await lesson.getByLabel("Matrix B rows").selectOption("3");
checks.restored = await state();
await lesson
  .getByRole("button", { name: "Next cell", exact: true })
  .first()
  .click();
checks.next = await state();
await lesson.getByLabel("Show formula").click();
await lesson.getByLabel("Multiplication step").fill("6");
checks.controls = await state();
await lesson.getByRole("button", { name: "D. 10", exact: true }).click();
checks.rejected = await state();
await lesson.getByRole("button", { name: "B. 3", exact: true }).click();
await lesson.getByRole("button", { name: "Examples", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="matrix-mockup-0535"]')
      ?.getAttribute("data-actions") === "0",
);
checks.shellReset = await state();
await page.evaluate(() => {
  scrollTo(0, 0);
  document.querySelectorAll("*").forEach((n) => {
    if (n.scrollLeft) n.scrollLeft = 0;
  });
});
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
    hero: await rect(".mat350-hero"),
    tabs: await rect(".mat350-tabs"),
    lab: await rect(".mat350-lab"),
    notes: await rect(".mat350-notes"),
    check: await rect(".mat350-check"),
    adjacent: await rect(".lesson-adjacent-nav"),
    footer: await rect('footer[aria-label="Site footer"]'),
  };
const passed =
  checks.initial.result === "[[9,7],[13,8]]" &&
  checks.initial.value === "9" &&
  checks.initial["after-a"] === checks.initial.direct &&
  checks.edit.result === "[[11,8],[13,8]]" &&
  checks.incompatible.compatible === "false" &&
  checks.incompatible.result === "[]" &&
  checks.restored.compatible === "true" &&
  checks.restored.b === "[[2,1],[-1,0],[0,0]]" &&
  checks.next.cell === "0,1" &&
  checks.next.value === "2" &&
  checks.controls.formula === "false" &&
  checks.controls.substep === "6" &&
  checks.rejected.quick === "incorrect" &&
  checks.accepted.quick === "correct" &&
  checks.accepted.tab === "Examples" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1821 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0535-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0535-reference.png"));
await writeFile(
  path.join(evidence, "0535-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0535", lessonId: 350, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
