/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0642-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-cartesian-product-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/585-cartesian-product";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0642");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(300);
const keys = [
    "a",
    "b",
    "pairs",
    "pairCount",
    "reverse",
    "reversePairs",
    "visible",
    "speed",
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
const controls = lesson.locator(".cp585-lab>div>aside").first();
await controls.getByRole("button", { name: "Remove 3 from set A" }).click();
checks.removeA = await state();
await controls.getByRole("button", { name: "Choose values for set A" }).click();
await controls.getByRole("button", { name: "Add 4 to set A" }).click();
checks.addA = await state();
await controls.getByRole("button", { name: "Choose values for set B" }).click();
await controls.getByRole("button", { name: "Add 3 to set B" }).click();
checks.addB = await state();
await lesson.getByLabel("Show reverse pairs").check();
checks.reverse = await state();
await lesson.getByLabel("Pair animation speed").fill("80");
await controls.getByRole("button", { name: /Animate pairs/ }).click();
checks.animationStart = await state();
await page.waitForTimeout(900);
checks.animationEnd = await state();
await controls.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".cp585-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson
  .getByLabel("Cartesian product answer")
  .fill("(1,x),(1,y),(4,x),(4,y),(5,x)");
await lesson.getByLabel("Cartesian product cardinality").fill("5");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.wrong = await state();
await lesson
  .getByLabel("Cartesian product answer")
  .fill("(1,x),(1,y),(4,x),(4,y),(5,x),(5,y)");
await lesson.getByLabel("Cartesian product cardinality").fill("6");
await lesson.getByRole("button", { name: "Check Answer" }).click();
checks.correct = await state();
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
  hero: await rect(".cp585-hero"),
  tabs: await rect(".cp585-tabs"),
  lab: await rect(".cp585-lab"),
  theory: await rect(".cp585-theory"),
  practice: await rect(".cp585-practice"),
  adjacent: await rect(".cp585-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0642-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0642").waitFor({ timeout: 600000 });
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
  path: path.join(evidence, "0642-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.a === "1,2,3" &&
  checks.initial.b === "1,2" &&
  checks.initial.pairCount === "6" &&
  checks.removeA.a === "1,2" &&
  checks.removeA.pairCount === "4" &&
  checks.addA.a === "1,2,4" &&
  checks.addA.pairCount === "6" &&
  checks.addB.b === "1,2,3" &&
  checks.addB.pairCount === "9" &&
  checks.reverse.reverse === "true" &&
  checks.reverse.reversePairs.split("|").length === 9 &&
  checks.animationStart.visible === "0" &&
  Number(checks.animationEnd.visible) >= 9 &&
  checks.reset.pairCount === "6" &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.pairCount === "6" &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0642-reference.png"));
await writeFile(
  path.join(evidence, "0642-validation.json"),
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
