/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0670-interactive-intermediate-advanced-financial-mathematics-and-modelling-dimensional-analysis-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/613-dimensional-analysis";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1048, height: 1501 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0670");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      result: n.dataset.result,
      valid: n.dataset.valid,
      chain: n.dataset.chain,
      challengeResult: n.dataset.challengeResult,
      challengeValid: n.dataset.challengeValid,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.locator(".da613-chain>div").first().click();
checks.removed = await state();
await lesson.locator(".da613-pool button").nth(1).click();
checks.restored = await state();
await lesson.getByLabel("Show cancellations").uncheck();
checks.cancellations = await lesson.locator(".da613-chain>div>i").count();
await lesson.getByRole("button", { name: "Hint", exact: true }).click();
checks.hint = await lesson.locator(".da613-lab > .hint").isVisible();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".da613-note").isVisible();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
const zone = lesson.locator(".da613-challenge .zones");
for (const index of [0, 5, 3])
  await lesson.locator(".da613-pool button").nth(index).dragTo(zone);
checks.dragged = await state();
await lesson
  .locator(".da613-challenge section")
  .getByRole("button", { name: "Check", exact: true })
  .click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "Show solution", exact: true })
  .click();
checks.solution = await lesson
  .locator(".da613-challenge aside strong")
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0670");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (s) => {
  const v = await lesson.locator(s).first().boundingBox();
  return v
    ? {
        top: Math.round(v.y),
        height: Math.round(v.height),
        bottom: Math.round(v.y + v.height),
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
  hero: await measure(".da613-hero"),
  tabs: await measure(".da613-tabs"),
  lab: await measure(".da613-lab"),
  theory: await measure(".da613-theory"),
  challenge: await measure(".da613-challenge"),
  adjacent: await measure(".da613-adjacent"),
};
await page.screenshot({ path: path.join(evidence, "0670-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0670").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0670-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.result === "83.33" &&
    checks.initial.valid === "true" &&
    checks.removed.valid === "false" &&
    checks.restored.valid === "true" &&
    checks.cancellations === 0 &&
    checks.hint &&
    checks.formula &&
    checks.reset.chain === "m/km|h/min|h/h" &&
    checks.dragged.challengeResult === "9.00" &&
    checks.dragged.challengeValid === "true" &&
    checks.correct.graded === "true" &&
    checks.solution &&
    metrics.hero?.top === 107 &&
    metrics.hero?.bottom === 264 &&
    metrics.tabs?.top === 276 &&
    metrics.lab?.top === 337 &&
    metrics.lab?.bottom === 858 &&
    metrics.theory?.top === 870 &&
    metrics.theory?.bottom === 1172 &&
    metrics.challenge?.top === 1178 &&
    metrics.challenge?.bottom === 1347 &&
    metrics.adjacent?.top === 1359 &&
    metrics.adjacent?.bottom === 1410 &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0670-reference.png"));
await writeFile(
  path.join(evidence, "0670-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
