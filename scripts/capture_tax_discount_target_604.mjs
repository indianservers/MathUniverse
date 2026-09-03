/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0661-interactive-intermediate-advanced-financial-mathematics-and-modelling-tax-and-discounts-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/discrete-and-applied-mathematics/604-tax-and-discounts",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1005, height: 1565 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("finance-mockup-0661");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((node) => ({
      subtotal: node.dataset.subtotal,
      discounted: node.dataset.discounted,
      taxable: node.dataset.taxable,
      tax: node.dataset.tax,
      final: node.dataset.final,
      items: node.dataset.items,
      graded: node.dataset.graded,
      actions: node.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Discount slider").fill("20");
checks.discount = await state();
await lesson.getByLabel("Coupon code").selectOption("5");
checks.coupon = await state();
await lesson.getByLabel("Tax rate", { exact: true }).fill("12");
checks.tax = await state();
await lesson.getByLabel("Item to add").selectOption("Calculator");
await lesson.getByRole("button", { name: "Add", exact: true }).click();
checks.added = await state();
await lesson.locator(".td604-cart>button").last().click();
checks.removed = await state();
await lesson.getByRole("button", { name: "Compact", exact: true }).click();
checks.compact = await lesson.locator(".td604-steps").getAttribute("class");
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.formula = await lesson.locator(".td604-note").isVisible();
await lesson.getByLabel("Final price answer").fill("23000");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Final price answer").fill("23833.60");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: "Show Hint", exact: true }).click();
checks.hint = await lesson.locator(".td604-challenge main small").isVisible();
await lesson
  .getByRole("button", { name: "Show Solution", exact: true })
  .click();
checks.solution = await lesson
  .locator(".td604-challenge aside small")
  .isVisible();
await lesson.getByLabel("Reset shop").click();
checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("finance-mockup-0661");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const box = async (selector) => {
    const value = await lesson.locator(selector).first().boundingBox();
    return value
      ? {
          top: Math.round(value.y),
          height: Math.round(value.height),
          bottom: Math.round(value.y + value.height),
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
    hero: await box(".td604-hero"),
    tabs: await box(".td604-tabs"),
    shop: await box(".td604-shop"),
    order: await box(".td604-order"),
    theory: await box(".td604-theory"),
    challenge: await box(".td604-challenge"),
    adjacent: await box(".td604-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0661-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("finance-mockup-0661").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0661-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.subtotal === "3450.00" &&
    checks.initial.discounted === "2932.50" &&
    checks.initial.taxable === "2639.25" &&
    checks.initial.tax === "475.06" &&
    checks.initial.final === "3114.32" &&
    checks.discount.discounted === "2760.00" &&
    checks.coupon.taxable === "2622.00" &&
    checks.tax.final === "2936.64" &&
    checks.added.items === "5" &&
    checks.added.subtotal === "4350.00" &&
    checks.removed.items === "4" &&
    checks.compact?.includes("compact") &&
    checks.formula &&
    checks.wrong.graded === "false" &&
    checks.correct.graded === "true" &&
    checks.hint &&
    checks.solution &&
    checks.reset.final === "3114.32" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0661-reference.png"));
await writeFile(
  path.join(evidence, "0661-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
