import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const titles = [
  "Data Types", "Frequency Tables", "Grouped Frequency Tables", "Mean", "Median", "Mode", "Weighted Mean", "Range", "Quartiles and IQR", "Variance and Standard Deviation", "Percentiles", "Z-Scores", "Outliers", "Box Plot", "Dot Plot", "Stem-and-Leaf Plot", "Histogram", "Frequency Polygon", "Cumulative Frequency Curve", "Bar and Pie Charts", "Scatter Plot", "Time-Series Plot", "Correlation Coefficient", "Linear Regression", "Polynomial Regression", "Exponential Regression", "Logarithmic Regression", "Power Regression", "Logistic Regression", "Sinusoidal Regression", "Residual Plot", "Model Comparison", "Interpolation and Extrapolation",
];
const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

await mkdir(out, { recursive: true });
const refNames = await readdir(refs);
const browser = await chromium.launch();
const results = [];

const startIndex = Math.max(0, Number(process.env.START_MOCKUP ?? 430) - 430);
for (let index = startIndex; index < titles.length; index += 1) {
  const lessonId = 467 + index;
  const mockup = String(430 + index).padStart(4, "0");
  const route = `/lessons/data-and-probability/${lessonId}-${slug(titles[index])}`;
  const reference = refNames.find((name) => name.startsWith(`${mockup}-`));
  if (reference) await copyFile(path.join(refs, reference), path.join(out, `${mockup}-reference.png`));
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const consoleMessages = [];
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator(`[data-testid='statistics-mockup-${mockup}']`).waitFor({ state: "attached", timeout: 180_000 });
  await page.screenshot({ path: path.join(out, `${mockup}-desktop.png`), fullPage: true });
  const present = await page.locator(`[data-testid='statistics-mockup-${mockup}']`).count();
  const controls = await page.locator("input, button").count();
  const range = page.locator("input[type=range]").first();
  if (await range.count()) await range.evaluate((element) => { element.value = element.max; element.dispatchEvent(new Event("input", { bubbles: true })); element.dispatchEvent(new Event("change", { bubbles: true })); });
  await page.screenshot({ path: path.join(out, `${mockup}-interacted.png`), fullPage: true });
  await page.setViewportSize({ width: 900, height: 1100 });
  await page.screenshot({ path: path.join(out, `${mockup}-tablet.png`), fullPage: true });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.screenshot({ path: path.join(out, `${mockup}-mobile.png`), fullPage: true });
  const audit = { mockup, lessonId, route, reference: reference ?? null, present: present > 0, interactiveControls: controls, consoleMessages };
  await writeFile(path.join(out, `${mockup}-control-audit.json`), JSON.stringify(audit, null, 2));
  results.push({ mockup, lessonId, route, status: present > 0 && controls >= 5 && consoleMessages.length === 0 ? "Passed" : "Review", screenshots: [`${mockup}-reference.png`, `${mockup}-desktop.png`, `${mockup}-tablet.png`, `${mockup}-mobile.png`, `${mockup}-interacted.png`], controlAudit: `${mockup}-control-audit.json`, consoleMessages: consoleMessages.length });
  await page.close();
}

await browser.close();
const { readFile } = await import("fs/promises");
const prior = [];
for (let index = 0; index < startIndex; index += 1) {
  const mockup = String(430 + index).padStart(4, "0");
  const audit = JSON.parse(await readFile(path.join(out, `${mockup}-control-audit.json`), "utf8"));
  prior.push({ mockup, lessonId: audit.lessonId, route: audit.route, status: audit.present && audit.interactiveControls >= 5 && audit.consoleMessages.length === 0 ? "Passed" : "Review", screenshots: [`${mockup}-reference.png`, `${mockup}-desktop.png`, `${mockup}-tablet.png`, `${mockup}-mobile.png`, `${mockup}-interacted.png`], controlAudit: `${mockup}-control-audit.json`, consoleMessages: audit.consoleMessages.length });
}
const combined = [...prior, ...results];
const status = combined.length === 33 && combined.every((result) => result.status === "Passed") ? "Passed" : "Review";
await writeFile(path.join(out, "0430-0462-statistics-regression-validation-summary.json"), JSON.stringify({ family: "Statistics and Regression", lessons: combined.length, status, results: combined }, null, 2));
console.log(JSON.stringify({ family: "Statistics and Regression", lessons: combined.length, status }, null, 2));
