/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const lessons = [
  [521, "/lessons/advanced-mathematics/336-geometric-sequences", "Geometric Sequences", "sequence", ["sequence and series lab", "Active sequence", "Geometric term"]],
  [522, "/lessons/advanced-mathematics/337-recursive-sequences", "Recursive Sequences", "sequence", ["sequence and series lab", "Active sequence", "Recursive term"]],
  [523, "/lessons/advanced-mathematics/338-fibonacci-sequence", "Fibonacci Sequence", "sequence", ["sequence and series lab", "Active sequence", "Fibonacci-type term"]],
  [524, "/lessons/advanced-mathematics/339-sigma-notation", "Sigma Notation", "sequence", ["sequence and series lab", "Active sequence", "Expanded sigma sum"]],
  [525, "/lessons/advanced-mathematics/340-arithmetic-series", "Arithmetic Series", "sequence", ["sequence and series lab", "Active sequence", "Arithmetic sum"]],
  [526, "/lessons/advanced-mathematics/341-geometric-series", "Geometric Series", "sequence", ["sequence and series lab", "Active sequence", "Geometric partial sum"]],
  [527, "/lessons/advanced-mathematics/342-convergence-and-divergence", "Convergence and Divergence", "sequence", ["sequence and series lab", "Active sequence", "Sequence classification"]],
  [528, "/lessons/advanced-mathematics/343-power-series", "Power Series", "sequence", ["sequence and series lab", "Active sequence", "Power-series approximation"]],
  [529, "/lessons/advanced-mathematics/344-taylor-and-maclaurin-series", "Taylor and Maclaurin Series", "sequence", ["sequence and series lab", "Active sequence", "Taylor approximation"]],
  [530, "/lessons/advanced-mathematics/345-binomial-series", "Binomial Series", "sequence", ["sequence and series lab", "Active sequence", "Binomial-series approximation"]],
  [531, "/lessons/advanced-mathematics/346-recurrence-modelling", "Recurrence Modelling", "sequence", ["sequence and series lab", "Active sequence", "Model value"]],
  [532, "/lessons/advanced-mathematics/347-matrix-builder", "Matrix Builder", "matrix", ["matrix and linear-algebra lab", "Editable values", "Sum of matrix entries"]],
  [533, "/lessons/advanced-mathematics/348-matrix-addition-and-subtraction", "Matrix Addition and Subtraction", "matrix", ["matrix and linear-algebra lab", "Editable values", "Entry C"]],
  [534, "/lessons/advanced-mathematics/349-scalar-multiplication", "Scalar Multiplication", "matrix", ["matrix and linear-algebra lab", "Editable values", "Scaled entry"]],
  [535, "/lessons/advanced-mathematics/350-matrix-multiplication", "Matrix Multiplication", "matrix", ["matrix and linear-algebra lab", "Editable values", "Product entry"]],
  [536, "/lessons/advanced-mathematics/351-identity-matrix", "Identity Matrix", "matrix", ["matrix and linear-algebra lab", "Editable values", "Trace after multiplying by I"]],
  [537, "/lessons/advanced-mathematics/352-transpose", "Transpose", "matrix", ["matrix and linear-algebra lab", "Editable values", "Transpose entry"]],
  [538, "/lessons/advanced-mathematics/353-determinant", "Determinant", "matrix", ["matrix and linear-algebra lab", "Editable values", "Determinant"]],
  [539, "/lessons/advanced-mathematics/354-matrix-inverse", "Matrix Inverse", "matrix", ["matrix and linear-algebra lab", "Editable values", "Inverse"]],
  [540, "/lessons/advanced-mathematics/355-row-operations", "Row Operations", "matrix", ["matrix and linear-algebra lab", "Editable values", "New row-2 first entry"]],
  [541, "/lessons/advanced-mathematics/356-rref", "RREF", "matrix", ["matrix and linear-algebra lab", "Editable values", "Number of pivots"]],
  [542, "/lessons/advanced-mathematics/357-augmented-matrices", "Augmented Matrices", "matrix", ["matrix and linear-algebra lab", "Editable values", "Solution x"]],
  [543, "/lessons/advanced-mathematics/358-linear-transformations", "Linear Transformations", "matrix", ["matrix and linear-algebra lab", "Editable values", "Area scale factor"]],
  [544, "/lessons/advanced-mathematics/359-eigenvalues-and-eigenvectors", "Eigenvalues and Eigenvectors", "eigen", ["eigendirection lab", "Vector angle", "alignment"]],
  [545, "/lessons/advanced-mathematics/360-basis-and-dimension", "Basis and Dimension", "matrix", ["matrix and linear-algebra lab", "Editable values", "Span dimension"]],
  [546, "/lessons/advanced-mathematics/361-linear-independence", "Linear Independence", "matrix", ["matrix and linear-algebra lab", "Editable values", "Column-vector status"]],
  [547, "/lessons/advanced-mathematics/362-vector-spaces", "Vector Spaces", "matrix", ["matrix and linear-algebra lab", "Editable values", "Combination x-coordinate"]],
  [548, "/lessons/advanced-mathematics/363-gramschmidt", "Gram–Schmidt", "matrix", ["matrix and linear-algebra lab", "Editable values", "Second orthogonal-vector length"]],
  [549, "/lessons/advanced-mathematics/364-least-squares", "Least Squares", "matrix", ["matrix and linear-algebra lab", "Editable values", "Least-squares prediction"]],
];

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["tablet", { width: 900, height: 1100 }],
  ["mobile", { width: 390, height: 1100 }],
];

function assertIncludes(text, expected, label) {
  if (!text.toLowerCase().includes(expected.toLowerCase())) throw new Error(`${label}: missing "${expected}"`);
}

async function setRange(page, locator, value) {
  const next = await locator.evaluate((input, requested) => {
    const min = Number(input.min);
    const max = Number(input.max);
    const step = Number(input.step) || 1;
    const clamped = Math.min(max, Math.max(min, Number(requested)));
    const snapped = min + Math.round((clamped - min) / step) * step;
    return Number(snapped.toFixed(6));
  }, value);
  await locator.fill(String(next));
}

const browser = await chromium.launch();
const results = [];

try {
  for (const [id, route, title, kind, snippets] of lessons) {
    for (const [viewportName, viewport] of viewports) {
      const page = await browser.newPage({ viewport });
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: title }).first().waitFor({ timeout: 15_000 });

      const text = await page.locator("body").innerText();
      assertIncludes(text, title, `${id} ${viewportName}`);
      for (const snippet of snippets) assertIncludes(text, snippet, `${id} ${viewportName}`);

      const svgCount = await page.locator("svg").count();
      if (svgCount < 1) throw new Error(`${id} ${viewportName}: expected SVG scene`);

      if (kind === "sequence") {
        const sliders = page.locator('input[type="range"]');
        if ((await sliders.count()) < 3) throw new Error(`${id} ${viewportName}: expected three sequence controls`);
        const before = await page.locator("#sequence-result").innerText();
        await setRange(page, sliders.nth(0), 4);
        await setRange(page, sliders.nth(1), 1);
        await setRange(page, sliders.nth(2), 6);
        const after = await page.locator("#sequence-result").innerText();
        if (!after.trim() || after === before) throw new Error(`${id} ${viewportName}: sequence result did not update`);
        assertIncludes(await page.locator("body").innerText(), "aₙ", `${id} ${viewportName}`);
      } else if (kind === "matrix") {
        const matrixInputs = page.locator('input[aria-label$="exact value"]');
        if ((await matrixInputs.count()) < 4) throw new Error(`${id} ${viewportName}: expected editable matrix entries`);
        const before = await page.locator("#matrix-result").innerText();
        if (id >= 532 && id <= 536) await matrixInputs.nth(0).fill("3");
        await matrixInputs.nth(1).fill("4");
        const scalar = page.locator('input[type="range"]').first();
        if ((await scalar.count()) > 0) await setRange(page, scalar, 1.5);
        const after = await page.locator("#matrix-result").innerText();
        if (!after.trim() || after === before) throw new Error(`${id} ${viewportName}: matrix result did not update`);
        assertIncludes(await page.locator("body").innerText(), "Computation", `${id} ${viewportName}`);
      } else {
        const entry = page.getByLabel("Matrix entry 1");
        await entry.fill("3");
        await setRange(page, page.locator('input[type="range"]').first(), 45);
        const updated = await page.locator("body").innerText();
        assertIncludes(updated, "λ", `${id} ${viewportName}`);
        assertIncludes(updated, "alignment", `${id} ${viewportName}`);
      }

      if (consoleErrors.length) throw new Error(`${id} ${viewportName}: console errors: ${consoleErrors.join(" | ")}`);
      await page.screenshot({ path: `${evidenceDir}/${String(id).padStart(4, "0")}-${viewportName}.png`, fullPage: true });
      results.push({ id, route, viewport: viewportName, status: "passed" });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0521-0549-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log(`Validated ${results.length} lesson viewport renders from 0521 through 0549.`);
