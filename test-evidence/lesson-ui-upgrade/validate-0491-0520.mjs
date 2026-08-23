/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const lessons = [
  [491, "/lessons/data-and-probability/528-normal-distribution", "Normal Distribution", "probability", ["seeded simulation", "Normal Distribution", "mean for centre"]],
  [492, "/lessons/data-and-probability/529-student-t-distribution", "Student t Distribution", "probability", ["seeded simulation", "Student t Distribution", "sigma is unknown"]],
  [493, "/lessons/data-and-probability/530-chi-square-distribution", "Chi-Square Distribution", "probability", ["seeded simulation", "Chi-Square Distribution", "non-negative"]],
  [494, "/lessons/data-and-probability/531-f-distribution", "F Distribution", "probability", ["seeded simulation", "F Distribution", "variance estimates"]],
  [495, "/lessons/data-and-probability/532-exponential-distribution", "Exponential Distribution", "probability", ["seeded simulation", "Exponential Distribution", "waiting time"]],
  [496, "/lessons/data-and-probability/533-gamma-distribution", "Gamma Distribution", "probability", ["seeded simulation", "Gamma Distribution", "several events"]],
  [497, "/lessons/data-and-probability/534-weibull-distribution", "Weibull Distribution", "probability", ["seeded simulation", "Weibull Distribution", "failure risk"]],
  [498, "/lessons/data-and-probability/535-standardisation", "Standardisation", "probability", ["seeded simulation", "Standardisation", "z-score"]],
  [499, "/lessons/data-and-probability/536-distribution-simulation", "Distribution Simulation", "probability", ["seeded simulation", "Distribution Simulation", "random values"]],
  [500, "/lessons/data-and-probability/537-sampling-distributions", "Sampling Distributions", "inference", ["inference lab", "Sampling Distributions", "many samples"]],
  [501, "/lessons/data-and-probability/538-central-limit-theorem", "Central Limit Theorem", "inference", ["inference lab", "Central Limit Theorem", "approximately normal"]],
  [502, "/lessons/data-and-probability/539-confidence-interval-for-mean", "Confidence Interval for Mean", "inference", ["inference lab", "Confidence Interval for Mean", "margin of error"]],
  [503, "/lessons/data-and-probability/540-confidence-interval-for-proportion", "Confidence Interval for Proportion", "inference", ["inference lab", "Confidence Interval for Proportion", "p-hat"]],
  [504, "/lessons/data-and-probability/541-difference-of-means-interval", "Difference of Means Interval", "inference", ["inference lab", "Difference of Means Interval", "one mean minus another"]],
  [505, "/lessons/data-and-probability/542-difference-of-proportions-interval", "Difference of Proportions Interval", "inference", ["inference lab", "Difference of Proportions Interval", "one proportion minus another"]],
  [506, "/lessons/data-and-probability/543-one-sample-z-test", "One-Sample z-Test", "inference", ["inference lab", "One-Sample z-Test", "z statistic"]],
  [507, "/lessons/data-and-probability/544-one-sample-t-test", "One-Sample t-Test", "inference", ["inference lab", "One-Sample t-Test", "sample standard deviation"]],
  [508, "/lessons/data-and-probability/545-two-sample-t-test", "Two-Sample t-Test", "inference", ["inference lab", "Two-Sample t-Test", "independent means"]],
  [509, "/lessons/data-and-probability/546-paired-t-test", "Paired t-Test", "inference", ["inference lab", "Paired t-Test", "within-pair"]],
  [510, "/lessons/data-and-probability/547-one-proportion-test", "One-Proportion Test", "inference", ["inference lab", "One-Proportion Test", "null proportion"]],
  [511, "/lessons/data-and-probability/548-two-proportion-test", "Two-Proportion Test", "inference", ["inference lab", "Two-Proportion Test", "Pool when"]],
  [512, "/lessons/data-and-probability/549-chi-square-goodness-of-fit", "Chi-Square Goodness-of-Fit", "inference", ["inference lab", "Chi-Square Goodness-of-Fit", "observed and expected counts"]],
  [513, "/lessons/data-and-probability/550-chi-square-independence", "Chi-Square Independence", "inference", ["inference lab", "Chi-Square Independence", "two-way table"]],
  [514, "/lessons/data-and-probability/551-variance-tests", "Variance Tests", "inference", ["inference lab", "Variance Tests", "sensitive to outliers"]],
  [515, "/lessons/data-and-probability/552-anova", "ANOVA", "inference", ["inference lab", "ANOVA", "overall test"]],
  [516, "/lessons/data-and-probability/553-p-value-visualiser", "p-Value Visualiser", "inference", ["inference lab", "p-Value Visualiser", "at least as extreme"]],
  [517, "/lessons/data-and-probability/554-type-i-and-type-ii-errors", "Type I and Type II Errors", "inference", ["inference lab", "Type I and Type II Errors", "false alarm"]],
  [518, "/lessons/data-and-probability/555-power-of-a-test", "Power of a Test", "inference", ["inference lab", "Power of a Test", "1 minus Type II"]],
  [519, "/lessons/advanced-mathematics/334-sequence-generator", "Sequence Generator", "sequence", ["sequence and series lab", "Active sequence"]],
  [520, "/lessons/advanced-mathematics/335-arithmetic-sequences", "Arithmetic Sequences", "sequence", ["sequence and series lab", "Active sequence"]],
];

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["tablet", { width: 900, height: 1100 }],
  ["mobile", { width: 390, height: 1100 }],
];

function assertIncludes(text, expected, label) {
  if (!text.includes(expected)) throw new Error(`${label}: missing "${expected}"`);
}

const browser = await chromium.launch();
const results = [];

try {
  for (const [id, route, title, kind, snippets] of lessons) {
    for (const [viewportName, viewport] of viewports) {
      const page = await browser.newPage({ viewport });
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: title }).first().waitFor({ timeout: 15_000 });

      const text = await page.locator("body").innerText();
      assertIncludes(text, title, `${id} ${viewportName}`);
      for (const snippet of snippets) assertIncludes(text, snippet, `${id} ${viewportName}`);

      const svgCount = await page.locator("svg").count();
      if (svgCount < 1) throw new Error(`${id} ${viewportName}: expected SVG scene`);

      if (kind === "probability") {
        await page.getByLabel("Trials exact value").fill("200");
        await page.getByLabel("Parameter exact value").fill("12");
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "Live invariant", `${id} ${viewportName}`);
      } else if (kind === "inference") {
        await page.getByLabel("Sample size exact value").fill("50");
        await page.getByLabel("Successes exact value").fill("20");
        await page.getByLabel("Confidence exact value").fill("96");
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "Study design", `${id} ${viewportName}`);
        assertIncludes(updated, "Std. error", `${id} ${viewportName}`);
      } else {
        const sliders = await page.locator('input[type="range"]').count();
        if (sliders < 3) throw new Error(`${id} ${viewportName}: expected sequence controls`);
        const outputText = await page.locator("#sequence-result").innerText();
        if (!outputText.trim()) throw new Error(`${id} ${viewportName}: empty sequence result`);
      }

      await page.screenshot({ path: `${evidenceDir}/${String(id).padStart(4, "0")}-${viewportName}.png`, fullPage: true });
      results.push({ id, route, viewport: viewportName, status: "passed" });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0491-0520-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log(`Validated ${results.length} lesson viewport renders from 0491 through 0520.`);
