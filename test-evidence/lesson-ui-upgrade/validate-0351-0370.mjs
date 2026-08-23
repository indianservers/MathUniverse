/* global console, process */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 768, height: 1024 }],
  ["mobile", { width: 390, height: 844 }],
];

const lessons = [
  [351, "/lessons/symbolic-mathematics/445-complex-calculations", "Complex Calculations", "Complex Calculations - reusable CAS engine", "cas"],
  [352, "/lessons/symbolic-mathematics/446-assumptions", "Assumptions", "Assumptions - reusable CAS engine", "cas"],
  [353, "/lessons/symbolic-mathematics/447-exact-numeric-toggle", "Exact / Numeric Toggle", "Exact / Numeric Toggle - reusable CAS engine", "cas"],
  [354, "/lessons/symbolic-mathematics/448-step-by-step-algebra", "Step-by-Step Algebra", "Step-by-Step Algebra - reusable CAS engine", "cas"],
  [355, "/lessons/symbolic-mathematics/449-cas-to-graph-link", "CAS-to-Graph Link", "CAS-to-Graph Link - reusable CAS engine", "cas"],
  [356, "/lessons/calculus/277-informal-limits", "Informal Limits", "A removable-looking limit model approaches y=1 near x=0", "calculus"],
  [357, "/lessons/calculus/278-one-sided-limits", "One-Sided Limits", "The graph stays near -1 from the left and +1 from the right", "calculus"],
  [358, "/lessons/calculus/279-infinite-limits", "Infinite Limits", "A positive reciprocal-square curve shoots upward", "calculus"],
  [359, "/lessons/calculus/280-limits-at-infinity", "Limits at Infinity", "A rational function flattens toward the horizontal asymptote", "calculus"],
  [360, "/lessons/calculus/281-continuity-at-a-point", "Continuity at a Point", "A smooth parabola has matching left approach", "calculus"],
  [361, "/lessons/calculus/282-types-of-discontinuity", "Types of Discontinuity", "A reciprocal curve separates into two branches", "calculus"],
  [362, "/lessons/calculus/283-epsilondelta-visualiser", "Epsilon–Delta Visualiser", "A linear function turns an input band", "calculus"],
  [363, "/lessons/calculus/284-average-rate-of-change", "Average Rate of Change", "Two selected points form a secant line", "calculus"],
  [364, "/lessons/calculus/285-instantaneous-rate-of-change", "Instantaneous Rate of Change", "As the second point moves close to the first", "calculus"],
  [365, "/lessons/calculus/286-derivative-from-first-principles", "Derivative from First Principles", "The highlighted pair visualizes the difference quotient", "calculus"],
  [366, "/lessons/calculus/287-tangent-line", "Tangent Line", "A tangent line follows the local direction", "calculus"],
  [367, "/lessons/calculus/288-normal-line", "Normal Line", "The normal line is perpendicular", "calculus"],
  [368, "/lessons/calculus/289-derivative-graph", "Derivative Graph", "A cubic curve is paired with slope information", "calculus"],
  [369, "/lessons/calculus/290-higher-derivatives", "Higher Derivatives", "A quartic curve shows how first and second derivatives", "calculus"],
  [370, "/lessons/calculus/291-product-rule", "Product Rule", "The product curve changes because both", "calculus"],
];

function mustContain(text, needle, context) {
  if (!text.includes(needle)) {
    throw new Error(`${context} missing text: ${needle}`);
  }
}

async function exerciseVisibleControl(page) {
  const range = page.locator('input[type="range"]').first();
  if ((await range.count()) > 0) {
    await range.focus();
    await page.keyboard.press("ArrowRight");
    return "range";
  }

  const button = page.getByRole("button", { name: /next symbolic step|reveal next step|calculate|run/i }).first();
  if ((await button.count()) > 0) {
    await button.click();
    return "button";
  }

  return "none";
}

async function main() {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const [mockupId, route, title, snippet, family] of lessons) {
      for (const [viewportName, viewport] of viewports) {
        const page = await browser.newPage({ viewport });
        const url = `${baseUrl}${route}`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
        await page.locator("main, body").first().waitFor({ state: "visible", timeout: 15_000 });
        const exercised = await exerciseVisibleControl(page);

        const bodyText = await page.locator("body").innerText({ timeout: 15_000 });
        mustContain(bodyText, title, `${mockupId} ${viewportName}`);
        mustContain(bodyText, snippet, `${mockupId} ${viewportName}`);

        if (family === "cas") {
          mustContain(bodyText, "CAS Lab", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "CAS Calculator", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "expression", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "CAS result", `${mockupId} ${viewportName}`);
        } else {
          mustContain(bodyText, "Calculus Lab", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "graph + CAS", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "Linked controls", `${mockupId} ${viewportName}`);
          mustContain(bodyText, "CAS derivative", `${mockupId} ${viewportName}`);
          if ((await page.locator("svg").count()) === 0) {
            throw new Error(`${mockupId} ${viewportName} missing calculus graph surface`);
          }
        }

        const screenshotPath = path.join(evidenceDir, `${String(mockupId).padStart(4, "0")}-${viewportName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        results.push({ mockupId, route, viewport: viewportName, screenshotPath, exercised, status: "passed" });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    path.join(evidenceDir, "0351-0370-validation-summary.json"),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf8",
  );
  console.log(`Validated ${lessons.length} lessons across ${viewports.length} viewports each.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
