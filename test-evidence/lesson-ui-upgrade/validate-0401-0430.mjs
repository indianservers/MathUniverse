/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const lessons = [
  [401, "/lessons/calculus/322-accumulation-functions", "Accumulation Functions", ["Accumulation", "graph + CAS", "Linked controls"]],
  [402, "/lessons/calculus/323-direction-fields", "Direction Fields", ["Direction Fields", "graph + CAS", "Linked controls"]],
  [403, "/lessons/calculus/324-euler-s-method", "Euler's Method", ["Euler", "graph + CAS", "Linked controls"]],
  [404, "/lessons/calculus/325-separable-equations", "Separable Equations", ["Separable", "graph + CAS", "Linked controls"]],
  [405, "/lessons/calculus/326-first-order-linear-equations", "First-Order Linear Equations", ["First-Order", "graph + CAS", "Linked controls"]],
  [406, "/lessons/calculus/327-logistic-growth", "Logistic Growth", ["Logistic", "graph + CAS", "Linked controls"]],
  [407, "/lessons/calculus/328-second-order-equations", "Second-Order Equations", ["Second-Order", "graph + CAS", "Linked controls"]],
  [408, "/lessons/calculus/329-phase-plane", "Phase Plane", ["Phase Plane", "graph + CAS", "Linked controls"]],
  [409, "/lessons/calculus/330-equilibrium-and-stability", "Equilibrium and Stability", ["Equilibrium", "graph + CAS", "Linked controls"]],
  [410, "/lessons/calculus/331-discrete-dynamical-systems", "Discrete Dynamical Systems", ["Discrete", "graph + CAS", "Linked controls"]],
  [411, "/lessons/calculus/332-cobweb-diagrams", "Cobweb Diagrams", ["Cobweb", "graph + CAS", "Linked controls"]],
  [412, "/lessons/calculus/333-chaos-and-bifurcation", "Chaos and Bifurcation", ["Chaos", "graph + CAS", "Linked controls"]],
  [413, "/lessons/data-and-probability/450-data-entry-grid", "Data Entry Grid", ["linked sheet", "Data Entry Grid", "linked objects"]],
  [414, "/lessons/data-and-probability/451-cell-formulas", "Cell Formulas", ["linked sheet", "Cell Formulas", "All formulas valid"]],
  [415, "/lessons/data-and-probability/452-fill-and-copy", "Fill and Copy", ["linked sheet", "Fill and Copy", "Fill formula down"]],
  [416, "/lessons/data-and-probability/453-relative-references", "Relative References", ["linked sheet", "Relative References", "Plain references adjust"]],
  [417, "/lessons/data-and-probability/454-absolute-references", "Absolute References", ["linked sheet", "Absolute References", "Dollar signs keep cells fixed"]],
  [418, "/lessons/data-and-probability/455-sorting", "Sorting", ["linked sheet", "Sorting", "Sort the whole table together"]],
  [419, "/lessons/data-and-probability/456-filtering", "Filtering", ["linked sheet", "Filtering", "Filtering hides"]],
  [420, "/lessons/data-and-probability/457-lists-from-cells", "Lists from Cells", ["linked sheet", "Lists from Cells", "Preserve order"]],
  [421, "/lessons/data-and-probability/458-points-from-columns", "Points from Columns", ["linked sheet", "Points from Columns", "Pair x and y"]],
  [422, "/lessons/data-and-probability/459-matrices-from-cells", "Matrices from Cells", ["linked sheet", "Matrices from Cells", "rectangular range"]],
  [423, "/lessons/data-and-probability/460-frequency-tables", "Frequency Tables", ["linked sheet", "Frequency Tables", "Count each value once"]],
  [424, "/lessons/data-and-probability/461-summary-statistics", "Summary Statistics", ["linked sheet", "Summary Statistics", "centre and spread"]],
  [425, "/lessons/data-and-probability/462-spreadsheet-charts", "Spreadsheet Charts", ["linked sheet", "Spreadsheet Charts", "Match chart type"]],
  [426, "/lessons/data-and-probability/463-regression-from-data", "Regression from Data", ["linked sheet", "Regression from Data", "residuals"]],
  [427, "/lessons/data-and-probability/464-dynamic-cell-links", "Dynamic Cell Links", ["linked sheet", "Dynamic Cell Links", "source cell"]],
  [428, "/lessons/data-and-probability/465-import-csv", "Import CSV", ["linked sheet", "Import CSV", "delimiter"]],
  [429, "/lessons/data-and-probability/466-export-data", "Export Data", ["linked sheet", "Export Data", "headings"]],
  [430, "/lessons/data-and-probability/467-data-types", "Data Types", ["data + graph", "Data Types", "Classify data"]],
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

      if (id <= 412) {
        const svgCount = await page.locator("svg").count();
        if (svgCount < 1) throw new Error(`${id} ${viewportName}: expected calculus svg scene`);
        const sliders = await page.locator('input[type="range"]').count();
        if (sliders < 2) throw new Error(`${id} ${viewportName}: expected linked calculus controls`);
      } else if (id <= 429) {
        const cell = page.getByLabel("Cell B2");
        await cell.fill(String(6 + (id % 5)));
        await page.getByRole("button", { name: "Fill formula down" }).click();
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "All formulas valid", `${id} ${viewportName}`);
      } else {
        const sliders = await page.locator('input[type="range"]').count();
        if (sliders < 2) throw new Error(`${id} ${viewportName}: expected statistics controls`);
      }

      await page.screenshot({ path: `${evidenceDir}/${String(id).padStart(4, "0")}-${viewportName}.png`, fullPage: true });
      results.push({ id, route, viewport: viewportName, status: "passed" });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0401-0430-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log(`Validated ${results.length} lesson viewport renders from 0401 through 0430.`);
