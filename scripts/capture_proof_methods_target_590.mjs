/* global document,innerWidth,scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  ev = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  ref =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0647-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-proof-methods-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/590-proof-methods";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1008, height: 1560 },
    permissions: ["clipboard-read", "clipboard-write"],
  }),
  page = await context.newPage(),
  logs = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0647");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(250);
const state = () =>
    lesson.evaluate((n) => ({
      strategy: n.dataset.strategy,
      placed: n.dataset.placed,
      correct: n.dataset.correct,
      complete: n.dataset.complete,
      challenge: n.dataset.challenge,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() },
  pool = lesson.locator(".pool article"),
  drop = lesson.locator(".drop");
await lesson.locator(".placed button.invalid").click();
checks.removeWrong = await state();
for (const text of [
  "a + b = 2(m + n).",
  "Since m + n ∈ Z, 2(m + n) is even.",
  "Therefore a + b is even.",
]) {
  await pool
    .getByRole("button", { name: new RegExp(text.replace(/[()+.]/g, "\\$&")) })
    .dragTo(drop);
}
checks.dragComplete = await state();
await lesson.getByRole("button", { name: "Clear", exact: true }).click();
checks.clear = await state();
for (const step of [
  "Let a = 2m",
  "a + b = 2m + 2n",
  "a + b = 2(m + n)",
  "Since m + n",
  "Therefore a + b is even",
]) {
  await pool
    .getByRole("button", { name: new RegExp(step.replace(/[()+.]/g, "\\$&")) })
    .click();
}
checks.clickComplete = await state();
for (const name of [
  "Contrapositive",
  "Contradiction",
  "Induction",
  "Direct proof",
]) {
  await lesson.getByRole("button", { name: new RegExp(`^${name}`) }).click();
  checks[name] = await state();
}
await lesson.getByRole("button", { name: /Formula/ }).click();
checks.formula = await lesson.locator(".pm590-note").isVisible();
await lesson.getByRole("button", { name: /Interact/ }).click();
await lesson.getByRole("button", { name: /Share/ }).click();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
await lesson.getByRole("button", { name: "Start Challenge" }).click();
await lesson
  .getByLabel("Even difference proof")
  .fill("The result might be odd.");
await lesson.getByRole("button", { name: "Check proof" }).click();
checks.wrong = await state();
await lesson
  .getByLabel("Even difference proof")
  .fill("Let a=2m and b=2n. Then a-b=2m-2n=2(m-n), so the difference is even.");
await lesson.getByRole("button", { name: "Check proof" }).click();
checks.correct = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
await page.waitForTimeout(250);
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const b = await lesson.locator(".pm590-adjacent").boundingBox(),
  metrics = {
    width: await page.evaluate(() => document.documentElement.scrollWidth),
    height: await page.evaluate(() => document.documentElement.scrollHeight),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    bottom: b && Math.round(b.y + b.height),
  };
await page.screenshot({ path: path.join(ev, "0647-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0647").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(250);
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(ev, "0647-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.placed === "define,substitute,odd" &&
  checks.initial.correct === "2" &&
  checks.removeWrong.placed === "define,substitute" &&
  checks.dragComplete.complete === "true" &&
  checks.clear.placed === "" &&
  checks.clickComplete.complete === "true" &&
  checks.Induction.strategy === "induction" &&
  checks["Direct proof"].strategy === "direct" &&
  checks.formula &&
  checks.reset.placed === "define,substitute,odd" &&
  checks.wrong.challenge === "false" &&
  checks.correct.challenge === "true" &&
  !metrics.overflow &&
  metrics.bottom <= 1560 &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(ref, path.join(ev, "0647-reference.png"));
await writeFile(
  path.join(ev, "0647-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
