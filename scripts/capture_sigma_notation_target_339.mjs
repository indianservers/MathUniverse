/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0524-interactive-intermediate-advanced-sequences-and-series-sigma-notation-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/advanced-mathematics/339-sigma-notation";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 826, height: 1903 } }),
  consoleMessages = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("sequence-mockup-0524");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
  lesson.evaluate((n) =>
    Object.fromEntries(
      [
        "lower",
        "upper",
        "source",
        "nested",
        "current",
        "playing",
        "stepwise",
        "terms",
        "partials",
        "total",
        "tab",
        "result",
        "copied",
        "actions",
      ].map((k) => [k, n.getAttribute(`data-${k}`)]),
    ),
  );
const checks = { initial: await state() };
await lesson.getByLabel("Sigma lower bound").fill("0");
await lesson.getByLabel("Sigma upper bound").fill("5");
await lesson.getByLabel("Sigma summand").fill("2i - 1");
checks.custom = await state();
await lesson.getByLabel("Sigma lower bound").fill("1");
await lesson.getByLabel("Sigma upper bound").fill("3");
await lesson.getByLabel("Sigma summand").fill("i + j");
await lesson.getByLabel("Sigma nested sum").check();
checks.nested = await state();
await lesson.getByRole("button", { name: "Reset lab" }).click();
await lesson.getByRole("button", { name: "Animate terms" }).click();
await page.waitForTimeout(800);
await lesson.getByTitle("Pause").click();
checks.animation = await state();
const handle = lesson.locator('[data-drag="sigma-point-7"]'),
  box = await handle.boundingBox();
if (!box) throw new Error("Sigma graph point missing");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 2, box.y - 2);
await page.mouse.up();
checks.drag = await state();
await lesson.getByRole("button", { name: "Copy", exact: true }).click();
checks.copy = await state();
await lesson.getByLabel("Sigma quick answer").fill("24");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.rejected = await state();
await lesson.getByLabel("Sigma quick answer").fill("25");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
await lesson.getByRole("button", { name: "Formulas", exact: true }).click();
checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="sequence-mockup-0524"]')
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
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  sidebar: await rect('[data-testid="desktop-sidebar"]'),
  hero: await rect(".seq339-hero"),
  tabs: await rect(".seq339-tabs"),
  lab: await rect(".seq339-lab"),
  learning: await rect(".seq339-learning"),
  check: await rect(".seq339-check"),
  adjacent: await rect(".lesson-adjacent-nav"),
  footer: await rect('footer[aria-label="Site footer"]'),
};
const passed =
  checks.initial.terms === "2,5,10,17,26,37,50,65" &&
  checks.initial.total === "212" &&
  checks.custom.terms === "-1,1,3,5,7,9" &&
  checks.custom.total === "24" &&
  checks.nested.terms === "2,7,15" &&
  checks.nested.total === "24" &&
  checks.animation.current !== "1" &&
  checks.drag.current === "7" &&
  checks.copy.copied === "true" &&
  checks.rejected.result === "incorrect" &&
  checks.accepted.result === "correct" &&
  checks.accepted.tab === "Formulas" &&
  checks.shellReset.actions === "0" &&
  metrics.document.height === 1903 &&
  !metrics.overflow &&
  consoleMessages.length === 0;
await page.screenshot({
  path: path.join(evidence, "0524-desktop.png"),
  fullPage: true,
});
await copyFile(reference, path.join(evidence, "0524-reference.png"));
await writeFile(
  path.join(evidence, "0524-dedicated-target-validation.json"),
  JSON.stringify(
    { mockup: "0524", lessonId: 339, checks, metrics, consoleMessages, passed },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
