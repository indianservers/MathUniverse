/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const lessons = [
  [431, "/lessons/data-and-probability/468-frequency-tables", "Frequency Tables", ["data + graph", "Frequency Tables", "Tally every value once"]],
  [432, "/lessons/data-and-probability/469-grouped-frequency-tables", "Grouped Frequency Tables", ["data + graph", "Grouped Frequency Tables", "non-overlapping intervals"]],
  [433, "/lessons/data-and-probability/470-mean", "Mean", ["data + graph", "Mean", "Add values and divide"]],
  [434, "/lessons/data-and-probability/471-median", "Median", ["data + graph", "Median", "Sort first"]],
  [435, "/lessons/data-and-probability/472-mode", "Mode", ["data + graph", "Mode", "most frequent"]],
  [436, "/lessons/data-and-probability/473-weighted-mean", "Weighted Mean", ["data + graph", "Weighted Mean", "Multiply by weights"]],
  [437, "/lessons/data-and-probability/474-range", "Range", ["data + graph", "Range", "Subtract minimum"]],
  [438, "/lessons/data-and-probability/475-quartiles-and-iqr", "Quartiles and IQR", ["data + graph", "Quartiles and IQR", "IQR is Q3 minus Q1"]],
  [439, "/lessons/data-and-probability/476-variance-and-standard-deviation", "Variance and Standard Deviation", ["data + graph", "Variance and Standard Deviation", "Measure spread"]],
  [440, "/lessons/data-and-probability/477-percentiles", "Percentiles", ["data + graph", "Percentiles", "ordered positions"]],
  [441, "/lessons/data-and-probability/478-z-scores", "Z-Scores", ["data + graph", "Z-Scores", "standard deviations"]],
  [442, "/lessons/data-and-probability/479-outliers", "Outliers", ["data + graph", "Outliers", "unusual values"]],
  [443, "/lessons/data-and-probability/480-box-plot", "Box Plot", ["five-number-summary lab", "Whisker rule", "Q1"]],
  [444, "/lessons/data-and-probability/481-dot-plot", "Dot Plot", ["data + graph", "Dot Plot", "one dot"]],
  [445, "/lessons/data-and-probability/482-stem-and-leaf-plot", "Stem-and-Leaf Plot", ["data + graph", "Stem-and-Leaf Plot", "Sort leaves"]],
  [446, "/lessons/data-and-probability/483-histogram", "Histogram", ["data + graph", "Histogram", "touching bars"]],
  [447, "/lessons/data-and-probability/484-frequency-polygon", "Frequency Polygon", ["data + graph", "Frequency Polygon", "midpoint"]],
  [448, "/lessons/data-and-probability/485-cumulative-frequency-curve", "Cumulative Frequency Curve", ["data + graph", "Cumulative Frequency Curve", "running totals"]],
  [449, "/lessons/data-and-probability/486-bar-and-pie-charts", "Bar and Pie Charts", ["data + graph", "Bar and Pie Charts", "parts of a whole"]],
  [450, "/lessons/data-and-probability/487-scatter-plot", "Scatter Plot", ["data + graph", "Scatter Plot", "paired numerical values"]],
  [451, "/lessons/data-and-probability/488-time-series-plot", "Time-Series Plot", ["data + graph", "Time-Series Plot", "time order"]],
  [452, "/lessons/data-and-probability/489-correlation-coefficient", "Correlation Coefficient", ["data + graph", "Correlation Coefficient", "does not prove cause"]],
  [453, "/lessons/data-and-probability/490-linear-regression", "Linear Regression", ["data + graph", "Linear Regression", "straight line"]],
  [454, "/lessons/data-and-probability/491-polynomial-regression", "Polynomial Regression", ["data + graph", "Polynomial Regression", "overfit"]],
  [455, "/lessons/data-and-probability/492-exponential-regression", "Exponential Regression", ["data + graph", "Exponential Regression", "ratios are roughly steady"]],
  [456, "/lessons/data-and-probability/493-logarithmic-regression", "Logarithmic Regression", ["data + graph", "Logarithmic Regression", "positive x-values"]],
  [457, "/lessons/data-and-probability/494-power-regression", "Power Regression", ["data + graph", "Power Regression", "y = ax^b"]],
  [458, "/lessons/data-and-probability/495-logistic-regression", "Logistic Regression", ["data + graph", "Logistic Regression", "S-shaped model"]],
  [459, "/lessons/data-and-probability/496-sinusoidal-regression", "Sinusoidal Regression", ["data + graph", "Sinusoidal Regression", "repeating wave"]],
  [460, "/lessons/data-and-probability/497-residual-plot", "Residual Plot", ["data + graph", "Residual Plot", "observed minus predicted"]],
];

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["tablet", { width: 900, height: 1100 }],
  ["mobile", { width: 390, height: 1100 }],
];

function assertIncludes(text, expected, label) {
  if (!text.includes(expected)) {
    throw new Error(`${label}: missing "${expected}"`);
  }
}

const browser = await chromium.launch();
const results = [];

try {
  for (const [id, route, title, snippets] of lessons) {
    for (const [viewportName, viewport] of viewports) {
      const page = await browser.newPage({ viewport });
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: title }).first().waitFor({ timeout: 15_000 });

      const text = await page.locator("body").innerText();
      assertIncludes(text, title, `${id} ${viewportName}`);
      for (const snippet of snippets) assertIncludes(text, snippet, `${id} ${viewportName}`);

      const svgCount = await page.locator("svg").count();
      if (svgCount < 1) throw new Error(`${id} ${viewportName}: expected statistics svg scene`);

      if (id === 443) {
        await page.getByLabel("Data").fill("1,2,3,4,5,30");
        await page.getByLabel("Whisker rule").selectOption("range");
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "Full range", `${id} ${viewportName}`);
      } else {
        const sliders = await page.locator('input[type="range"]').count();
        if (sliders < 2) throw new Error(`${id} ${viewportName}: expected statistics controls`);
        await page.getByLabel("Shift sample exact value").fill("1");
        await page.getByLabel("Outlier exact value").fill("12");
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "Slope", `${id} ${viewportName}`);
      }

      await page.screenshot({ path: `${evidenceDir}/${String(id).padStart(4, "0")}-${viewportName}.png`, fullPage: true });
      results.push({ id, route, viewport: viewportName, status: "passed" });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0431-0460-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log(`Validated ${results.length} lesson viewport renders from 0431 through 0460.`);
