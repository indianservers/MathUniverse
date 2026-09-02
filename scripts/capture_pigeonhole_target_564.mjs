/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0621-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-pigeonhole-principle-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/564-pigeonhole-principle";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1019, height: 1543 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0621");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(700);
const keys = [
    "n",
    "k",
    "distribution",
    "counts",
    "least",
    "most",
    "guarantee",
    "holds",
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
  .getByRole("button", { name: "Pigeon 2" })
  .dragTo(lesson.getByTestId("pigeon-hole-1"));
checks.moved = await state();
await lesson.getByLabel("Pigeon count").fill("10");
await lesson.getByLabel("Hole count").fill("3");
checks.tenThree = await state();
await lesson.getByRole("button", { name: "Try it!" }).click();
checks.random = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaClass = await lesson
  .getByRole("button", { name: "Formula", exact: true })
  .getAttribute("class");
await lesson.getByLabel("Challenge holes").fill("4");
checks.challengeFour = await state();
await lesson.getByLabel("Pigeonhole challenge answer").fill("3");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Pigeonhole challenge answer").fill("4");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show me/ }).click();
checks.shown = await lesson
  .getByText("ceil(13/4) = 4", { exact: true })
  .isVisible();
await lesson.getByRole("button", { name: /Reset/ }).first().click();
checks.reset = await state();
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
    hero: await rect(".pig564-hero"),
    tabs: await rect(".pig564-tabs"),
    lab: await rect(".pig564-lab"),
    theory: await rect(".pig564-theory"),
    bottom: await rect(".pig564-bottom"),
    adjacent: await rect(".pig564-adjacent"),
  };
await page.screenshot({
  path: path.join(evidence, "0621-desktop.png"),
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
  path: path.join(evidence, "0621-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.n === "7" &&
  checks.initial.k === "5" &&
  checks.initial.counts === "2,1,1,2,1" &&
  checks.initial.guarantee === "2" &&
  checks.moved.counts === "3,0,1,2,1" &&
  checks.moved.most === "3" &&
  checks.tenThree.n === "10" &&
  checks.tenThree.k === "3" &&
  checks.tenThree.counts === "4,3,3" &&
  checks.tenThree.guarantee === "4" &&
  checks.random.holds === "true" &&
  checks.formulaClass.includes("active") &&
  checks.challengeFour.challengeTotal === "4" &&
  checks.wrong.correct === "false" &&
  checks.correct.correct === "true" &&
  checks.shown &&
  checks.reset.n === "7" &&
  checks.reset.counts === "2,1,1,2,1" &&
  checks.final.guarantee === "2" &&
  metrics.document.width === 1019 &&
  metrics.document.height === 1543 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0621-reference.png"));
await writeFile(
  path.join(evidence, "0621-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;
