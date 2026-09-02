/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0614-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-factorials-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/557-factorials",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0614");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(600);
const keys = [
    "n",
    "total",
    "slots",
    "remaining",
    "completed",
    "enumerated",
    "challengeN",
    "challengeTotal",
    "graded",
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
  .getByRole("button", { name: "Object A" })
  .dragTo(lesson.getByTestId("factorial-slot-1"));
checks.dragged = await state();
for (const name of ["Object B", "Object C", "Object D", "Object E"])
  await lesson.getByRole("button", { name }).click();
checks.completed = await state();
await lesson.getByRole("button", { name: /Reset tray/ }).click();
checks.trayReset = await state();
await lesson.getByLabel("Object count number").fill("4");
checks.four = await state();
await lesson.getByRole("button", { name: "Enumerate all (24)" }).click();
checks.enumerated = await state();
checks.enumerationVisible = await lesson
  .locator(".fac557-enumeration span")
  .filter({ hasText: /^ABCD$/ })
  .isVisible();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge object count").fill("6");
checks.challengeSix = await state();
await lesson.getByLabel("Factorial challenge answer").fill("5040");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Factorial challenge answer").fill("720");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(500);
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
    hero: await rect(".fac557-hero"),
    tabs: await rect(".fac557-tabs"),
    observe: await rect(".fac557-observe"),
    build: await rect(".fac557-build"),
    pattern: await rect(".fac557-pattern"),
    bottom: await rect(".fac557-bottom"),
    adjacent: await rect(".fac557-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0614-desktop.png"),
  fullPage: false,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
const mobileMetrics = {
  documentWidth: await page.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await page.screenshot({
  path: path.join(evidence, "0614-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.n === "5" &&
  checks.initial.total === "120" &&
  checks.initial.slots === "_____" &&
  checks.dragged.slots === "A____" &&
  checks.completed.slots === "ABCDE" &&
  checks.completed.completed === "1" &&
  checks.completed.remaining === "" &&
  checks.trayReset.slots === "_____" &&
  checks.four.n === "4" &&
  checks.four.total === "24" &&
  checks.four.slots === "____" &&
  checks.enumerated.enumerated === "true" &&
  checks.enumerationVisible &&
  checks.formula.includes("active") &&
  checks.challengeSix.challengeN === "6" &&
  checks.challengeSix.challengeTotal === "720" &&
  checks.wrong.graded === "true" &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.final.n === "5" &&
  checks.final.challengeN === "7" &&
  metrics.document.width === 1024 &&
  metrics.document.height === 1536 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0614-reference.png"));
await writeFile(
  path.join(evidence, "0614-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
