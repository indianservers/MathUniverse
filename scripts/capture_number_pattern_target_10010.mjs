/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0684-school-class-6-patterns-number-pattern-completion-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-patterns-number-pattern-completion",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 963, height: 1634 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0684");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((n) => ({ ...n.dataset })),
  checks = { initial: await state() };
await lesson.getByLabel("Pattern change").fill("5");
checks.changed = await state();
await lesson.getByRole("button", { name: "Apply rule" }).click();
checks.applied = await state();
await lesson.getByRole("button", { name: "Multiply / Divide" }).click();
checks.multiply = await state();
await lesson.getByLabel("Term position", { exact: true }).fill("6");
await lesson.getByRole("button", { name: "Compute" }).click();
checks.computed = await state();
await lesson.getByRole("button", { name: /Reset/ }).click();
checks.reset = await state();
for (const [i, v] of ["18", "22", "25"].entries())
  await lesson.getByLabel(`Pattern answer ${i + 1}`).fill(v);
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Pattern answer 1").fill("19");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByLabel("Quick term position").fill("10");
await lesson.getByRole("button", { name: "Go" }).click();
checks.quick = await state();
await lesson.getByRole("button", { name: "Show solution" }).click();
checks.solution = await lesson.getByText(/21, 25, 29/).isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0684");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (s) => {
    const b = await lesson.locator(s).first().boundingBox();
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
    hero: await measure(".np10010-hero"),
    tabs: await measure(".np10010-tabs"),
    observe: await measure(".np10010-observe"),
    manip: await measure(".np10010-manip"),
    rule: await measure(".np10010-rule"),
    practice: await measure(".np10010-practice"),
    cards: await measure(".np10010-cards"),
    summary: await measure(".np10010-summary"),
    adjacent: await measure(".np10010-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0684-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0684").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0684-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.terms === "4,8,12,16,20,24,28,32,36,40" &&
    checks.changed.terms === "4,9,14,19,24,29,34,39,44,49" &&
    checks.changed.applied === "false" &&
    checks.applied.applied === "true" &&
    checks.multiply.mode === "multiply" &&
    checks.multiply.terms.startsWith("4,8,16") &&
    checks.computed.computed === "128" &&
    checks.reset.mode === "add" &&
    checks.wrong.answerGraded === "false" &&
    checks.correct.answerGraded === "true" &&
    checks.quick.quickValue === "34" &&
    checks.solution &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0684-reference.png"));
await writeFile(
  path.join(evidence, "0684-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
