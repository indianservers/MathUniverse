/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0680-school-class-6-data-handling-pictograph-builder-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-data-handling-pictograph-builder";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 968, height: 1630 } }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0680");
await lesson.waitFor({ timeout: 600000 });
const state = () =>
    lesson.evaluate((n) => ({
      key: n.dataset.key,
      counts: n.dataset.counts,
      totalIcons: n.dataset.totalIcons,
      countGraded: n.dataset.countGraded,
      challenge: n.dataset.challenge,
      challengeGraded: n.dataset.challengeGraded,
      actions: n.dataset.actions,
    })),
  checks = { initial: await state() };
await lesson.getByLabel("Apples count").fill("8");
await lesson.getByLabel("Bananas count").fill("6");
await lesson.getByRole("radio").nth(1).check();
checks.keyTwo = await state();
const palette = lesson.locator(".pg10006-palette button");
await palette.nth(0).dragTo(lesson.locator(".pg10006-chart tbody tr").nth(0));
await lesson.locator(".pg10006-chart tbody tr").nth(1).click();
await palette.nth(1).click();
checks.chartEdits = await state();
await lesson.getByRole("button", { name: "Check counts" }).click();
checks.countCheck = await state();
const pencils = lesson.locator(".pg10006-challenge footer button");
for (const [day, count] of [14, 10, 6, 8].entries()) {
  for (let i = 0; i < count / 2; i++)
    await pencils
      .nth(0)
      .dragTo(
        lesson
          .locator(".pg10006-challenge > div > table:nth-child(2) tbody tr")
          .nth(day),
      );
}
checks.challengeBuilt = await state();
await lesson.getByRole("button", { name: "Check my answer" }).click();
checks.challengeCorrect = await state();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0680");
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
    hero: await measure(".pg10006-hero"),
    tabs: await measure(".pg10006-tabs"),
    builder: await measure(".pg10006-builder"),
    concepts: await measure(".pg10006-concepts"),
    theory: await measure(".pg10006-theory"),
    challenge: await measure(".pg10006-challenge"),
    adjacent: await measure(".pg10006-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0680-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0680").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0680-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.counts === "7,5,3,9" &&
    checks.initial.totalIcons === "24" &&
    checks.keyTwo.key === "2" &&
    checks.keyTwo.totalIcons === "13" &&
    checks.chartEdits.counts === "10,7,3,9" &&
    checks.countCheck.countGraded === "true" &&
    checks.challengeBuilt.challenge === "14,10,6,8" &&
    checks.challengeCorrect.challengeGraded === "true" &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0680-reference.png"));
await writeFile(
  path.join(evidence, "0680-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
