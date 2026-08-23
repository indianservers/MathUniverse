/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const lessons = [
  [461, "/lessons/data-and-probability/498-model-comparison", "Model Comparison", "statistics", ["data + graph", "Model Comparison", "Compare residuals"]],
  [462, "/lessons/data-and-probability/499-interpolation-and-extrapolation", "Interpolation and Extrapolation", "statistics", ["data + graph", "Interpolation and Extrapolation", "Inside the data range"]],
  [463, "/lessons/data-and-probability/500-sample-spaces", "Sample Spaces", "probability", ["seeded simulation", "Sample Spaces", "List every possible outcome once"]],
  [464, "/lessons/data-and-probability/501-events", "Events", "probability", ["seeded simulation", "Events", "set of outcomes"]],
  [465, "/lessons/data-and-probability/502-probability-scale", "Probability Scale", "probability", ["seeded simulation", "Probability Scale", "0 is impossible"]],
  [466, "/lessons/data-and-probability/503-complement-rule", "Complement Rule", "probability", ["seeded simulation", "Complement Rule", "Subtract from 1"]],
  [467, "/lessons/data-and-probability/504-addition-rule", "Addition Rule", "probability", ["seeded simulation", "Addition Rule", "double-counting"]],
  [468, "/lessons/data-and-probability/505-multiplication-rule", "Multiplication Rule", "probability", ["seeded simulation", "Multiplication Rule", "Multiply along"]],
  [469, "/lessons/data-and-probability/506-independent-events", "Independent Events", "probability", ["seeded simulation", "Independent Events", "does not change"]],
  [470, "/lessons/data-and-probability/507-mutually-exclusive-events", "Mutually Exclusive Events", "probability", ["seeded simulation", "Mutually Exclusive Events", "no shared outcomes"]],
  [471, "/lessons/data-and-probability/508-conditional-probability", "Conditional Probability", "probability", ["seeded simulation", "Conditional Probability", "reduced sample space"]],
  [472, "/lessons/data-and-probability/509-tree-diagrams", "Tree Diagrams", "probability", ["seeded simulation", "Tree Diagrams", "Branches organise"]],
  [473, "/lessons/data-and-probability/510-venn-diagrams", "Venn Diagrams", "probability", ["seeded simulation", "Venn Diagrams", "overlap"]],
  [474, "/lessons/data-and-probability/511-two-way-tables", "Two-Way Tables", "probability", ["seeded simulation", "Two-Way Tables", "margin totals"]],
  [475, "/lessons/data-and-probability/512-bayes-theorem", "Bayes' Theorem", "probability", ["seeded simulation", "Bayes' Theorem", "base rate"]],
  [476, "/lessons/data-and-probability/513-expected-value", "Expected Value", "probability", ["seeded simulation", "Expected Value", "long-run average"]],
  [477, "/lessons/data-and-probability/514-simulation", "Simulation", "probability", ["seeded simulation", "Simulation", "Small simulations are noisy"]],
  [478, "/lessons/data-and-probability/515-law-of-large-numbers", "Law of Large Numbers", "probability", ["seeded simulation", "Law of Large Numbers", "many trials"]],
  [479, "/lessons/data-and-probability/516-distribution-calculator", "Distribution Calculator", "probability", ["seeded simulation", "Distribution Calculator", "Match the model"]],
  [480, "/lessons/data-and-probability/517-probability-plot", "Probability Plot", "probability", ["seeded simulation", "Probability Plot", "theoretical distribution"]],
  [481, "/lessons/data-and-probability/518-cumulative-distribution", "Cumulative Distribution", "probability", ["seeded simulation", "Cumulative Distribution", "P(X <= x)"]],
  [482, "/lessons/data-and-probability/519-interval-tail-probability", "Interval / Tail Probability", "probability", ["seeded simulation", "Interval / Tail Probability", "shaded area"]],
  [483, "/lessons/data-and-probability/520-inverse-probability", "Inverse Probability", "probability", ["seeded simulation", "Inverse Probability", "find the cutoff"]],
  [484, "/lessons/data-and-probability/521-bernoulli-distribution", "Bernoulli Distribution", "probability", ["seeded simulation", "Bernoulli Distribution", "one success-or-failure trial"]],
  [485, "/lessons/data-and-probability/522-binomial-distribution", "Binomial Distribution", "probability", ["seeded simulation", "Binomial Distribution", "fixed independent trials"]],
  [486, "/lessons/data-and-probability/523-hypergeometric-distribution", "Hypergeometric Distribution", "probability", ["seeded simulation", "Hypergeometric Distribution", "without replacement"]],
  [487, "/lessons/data-and-probability/524-poisson-distribution", "Poisson Distribution", "probability", ["seeded simulation", "Poisson Distribution", "fixed interval"]],
  [488, "/lessons/data-and-probability/525-geometric-distribution", "Geometric Distribution", "probability", ["seeded simulation", "Geometric Distribution", "first success"]],
  [489, "/lessons/data-and-probability/526-negative-binomial-distribution", "Negative Binomial Distribution", "probability", ["seeded simulation", "Negative Binomial Distribution", "fixed number of successes"]],
  [490, "/lessons/data-and-probability/527-uniform-distribution", "Uniform Distribution", "probability", ["seeded simulation", "Uniform Distribution", "equally likely"]],
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

      if (kind === "statistics") {
        await page.getByLabel("Shift sample exact value").fill("1");
        await page.getByLabel("Outlier exact value").fill("12");
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "Slope", `${id} ${viewportName}`);
      } else {
        await page.getByLabel("Trials exact value").fill("200");
        await page.getByLabel("Parameter exact value").fill("12");
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "Live invariant", `${id} ${viewportName}`);
        assertIncludes(updated, "Probabilities stay within 0 and 1", `${id} ${viewportName}`);
      }

      await page.screenshot({ path: `${evidenceDir}/${String(id).padStart(4, "0")}-${viewportName}.png`, fullPage: true });
      results.push({ id, route, viewport: viewportName, status: "passed" });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0461-0490-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log(`Validated ${results.length} lesson viewport renders from 0461 through 0490.`);
