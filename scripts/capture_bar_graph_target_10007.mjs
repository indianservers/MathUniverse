/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0681-school-class-6-data-handling-bar-graph-builder-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2257/lessons/school/class-6/class-6-data-handling-bar-graph-builder",
  browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({
    viewport: { width: 968, height: 1625 },
    acceptDownloads: true,
  }),
  logs = [];
page.setDefaultTimeout(90000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    logs.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
let lesson = page.getByTestId("school-mockup-0681");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((n) => ({ ...n.dataset })),
  checks = { initial: await state() };
await lesson.getByLabel("Value 1").fill("60");
checks.invalidScale = await state();
await lesson.getByRole("button", { name: "Auto fit" }).click();
checks.autoFit = await state();
await lesson.getByLabel("Zoom in").click();
await lesson.getByRole("button", { name: "Grid" }).click();
await lesson.getByRole("button", { name: "Labels" }).click();
await lesson.getByRole("button", { name: "Colors" }).click();
await lesson.getByRole("button", { name: "Bar width" }).click();
checks.tools = await state();
await lesson.getByRole("button", { name: "Reset chart" }).click();
checks.reset = await state();
const downloadPromise = page.waitForEvent("download");
await lesson.getByRole("button", { name: "PNG" }).click();
const download = await downloadPromise;
checks.download = (await download.suggestedFilename()) === "bar-graph.png";
await lesson.getByRole("button", { name: "Start challenge" }).click();
checks.challenge = await lesson.getByText(/Most: Adventure/).isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
lesson = page.getByTestId("school-mockup-0681");
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
    hero: await measure(".bg10007-hero"),
    tabs: await measure(".bg10007-tabs"),
    lab: await measure(".bg10007-lab"),
    lower: await measure(".bg10007-lower"),
    adjacent: await measure(".bg10007-adjacent"),
  };
await page.screenshot({ path: path.join(evidence, "0681-desktop.png") });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("school-mockup-0681").waitFor({ timeout: 600000 });
const mobileMetrics = {
  width: await mobile.evaluate(() => document.documentElement.scrollWidth),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0681-mobile.png"),
  fullPage: true,
});
const passed =
    checks.initial.values === "42,28,15,35" &&
    checks.initial.total === "120" &&
    checks.invalidScale.validScale === "false" &&
    checks.autoFit.scale === "60" &&
    checks.autoFit.validScale === "true" &&
    checks.tools.zoom === "1.1" &&
    checks.tools.grid === "false" &&
    checks.tools.labels === "false" &&
    checks.tools.barWidth === "28" &&
    checks.reset.values === "42,28,15,35" &&
    checks.download &&
    checks.challenge &&
    !metrics.overflow &&
    !mobileMetrics.overflow &&
    logs.length === 0,
  report = { passed, checks, metrics, mobileMetrics, logs };
await copyFile(reference, path.join(evidence, "0681-reference.png"));
await writeFile(
  path.join(evidence, "0681-validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
