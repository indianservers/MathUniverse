/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0639-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-set-builder-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/582-set-builder";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0639");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(300);
const keys = [
    "universe",
    "preset",
    "predicate",
    "result",
    "resultCount",
    "domain",
    "visible",
    "seed",
    "challenge",
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
await lesson.getByLabel("Predicate", { exact: true }).selectOption("positive");
checks.positive = await state();
await lesson.getByLabel("Predicate", { exact: true }).selectOption("nonpositive");
checks.nonpositive = await state();
await lesson.getByRole("button", { name: ">=", exact: true }).click();
await lesson.getByLabel("Predicate bound").fill("2");
checks.custom = await state();
await lesson.getByLabel("Domain minimum").fill("-3");
await lesson.getByLabel("Domain maximum").fill("3");
await page.waitForTimeout(50);
checks.domain = await state();
await lesson.getByRole("button", { name: /Randomize U/ }).click();
checks.random = await state();
await lesson.getByRole("button", { name: /Animate/ }).click();
checks.animationStart = await state();
await page.waitForTimeout(1200);
checks.animationEnd = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson.locator(".sb582-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Challenge integer 1").click();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Challenge integer 1").click();
await lesson.getByRole("button", { name: "Check answer" }).click();
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
  hero: await rect(".sb582-hero"),
  tabs: await rect(".sb582-tabs"),
  builder: await rect(".sb582-builder"),
  pattern: await rect(".sb582-pattern"),
  theory: await rect(".sb582-theory"),
  practice: await rect(".sb582-practice"),
  adjacent: await rect(".sb582-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0639-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`mobile ${message.type()}: ${message.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0639").waitFor({ timeout: 600000 });
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
  path: path.join(evidence, "0639-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.result === "-4,-2,0,2,4" &&
  checks.initial.resultCount === "5" &&
  checks.positive.result === "1,2,3,4,5" &&
  checks.nonpositive.result === "-5,-4,-3,-2,-1,0" &&
  checks.custom.predicate === "x >= 2" &&
  checks.custom.result === "2,3,4,5" &&
  checks.domain.domain === "-3,3" &&
  checks.domain.result === "2,3" &&
  checks.random.seed === "1" &&
  checks.random.universe !== checks.initial.universe &&
  Number(checks.animationStart.visible) <
    checks.random.universe.split(",").length &&
  Number(checks.animationEnd.visible) >=
    checks.random.universe.split(",").length &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.correct.challenge === "-1,1,3" &&
  checks.final.result === "-4,-2,0,2,4" &&
  !metrics.overflow &&
  metrics.surface?.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0639-reference.png"));
await writeFile(
  path.join(evidence, "0639-validation.json"),
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
