/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0679-school-class-6-numbers-and-arithmetic-mixed-units-and-unit-conversion-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2257/lessons/school/class-6/class-6-numbers-and-arithmetic-mixed-units-and-unit-conversion";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 963, height: 1634 } });
const logs = [];
page.setDefaultTimeout(90000);
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    logs.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0679");
await lesson.waitFor({ timeout: 600000 });

const state = () =>
  lesson.evaluate((node) => ({
    observeDifference: node.dataset.observeDifference,
    aMetres: node.dataset.aMetres,
    bMetres: node.dataset.bMetres,
    difference: node.dataset.difference,
    chainValid: node.dataset.chainValid,
    chainResult: node.dataset.chainResult,
    challengeGraded: node.dataset.challengeGraded,
    actions: node.dataset.actions,
  }));
const checks = { initial: await state() };

await lesson.getByLabel("Observe centimetres").fill("160");
checks.observe = await state();
await lesson.getByLabel("Quantity A value").fill("3");
await lesson.getByLabel("Quantity A unit").selectOption("km");
await lesson.getByLabel("Quantity B value").fill("500");
await lesson.getByLabel("Quantity B unit").selectOption("m");
checks.manipulate = await state();

await lesson.getByRole("button", { name: "Clear chain" }).click();
await lesson.getByRole("button", { name: "100 cm / 1 m" }).click();
checks.wrongFactor = await state();
await lesson
  .getByRole("button", { name: "1 m / 100 cm", exact: true })
  .dragTo(lesson.locator("article.chain"));
checks.correctFactor = await state();

await lesson.getByLabel("3.2 metres in centimetres").fill("300");
await lesson.getByLabel("280 centimetres in metres").fill("2.8");
await lesson.getByLabel("280 cm", { exact: true }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.challengeWrong = await state();
await lesson.getByLabel("3.2 metres in centimetres").fill("320");
await lesson.getByLabel("3.2 m", { exact: true }).check();
await lesson.getByRole("button", { name: "Check answer" }).click();
checks.challengeCorrect = await state();

for (const [index, answer] of ["6.4", "2.75", "5.55"].entries()) {
  await lesson.getByLabel(`Practice answer ${index + 1}`).fill(answer);
  await lesson
    .getByRole("button", { name: "Check", exact: true })
    .nth(index)
    .click();
}
checks.practiceCorrect = await Promise.all(
  [0, 1, 2].map((index) =>
    lesson.locator(".mu10005-practice article output").nth(index).textContent(),
  ),
);

await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0679");
await lesson.waitFor();
await page.evaluate(() => scrollTo(0, 0));
const measure = async (selector) => {
  const box = await lesson.locator(selector).first().boundingBox();
  return box
    ? {
        top: Math.round(box.y),
        height: Math.round(box.height),
        bottom: Math.round(box.y + box.height),
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
  hero: await measure(".mu10005-hero"),
  tabs: await measure(".mu10005-tabs"),
  workspace: await measure(".mu10005-workspace"),
  worked: await measure(".mu10005-worked"),
  practice: await measure(".mu10005-practice"),
  adjacent: await measure(".mu10005-adjacent"),
  footer: await page.locator('footer[aria-label="Site footer"]').boundingBox(),
};
await page.screenshot({ path: path.join(evidence, "0679-desktop.png") });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0679").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0679-mobile.png"),
  fullPage: true,
});

const passed =
  checks.initial.observeDifference === "0.00" &&
  checks.initial.aMetres === "2.50" &&
  checks.initial.bMetres === "1.75" &&
  checks.initial.difference === "0.75" &&
  checks.observe.observeDifference === "0.60" &&
  checks.manipulate.aMetres === "3000.00" &&
  checks.manipulate.bMetres === "500.00" &&
  checks.manipulate.difference === "2500.00" &&
  checks.wrongFactor.chainValid === "false" &&
  checks.correctFactor.chainValid === "true" &&
  checks.correctFactor.chainResult === "2.5" &&
  checks.challengeWrong.challengeGraded === "false" &&
  checks.challengeCorrect.challengeGraded === "true" &&
  checks.practiceCorrect.every((result) => result === "Correct") &&
  !metrics.overflow &&
  !mobileMetrics.overflow &&
  logs.length === 0;
const report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0679-reference.png"));
await writeFile(
  path.join(evidence, "0679-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
