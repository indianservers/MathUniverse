/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0619-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-pascal-s-triangle-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/562-pascal-s-triangle";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 854, height: 1840 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0619");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "rows",
    "selected",
    "value",
    "parents",
    "showParents",
    "showSums",
    "showLabels",
    "correct",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson
  .locator(".pas562-triangle>div")
  .nth(6)
  .getByRole("button")
  .nth(3)
  .click();
checks.sixThree = await state();
await lesson.getByLabel("Rows shown").fill("8");
checks.eightRows = await state();
await lesson.getByLabel("Jump row").selectOption("8");
await lesson.getByLabel("Jump index").selectOption("3");
await lesson.getByRole("button", { name: "Go", exact: true }).click();
checks.jumped = await state();
const boxes = lesson.locator('.pas562-observe input[type="checkbox"]');
await boxes.nth(0).click();
await boxes.nth(1).click();
await boxes.nth(2).click();
checks.overlaysOff = await state();
await lesson
  .locator(".pas562-observe>footer>section")
  .last()
  .getByRole("button", { name: "+" })
  .click();
checks.nineRows = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Pascal answer 1").fill("20");
checks.oneWrong = await state();
await lesson.getByLabel("Pascal answer 1").fill("21");
checks.allCorrect = await state();
await lesson.getByRole("button", { name: /Hint/ }).click();
checks.hint = await lesson
  .getByText(/Use the sum of the two parents/)
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
    const r = await lesson.locator(s).boundingBox();
    return r
      ? {
          top: Math.round(r.y),
          left: Math.round(r.x),
          width: Math.round(r.width),
          height: Math.round(r.height),
          bottom: Math.round(r.y + r.height),
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
    hero: await rect(".pas562-hero"),
    tabs: await rect(".pas562-tabs"),
    observe: await rect(".pas562-observe"),
    pattern: await rect(".pas562-pattern"),
    rules: await rect(".pas562-rules"),
    practice: await rect(".pas562-practice"),
    adjacent: await rect(".pas562-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0619-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0619-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.rows === "7" &&
  checks.initial.selected === "4,2" &&
  checks.initial.value === "6" &&
  checks.sixThree.selected === "6,3" &&
  checks.sixThree.value === "20" &&
  checks.eightRows.rows === "8" &&
  checks.jumped.selected === "8,3" &&
  checks.jumped.value === "56" &&
  checks.overlaysOff.showParents === "false" &&
  checks.overlaysOff.showSums === "false" &&
  checks.overlaysOff.showLabels === "false" &&
  checks.nineRows.rows === "9" &&
  checks.formulaClass.includes("active") &&
  checks.oneWrong.correct === "2" &&
  checks.allCorrect.correct === "3" &&
  checks.hint &&
  checks.final.rows === "7" &&
  checks.final.value === "6" &&
  metrics.document.width === 854 &&
  metrics.document.height === 1840 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0619-reference.png"));
await writeFile(
  path.join(evidence, "0619-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
