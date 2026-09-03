/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0658-interactive-intermediate-advanced-financial-mathematics-and-modelling-currency-conversion-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/601-currency-conversion",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 935, height: 1683 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0658");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      source: n.dataset.source,
      target: n.dataset.target,
      rate: n.dataset.rate,
      amount: n.dataset.amount,
      result: n.dataset.result,
      fee: n.dataset.fee,
      decimals: n.dataset.decimals,
      graded: n.dataset.graded,
      challenge: n.dataset.challenge,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Source currency", { exact: true }).selectOption("EUR");
await lesson.getByLabel("Target currency", { exact: true }).selectOption("JPY");
await lesson.getByLabel("Source amount", { exact: true }).fill("250");
checks.eurJpy = await state();
await lesson
  .getByRole("button", { name: "Swap direction", exact: true })
  .click();
checks.swapped = await state();
await lesson.getByLabel("Apply conversion fee").check();
await lesson.getByLabel("Conversion fee percent").fill("2");
checks.fee = await state();
await lesson.getByLabel("Decimal places").selectOption("4");
checks.rounding = await state();
await lesson.getByRole("button", { name: "View steps »", exact: true }).click();
checks.steps = await lesson
  .getByText("Rate units: JPY/EUR", { exact: false })
  .isVisible();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".cur601-note").isVisible();
await lesson.getByLabel("Challenge converted amount").fill("1");
await lesson
  .getByRole("button", { name: "✓ Check Answer", exact: true })
  .click();
checks.wrong = await state();
await lesson.getByLabel("Challenge converted amount").fill("32438");
await lesson
  .getByRole("button", { name: "✓ Check Answer", exact: true })
  .click();
checks.correct = await state();
await lesson
  .getByRole("button", { name: "Show Solution", exact: true })
  .click();
checks.solution = await lesson
  .getByText("350 × 92.68", { exact: false })
  .isVisible();
await lesson
  .getByRole("button", { name: "New Challenge", exact: true })
  .click();
checks.newChallenge = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0658");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const box = async (s) => {
    const b = await lesson.locator(s).boundingBox();
    return b
      ? {
          top: Math.round(b.y),
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
    hero: await box(".cur601-hero"),
    tabs: await box(".cur601-tabs"),
    lab: await box(".cur601-lab"),
    units: await box(".cur601-units"),
    theory: await box(".cur601-theory"),
    misconception: await box(".cur601-misconception"),
    challenge: await box(".cur601-challenge"),
    adjacent: await box(".cur601-adjacent"),
  };
await page.screenshot({ path: path.join(ev, "0658-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0658").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0658-mobile.png"),
  fullPage: true,
});
const near = (a, b) => Math.abs(Number(a) - b) < 0.02,
  passed =
    checks.initial.source === "USD" &&
    checks.initial.target === "INR" &&
    near(checks.initial.rate, 83.42) &&
    near(checks.initial.result, 10010.4) &&
    checks.eurJpy.source === "EUR" &&
    checks.eurJpy.target === "JPY" &&
    near(checks.eurJpy.rate, 164.7) &&
    near(checks.eurJpy.result, 41175) &&
    checks.swapped.source === "JPY" &&
    checks.swapped.target === "EUR" &&
    near(checks.swapped.rate, 1 / 164.7) &&
    Number(checks.fee.result) < Number(checks.swapped.result) &&
    checks.rounding.decimals === "4" &&
    checks.steps &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.solution &&
    checks.newChallenge.challenge === "1" &&
    checks.reset.source === "USD" &&
    checks.reset.target === "INR" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0658-reference.png"));
await writeFile(
  path.join(ev, "0658-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
