/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0615-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-permutations-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/558-permutations";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 999, height: 1575 } });
const consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0615");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(600);
const keys = [
  "n",
  "r",
  "total",
  "slots",
  "unique",
  "practice",
  "practiceTotal",
  "checked",
  "correct",
  "shuffles",
  "actions",
];
const state = () =>
  lesson.evaluate(
    (node, names) =>
      Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
    keys,
  );
const checks = { initial: await state() };
await lesson
  .getByRole("button", { name: "D", exact: true })
  .first()
  .dragTo(lesson.getByTestId("permutation-slot-1"));
await lesson.getByRole("button", { name: "E", exact: true }).first().click();
checks.completed = await state();
await lesson.getByRole("button", { name: /Reset board/ }).click();
checks.reset = await state();
await lesson.getByLabel("Object count").fill("4");
await lesson.getByLabel("Selection order").selectOption("3");
checks.fourThree = await state();
await lesson.getByRole("button", { name: /Shuffle objects/ }).click();
checks.shuffled = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByRole("button", { name: "A", exact: true }).last().click();
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.incomplete = await state();
await lesson
  .getByRole("button", { name: "B", exact: true })
  .last()
  .dragTo(lesson.getByTestId("permutation-practice-slot-2"));
await lesson.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.practiceCorrect = await state();
await lesson.getByRole("button", { name: /Reset/, exact: true }).last().click();
checks.practiceReset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(400);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const value = await lesson.locator(selector).boundingBox();
  return value
    ? {
        top: Math.round(value.y),
        left: Math.round(value.x),
        width: Math.round(value.width),
        height: Math.round(value.height),
        bottom: Math.round(value.y + value.height),
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
  hero: await rect(".perm558-hero"),
  tabs: await rect(".perm558-tabs"),
  observe: await rect(".perm558-observe"),
  middle: await rect(".perm558-middle"),
  bottom: await rect(".perm558-bottom"),
  glance: await rect(".perm558-glance"),
  adjacent: await rect(".perm558-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0615-desktop.png"),
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
  path: path.join(evidence, "0615-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.n === "5" &&
  checks.initial.r === "2" &&
  checks.initial.total === "20" &&
  checks.initial.slots === "__" &&
  checks.initial.unique === "3" &&
  checks.completed.slots === "DE" &&
  checks.completed.unique === "4" &&
  checks.reset.slots === "__" &&
  checks.fourThree.total === "24" &&
  checks.fourThree.slots === "___" &&
  checks.shuffled.shuffles === "1" &&
  checks.formulaClass.includes("active") &&
  checks.incomplete.checked === "true" &&
  checks.incomplete.correct === "false" &&
  checks.practiceCorrect.practice === "AB" &&
  checks.practiceCorrect.correct === "true" &&
  checks.practiceReset.practice === "__" &&
  checks.final.total === "20" &&
  checks.final.practiceTotal === "12" &&
  metrics.document.width === 999 &&
  metrics.document.height === 1575 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0615-reference.png"));
await writeFile(
  path.join(evidence, "0615-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
