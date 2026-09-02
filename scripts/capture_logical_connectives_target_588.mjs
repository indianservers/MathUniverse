/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0645-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-logical-connectives-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/588-logical-connectives";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1246, height: 1263 } }),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0645");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
    lesson.evaluate((n) => ({
      op: n.dataset.op,
      p: n.dataset.p,
      q: n.dataset.q,
      result: n.dataset.result,
      truth: n.dataset.truth,
      graded: n.dataset.graded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Toggle q input").click();
checks.qFalse = await state();
for (const [name, label, truth] of [
  ["OR", "OR p ∨ q", "TTTF"],
  ["XOR", "XOR p ⊕ q", "FTTF"],
  ["NOT", "NOT ¬p", "FFTT"],
  ["→", "→ p → q", "TFTT"],
  ["↔", "↔ p ↔ q", "TFFT"],
]) {
  await lesson.getByRole("button", { name: label, exact: true }).click();
  checks[name] = { ...(await state()), expected: truth };
}
await lesson.getByLabel("Toggle p input").click();
checks.pFalse = await state();
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.formula = await lesson.locator(".lc588-note").isVisible();
await lesson.getByRole("button", { name: /Interact/ }).click();
const selects = lesson.locator(".lc588-theory select");
for (let i = 0; i < 4; i++) await selects.nth(i).selectOption("F");
await lesson.getByRole("button", { name: "Check my answers" }).click();
checks.wrong = await state();
for (const [i, v] of ["T", "F", "F", "T"].entries())
  await selects.nth(i).selectOption(v);
await lesson.getByRole("button", { name: "Check my answers" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const b = await lesson.locator(".lc588-adjacent").boundingBox(),
  metrics = {
    width: await page.evaluate(() => document.documentElement.scrollWidth),
    height: await page.evaluate(() => document.documentElement.scrollHeight),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    bottom: b && Math.round(b.y + b.height),
  };
await page.screenshot({ path: path.join(ev, "0645-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0645").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0645-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.truth === "TFFF" &&
  checks.initial.result === "true" &&
  checks.qFalse.result === "false" &&
  checks.OR.truth === "TTTF" &&
  checks.XOR.truth === "FTTF" &&
  checks.NOT.truth === "FFTT" &&
  checks["→"].truth === "TFTT" &&
  checks["↔"].truth === "TFFT" &&
  checks.pFalse.result === "true" &&
  checks.formula &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.final.op === "and" &&
  !metrics.overflow &&
  metrics.bottom <= 1263 &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0645-reference.png"));
await writeFile(
  path.join(ev, "0645-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
