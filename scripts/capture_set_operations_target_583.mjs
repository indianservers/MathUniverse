/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0640-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-union-intersection-and-difference-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/583-union-intersection-and-difference";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0640");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(300);
const keys = [
    "a",
    "b",
    "union",
    "intersection",
    "difference",
    "expression",
    "seed",
    "challengeA",
    "challengeB",
    "graded",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByLabel("Set A values").fill("1,2,7");
await lesson.getByLabel("Set B values").fill("2,7,8");
checks.edited = await state();
await lesson.getByLabel("Set expression").selectOption("intersection");
checks.expression = await state();
await lesson
  .locator(".so583-panels>aside div button")
  .filter({ hasText: "9" })
  .dragTo(lesson.locator(".so583-venn.union circle.left"));
checks.dragged = await state();
await lesson.getByRole("button", { name: /Shuffle U/ }).click();
checks.shuffled = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".so583-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Challenge union").fill("1,2,3");
await lesson.getByLabel("Challenge intersection").fill("6");
await lesson.getByLabel("Challenge difference").fill("2,4");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge union").fill("1,2,3,4,5,6,7,8");
await lesson.getByLabel("Challenge difference").fill("2,4,8");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /New Challenge/ }).click();
checks.newChallenge = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (selector) => {
  const b = selector
    ? await lesson.locator(selector).boundingBox()
    : await lesson.boundingBox();
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
  surface: await rect(null),
  hero: await rect(".so583-hero"),
  tabs: await rect(".so583-tabs"),
  lab: await rect(".so583-lab"),
  theory: await rect(".so583-theory"),
  rules: await rect(".so583-rules"),
  practice: await rect(".so583-practice"),
  adjacent: await rect(".so583-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0640-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0640").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0640-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.union === "1,2,3,4,5,6" &&
  checks.initial.intersection === "5,6" &&
  checks.initial.difference === "1,2" &&
  checks.edited.union === "1,2,7,8" &&
  checks.edited.intersection === "2,7" &&
  checks.edited.difference === "1" &&
  checks.expression.expression === "intersection" &&
  checks.dragged.a.includes("9") &&
  checks.shuffled.seed === "1" &&
  checks.reset.a === "1,2,5,6" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.newChallenge.challengeA === "1,3,5,7" &&
  checks.final.union === "1,2,3,4,5,6" &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0640-reference.png"));
await writeFile(
  path.join(evidence, "0640-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    { passed, checks, metrics, mobileMetrics, consoleMessages },
    null,
    2,
  ),
);
await browser.close();
if (!passed) process.exitCode = 1;
