import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const titles = [
  "Sample Spaces", "Events", "Probability Scale", "Complement Rule", "Addition Rule", "Multiplication Rule", "Independent Events", "Mutually Exclusive Events", "Conditional Probability", "Tree Diagrams", "Venn Diagrams", "Two-Way Tables", "Bayes' Theorem", "Expected Value", "Simulation", "Law of Large Numbers", "Distribution Calculator", "Probability Plot", "Cumulative Distribution", "Interval / Tail Probability", "Inverse Probability", "Bernoulli Distribution", "Binomial Distribution", "Hypergeometric Distribution", "Poisson Distribution", "Geometric Distribution", "Negative Binomial Distribution", "Uniform Distribution", "Normal Distribution", "Student t Distribution", "Chi-Square Distribution", "F Distribution", "Exponential Distribution", "Gamma Distribution", "Weibull Distribution", "Standardisation", "Distribution Simulation",
];
const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

await mkdir(out, { recursive: true });
const refNames = await readdir(refs);
const browser = await chromium.launch();
const results = [];
let cursor = 0;

async function worker() {
  while (cursor < titles.length) {
    const index = cursor++;
    const lessonId = 500 + index;
    const mockup = String(463 + index).padStart(4, "0");
    const route = `/lessons/data-and-probability/${lessonId}-${slug(titles[index])}`;
    const reference = refNames.find((name) => name.startsWith(`${mockup}-`));
    if (reference) await copyFile(path.join(refs, reference), path.join(out, `${mockup}-reference.png`));
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    const consoleMessages = [];
    page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator(`[data-testid='probability-mockup-${mockup}']`).waitFor({ state: "attached", timeout: 180_000 });
    await page.screenshot({ path: path.join(out, `${mockup}-desktop.png`), fullPage: true });
    const present = await page.locator(`[data-testid='probability-mockup-${mockup}']`).count();
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
    results.push({ mockup, lessonId, route, status: present > 0 && controls >= 8 && consoleMessages.length === 0 ? "Passed" : "Review", screenshots: [`${mockup}-reference.png`, `${mockup}-desktop.png`, `${mockup}-tablet.png`, `${mockup}-mobile.png`, `${mockup}-interacted.png`], controlAudit: `${mockup}-control-audit.json`, consoleMessages: consoleMessages.length });
    await page.close();
  }
}

await Promise.all([worker(), worker(), worker()]);
await browser.close();
results.sort((a, b) => Number(a.mockup) - Number(b.mockup));
const status = results.length === 37 && results.every((result) => result.status === "Passed") ? "Passed" : "Review";
await writeFile(path.join(out, "0463-0499-probability-distributions-validation-summary.json"), JSON.stringify({ family: "Probability and Distributions", lessons: results.length, status, results }, null, 2));
console.log(JSON.stringify({ family: "Probability and Distributions", lessons: results.length, status }, null, 2));
