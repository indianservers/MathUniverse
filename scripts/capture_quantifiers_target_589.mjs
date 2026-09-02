/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0646-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-quantifiers-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/589-quantifiers";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1024, height: 1536 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0646");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
    lesson.evaluate((n) => ({
      domain: n.dataset.domain,
      predicate: n.dataset.predicate,
      forall: n.dataset.forall,
      exists: n.dataset.exists,
      witnesses: n.dataset.witnesses,
      counter: n.dataset.counterexamples,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() },
  predicate = lesson.getByLabel("Finite predicate");
for (const id of ["nonnegative", "negative", "zero", "square4", "even"]) {
  await predicate.selectOption(id);
  checks[id] = await state();
}
await lesson.getByRole("button", { name: "0,1,2,3,4", exact: true }).click();
checks.preset = await state();
await lesson.getByLabel("Finite quantifier domain").fill("-1,1");
checks.custom = await state();
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formula = await lesson.locator(".qt589-note").isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Universal challenge answer").selectOption("true");
await lesson.getByLabel("Existential challenge answer").selectOption("false");
await lesson.getByLabel("Quantifier witnesses").fill("-2,0");
await lesson.getByLabel("Quantifier counterexamples").fill("-3,-1,1");
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.wrong = await state();
await lesson.getByLabel("Universal challenge answer").selectOption("false");
await lesson.getByLabel("Existential challenge answer").selectOption("true");
await lesson.getByLabel("Quantifier witnesses").fill("-2,0,2");
await lesson.getByLabel("Quantifier counterexamples").fill("-3,-1,1,3");
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const b = await lesson.locator(".qt589-adjacent").boundingBox(),
  metrics = {
    width: await page.evaluate(() => document.documentElement.scrollWidth),
    height: await page.evaluate(() => document.documentElement.scrollHeight),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    bottom: b && Math.round(b.y + b.height),
  };
await page.screenshot({ path: path.join(ev, "0646-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0646").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0646-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.witnesses === "1,2,3" &&
  checks.initial.counter === "-2,-1,0" &&
  checks.nonnegative.witnesses === "0,1,2,3" &&
  checks.negative.witnesses === "-2,-1" &&
  checks.zero.witnesses === "0" &&
  checks.square4.counter === "3" &&
  checks.even.witnesses === "-2,0,2" &&
  checks.preset.domain === "0,1,2,3,4" &&
  checks.custom.domain === "-1,1" &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.predicate === "positive" &&
  !metrics.overflow &&
  metrics.bottom <= 1536 &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0646-reference.png"));
await writeFile(
  path.join(ev, "0646-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
